define(['./jquery','./app/wosa'],function ($,wosa) {
	var mainMask = $("#mainMaskOfInternet");
	var loadingWrap = $("#loadingWrap");
	var loadingDom = $("#loading");
	var _language = null;
	var timer = null;
	var popupTips = {
		en:{
			netWorkErr:'Server connection error, please check your network.'
		},
		zh:{
			netWorkErr:'服务器连接异常，请检查本机的网络连接。'
		}	
			
	}
	var popupBtnTips = {
		en:{
			netWorkErr:{
				leftBtnTip:'OK'
			}
		},
		zh:{
			netWorkErr:{
				leftBtnTip:'确定'
			}
		}		
	}
	var popupFuns = {
			netWorkErr:{
				leftBtnFun:function(){
					var hash = location.hash;
					if(hash && (hash.indexOf('_') != -1)){
						hash = hash.split("_")[0];
					}
					if("#login" == location.hash){
						$("#username").focus();
						$("#password").focus();
					}else if("#idNo" == location.hash){
						if(!$("#mainMask").is(':visible')){
							$("#otherIdNo").focus();
						}
					}
					if("#telephoneBankChoice" == hash){
						$("#js-next").removeClass("disabled").attr("disabled",false);
					}
					if("#openFileForSign" == hash){
						//图片回显后再让continue按钮处于enable状态
						if($("#previewOfSignature").is(':visible')){
							$("#fileSignNext").removeClass("disabled").attr("disabled",false);
						}
					}
					if("#scanBankCard" == hash){
						beforeChageHash().then(function(){
							location.hash = "scanBankCard_" + (new Date()).getTime();
						})
					}
					if(("#enterPassword" == hash || "#enterAgain" == hash) && window.reloadEnterPassword){
						beforeChageHash().then(function(){
							location.hash = "enterPassword_" + (new Date()).getTime();
						})
					}
					if(("#phoneBankNumber" == hash || "#phoneBankNumberAgain" == hash) && window.reloadPhoneBankNumber){
						beforeChageHash().then(function(){
							location.hash = "phoneBankNumber_" + (new Date()).getTime();
						})
					}
					if("#readyTurnOnCamera" == hash || "#turnOnCameraWaiting" == hash){
						window.external.Record.AsyncStopRecord();
						window.external.Record.CloseRecord();
						location.hash = "faceToface"
					}
				}
			}
	}
	var debug = function(objMsg){
		window.external.Common.LogForFrontSide("Info", objMsg);
	}
	var showLoading = function(){
		loadingDom.show();
		loadingWrap.show();
	}
	var hideLoading = function(){
		loadingDom.hide();
		loadingWrap.hide();
	}
	//监听网络是否连接异常
	var beforeChageHash = function(){
		loadingWrap = $("#loadingWrap");
		loadingDom = $("#loading");
		debug("在checkInternet方法里调用beforeChageHash方法，当前页面是："+location.hash);
		showLoading();
		var img=new Image(); 
		var deffered = $.Deferred();
		img.src = "images/app/common/checked.png?time="+(new Date()).getTime();
		img.onerror = function(){
			deffered.reject();
			debug("检查网络时请求服务器资源失败");
			if(timer){
				clearTimeout(timer);
			}
			timer = setTimeout(function(){
				showPopup("netWorkErr",_language,null,null,null);
			},5000);
		}
		img.onload = function(){
			debug("检查网络时请求服务器资源成功");
			deffered.resolve();
			hideLoading();
		}
		return deffered;
	}
	var showPopup = function (popupName,language,leftEvent,rightEvent,code){
		debug("检查网络的popup："+location.hash);
		hideLoading();
		_language = language;
		var hash = location.hash;
		if(hash && (hash.indexOf('_') != -1)){
			hash = hash.split("_")[0];
		}

		if("#login" == hash){
			$("#username").blur();
			$("#password").blur();
		}else if("#idNo" == hash){
			$("#otherIdNo").blur();
		}
		if(!language){
			language = "zh";
		}
		
		var _domStr = null;
		if(code){
			_domStr = '<div id="popupWrapOfInternet"><p id="popupTipWrapOfInternet">'+popupTips[language][popupName]+code+'</p>';
		}else{
			_domStr = '<div id="popupWrapOfInternet"><p id="popupTipWrapOfInternet">'+popupTips[language][popupName]+'</p>';
		}
		
		var funNum = 0;
		if(leftEvent&&rightEvent){
			funNum = 2;
		}else if(leftEvent || rightEvent){
			funNum = 1;
		}
		var _funNum = null;
		var objOfFun = popupFuns[popupName];
		for(var fun in objOfFun){
			++_funNum;
		}
		funNum = Math.max(funNum,_funNum);
		//如果只有一个button的情况下
		if(1 == funNum){
			if("Back to Home" == popupBtnTips[language][popupName].leftBtnTip || "返回首页" == popupBtnTips[language][popupName].leftBtnTip){
				
				_domStr = _domStr + '<div id="popupBtnWrapOfInternet"><button type="button" id="popupLeftBtnOfInternet">'+popupBtnTips[language][popupName].leftBtnTip+'</button></div>';
			}else{
				_domStr = _domStr + '<div id="popupBtnWrapOfInternet"><button type="button" id="popupLeftBtnOfInternet" class="only-popup-btn">'+popupBtnTips[language][popupName].leftBtnTip+'</button></div>';
			}
		}else if(2 == funNum){
			_domStr = _domStr + '<div id="popupBtnWrapOfInternet"><button type="button" id="popupLeftBtnOfInternet">'+popupBtnTips[language][popupName].leftBtnTip+'</button><button type="button" id="popupRightBtn">'+popupBtnTips[language][popupName].rightBtnTip+'</button></div>';
		}
		mainMask[0].innerHTML = _domStr;
		mainMask.show();
		if(1 == funNum){
			$("#popupLeftBtnOfInternet").off("click").on("click",function(){
				mainMask.hide();
				//如果函数是参数,存在的情况下
				if(leftEvent){
					leftEvent();
				}
				popupFuns[popupName].leftBtnFun();
			})
		}else if(2 == funNum){
			$("#popupLeftBtnOfInternet").off("click").on("click",function(){
				mainMask.hide();
				if(leftEvent){
					leftEvent();
				}
				popupFuns[popupName].leftBtnFun();
			});
			$("#popupRightBtnOfInternet").off("click").on("click",function(){
				$(this).addClass("disabled");
				//在retry的时候让客户视觉上知道点击了retry按钮
				if("canRety" == popupName.split("_")[1]){
					var timer = setTimeout(function(){
						mainMask.hide();
						if(rightEvent){
							rightEvent();
						}
						popupFuns[popupName].rightBtnFun();
						clearTimeout(timer);
					},800)
				}else{
					mainMask.hide();
					if(rightEvent){
						rightEvent();
					}
					popupFuns[popupName].rightBtnFun();
				}
			});
		}
	}
	return showPopup;
});
