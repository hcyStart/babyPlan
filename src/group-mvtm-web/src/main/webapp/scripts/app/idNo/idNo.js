define(function (require) {
	var $ = require('jquery'),
		$$ = require('app/util'),
		model = require('./idNo.model'),
		dialog = require('app/dialog/dialog'),
		template = require('text!./idNo.template.html'),
		codeAndTip = require('../../codeAndTip'),
		controller = require('./idNo.controller'),
		popup = require('../../popup');

	/**
	 * 对外暴露函数，用于视图加载
	 */
	var load = function () {
		$$.actionLog("Enter idNo page");
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
		$("#fbInIdNo").on("click",function(){
			$$.beforChageHash().then(function(){
				location.hash = "identificationType";
			})
		})
		$("#idNo-next").on("click", function () {
			$(this).addClass("disabled").attr("disabled",true);
			//var _idNumber = $('.idNo .IDNobg .idNumber').val();
			var _idNumber = ($("#otherIdNo").val()).toUpperCase();
			var _idType = $("#view-part-container").data('idType');
			var idcardInfo = {"IDNumber": _idNumber,'IDType': _idType};
			var _this = $(this);
			model.customer.customerSession.idCardInfo = idcardInfo;
			//专门用于证件号存放，方便后面存取
			model.customer.idCardNo = _idNumber;
			//system resume的相应属性
			model.customer.customerSession.stepData = "idNo";
			$("#fbInIdNo").addClass("disabled").attr("disabled",true);
			customerSession(_this);

		});

		$('#idNO-dialog-again').on('click',function(){
			dialog.layerHide("#idNO-dialog");
			$('.idNumber').val("");
			$('.idNumber').focus();
		})
		
		$('#idNO-dialog-continue').on('click',function(){
			dialog.layerHide("#idNO-dialog");
			//没有通过prill,没开户
			controller.saveCustomerSession();
			$$.beforChageHash().then(function(){
				location.hash = "capture";
			})
		})

		$('#otherIdNo').on('input',function(){
			var idNo = $(this).val(),
				idNoNext = $('#idNo-next');
			$(this).val((idNo).toUpperCase());
			if(idNo && idNo.length>10){
				var errType='idNoInputErrOne'
				var language = controller.getLocale();
				popup(errType,language,null,null,null);
			}else if(idNo.length == 0){
				idNoNext.addClass('disabled').attr("disabled",true);
			}
			if(!(/^[0-9a-zA-Z]{0,10}$/.test($(this).val()))){
				$('.idNumber').blur();
				var errType='idNoInputErrTwo'
				var language = controller.getLocale();
				popup(errType,language,null,null,null);
			}else if(idNo.length == 0){
				idNoNext.addClass('disabled').attr("disabled",true);
			}else{
				idNoNext.removeClass('disabled').attr("disabled",false);
			}
		})
	}

	function customerSession(obj){
		controller.checkCustomerSession(function(){$('#idNo-next').removeClass("disabled").attr("disabled",false)},$("#fbInIdNo"));
		obj.addClass("disabled").attr("disabled",true);
	}

	function run() {
		$$.statusStep(1,1);
		$("#js-exit").hide();
		var language = controller.getLocale();
		var idType = $("#view-part-container").data('idType');
		$('.idNo .IDNobg div').html(model.locale[language][idType]);
		$('.idNumber').focus();
	}

	return {
		load: load
	};
});