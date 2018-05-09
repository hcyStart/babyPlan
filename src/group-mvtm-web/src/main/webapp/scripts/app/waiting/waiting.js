define(function (require) {
	var $ = require('jquery'),
		$$ = require('app/util'),
		model = require('./waiting.model'),
		template = require('text!./waiting.template.html'),
		controller = require('./waiting.controller');

	/**
	 * 对外暴露函数，用于视图加载
	 */
	var load = function () {
		$$.actionLog("enter waiting page");
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
		$("#waiting-next").on("click",function(){
			location.hash ="takeIdCard";
		})
	}	

	function run() {
		$$.statusStep(1,1);
		$("#js-exit").hide();
	}

	return {
		load: load
	};
});
