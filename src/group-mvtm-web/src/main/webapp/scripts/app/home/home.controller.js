define(['../BaseController','./home.model','app/util','app/wosa'], function (Base,model,$$,wosa) {
	var controller = new Base('home controller');
	//customerSession初始化
    controller.setCustomerSession = function(){
        model.setCustomer({});
        model.customer.customerSession = {}; 
    }
    
    controller.startUpLoadVideoInit = function(callbacks){
		try{
		    var  _hResult = wosa.videoStartSFTPUpload();
		    $$.debug("调用开始上传模块结果"+ _hResult); 
		    _hResult = JSON.parse(_hResult);
		    if(_hResult.hResult == "WFS_SUCCESS"){  
			    callbacks.startUpLoadSuc.call(null);
		    }else{
		    	callbacks.startUpLoadFail.call(null,_hResult);
		    }
		}catch(e){
			$$.debug("调用开始上传模块保存出现异常"+ e); 
		}
    }
    
    controller.stopUpLoadVideoInit = function(callbacks){
		try{
		    var  _hResult = wosa.videoStopUpload();
		    $$.debug("调用停止上传模块结果"+ _hResult); 
		    _hResult = JSON.parse(_hResult);
		    if(_hResult.hResult == "WFS_SUCCESS"){ 
		    	callbacks.stopUpLoadSuc.call(null);
		    }else{
		    	callbacks.stopUpLoadFail.call(null,_hResult);
		    }   
		}catch(e){
			$$.debug("调用停止上传模块保存出现异常"+ e); 
		}
    }
    controller.getUpLoadVideoStatusInit = function(callbacks){
		try{
		    var  _hResult = wosa.videoUploadGetStatus();
		    _hResult = JSON.parse(_hResult);
		    $$.debug("调用停止上传模块结果"+ _hResult); 
		    if(_hResult.hResult == "WFS_SUCCESS"){ 
		        callbacks.getUpLoadVideoStatusSuc.call(null,_hResult);
		    }else{
		        callbacks.getUpLoadVideoStatusFail.call(null,_hResult);
		    } 
		}catch(e){
			$$.debug("调用获取上传信息模块保存出现异常"+ e); 
		}
    }
    
	return controller;
});
