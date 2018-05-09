define(function (require) {
	var $ = require('jquery'),
		$$ = require('app/util'),
		model = require('./scanId.model'),
		dialog = require('app/dialog/dialog'),
		template = require('text!./scanId.template.html'),
		controller = require('./scanId.controller');
	/**
	 * 对外暴露函数，用于视图加载
	 */
	var load = function () {
		$$.actionLog("enter scanId page");
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
		$("#scanId-next").on("click",function(){
			//身份证模块没集成作家数据
			if(model){
				 var idcardInfo = {"Name":"王家良","Gender":"男","Nation":"汉","Birthday":"19791007","Address":"西安市雁塔区鱼化街西安外事学院家属院2区1号楼1单元2层A户","IDNumber":"412928197910073838","IssueDepartment":"西安市公安局雁塔分局","ValidFromDate":"20071115","ValidExpiryDate":"20271115","Reserve":"","PhotoPathFornt":"C:\\Users\\Public\\Documents\\MVTMClient\\Files\\IDCardImgs\\front.bmp"};
				 model.customer.customerSession.idCardInfo = idcardInfo;
				 //专门用于身份证呢号存放，方便后面存取
				 model.customer.idCardNo = idcardInfo.IDNumber;
		    }
			//保存完身份证信息后，将身份证信息保存到
			controller.checkCustomerSession();				
			location.hash ="waiting";
		});
	}

	function run() {
		$$.statusStep(1,1);
		$$.isUserTakeoutCard = false;
		$$.isGotIDCardInfo = false;
		controller.IDCInit({
			readCardSuc: function (cardResult){
				 $$.debug('身份证模块返回结果 :'+ cardResult);
			    if(cardResult && "WFS_STAT_DEVHWERROR" == cardResult.hResult){
			    	 //alert("准备开始retry");
			    }else{
			    	 $$.debug('身份证模块正常返回结果 :'+ cardResult);
			    }
			},
 			success: function (IDCInfo) {
				$$.debug("回调 success 方法");
				if(IDCInfo){
	                location.hash = "showIdCard";
				}
			},
			error: function (errorinfo) {
				 $$.debug("回调身份证失败： "+JSON.stringify(errorinfo));
				 //alert('错误码：'+errorinfo.errorCode+',错误信息：'+errorinfo.ResultStr);
			},
			invalid: function(){
				 $$.debug("回调身份证有误 ");
				 //alert("身份证扫描失败");				
			}
		});
	}

	return {
		load: load
	};
});
