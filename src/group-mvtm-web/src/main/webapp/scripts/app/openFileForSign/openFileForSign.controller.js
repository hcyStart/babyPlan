define(['../BaseController','app/util','app/wosa', './openFileForSign.model','../../codeAndTip','app/comInterface','../../popup'], function (Base,$$,wosa,model,codeAndTip,comInterface,popup) {
	var controller = new Base('openFileForSign controller');
	var currentHash = location.hash;
	var uploadData = null;
	controller.pdfSignature = function(id,errorFun,language){
		//打开需要客户签名的PDF
		var ret = wosa.smpPdfSignature(id);
		var jsonRet = JSON.parse(ret);
		if(codeAndTip.code.common.hardwareAvailable == jsonRet.hResult){
			$$.debug("open PDF success " +"ret:"+ret + currentHash);
		}else if(codeAndTip.code.common.hardwareFailure == jsonRet.hResult){
			$$.debug("open PDF failed " +"ret:"+JSON.stringify(ret) + currentHash);
			controller.pdfExceptionHandle(_msg.errorCode,language);
			//给dom绑定事件的方法立即执行
			errorFun()();
		}
	}
	controller.closeSignature = function(idNo){
		//关闭需要客户签名的PDF
		try{
			var ret = wosa.closePDFViewer();
			var jsonRet = JSON.parse(ret);
			if(codeAndTip.code.common.hardwareAvailable == jsonRet.hResult){
				$$.debug("close PDF success " +"ret:"+ret + currentHash);
			}else if(codeAndTip.code.common.hardwareFailure == jsonRet.hResult){
				//redo的时候PDF关闭失败,异常暂不处理
				//popup("retryClosePdf",controller.getLocal(),function(){controller.closeSignature(idNo)},function(){location.hash="home"},jsonRet.errorCode)
				$$.debug("close PDF failed " +"ret:"+JSON.stringify(ret) + currentHash);
			}
		}catch(e){
			$$.debug("closeSignature catch error:"+e)
		}
	}
	//PDF签完名的后的回调事件
	controller.callBackPDFControlType = function(idNo,callBacks,language,errorFun){	
		window.callBackPDFControlType = function(type,msg){
			if(codeAndTip.code.openFileForSign.signComplete == type){
				uploadData = msg;
				$$.showLoading();
				$$.debug("callBackPDFControlType回调，type："+type);
				window.CommonBridgeAsynCallBack = function(type,msg){
					if("MultFilesUpload" == type){
						$$.debug("执行上传PDF和签名图片的异步回调事件");
						var _msg = JSON.parse(msg);
						if(codeAndTip.code.common.hardwareAvailable == _msg.hResult){
							var _path = JSON.parse(_msg.data).data[0][1];
							callBacks.success(_path);
							$$.debug("上传PDF和签名图片的异步回调事件执行成功，");
						}else if(codeAndTip.code.common.hardwareFailure == _msg.hResult){
							$$.debug("上传PDF和签名图片的异步回调事件执行失败,msg:"+msg);
							popup("uploadPDFError_canRety",language,function(){controller.uploadFailBackHome(idNo)},function(){controller.uploadPDF(idNo,uploadData,language)},_msg.errorCode);
						}
					}else if("AsyncDeleteDirsAndFiles" == type){
						$$.debug("删除smp的PDF的回调     AsyncDeleteDirsAndFiles  2");
					}
				}
				controller.uploadPDF(idNo,JSON.parse(msg),controller.getLocale());
			}else if(codeAndTip.code.openFileForSign.redo==type){
				//关闭PDF
				controller.closeSignature(idNo);
				//录像功能中,因为部分页面点击exit,pdf点击redo,点击本页面中的continue都会调用生成视频和关闭摄像头接口,因此将改接口封装到了comInterface.js中
				comInterface.asyncStopRecord("faceToface",idNo,"redo",null,controller.getLocale(),null,model.customer.customerSession.smpPath);
			}else if(codeAndTip.code.openFileForSign.pdfError==type){
				var _msg = JSON.parse(msg);
				popup("pdfRetry",language,function(){controller.closeSignature(idNo);errorFun()();},null,_msg.errorCode);
				$$.debug("sign PDF error " +"type:"+type +"msg:" +msg +  currentHash);
			}
		}
	}
	controller.uploadPDF = function(idNo,msg,language){
		$$.showLoading();
		$$.debug("uploadPDF,msg:"+msg+",language:"+language);
		var result = JSON.parse($$.uploadFile(idNo,msg));
		if(codeAndTip.code.common.hardwareAvailable == result.hResult){
			$$.debug("MultFilesUpload上传PDF和签名图片同步执行成功");
		}else if(codeAndTip.code.common.hardwareFailure == result.hResult){
			$$.debug("MultFilesUpload上传PDF和签名图片同步执行失败");
			popup("uploadPDFError_canRety",language,function(){controller.uploadFailBackHome(idNo)},function(){controller.uploadPDF(idNo,msg)},result.errorCode);
		}
	}
	controller.pdfExceptionHandle = function(errorCode,language){
		$$.debug("pdfExceptionHandle,errorCode:"+errorCode+",language:"+language);
		if("E23602" == errorCode || "E23621" == errorCode || "E23622" == errorCode || "E23623" == errorCode){
			popup("pdfNotFound",language,null,null,errorCode);
		}else if("E23603" == errorCode || "E23604"  == errorCode || "E23605" == errorCode || "E23606" == errorCode || "E23607" == errorCode || "E23608" == errorCode || "E23609" == errorCode || "E23610" == errorCode || "E23611" == errorCode || "E23612" == errorCode || "E23613"  == errorCode || "E23614" == errorCode || "E23615" == errorCode || "E23616" == errorCode || "E23617" == errorCode || "E23618" == errorCode || "E23619" == errorCode || "E23620" == errorCode || "E24801" == errorCode || "E23802" == errorCode){
			popup("pdfRetry",language,null,null,errorCode);
		}else if("E23624" == errorCode || "E23625" == errorCode){
			popup("pdfResume",language,null,null,errorCode);
		}
	}
	controller.uploadFailBackHome = function(idNo){
		$$.debug("执行uploadFailBackHome方法");
		wosa.asyncStopRecord();
		wosa.addVideoStatus(idNo,false)
		wosa.closeRecord();
		window.CommonBridgeAsynCallBack = function(){};//重置上传的回调事件
		location.hash="home";
	}
	return controller;
});
