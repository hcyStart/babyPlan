define(function (require) {
	var $ = require('jquery'),
		$$ = require('app/util'),
		model = require('./setPasswordSuccess.model'),
		template = require('text!./setPasswordSuccess.template.html'),
		controller = require('./setPasswordSuccess.controller');

	/**
	 * 对外暴露函数，用于视图加载
	 */
	var load = function () {
		$$.actionLog("Enter setPasswordSuccess page");
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
		$("#setPasswordSuccess-next").click(function(){
			location.hash = "displayQR";
		})
		
	}

	function run() {
		$$.statusStep(2,6);
	}

	return {
		load: load
	};
});