define(function(require) {
	var $ = require('jquery'),
		$$ = require('app/util'),
		model = require('./understandTnc.model'),
		dialog = require('app/dialog/dialog'),
		template = require('text!./understandTnc.template.html'),
		controller = require('./understandTnc.controller'),
		codeAndTip = require('../../codeAndTip');
	var nextBtn = null;
	/**
	 * 对外暴露函数，用于视图加载
	 */
	var load = function() {
		$$.actionLog("enter understandTnc page");
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
		nextBtn = $("#understandNext");

		nextBtn.off("click").on("click",function(){
			$$.beforChageHash().then(function(){
				location.hash = "openFileForSign"
			})
		})

	}
	function run() {
		$$.statusStep(2,5);
		var	PDFNum = null;
		var PBankResult = model.customer.customerSession.selectPhoneBanking,
			prefillResult = model.customer.customerSession.prefillState;
		$("#agree-term td:gt(0)").hide();
		if(PBankResult == 1 && prefillResult == 1){
			$(".agree-PBankAndPrefill-content").show();
		}else if(PBankResult == 0 && prefillResult == 1){
			$(".agree-prefill-content").show();
		}else if(PBankResult == 1 && (prefillResult == 0 || prefillResult == undefined)){
			$(".agree-PBank-content").show();
		}else if(PBankResult == 0 && (prefillResult == 0 || prefillResult == undefined)){
			$(".agree-content").show();
		}
		$$.updateCurrentStep({"idCardNo":model.customer.idCardNo,"stepData":"understandTnc"}).then(function(res){
			$$.debug("updateCurrentStepSuceess--understandTnc")
		},function(res){
			$$.debug("updateCurrentStepFail--understandTnc:"+JSON.stringify(res))
		});
		if(PBankResult == 0){
			$('[data-name=phonebank]').hide();
			PDFNum = 4;
		}else{
			$('[data-name=phonebank]').show();
			PDFNum = 5;
		}

		function readTcYes(){
			$$.transformPdfToImage(".termDetail", "#showPdf-agree", controller.getLocale());
			$(".agree-term").off("click").on("click", function() {
				var _this = $(this);
				_this.find(".no-check").toggleClass("checked");
				if($(".no-check").hasClass("checked")){
					nextBtn.removeClass("disabled").attr("disabled",false);
				}else{
					nextBtn.addClass("disabled").attr("disabled",true);
				}
			});
		}
		function readTcNo(){
			$$.transformPdfToImage(".termDetail", "#showPdf-agree", controller.getLocale());
			$('.form-inline-tcAgree .no-check').addClass('checkboxDisable');

			$(".agree-term").off("click").on("click", function() {
				var _this = $(this),
					i = 0;
				$(".termDetail").each(function(){
					if($(this).data("code") == "open"){
						i++;
						if(i ==PDFNum){
							_this.find(".no-check").toggleClass("checked");
						}else{
							return;
						}
						if($(".no-check").hasClass("checked")){
							nextBtn.removeClass("disabled").attr("disabled",false);
						}else{
							nextBtn.addClass("disabled").attr("disabled",true);
						}
					}
				})
			});
		}

		var idCardInfo = model.customer.customerSession.idCardInfo,
		 	idNum = model.customer.idCardNo,
			idType = idCardInfo.IDType

//		controller.PrefillInfoForMvtmPO(idNum,idType).then(function(res){
//			if (res.status == codeAndTip.code.common.success && res.data.length > 0){
//				var data = res.data[0];
//				$('.termDetail').find('b').removeClass('arrow').addClass('open icon');
//					readTcYes();
//			}else if(res.status == codeAndTip.code.understandTnc.notRegPreFill){
//				readTcNo();
//			}
//		},function(){
//			alert("服务器异常")
//		});
			if(prefillResult == 1){
				readTcYes();
				$('.termDetail').find('b').removeClass('arrow').addClass('open icon');
			}else if(prefillResult == 0){
				readTcNo();
			}else if(prefillResult == undefined){
				readTcNo();
			}

	}
	return {
		load: load
	};
});
