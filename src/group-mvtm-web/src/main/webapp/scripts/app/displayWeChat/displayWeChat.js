define(function(require) {
	var $ = require('jquery'),
		$$ = require('app/util'),
		model = require('./displayWeChat.model'),
		template = require('text!./displayWeChat.template.html'),
		controller = require('./displayWeChat.controller');

	/**
	 * 对外暴露函数，用于视图加载
	 */
	var load = function() {
		$$.actionLog("enter displayWeChat page");
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
		$("#displayWeChat-next").off().on("click", function() {
			$$.beforChageHash().then(function(){
				location.hash = "rateExperience";
			})
		});
	}

	function run() {
		$$.statusStep(3,2);
		$$.updateCurrentStep({"idCardNo":model.customer.idCardNo,"stepData":"displayWeChat"}).then(function(res){
			$$.debug("updateCurrentStepSuceess--displayWeChat")
		},function(res){
			$$.debug("updateCurrentStepFail--displayWeChat"+JSON.stringify(res))
		})

	}
	
	return {
		load: load
	};
});