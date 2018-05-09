define(function (require) {
	var $ = require('jquery'),
		$$ = require('app/util'),
		model = require('./turnOnCamera.model'),
		dialog = require('app/dialog/dialog'),
		template = require('text!./turnOnCamera.template.html'),
		controller = require('./turnOnCamera.controller');
	/**
	 * 对外暴露函数，用于视图加载
	 */
	var load = function () {
		$$.actionLog("enter turnOnCamera page");
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
		$("#turnOnCamera-next").on("click",function(){
			$$.beforChageHash().then(function(){
				location.hash ="understandTnc";
			})
		})
	}

	function run() {
		$$.statusStep(2,4);
		$("#js-exit").show();
		$$.updateCurrentStep({"idCardNo":model.customer.idCardNo,"stepData":"turnOnCamera"}).then(function(res){
			$$.debug("updateCurrentStepSuceess--turnOnCamera")
		},function(res){
			$$.debug("updateCurrentStepFail--turnOnCamera:"+JSON.stringify(res))
		})
	}
	return {
		load: load
	};
});
