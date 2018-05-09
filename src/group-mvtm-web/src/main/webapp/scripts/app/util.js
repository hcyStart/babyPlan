define(function (require) {
	var ext = window.external;
	var $ = require('jquery'),
		codeAndTip = require('../codeAndTip'),
		controller = require('./BaseController'),
		checkInternet = require('../checkInternet'),
		viewContainer = null,
		body = null,
		retryServerSum = 3,
		retryServerCount = 1,
		staffId = '',//员工编号
		debugEnable = true,
		retrysetPinCard = 0,//设置卡密码失败重置次数
		phoneNumberRetry = 0,//设置电话银行码失败重置次数
		isGotIDCardInfo = false,//是否获取到身份证信息
		scanIDStatus = "",//扫描身份证状态
		machineInfo = "",//设备信息
		scanNum = 0,//重新扫描身份证次数
		locallanguage = '',//语言类型
		sendTimer = 500, //服务retry的时间间隔
	    uploadFlag = true,//首页上传视屏的标识
	    isGotBankCardInfo = false;//是否获取到银行卡信息
	var mainMask = $("#mainMask");
	var popupContainer = $("#popupContainer");
	var loadingWrap = $("#loadingWrap");
	var loadingDom = $("#loading");
	var preloadImages = [];
	var notLoadTCFlag = false;//标志是否需要重新预加载T&C
	var checkTimer = null;//每十秒检测一次网络连接状况
	function getViewContainer() {
		return viewContainer ? viewContainer : viewContainer = $('.view-container')[0];
	}


	function statusStep(x, y) {
		x--;
		if(y){
			y--;
		}
		$(".status-bar .box").each(function(i) {
			if (i < x) {
				$(this).removeClass('active-bg');
				$(this).find("h2").addClass("active1");
			} else if (i == x) {
				$(this).addClass("active-bg");
				if(y || y==0){
					$(this).find('ul li').eq(y).prevAll().removeClass('active').addClass("active3");
					$(this).find('ul li').eq(y).nextAll().removeClass('active').removeClass("active3")
                    $(this).find('ul li').eq(y).addClass('active');
				}else{
					$(this).find("h2").addClass('no-subItem');
				}
			}
		});
	}

	function debug(msg,masklog) {	
		if(masklog){
			msg = msg + maskinglog(masklog);
		}
		try{
			writeLog("Info",msg);
		} catch(e) {
			//debug("请求异常"+e);
		}
	}

    function writeLog(logType, objMsg){
			return ext.Common.LogForFrontSide(logType, objMsg);
		}
    function maskinglog(masklog){
		var resultAll = JSON.parse(masklog);
		var hResult = resultAll.hResult;
		var hData = JSON.parse(resultAll.data);
		var hCode = resultAll.Code;
		var hBuffer = hData.Buffer;
		 if(codeAndTip.code.common.hardwareAvailable == hResult && codeAndTip.code.scanid.DeviceName == resultAll.Name && hBuffer){
			 var IDCardNO = hBuffer.chip.IDCardNO;
			 var Address = hBuffer.chip.Address;
			 var Name = hBuffer.chip.Name;
			 hData.Buffer.chip.IDCardNO = IDCardNO.replace(IDCardNO.substr(4,10), "*********");
			 hData.Buffer.chip.Address = Address.replace(Address.substr(3,Address.length),"******");
			 hData.Buffer.chip.Name = Name.replace(Name.substr(1,Name.length),"**");
		 }else if(codeAndTip.code.common.hardwareAvailable == hResult && codeAndTip.code.sacnBankCard.DeviceName == resultAll.Name && hBuffer &&  "ok" == hBuffer.track2status){
			 var cardDetailInfo = hBuffer.track2.split('=');
			 var cardNumber = cardDetailInfo[0];
			 var issueNumber =  cardDetailInfo[1]
			 hData.Buffer.track2 = cardNumber.replace(cardNumber.substr(0,14), "************")+"="+issueNumber.replace(issueNumber.substr(4,issueNumber.length), "************");
		 }else　if(codeAndTip.code.enterPassword.pinKeyCode == hCode && codeAndTip.code.common.hardwareAvailable == hResult && hBuffer){
			 var ulDigit = hBuffer.ulDigit;
			 //区别数字和enter，clear按键
			 if(ulDigit.length == 1){
				 hData.Buffer.ulDigit = ulDigit.replace(ulDigit,"*");
			 }
		 }else if(codeAndTip.code.enterPassword.getPinDataCode == hCode && codeAndTip.code.common.hardwareAvailable == hResult && hBuffer){
			 var PinKeys = hBuffer.PinKeys;
			 hData.Buffer.PinKeys = PinKeys.replace(PinKeys,"******"); 
		 }
		     resultAll.data =  hData;
		     resultAll = JSON.stringify(resultAll);
		     return resultAll;
    }
    function goTo(viewName) {
          location.hash = viewName;
    }
    //发送请求有异常处理
	var sendMessage = function(url, data, type, dataType, contentType, async){
		debug("开始请求server");
		//服务请求先加loading
		showLoading();
	      var _type = type || "POST",
	           _dataType = dataType || "json",
	           _async = true,
	           _contentType = contentType || "application/json;charset=utf-8";
	       var deffered = $.Deferred();
	       var promise = null;
	       var _url = null;
	       if(url.indexOf('?')>=0){
	    	   _url = url.split('?')[0];
	       }else{
	    	   _url = url;
	       }
	       
	      debug('sendMessage第'+retryServerCount+'次开始请求' + _url);
	       promise = $.ajax({
	    			type: _type,
	    			async: _async,
	    			url: url,
	    			dataType: _dataType,
	    			contentType: _contentType,
	    			timeout: 120000,
	    			data: data
	        });
           //程序阻塞sendTimer毫秒 
	       if(retryServerCount != 1){
	    	   debug("sendMessage开始延迟");
	           var _now = (new Date()).getTime(); 
		       while((new Date()).getTime() - _now < sendTimer){}; 
	       }
	        return promise.then(function(resp,requestResult,XMLHTTPRequestResult){//请求成功
	        	debug('sendMessage第'+retryServerCount+'次请求成功！');
	        	var token = XMLHTTPRequestResult.getResponseHeader("vtm-token-key");
				if(token){
				     var result = window.external.Common.SetTokenValue(token);
				     debug("supportDocUpload设置token结果："+result);
				}
				retryServerSum = 3;
				retryServerCount = 1;
				//请求成工隐藏loading
				hideLoading();
  				return deffered.resolve(resp,requestResult,XMLHTTPRequestResult);
	        },function(err){//请求失败
				if(retryServerCount< retryServerSum){
					    debug('sendMessage第'+retryServerCount+'次请求失败！请求结果：' + JSON.stringify(err));
						retryServerCount = retryServerCount + 1;
						return sendMessage(url, data, type, dataType, contentType, async);
				 } else {
					    debug('sendMessage第'+retryServerCount+'次请求失败！请求结果：'+ JSON.stringify(err));
						retryServerSum = 3,
						retryServerCount = 1;
						var errMsg = "";
						var btnName = ""; 	
						if( location.hash != "#login" ){
	                        if(controller.prototype.getLocale() == "zh"){
	                    		errMsg = "服务器异常，本机服务暂停，请联系维护热线： 021-38886000。";
	                    		btnName = "返回首页";   
	                        } else {                      
	                    	 	errMsg = "Service unavailable due to server error. please contact our maintenance hotline: 021-38886000.";
	                    		btnName = "Back to home";                         	                   	
	                        }
	                        //if(err.readyState == '2'||err.readyState == '3'||err.readyState == '4'){
	                        	showServerDialog(errMsg,btnName);	
	                        //}
						}	
						hideLoading();
						return  deffered.reject(err);
				 }
	        })
	        
	}
	
    //发送请求没有异常处理
	var sendMessageWithoutException = function(url, data, type, dataType, contentType, async){
		debug("开始请求server");
	      var _type = type || "POST",
	           _dataType = dataType || "json",
	           _async = true,
	           _contentType = contentType || "application/json;charset=utf-8";
	       var deffered = $.Deferred();
	       var promise = null;
	       var _url = null;
	       if(url.indexOf('?')>=0){
	    	   _url = url.split('?')[0];
	       }else{
	    	   _url = url;
	       }
	      debug('sendMessageWithoutException第'+retryServerCount+'次开始请求' + _url);
	       promise = $.ajax({
	    			type: _type,
	    			async: _async,
	    			url: url,
	    			dataType: _dataType,
	    			contentType: _contentType,
	    			timeout: 120000,
	    			data: data
	        });
           //程序阻塞sendTimer毫秒 
	       if(retryServerCount != 1){
	    	   debug("sendMessageWithoutException开始延迟");
	           var _now = (new Date()).getTime(); 
		       while((new Date()).getTime() - _now < sendTimer){}; 
	       }
	        return promise.then(function(resp,requestResult,XMLHTTPRequestResult){//请求成功
	        	debug('sendMessageWithoutException第'+retryServerCount+'次请求成功！');
				retryServerSum = 3;
				retryServerCount = 1;
  				return deffered.resolve(resp,requestResult,XMLHTTPRequestResult);
	        },function(err){//请求失败
				if(retryServerCount< retryServerSum){
					    debug('sendMessageWithoutException第'+retryServerCount+'次请求失败！请求结果：' + JSON.stringify(err));
						retryServerCount = retryServerCount + 1;
						return sendMessageWithoutException(url, data, type, dataType, contentType, async);
				 } else {
					    debug('sendMessageWithoutException第'+retryServerCount+'次请求失败！请求结果：'+ JSON.stringify(err));
						retryServerSum = 3,
						retryServerCount = 1;			
						return  deffered.reject(err);
				 }
	        })  
	}

	function getPdfUrl() {
		return $.getJSON("/group-vtm-sln-content-service/service/content/repository/tc/img/TCpdf.json")
	}
	function showPdfImg(dialoyObg,imgStr) {
		var iNum = 0,
			timer = null;
		dialoyObg.show().addClass("layer");
		dialoyObg.find('.loading').show();
		$("#closePdf").show();
		dialoyObg.find('.showImg').empty();
		//debug("获取PDF地址：" + getUrl + "***" + dataName);
		for (var i = 0; i < imgStr.length; i++) {
			dialoyObg.find('.showImg').append("<img src=" + imgStr[i] + ">");

		}
		dialoyObg.find('.showImg').scrollTop(0);
		dialoyObg.find('.loading').hide();
	}

	var transformPdfToImage = function(clickObg, dialoyObg, languageType) {
		var clickObg = $(clickObg),
			dialoyObg = $(dialoyObg), dataName;
		getPdfUrl().then(function(data) {
			clickObg.on("click", function() {
				dataName = $(this).attr('data-name');
				var imgStr = data[dataName][languageType];
				showPdfImg(dialoyObg,imgStr);
				$(this).find('b').removeClass('arrow').addClass('open icon');
				var i = 0;
				$(this).attr("data-code","open");
				$(".termDetail").each(function(){
					if($(this).data("code") == "open"){
						i++;
						if(i == $('.termDetail:visible').length){
							$('.form-inline-tcAgree .no-check').removeClass('checkboxDisable');
						}
					}
				})
			})
		});
		dialoyObg.find('#closePdf').on("click", function() {
			dialoyObg.removeClass("layer").hide();
		});
		dialoyObg.find('.showImg').off().on("scroll", function() {
			$("body").trigger("click");
		});
	}
	/*  
	 *	操作日志  记录类
	 **/
	function actionLog(msg,url){
		debug('开始记录活动日志：' + msg + '======' + url);
/*		var m = require('app/home/home.model');
		var _url = url || 'service/proxy/vtcService/activityAuditLog/save';
		var s = {
			"correlationID": (m.actionLog && m.actionLog.correlationID) ? m.actionLog.correlationID : '',
			"bizType": m.actionLog.bizType,
			"terminalType": "VTM",
			"terminalCode": m.actionLog.terminalCode,
			"customerIdType": m.actionLog.customerIdType,
			"customerId": m.actionLog.customerId,
			"actionDescription": "[PRD] " + msg
		};
		$.ajax({
			url: _url,
			data: JSON.stringify(s),
			contentType: "application/json;charset=utf-8",
			type : "POST",
			dataType :"json",
			success: function(data){
				debug('记录活动日志成功： ' + JSON.stringify(data));
			},
			error : function(data){
				debug('记录活动日志异常： ' + JSON.stringify(data));
			}
		});*/
	}
	
/*	function uploadFile(id,data){
		var uploadJson = JSON.stringify(data);
		//传给C#的值为字符串
		debug("进入uploadFile方法:"+JSON.stringify(uploadJson));
		var def = $.Deferred();
		var res = ext.Common.MultFilesUpload(id,uploadJson);
		var ret = JSON.parse(res);

		if(codeAndTip.code.common.hardwareAvailable == ret.hResult){
			def.resolve(ret);
		}else if(codeAndTip.code.common.hardwareFailure == ret.hResult){
			def.reject(ret);
		}
		debug("进入uploadFile结束："+res);
		return def;
	}*/
	function uploadFile(id,data){
		var uploadJson = null;
		if("string" == typeof data){
			uploadJson = data;
		}else{
			uploadJson = JSON.stringify(data);
		}
		//传给C#的值为字符串
		debug("执行uploadFile方法");
		var res = ext.Common.MultFilesUpload(id,uploadJson);
		debug("uploadFile结束");
		return res;
	}
	//映射未来选择身份校验的卡种类
	function  identityType(type){
       var _cardType = ['idCard','passPort','birthCard'];
       return _cardType[type];
	} 
	//system resume功能的保存接口
	function updateCurrentStep(data){
		return sendMessageWithoutException("service/proxy/vtcService/mVTMAOSession/updateStepDataByIdCardNo",JSON.stringify(data));
	}
 
	//system resume功能的信息查询接口
	function getCurrentStep(customerID){
		return sendMessageWithoutException("service/proxy/vtcService/mVTMAOSession/findByIdCardNo",customerID);
	}
	
	//返回首页的出错信息提示
	function fillerrorText(errTitle,errMsg){
		 $('#blacklist-name').text(errTitle);
		 $('#blacklist-content').html(errMsg);	
		 $("#home-maskLayer").show();
		 $("#blacklist-dialog").show();
	}
	
	
	function showServerDialog(msg,btnName){
		//server异常弹出框，隐藏loading
		hideLoading();
		var mainMask = $("#mainMask");
		var _domStr = null;
			_domStr = '<div id="popupWrap"><p id="popupTipWrap">'+msg+'</p>';
		//如果只有一个button的情况下
			_domStr = _domStr + '<div id="popupBtnWrap"><button type="button" id="popupLeftBtn">'+btnName+'</button>';
		mainMask[0].innerHTML = _domStr;
		mainMask.show();
		var _currentHash = location.hash;
		$("#popupLeftBtn").off("click").on("click",function(){
			if("#turnOnCamera" == _currentHash||"#turnOnCameraWaiting"== _currentHash||"#understandTnc" == _currentHash||"#openFileForSign"==_currentHash){
				debug("录像过程中，服务器中断");
				var  _stopResult = ext.Record.AsyncStopRecord();
			    debug('_stopResult : ' + _stopResult);
			    var  _closeResult = ext.Record.CloseRecord();
			    debug('_closeResult : ' + _closeResult);
			}
			if(_currentHash != "#login"){
				location.hash = "home";
			}			
			mainMask.hide();
		})
	}	
	function showLoading(){
		loadingDom.show();
		loadingWrap.show();
	}
	function hideLoading(){
		loadingDom.hide();
		loadingWrap.hide();
	}
	//监听网络是否连接异常
	function beforeChageHash(){
		/*showLoading();
		var img=new Image(); 
		var deffered = $.Deferred();
		img.src = "images/app/common/checked.png";
		img.onerror = function(){
			alert()
			deffered.reject("shibai");
			checkInternet("netWorkErr",controller.prototype.getLocale(),null,null,null);
		}
		img.onload = function(){
			deffered.resolve();
			hideLoading();
		}*/
		var deffered = $.Deferred();
		deffered.resolve();
		return deffered;
	}
	return {
		getViewContainer: getViewContainer,
		statusStep: statusStep,
		goTo: goTo,
		transformPdfToImage: transformPdfToImage,
		sendMessage:sendMessage,
		debug:debug,
		staffId: staffId,
		scanIDStatus: scanIDStatus,
		actionLog: actionLog,
		identityType: identityType,
		isGotIDCardInfo: isGotIDCardInfo,
		uploadFile:uploadFile,
		updateCurrentStep:updateCurrentStep,
		fillerrorText: fillerrorText,
		getCurrentStep:getCurrentStep,
		getPdfUrl:getPdfUrl,
		sendMessageWithoutException:sendMessageWithoutException,
		scanNum:scanNum,
		showLoading:showLoading,
		hideLoading:hideLoading,
		preloadImages:preloadImages,
		notLoadTCFlag:notLoadTCFlag,
		beforChageHash:beforeChageHash,
		checkTimer:checkTimer,
		uploadFlag:uploadFlag,
		isGotBankCardInfo:isGotBankCardInfo,
		retrysetPinCard: retrysetPinCard,
		phoneNumberRetry: phoneNumberRetry
	}
});
