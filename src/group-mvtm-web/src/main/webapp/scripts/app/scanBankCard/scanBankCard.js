define(function (require) {
	var $ = require('jquery'),
		$$ = require('app/util'),
		model = require('./scanBankCard.model'),
		dialog = require('app/dialog/dialog'),
		template = require('text!./scanBankCard.template.html'),
		controller = require('./scanBankCard.controller'),
	    codeAndTip = require('../../codeAndTip'),
	    popup=require('popup');
	    wosa = require('app/wosa')
	/**
	 * 对外暴露函数，用于视图加载
	 */
	var load = function () {
		$$.actionLog("enter scanBankCard page");
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
/*		$("#sacnBankCard-next").on("click",function()
			location.hash = "enterPassword";
		});*/
		$("#scanBankCard").on("click",function(){
			controller.cannelScanBankCard(); 
			$$.beforChageHash().then(function(){
				location.hash = "accountType";
			})
		})
	}
	function run() {
		$("#scanBankCard").addClass('only-exit');
		$(".bank-card-img").hide();
		if("P" == model.customer.accountType){
			$("#primaryCard").show();
		}else if("A" == model.customer.accountType){
			$("#advanceCard").show();
		}else if("O" == model.customer.accountType){
			$("#personalSynthesis").show();
		}
		$$.statusStep(2,2);
		$$.isGotBankCardInfo = false;
		var language = controller.getLocale();
		controller.trackReaderInit({
			readCardSuc: function (cardResult){
				 $$.debug('银行卡模块返回结果 :'+ cardResult);
				 cardResult = JSON.parse(cardResult);
	 				var hash = location.hash;
	 				if(hash && (hash.indexOf('_') != -1)){
	 					hash = hash.split("_")[0];
	 				}
			    if(cardResult && ("WFS_ERROR" == cardResult.hResult || "WFS_STAT_DEVOFFLINE" == cardResult.hResult) && '#scanBankCard' == hash){	
					$$.debug('银行卡模块错误返回结果   ERROR CODE :'+ cardResult);
					$$.scanIdErrorFlag = true;
					var errorcode = cardResult.errorCode;
					var errType = '';
					if(errorcode == 'E233941'){
						 errType='closeBankCardHandWareError';
					}else{
						 errType='bankCardHandWareError';
					}
					popup(errType,language,"","",errorcode);
			    }else{
			    	 $$.debug('银行卡模块正常返回结果 .');
			    }
			},
			insert: function () {
				$$.debug('银行卡模块插入insert事件不做任何处理，让成功渡取银行卡卡号后自动跳转页面');				
			},
 			success: function () {
 				var unconnectionFlag = $("#mainMaskOfInternet").is(":visible");
 				var hash = location.hash;
 				if(hash && (hash.indexOf('_') != -1)){
 					hash = hash.split("_")[0];
 				}
 				$$.debug(location.hash+'页面,回调success方法, unconnectionFlag:'+unconnectionFlag);
 				//当检查联网状态的popup未弹出的时候才可以进行成功后的操作
 				if(!unconnectionFlag){
 					$$.debug("回调 success 方法");				
 					$$.debug("isGotBankCardInfo: " + $$.isGotBankCardInfo);				
 					$$.debug("success 方法中  hash:"+hash);
 					if($$.isGotBankCardInfo &&'#scanBankCard' == hash){
 						$$.debug("success 方法中进入 enterPassword 页面 ");
 						location.hash = "telephoneBankChoice";
 						/*controller.updateCardNumber().then(function(res){ 	
 		                	 if(codeAndTip.code.common.success == res.status){
 		                		 $$.debug('更新银行卡卡号信息类成功 ，更新成功  ');
 		                		 location.hash = "telephoneBankChoice";
 		                	 }else if(codeAndTip.code.customerSession.notFound == res.status){
 		                 		$$.debug('更新银行卡卡号信息类时，信息未找到'+ JSON.stringify(res));
 								var errType='serviceError';
 								popup(errType,language); 
 		                	 }else{
 		                		$$.debug('更新银行卡卡号信息类请求成功，但是更新失败  :'+ JSON.stringify(res));
 								var errType='serviceError';
 								popup(errType,language);
 		                	 }
 		                	 
 		                },function(err){
 			                 $$.debug('更新银行卡卡号信息类失败   :'+ JSON.stringify(err));
 			            })*/
 					}
 				}
			},
			TimeOut: function (){
				var hash = location.hash;
				if(hash && (hash.indexOf('_') != -1)){
					hash = hash.split("_")[0];
				}
				$$.debug("银行卡扫描或等待扫描超时。hash"+hash);
				if("#scanBankCard" == hash || hash.indexOf('#scanBankCard') >-1){
					var errType='scanBankCardTimeOut';
					popup(errType,language);
				}
			},
			remove: function () {
				$$.debug("收到remove方法不做任何处理，让成功渡取银行卡卡号后自动跳转页面");
			},
			invalidCard: function(){
				$$.debug("invalid 方法中,不可用的银行卡或者没有读取到银行卡信息    hash:"+hash);
				var hash = location.hash;
				if(hash && (hash.indexOf('_') != -1)){
					hash = hash.split("_")[0];
				}
				if('#scanBankCard' == hash || hash.indexOf('#scanBankCard') >-1){
					var errType='invialdBankCardRetry';
					popup(errType,language);
				}	
			},
			handWareError: function(resultAll){
				var hash = location.hash;
				if(hash && (hash.indexOf('_') != -1)){
					hash = hash.split("_")[0];
				}
				$$.debug("银行卡错误类型"+JSON.stringify(resultAll));
				$$.debug("银行卡错误类型    hash："+hash);
				if('#scanBankCard' == hash || hash.indexOf('#scanBankCard') >-1){
					$$.debug("银行卡误类型"+JSON.stringify(resultAll));
					var errorcode = resultAll.errorCode;
					var errType = '';
					if(errorcode == 'E233941'){
						 errType='closeBankCardHandWareError';
					}else{
						 errType='bankCardHandWareError';
					}
					popup(errType,language,"","",errorcode);
				}			
			}
		});
		$$.updateCurrentStep({"idCardNo":model.customer.idCardNo,"stepData":"scanBankCard"}).then(function(res){
			$$.debug("updateCurrentStepSuceess--sacnBankCard")
		},function(res){
			$$.debug("updateCurrentStepFail--sacnBankCard:"+JSON.stringify(res))
		})
	}
	
	return {
		load: load
	};
});
