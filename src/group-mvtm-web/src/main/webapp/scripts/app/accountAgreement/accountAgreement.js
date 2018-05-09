define(function(require) {
	var $ = require('jquery'),
		$$ = require('app/util'),
		model = require('./accountAgreement.model'),
		template = require('text!./accountAgreement.template.html'),
		controller = require('./accountAgreement.controller');

	/**
	 * 对外暴露函数，用于视图加载
	 */
	var load = function() {
		$$.actionLog("enter accountAgreement page");
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
		controller.render($('#view-part-container')[0]);
	}

	/**
	 * 事件绑定
	 */
	function bind() {
		$(".agree-term").off().on("click", function() {
			var _this = $(this);
			_this.find(".no-check").toggleClass("checked");
			$("#accountAgreement-next").toggleClass("disabled");
		});
		
		$(".tnc-content-tcAgree").on("click", function() {
			if(!$(".no-check").hasClass("checked")){
				$('#accountAgreement-next').hide()
			}
		});
		$("#closePdf").on("click", function() {
			$('#accountAgreement-next').show()
		});

		$("#accountAgreement-next").off().on("click", function() {
			if($(".no-check").hasClass("checked")){
				$$.beforChageHash().then(function(){
					location.hash ="telephoneBankChoice";
				})
			}
		});
	}

	function run() {
		$$.statusStep(2,4);
		$("#accountAgreement-next").show();
		//调用转PDF方法
		$$.transformPdfToImage(".tnc-content-tcAgree", "#showPdf-agree", controller.getLocale());
	}
	
	return {
		load: load
	};
});