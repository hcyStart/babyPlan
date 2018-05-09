define(function (require) {
	var $ = require('jquery'),
		$$ = require('app/util'),
		model = require('./showIdCard.model'),
		dialog = require('app/dialog/dialog'),
		template = require('text!./showIdCard.template.html'),
		controller = require('./showIdCard.controller'),
		codeAndTip = require('../../codeAndTip'),
		popup = require('../../popup');
	

	/**
	 * 对外暴露函数，用于视图加载
	 */
	var load = function () {
		$$.actionLog("enter showIdCard page");
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
	
	
	//国政通查询对比
	function GZTSearch(){
		
		controller.idValidatior().then(function(res){
			var contrastiveSuccess = $("#contrastiveSuccess"),
				contrastiveFailure = $("#contrastiveFailure"),
				queryEmpty = $("#queryEmpty"),
				GTZSuccessError = $("#GTZSuccessError"),
				GuoZhengTongImg = $("#guoZhengTongImg"),
				resultHint = $(".resultHint"),
				NotApplicable = $("#GZTMsg .notApplicable"),
				UserName = $("#userName .userName"),
				UserNumber = $("#userNumber .userNumber"),
				hintIcon = $("#GZTContainer .hintIcon"),
				GZTMsg = $("#GZTMsg"),
				refreshButton = $("#refreshButton")
			contrastiveSuccess.hide();
			contrastiveFailure.hide();
			queryEmpty.hide();
			GTZSuccessError.hide();
			$$.debug('请求国政通成功status:'+res.status);
			if (codeAndTip.code.common.success == res.status && res.data.length > 0){
				var data = res.data[0];
				if(data.message.status == "0"){
					var policeCheckInfo = data.policeCheckInfos.policeCheckInfo;
					$$.debug('请求国政通成功policeCheckInfo:'+policeCheckInfo);
					if(policeCheckInfo.compStatus == "1"){
						queryEmpty.show();
						GuoZhengTongImg.empty();
						GuoZhengTongImg.append("<i class='icon ico-no-photo'></i>");
						hintIcon.removeClass('icon-id-right').addClass('icon-id-wrong');
						resultHint.removeClass('GZTsearch-right').addClass('GZTsearch-wrong');
						NotApplicable.show();
						GZTMsg.show();
						refreshButton.show();
						$$.debug('库无此人');
					}else if(policeCheckInfo.compStatus == "2"){
						contrastiveFailure.show();
						GuoZhengTongImg.empty();
						GuoZhengTongImg.append("<i class='icon ico-no-photo'></i>");
						hintIcon.removeClass('icon-id-right').addClass('icon-id-wrong');
						resultHint.removeClass('GZTsearch-right').addClass('GZTsearch-wrong');
						UserName.html(policeCheckInfo.name);
						UserNumber.html(policeCheckInfo.id);
						NotApplicable.hide();
						GZTMsg.show();
						refreshButton.show();
						$$.debug('身份证对比结果不一致');
					}else if(policeCheckInfo.compStatus == "3"){
						contrastiveSuccess.show();
						hintIcon.removeClass('icon-id-wrong').addClass('icon-id-right');
						resultHint.removeClass('GZTsearch-wrong').addClass('GZTsearch-right');
						UserName.html(policeCheckInfo.name);
						UserNumber.html(policeCheckInfo.id);
						NotApplicable.hide();
						GuoZhengTongImg.empty();
						GuoZhengTongImg.append("<img src='data:image/gif;base64,"+policeCheckInfo.checkPhoto+"?t"+new Date().getTime()+"'/>")
						GZTMsg.show();
						refreshButton.show();
						$$.debug('身份证对比结果一致');
					}
				}
			}else if(codeAndTip.code.showIdcard.GTZerror == res.status){
				GTZSuccessError.show();
				hintIcon.removeClass('icon-id-right').addClass('icon-id-wrong');
				resultHint.removeClass('GZTsearch-right').addClass('GZTsearch-wrong');
				$("#idInformation").empty();
				refreshButton.show();
				$$.debug('后台请求国政通失败');
			}
		},function(){
			$("#GZTContainer").empty();
			var errType='serviceError'
			var language = controller.getLocale();
			popup(errType,language)
		})
		
	}
	
	
	
	
	

	/**
	 * 事件绑定
	 */
	function bind() {
		$("#showIdCard-next").off().on("click", function () {
			$$.beforChageHash().then(function(){
				location.hash = "capture";
			})
		});
		
		
		
		
		
		//刷新重试
		$("#refreshGZT").off("click").on("click",function() {
			var _this = $(this)
			GZTSearch();
			if (_this.hasClass("disable")) {
				return;
			}
			_this.addClass("disable");
			//cobain--待功能完成后,测试用计时器需要删除
			var timer = setTimeout(function(){
			 _this.removeClass("disable");
			 },800)
		})

	}

	function run() {
		GZTSearch();
		$$.statusStep(1,1);
		$$.updateCurrentStep({"idCardNo":model.customer.idCardNo,"stepData":"showIdCard"}).then(function(res){
			$$.debug("updateCurrentStepSuceess--showIdCard--then")
		},function(res){
			$$.debug("updateCurrentStepFail--showIdCard")
		})
		$('#idCard-face').attr('src', "images/app/showIdCard/front.jpg");
		$('#idCard-back').attr('src', "images/app/showIdCard/back.jpg");
		//$('#guoZhengTongImg').attr('src', "images/app/showIdCard/guozhengtong1.png");
		if("invalidUser" == $$.scanIDStatus){
			//dialog.layerShow("#blacklist-dialog");
		}
		
		if("invalidRetry" == $$.scanIDStatus){
			//dialog.layerShow("#noidentify-idcard-dialog");
		}
		
		if("invalid" == $$.scanIDStatus){
			//dialog.layerShow("#scanidcard-failed-dialog");
		}
	}

	return {
		load: load
	};
});
