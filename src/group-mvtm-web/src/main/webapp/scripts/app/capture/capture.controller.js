define(['../BaseController','app/util','../../codeAndTip','app/wosa','../../popup','app/comInterface'], function (Base,$$,codeAndTip,wosa,popup,comInterface) {
	var controller = new Base('capture controller');

	controller.cameraAsynCallBack = function(callBacks,idNo){
		window.CameraAsynCallBack = function(response){
			$$.showLoading();
			var msg = JSON.parse(response);
			switch (msg.hResult) {
				case codeAndTip.code.common.hardwareAvailable://回调成功
					$$.debug("cameraAsynCallBack:"+msg.hResult);
					callBacks.success(msg);
					break;
				case codeAndTip.code.common.hardwareCancel:
					$$.debug("cameraAsynCallBack:"+msg.hResult);
					callBacks.cancel(msg);
					break;
				case codeAndTip.code.common.hardwareFailure :
					$$.debug("cameraAsynCallBack:"+msg.hResult);
					//此处缺个上传方法
					openExceptionHandel(msg.errorCode,idNo,callBacks.error(msg));
					break;
			}
		}
	};

	function openExceptionHandel(code,idNo,errorFun){
		$$.debug("进入openExceptionHandel页面,errorCode:"+code);
		if("E23101" == code ||"E24104" == code || "E23105" == code){
			popup("cameraStartFailed_retry_1",controller.getLocale(),function(){location.hash="home"},null,code)
		}else if("E23102" == code || "E23103" == code || "E23106" == code ||"E23107" == code){
			popup("cameraStartFailed_retry_2",controller.getLocale(),function(){location.hash="home"},null,code);
		}else{
			//popup("cameraStartFailed_retry_3",controller.getLocale(),function(){location.hash="home"},function(){controller.openResult(idNo,errorFun)},code);
			popup("cameraStartFailed_retry_3",controller.getLocale(),function(){location.hash="home"},null,code);
		}
	}
	
	controller.openResult = function(idNo,errorFun){
		var openResult = JSON.parse(wosa.cameraStart());
		if(codeAndTip.code.common.hardwareAvailable == openResult.hResult){
			$$.debug('capture打开摄像头成功：'+JSON.stringify(openResult))
		}else if(codeAndTip.code.common.hardwareFailure == openResult.hResult){
			$$.debug('capture打开摄像头失败：'+JSON.stringify(openResult));
			openExceptionHandel(openResult.errorCode,idNo,errorFun);
			errorFun();
			$$.hideLoading();
		}
	}
	
	controller.deleteFile = function(id,fileNameArray){
		var url = "/group-vtm-sln-content-service/service/store/deleteAppointFile?folderName=" +id;
		return $$.sendMessageWithoutException(url, JSON.stringify(fileNameArray));
	}

	controller.supportDocUpload = function(idCardNo, coverState) {
		var multipartFile = new FormData($("#uploadForm")[0]);
		$$.debug('capture页面文件上传');
		return $.ajax({
			url: '/group-vtm-sln-content-service/service/store/upload?transactionId=' +
				idCardNo + '&coverState=' + coverState,
			type: 'POST',
			data: multipartFile,
			cache: false,
			contentType: false,
			processData: false
		});
	};
	controller.refreshList = function(IDcard){
			return $.get('/group-vtm-sln-content-service/service/store/list', {
				'folderName': IDcard,
				'randNum': Math.random()
			});
	}
	//更改视频状态
	controller.addVideoStatus = function(idNo,idCardType,numberValue){
		$$.debug('点击submit提交');
		var result = JSON.parse(wosa.addVideoStatus(idNo,true));
		if(codeAndTip.code.common.hardwareAvailable == result.hResult){
			$$.debug('更改录像状态成功(addVideoStatus)：'+JSON.stringify(result));
			//上传captiva
			controller.captiva(idNo,idCardType,numberValue)
		}else if(codeAndTip.code.common.hardwareFailure == result.hResult){
			$$.debug('更改录像状态失败(addVideoStatus)：'+JSON.stringify(result));
			var code = result.errorCode;
			popup("addVideoErr",controller.getLocale(),null,null,code)
		}
	}
	//captiva接口调用
	controller.captiva = function(idCard,idCardType,numberValue) {
		if('I' != idCardType && 'P' != idCardType){
			//captiva接口，当选择的证件类型为通行证时，证件类型为大写的X
			idCardType = 'X';
		}
		$$.debug('上传captiva');
		$$.sendMessage("service/proxy/vtcService/captivaForMvtm/captivaSendFileForMvtm",
			JSON.stringify({
				'idCardNo': idCard,
				'idCardType': idCardType
			})).then(function(res){
				$$.debug('调用captiva接口');
				var status = res.status;
				if('000' == status){
					$$.debug('调用captiva接口成功：'+status);
					//上传gwis
					controller.gwis(idCard,numberValue,idCardType)
				}else{
					$$.debug('captiva服务异常：'+status);
					popup("captivaErr",controller.getLocale(),null,null,status)
				}
			},function(res){
				$$.debug('调用captiva接口失败：'+JSON.stringify(res));
			});
	};
	//Gwis接口调用
	controller.gwis = function(idCard,numberValue,idCardType) {
		$$.debug('上传gwis');
		var idType = null;
		//gwis接口，当选择的证件类型为身份证时，证件类型为大写的ID，当选择的证件类型为其他时，证件类型为Passport
		if('I' == idCardType){
			idType = 'ID';
		}else{
			idType = 'Passport';
		}
		return $$.sendMessage("service/proxy/vtcService/mvtmTakeCard/gwisCreateFileForMvtm",
			JSON.stringify({
				'idCard': idCard,
				'productType': "PACOP",
				'numberValue': numberValue,
				'idValue': idCard,
				'idType': idType
			})).then(function(res){
				$$.debug('调用gwis接口');
				var status = res.status;
				if('000' == status){
					$$.debug('调用gwis接口成功：'+status);
					//更改开户状态
					controller.updateOpeningAccountStatus(idCard)
				}else{
					$$.debug('调用gwis接口失败：'+status);
					//gwis服务异常
					popup("gwisErr",controller.getLocale(),null,null,status);
				}
			},function(res){
				$$.debug('调用gwis接口失败：'+JSON.stringify(res));
			});
	};
	controller.updateOpeningAccountStatus = function(idCard){
		return $$.sendMessage("service/proxy/vtcService/mVTMAOSession/updataStatusByIdCardNo", JSON.stringify({
                "idCardNo": idCard,
                "status": 1
        	})).then(function(res){
        		if(res && res.status == codeAndTip.code.common.success){
        			//更新操作页面
    				$$.updateCurrentStep({"idCardNo":idCard,"stepData":"captureSubmit"}).then(function(res){
    					$$.debug("updateCurrentStepSuceess--captureSubmit")
    				},function(res){
    					$$.debug("updateCurrentStepFail--captureSubmit:"+JSON.stringify(res))
    				})
    				location.hash = 'home';
        			//删除临时文件
        			comInterface.asyncDeleteTempFiles();
        		}else if(codeAndTip.code.customerSession.notFound == res.status){
        			$$.debug('调用updataStatusByIdCardNo接口异常：'+res.status);
        			var errType='serviceError';
    				var language = controller.getLocale();
    				popup(errType,language);
        		}else{
        			$$.debug('调用updataStatusByIdCardNo接口异常：'+res.status);
        			var errType='serviceError';
    				var language = controller.getLocale();
    				popup(errType,language);
        		}
        		
        	},function(res){
        		$$.debug('调用updataStatusByIdCardNo接口失败：'+JSON.stringify(res));
        	});
	}
	return controller;
});
