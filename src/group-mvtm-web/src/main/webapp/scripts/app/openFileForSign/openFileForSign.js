define(function(require) {
	var $ = require('jquery'),
		$$ = require('app/util'),
		model = require('./openFileForSign.model'),
		dialog = require('app/dialog/dialog'),
		template = require('text!./openFileForSign.template.html'),
		controller = require('./openFileForSign.controller'),
		comInterface = require('app/comInterface'),
		popup = require('../../popup');
	
	var nextBtn = null;
	var openFileBtn = null;//打开pdf的button
	var closeRetryTime=null;//尝试调用生成视频的事件(C#)
	var stopRetryTime = null;//尝试调用关闭摄像头的事件(c#)
	/**
	 * 对外暴露函数，用于视图加载
	 */
	var load = function() {
		$$.actionLog("enter openFileForSign page");
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
		nextBtn = $("#fileSignNext");
		openFileBtn = $("#openFileForSign");
/*		openFileBtn.on('click',function(){
			$(this).addClass('fielSignActive');
			//打开需要客户签名的PDF
			controller.pdfSignature(model.customer.idCardNo);
			openFileBtn.off("click");
		})*/
		openPDFEvent();
		nextBtn.off("click").on("click",function(){
			$$.beforChageHash().then(function(){
				//录像功能中,因为部分页面点击exit,pdf点击redo,点击本页面中的continue都会调用生成视频和关闭摄像头接口,因此将改接口封装到了comInterface.js中
				comInterface.asyncStopRecord("reminder",model.customer.idCardNo,"continue",null,controller.getLocale(),function(){nextBtn.removeClass("disabled").attr("disabled",false)},model.customer.customerSession.smpPath);
				nextBtn.addClass("disabled").attr("disabled",true);
			})
		})
	}
	function run() {
		closeRetryTime = 3;
		stopRetryTime = 3;
		$$.statusStep(2,6);
		$("#previewOfSignature").hide();
		//PDF签名结束后的回调事件
		controller.callBackPDFControlType(model.customer.idCardNo,{
			success: function(path){
					//显示签名前先show loading
					$$.showLoading();
					$('#openFileForSign b.icon').removeClass('arrow').addClass('openPdf');
					var path = path+"?d="+(new Date()).getTime();
					var imgDom = $("#previewOfSignature img")[0];
					var loadingTimes = 0;
					loadSignImg(path,imgDom,loadingTimes);
					$("#previewOfSignature").show();
					nextBtn.removeClass("disabled").attr("disabled",false);
					//成功签名后按钮可再点击
					openPDFEvent();
					$$.hideLoading();
				}
		},controller.getLocale(),openPDFEvent)
	}
	function loadSignImg(path,imgDom,loadingTimes){
		if(loadingTimes<3){
			imgDom.onload = function(){$$.hideLoading();}
			imgDom.onerror = function(){loadSignImg(path,imgDom,loadingTimes);}
			imgDom.src = path;
		}else{
			popup("serviceError",controller.getLocale(),backHomeFun,null,"");
		}
		loadingTimes++;
	}
	function backHomeFun(){
		var smpPath = model.customer.customerSession && model.customer.customerSession.smpPath;
		comInterface.asyncStopRecord("home",model.customer.idCardNo,"exit",null,controller.getLocale(),null,smpPath);
	}
	//打开一次pdf后,按钮不再可点击
	function openPDFEvent(){
		openFileBtn.on('click',function(){
			$(this).addClass('fielSignActive');
			//打开需要客户签名的PDF
			controller.pdfSignature(model.customer.idCardNo,openPDFEvent,controller.getLocale());
			openFileBtn.off("click");
		})
	}
	return {
		load: load
	};
});
