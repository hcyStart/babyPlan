define(function(require) {
	var $ = require('jquery'),
		$$ = require('app/util'),
		model = require('./displayQR.model'),
		template = require('text!./displayQR.template.html'),
		controller = require('./displayQR.controller');

	/**
	 * 对外暴露函数，用于视图加载
	 */
	var load = function() {
		$$.actionLog("enter displayQR page");
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
		$("#displayQR-next").off().on("click", function() {
			$$.beforChageHash().then(function(){
				location.hash = "displayWeChat";
			})
		});
	}

	function run() {
		$$.statusStep(3,1);
		$$.updateCurrentStep({"idCardNo":model.customer.idCardNo,"stepData":"displayQR"}).then(function(res){
			$$.debug("updateCurrentStepSuceess--displayQR")
		},function(res){
			$$.debug("updateCurrentStepFail--displayQR:"+JSON.stringify(res))
		})
	}
	
	return {
		load: load
	};
});