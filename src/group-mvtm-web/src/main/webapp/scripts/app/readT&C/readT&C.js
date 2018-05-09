define(function(require) {
	var $ = require('jquery'),
		$$ = require('app/util'),
		model = require('./readT&C.model'),
		template = require('text!./readT&C.template.html'),
		controller = require('./readT&C.controller');

	/**
	 * 对外暴露函数，用于视图加载
	 */
	var load = function() {
		$$.actionLog("enter readT&C page");
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
			location.hash = "faceToface";
		});
	}

	function run() {
		$$.statusStep(7,2);
		var needPhoneBanking = model.customer.customerSession.selectPhoneBanking;
		var language = controller.getLocale();
		if(needPhoneBanking){
			if("zh"==language){
				$("#tAndcSrc").prop("src","images/app/readT&C/zhNeedPB.jpg");
			}else{
				$("#tAndcSrc").prop("src","images/app/readT&C/enNeedPB.jpg");
			}
		}else{
			if("zh"==language){
				$("#tAndcSrc").prop("src","images/app/readT&C/zhNoNeedPB.jpg");
			}else{
				$("#tAndcSrc").prop("src","images/app/readT&C/enNoNeedPB.jpg");
			}
		}
	}
	
	return {
		load: load
	};
});