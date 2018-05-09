define(function(require) {
	var $ = require('jquery'),
		$$ = require('app/util'),
		model = require('./openAccount.model'),
		dialog = require('app/dialog/dialog'),
		template = require('text!./openAccount.template.html'),
		controller = require('./openAccount.controller');
	/**
	 * 对外暴露函数，用于视图加载
	 */
	var load = function() {
		$$.actionLog("enter openAccount page");
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
		$("#confirm").on('click',function(){
			$('.cardNumber span:nth-child(2)').html('1234565676544');
			$(this).addClass('active');
		});
		$("#form-group-Pass").on('click',function(){
			$(this).addClass('active');
		});
		$("#openAccount-next").on('click',function(){
			location.hash = 'readyTurnOnCamera';
		});

	}

	function run() {
		$$.statusStep(4);
	}

	return {
		load: load
	};
});
