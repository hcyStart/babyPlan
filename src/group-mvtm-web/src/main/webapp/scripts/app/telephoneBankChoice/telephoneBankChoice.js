define(function(require) {
	var $ = require('jquery'),
		$$ = require('app/util'),
		model = require('./telephoneBankChoice.model'),
		dialog = require('app/dialog/dialog'),
		template = require('text!./telephoneBankChoice.template.html'),
		controller = require('./telephoneBankChoice.controller'),
    	popup = require('../../popup'),
	    codeAndTip = require('../../codeAndTip');
	/**
	 * 对外暴露函数，用于视图加载
	 */
	var load = function() {
		$$.actionLog("enter telephoneBankChoice page");
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
		$("#fbInTleChoice").on("click",function(){
			location.hash = "scanBankCard";
		})
		
		var contineBtn = $("#js-next");
		var phoneBackchose = $("#choiceBtnContainerButton .clickPhBackButton")
			phoneBackchose.on('click',function(){
				phoneBackchose.removeClass('selectButton').addClass('uncheckedButton');
				$(this).removeClass('uncheckedButton').addClass('selectButton')
				contineBtn.removeClass('disabled').attr("disabled",false);
			});
		contineBtn.off("click").on('click',function(){
			//contineBtn.addClass("disabled").attr("disabled",true);
			//$("#fbInTleChoice").addClass("disabled").attr("disabled",true)
			var needPhoBank = $("#needPhoBank").hasClass('selectButton'),
				notNeedPhoBack = $("#notNeedPhoBank").hasClass('selectButton');
			if(needPhoBank){
				model.customer.customerSession.selectPhoneBanking = 1;
			}else if(notNeedPhoBack){
				model.customer.customerSession.selectPhoneBanking = 0;
			}
			controller.updateAccountType();
			//更新customerSession中的phoneBanking
			/*controller.updatePhoneBankingStatus().then(function(res){
           	 if(codeAndTip.code.common.success == res.status){
        		 $$.debug('更新phoneBanking状态成请求功  ，更新成功  :'+ res.status);
    			$$.beforChageHash().then(function(){
    				 location.hash = 'faceToface';
				})
        	 }else if(codeAndTip.code.customerSession.notFound == res.status){
        		 $$.debug('更新phoneBanking未找到信息 :'+ res.status);
 				 var errType='serviceError';
 				 var language = controller.getLocale();
 				 popup(errType,language,function(){$("#fbInTleChoice").removeClass("disabled").attr("disabled",false)},function(){$("#fbInTleChoice").removeClass("disabled").attr("disabled",false)},null);
        	 }else{
        		$$.debug('更新phoneBanking状态请求成功 ，但是更新失败  :'+ res.status);
				var errType='serviceError';
				var language = controller.getLocale();
				popup(errType,language,function(){$("#fbInTleChoice").removeClass("disabled").attr("disabled",false)},function(){$("#fbInTleChoice").removeClass("disabled").attr("disabled",false)},null);
        	 }
			},function(err){
				$$.debug('更新phoneBanking状态失败   :'+ err);
			});*/
		})
	}

	function run() {
		$$.statusStep(2,3);
		$("#js-exit").hide();
	    //重写扫描银行卡页面防止它在别的页面弹出框
		window.TrackReaderAsyncCallBack = function (){}
		//systemResume功能,记录执行步骤
		$$.updateCurrentStep({"idCardNo":model.customer.idCardNo,"stepData":"telephoneBankChoice"}).then(function(res){
			$$.debug("updateCurrentStepSuceess--telephoneBankChoice")
		},function(res){
			$$.debug("updateCurrentStepFail--telephoneBankChoice:"+JSON.stringify(res))
		})
	}

	return {
		load: load
	};
});
