define(function(require) {
	var $ = require('jquery'),
		$$ = require('app/util'),
		model = require('./phoneBankingtnc.model'),
		template = require('text!./phoneBankingtnc.template.html'),
		controller = require('./phoneBankingtnc.controller');

	/**
	 * 对外暴露函数，用于视图加载
	 */
	var load = function() {
		$$.actionLog("enter phoneBankingtnc page");
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
			$("#phoneBankingtnc-next").toggleClass("disabled");
		});
		
		$("#phoneBankingtnc-next").off().on("click", function() {
			if($(".no-check").hasClass("checked")){
			$$.beforChageHash().then(function(){
				location.hash ="faceToface";
			})
			}
		});
		$("#phonebank").on("click", function() {
			if(!$(".no-check").hasClass("checked")){
				$('#phoneBankingtnc-next').hide()
			}
		});
		$("#closePdf").on("click", function() {
			$('#phoneBankingtnc-next').show()
		});
		//调用转PDF方法
		$$.transformPdfToImage(".tnc-content", "#showPdf-agree", controller.getLocale());
	}
	
	function run(){
		$$.statusStep(2,2);
		$("#js-exit").hide();
	}


	
	return {
		load: load
	};
});