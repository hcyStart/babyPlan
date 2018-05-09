define(function (require) {
	var $ = require('jquery'),
		$$ = require('app/util'),
		model = require('./dialog.model'),
		template = require('text!./dialog.template.html'),
		controller = require('./dialog.controller');
	
	function init() {
		var getSingle = function (fn) {
			var result;
			return function () {
				return result || (result = fn.apply(this, arguments))
			}
		};
		var createFullMask = function () {
			var str = '<div class="home-masklayer" id="home-maskLayer"></div>';
			if($('#home-maskLayer') && $('#home-maskLayer').length == 1){
				$('#home-maskLayer').remove();
			}
			return $("body").append(str);
		};
		
		getSingle(createFullMask());
	}
	
	/**
	 * 对外暴露函数，用于视图加载
	 */
	var load = function () {
		$$.actionLog("enter dialog page");
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
		controller.render($("#view-dialog")[0]);		
	}

	function layerShow (obj) {
		$("#home-maskLayer").show();
		$(obj).show();
	}
	
	function layerHide(obj) {
		$("#home-maskLayer").hide();
		$(obj).hide();
	}
	/**
	 * 事件绑定
	 */
	function bind() {	

		$("#blacklist-backhome").off().on("click", function () {
			layerHide("#blacklist-dialog");
			location.hash = "home" + "_" + new Date().getTime();
		});	
		
		$("#backtohome-confirm").on("click", function() {
			layerHide('#backtohome-dialog');
			location.hash = "home" + "_" + new Date().getTime();;
		});
		
		$("#backtohome-cancel").on("click", function() {
			layerHide('#backtohome-dialog');
		});

	}

	
	
	function run() {
		init();
	}

	return {
		load: load,
		layerShow: layerShow,
		layerHide: layerHide
	};
});
