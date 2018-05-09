define(function (require) {
	var $ = require('jquery'),
		$$ = require('app/util'),
		model = require('./scanId.model'),
		dialog = require('app/dialog/dialog'),
		template = require('text!./scanId.template.html'),
		controller = require('./scanId.controller'),
	    codeAndTip = require('../../codeAndTip'),
	    popup=require('popup');
	    wosa = require('app/wosa')
	/**
	 * 对外暴露函数，用于视图加载
	 */
	var load = function () {
		$$.actionLog("enter scanId page");
		render();
		bind();
		run();
	};

	/**
	 * 视图渲染
	 */
	function render() {
		controller.setModel(model);
		controller.setTemplate(template);
		controller.render($("#view-part-container")[0]);
	}

	/**
	 * 事件绑定
	 */
	function bind() {
		$("#fbInScanid").on("click",function(){
			//取消身份证扫描
			controller.cannelScanId();
			location.hash = "identificationType";
		})
/*		$("#scanId-next").on("click",function(){
			//身份证模块没集成作家数据
			 var idcardInfo ={"back":"C:\\Back.jpg","backstatus":"ok","chip":{"Address":"陕西省神马县神马镇魏迴村东合组","Born":"19920507","GrantDept":"神马县公安局","IDCardNO":"610422199205073000","Name":"神马","Nation":"汉族","PhotoFileName":"C:\\photo.bmp","Sex":"男","UserLifeBegin":"20130122","UserLifeEnd":"20230122"},"chipstatus":"ok","front":"C:\\Front.jpg","frontstatus":"ok"};
			 model.customer.customerSession.idCardInfo = idcardInfo;
			 //专门用于身份证呢号存放，方便后面存取
			 model.customer.idCardNo = idcardInfo.chip.IDCardNO;
			 model.customer.customerSession.idCardInfo.IDType = codeAndTip.code.scanid.idCardType;
			//保存完身份证信息后，将身份证信息保存到
			location.hash ="waiting";
		});*/
		/*三次以内扫描*/
		$("#noidentify-idcard-backhome").off().on("click", function () {
			dialog.layerHide("#noidentify-idcard-dialog");
			location.hash ="home";
		});
		
		$("#noidentify-idcard-retry").off().on("click", function () {
			$$.scanNum++;
			dialog.layerHide("#noidentify-idcard-dialog");
			location.hash = "scanId_" + new Date().getTime();
		});
		
		/*没有插入IdCard超时*/
		$("#idcard-timeout-retry").off().on("click", function () {
			dialog.layerHide("#idcard-timeout-dialog");
			location.hash = "scanId_" + new Date().getTime();
		});
		
		$("#idcard-timeout-backhome").off().on("click", function () {
			dialog.layerHide("#idcard-timeout-dialog");
			location.hash = "home";
		});
		
	}
	function run() {
		var language = controller.getLocale();			
		$("#js-exit").hide();
		$("#fbInScanid").addClass('only-exit');
		$$.statusStep(1,1);
		$$.isUserTakeoutCard = false;
		$$.isGotIDCardInfo = false;
		var language = controller.getLocale();
		controller.IDCInit({
			readCardSuc: function (cardResult){
				 $$.debug('身份证模块返回结果 :'+ cardResult);
				 cardResult = JSON.parse(cardResult);
					var hash = location.hash;
					if(hash && (hash.indexOf('_') != -1)){
						hash = hash.split("_")[0];
					}
			    if(cardResult &&  ("WFS_ERROR" == cardResult.hResult || "WFS_STAT_DEVOFFLINE" == cardResult.hResult)  && '#scanId' == hash){	
					$$.debug('身份证模块错误返回结果     ERROR CODE:'+ cardResult);
					var errType='idcardHandWareError';
					var errorcode = cardResult.errorCode;
					popup(errType,language,"","",errorcode);
			    }else{
			    	 $$.debug('身份证模块正常返回结果 .');
			    }
			},
			insert: function () {
				var hash = location.hash;
				$$.debug('身份证模块插入跳转页面      hash：'+hash);
				if(hash && (hash.indexOf('_') != -1)){
					hash = hash.split("_")[0];
				}
				//防止点击back回到其他页面时，收到insert事件再次跳转页面
				if('#scanId' == hash){
					location.hash = 'waiting';
				}			
			},
 			success: function () {
				$$.debug("回调 success 方法");				
				$$.debug("isGotIDCardInfo: " + $$.isGotIDCardInfo);				
				$$.isGotIDCardInfo = true;
				var hash = location.hash;
				$$.debug("success 方法中进入 takeIdCard 页面       hash："+hash);
				if(hash && (hash.indexOf('_') != -1)){
					hash = hash.split("_")[0];
				}
				if($$.isGotIDCardInfo && ('#scanId' == hash || '#waiting' == hash)){
					location.hash = 'takeIdCard';
				}				
			},
			invalidCard: function(){
				var hash = location.hash;
				 $$.debug("回调身份证有误     hash："+hash);	
				 $$.debug($$.scanNum);
				if(hash && (hash.indexOf('_') != -1)){
					hash = hash.split("_")[0];
				}
			    if($$.scanNum < 2){
					$$.scanIDStatus = codeAndTip.code.scanid.cardinvalidRetry;
				}else{
					$$.scanIDStatus = codeAndTip.code.scanid.cardRetryFail;
				}
				$$.debug("invalid 方法中进入 takeIdCard 页面    hash： ");
				if('#scanId' == hash || '#waiting' == hash){
					location.hash = 'takeIdCard';
				}		
			},
			invalidUser: function(invalidUserType){
				var hash = location.hash;
				$$.debug("回调invalidUser方法");
				if(hash && (hash.indexOf('_') != -1)){
					hash = hash.split("_")[0];
				}
				if(invalidUserType&& 'age' ==invalidUserType){
					$$.scanIDStatus = codeAndTip.code.scanid.cardinvalidAge;
				} else {
					$$.scanIDStatus = codeAndTip.code.scanid.cardinvalidCard;
				}
				$$.debug("invalidUser 方法 中进入 takeIdCard 页面    hash："+hash);
				if('#scanId' == hash || '#waiting' == hash){
					location.hash = 'takeIdCard';
				}	
			},
			remove: function () {
				$$.debug("收到remove方法不做任何处理，等待用户点击continue跳转下一步 ");
			},
			TimeOut: function (){
				var hash = location.hash;
				$$.debug("身份证扫描或等待扫描超时。  hash"+hash);
				if(hash && (hash.indexOf('_') != -1)){
					hash = hash.split("_")[0];
				}
				if(hash == "#scanId"){
					var errType='idcardTimeOut';
					popup(errType,language);
				}
			},
			handWareError: function(resultAll){
				var hash = location.hash;
				$$.debug("身份证错误类型"+JSON.stringify(resultAll));
				$$.debug("身份证错误类型    hash："+hash);
				if(hash && (hash.indexOf('_') != -1)){
					hash = hash.split("_")[0];
				}
				if('#scanId' == hash || '#waiting' == hash || '#takeIdCard' == hash){
					$$.debug("身份证错误类型"+JSON.stringify(resultAll));
					var errType='idcardHandWareError';
					var errorcode = resultAll.errorCode;
					popup(errType,language,"","",errorcode);
				}			
			}
		});
	}
	return {
		load: load
	};
});
