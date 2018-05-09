define(['../BaseController','app/util','./faceToface.model','../../codeAndTip','app/wosa'], function (Base,$$, model,codeAndTip,wosa) {
	var controller = new Base('faceToface controller');
	
	controller.pinChangeCpb = function(idNumber){
		return $$.sendMessageWithoutException("service/proxy/vtcService/pinChange/pinChangeCpb", JSON.stringify({
            "idNumber": idNumber
        }));
	};
	
	controller.checkPDFInit = function(callbacks){ 
		try{
		    var pdfResult = wosa.CheckSMPPDFisReady(model.customer.idCardNo);
			$$.debug("CheckSMPPDFisReady result")
	        var handwareResult = JSON.parse(pdfResult); 
		    if(codeAndTip.code.common.hardwareAvailable == handwareResult.hResult){
		         callbacks.pdfReadySuc(pdfResult);
		    }else{
		    	 callbacks.pdfReadyFail(pdfResult);
		    }	 
		}catch(e){
			$$.debug("调用查看SMPpdf是否存在出现异常"+ e); 
		}
	};
	return controller;
});
