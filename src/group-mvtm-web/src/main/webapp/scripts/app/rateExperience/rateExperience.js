define(function(require) {
	var $ = require('jquery'),
		$$ = require('app/util'),
		dialog = require('app/dialog/dialog'),
		model = require('./rateExperience.model'),
		template = require('text!./rateExperience.template.html'),
		controller = require('./rateExperience.controller');

	/**
	 * 对外暴露函数，用于视图加载
	 */
	var load = function() {
		$$.actionLog("enter rateExperience page");
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
		//对整体流程服务评论
		var arr = ["NA", "20", "40", "60", "80", "100"];
		var num1 = 0,num2 = 0;
		$(".overall-experience li").on('click', function() {
			var _this = $(this);
			var liIndex = $(this).index();
			$(".overall-experience li").removeClass("act");
			_this.addClass("act");
			_this.prevAll().addClass('act');
			num1= $(this).index() + 1;
		});
		//对远程toller评分系统
		$(".remote-experience li").on('click', function() {
			var _this = $(this);
			var liIndex = $(this).index();
			$(".remote-experience li").removeClass("act");
			_this.addClass("act");
			_this.prevAll().addClass('act');
			num2= $(this).index() + 1;
		});
		$("#rate-confirm").off().on('click',function(){
			window.captureNext = "home";
			$$.beforChageHash().then(function(){
				location.hash = "capture";
			})
		})
	}

	function run() {
		$$.statusStep(7,3);
		$('.main-padding').scrollTop(0);
		$$.updateCurrentStep({"idCardNo":model.customer.idCardNo,"stepData":"rateExperience"}).then(function(res){
			$$.debug("updateCurrentStepSuceess--rateExperience")
		},function(res){
			$$.debug("updateCurrentStepFail--rateExperience:"+JSON.stringify(res))
		})
	}

	return {
		load: load
	};
});