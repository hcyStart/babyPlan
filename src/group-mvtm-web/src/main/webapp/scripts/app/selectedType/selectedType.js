define(function(require) {
	var $ = require('jquery'),
		$$ = require('app/util'),
		model = require('./selectedType.model'),
		template = require('text!./selectedType.template.html'),
		controller = require('./selectedType.controller');

	/**
	 * 对外暴露函数，用于视图加载
	 */
	var load = function() {
		$$.actionLog("enter selectedType page");
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

	function bind(){
		$(".term-en").removeClass("term-en").addClass("term-"+controller.getLocale());
		$(".acceptTerm-en").removeClass("acceptTerm-en").addClass("acceptTerm-"+controller.getLocale());
		if(controller.getLocale() == "en"){
			if(model.accountType == "Premier"){
				$(".cardTypeDeTail .cardImg .premierImg").addClass("premierCardImg");
				$(".selectedType .cardTypeDeTail .term-en .termsPremier").addClass("termDetail");
			}else{
				$(".cardTypeDeTail .cardImg .advanceImg").addClass("advanceCardImg");
				$(".selectedType .cardTypeDeTail .term-en .termsAdvance").addClass("termDetail");
			}
		}else{
			if(model.accountType == "Premier"){
				$(".cardTypeDeTail .cardImg .premierImg").addClass("premierCardImg");
				$(".selectedType .cardTypeDeTail .term-zh .termsPremier").addClass("termDetail");
			}else{
				$(".cardTypeDeTail .cardImg .advanceImg").addClass("advanceCardImg");
				$(".selectedType .cardTypeDeTail .term-zh .termsAdvance").addClass("termDetail");
			}
		}
		$("#accountCheck").on("click", function() {
			if($(this).find("input").prop("checked")){
				$(this).find("span").removeClass("checked");
				$("#selectedType-next").addClass("disabled");
				$(this).find('input').prop('checked', false);
			}else{
				$(this).find("span").addClass("checked");
				$("#selectedType-next").removeClass("disabled");
				$(this).find('input').prop('checked', true);
			}
		});
		$("#selectedType-next").on("click", function() {
			if(!$("#selectedType-next").hasClass("disabled")){
				$$.beforChageHash().then(function(){
					location.hash = "accountAgreement";
				})
			}
		});
		$("#premierType,#advanceType").on("click", function() {
			if(!$("#accountCheck input").prop("checked")){
				$('#selectedType-next').hide()
			}
		});
		$("#closePdf").on("click", function() {
			$('#selectedType-next').show()
		});
	}

	function run() {
		$$.statusStep(2,2);
		$("#js-exit").hide();
		//调用转PDF方法
		$$.transformPdfToImage(".terms", "#showPdf-agree", controller.getLocale());
	}

	return {
		load: load
	};
});
