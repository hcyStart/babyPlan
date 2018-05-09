define(['./util','./wosa','codeAndTip','popup'],function ($$,wosa,codeAndTip,popup) {
	var recordFuns = {};
	recordFuns.currentHash = null;//记录当前页面的,用于system resume功能
	recordFuns.nextHash = null;//视频正常结束后(包含stop和close)要跳转的下一个页面
	recordFuns.idNo = null;//顾客开户所用的证件号码
	recordFuns.type = null;//是否是redo功能或exit功能的标识(redo的时候,则type为"redo",exit贼为"exit")
	recordFuns.recordError = null;//给视频一个标识,错误视频或正常视频
	recordFuns.language = null;//主要用于popup
	recordFuns.smpPath = null;//主要用于删除smp的pdf
	/**
	 *停止录屏并生成视频
	 */
	recordFuns.asyncStopRecord = function(nextHash,idNo,type,recordError,language,enableClick,smpPath){
		recordFuns.currentHash = location.hash.split("#")[1];//去掉#
		$$.debug(recordFuns.currentHash+"页面进入方法asyncStopRecord,nextHash:"+nextHash+",type:"+type+",recordError:"+recordError+",language:"+language);
		//在异常退出的时候会传null,异常退出方法已赋值
		if(nextHash){
			recordFuns.nextHash = nextHash;//不同页面调用该方法时,用此变量记录该方法调用成功后的跳转页面的hash值
		}
		//在异常退出的时候会传null,异常退出方法已赋值
		if(idNo){
			recordFuns.idNo = idNo;//记录当前顾客的证件号码,用于system resume功能
		}
		//如果是exit或者redo,type就是exit和redo
		if(type){
			recordFuns.type = type;
		}else{
			recordFuns.type = null;
		}
		//如果是异常中断的情况下
		if(recordError){
			recordFuns.recordError = recordError;
		}else{
			recordFuns.recordError = null;
		}
		if(language){
			recordFuns.language = language;
		}
		if(smpPath){
			recordFuns.smpPath = smpPath;
		}
		//先重写回调函数
		recordFuns.recordAsynCallBack(enableClick);
		var ret = JSON.parse(wosa.asyncStopRecord());
		if(codeAndTip.code.common.hardwareAvailable == ret.hResult){
			$$.debug("asyncStopRecord成功:"+JSON.stringify(ret));
		}else if(codeAndTip.code.common.hardwareFailure == ret.hResult){
			//如果是签完名点击continue按钮调用stop方法,则失败时需要retry
			if("continue" == recordFuns.type){
				//popup("recordError_retry",recordFuns.language,recordFuns.retryStop,null,ret.errorCode);
				popup("recordError_retry",recordFuns.language,enableClick,null,ret.errorCode);
			}else{
				recordFuns.afterStop();
			}
			$$.debug("asyncStopRecord失败:"+JSON.stringify(ret));

		}
	}
	
	recordFuns.retryStop = function(){
		recordFuns.asyncStopRecord(recordFuns.nextHash,recordFuns.idNo,recordFuns.type,recordFuns.recordError,recordFuns.language);
	}
	
	recordFuns.afterStop = function(){
		$$.debug("进入afterStop方法");
		//调用close方法
		try{
			recordFuns.closeRecord();
		}catch(e){
			$$.debug('close失败'+e);
		}
		if("exit" == recordFuns.type){
			recordFuns.deteleAllInformation(recordFuns.idNo,recordFuns.smpPath);
		}else{
			//如果是非正常关闭录像的情况下或者redo的情况下需要删除视频
			if(recordFuns.recordError || "redo" == recordFuns.type){
				var ret = recordFuns.addVideoStatus(false);
				$$.debug("调用addVideoStatus方法,参数为false,type:"+recordFuns.type+",recordError:"+recordFuns.recordError);
			}
			//除了异常终止的其他情况要删除SMP的文件
			if(recordFuns.type){
				recordFuns.deleteSMPPDF(recordFuns.smpPath);
				$$.debug(recordFuns.type+"过程中调用deleteSMPPDF方法:"+ret)
			}
			//在非exit和redo的时候更新操作页面(system resume)
			if("exit" != recordFuns.type && "redo" != recordFuns.type){
				/*$$.updateCurrentStep({"idCardNo":recordFuns.idNo,"stepData":recordFuns.currentHash}).then(function(res){
					$$.debug(recordFuns.currentHash+"==>updateCurrentStep成功");
				},function(res){
					$$.debug(recordFuns.currentHash+"==>updateCurrentStepFail失败"+JSON.stringify(res));
				})*/
			}
			//往faceToface 和 home 是加载已经加载过的页面  因此不需要检查联网状态
			if("faceToface" == recordFuns.nextHash || "home" == recordFuns.nextHash){
				location.hash = recordFuns.nextHash;
			}else{
				$$.beforChageHash().then(function(){
					location.hash = recordFuns.nextHash;
				})
			}
			
		}
	}
	
	
	recordFuns.recordAsynCallBack = function(enableClick){
		//停止录屏并生成视频方法的回调(和打开摄像头,开始录像共用一个回调事件)
		window.RecordAsynCallBack = function(type,msg){
			$$.debug("重写window.RecordAsynCallBack方法:");
			var _msg = JSON.parse(msg);
			//异步情况下,收到stopComplete事件,不管成功与否,直接调用close方法,异常中断的调用addVideoStatus方法,且无乱上述两种方法是否执行成功,可以继续开户
			if(codeAndTip.code.readyTurnOnCamera.stopComplete == type){
				$$.debug("asyncStopRecord回调事件type为StopComplete");
				//当回调函数失败的时候（点击continue触发）需要重新关闭
				if(codeAndTip.code.common.hardwareFailure == _msg.hResult && "continue" == recordFuns.type){
					//popup("recordError_retry",recordFuns.language,recordFuns.retryStop,null,ret.errorCode);
					popup("recordError_retry",recordFuns.language,enableClick,null,_msg.errorCode);
				}else if(codeAndTip.code.common.hardwareAvailable == _msg.hResult && "continue" == recordFuns.type){
					//只有点击continue时，修改视频状态为true
					recordFuns.addVideoStatus(true)
				}else{
					recordFuns.afterStop();
				}
			}else if(codeAndTip.code.readyTurnOnCamera.errorEvent == type){
				$$.debug("comInterface中收到errorEvent事件，重写RecordAsynCallBack方法为空方法");
				window.RecordAsynCallBack = function(){};
				var _msg = JSON.parse(msg);
				$$.debug("asyncStopRecord回调事件,type为:errorEvent,msg为"+JSON.stringify(msg));
				if("#readyTurnOnCamera" == recordFuns.currentHash || "#turnOnCameraWaiting" == recordFuns.currentHash || "#turnOnCamera" == recordFuns.currentHash || "#understandTnc" == recordFuns.currentHash || "#openFileForSign" == recordFuns.currentHash){
					recordFuns.recordErrorHandle(recordFuns.idNo,recordFuns.language,_msg.errorCode,"recordError");
				}
			}else{
				$$.debug("asyncStopRecord回调事件,type为:"+type+",msg为"+JSON.stringify(msg));
			}
		}
	}
	
	
	//关闭摄像头,error为非必须参数,
	recordFuns.closeRecord = function(){
		$$.debug("调用closeRecord方法");
		//调用关闭摄像头方法
		var ret = JSON.parse(wosa.closeRecord());
		if(codeAndTip.code.common.hardwareAvailable== ret.hResult){//调用方法同步返回值是成功
			$$.debug("closeRecord成功");
		}else if(codeAndTip.code.common.hardwareFailure == ret.hResult){//调用方法同步返回值是失败
			$$.debug("close方法失败:"+JSON.stringify(res));
		}else{//调用方法同步返回值是其他
			$$.debug("close方法的其他情况"+JSON.stringify(res));
		}
	}
	/**
	 * 标记已生成的视频是否味有效视频的方法,在正常和异常停止视频时都需要调用
	 */
	recordFuns.addVideoStatus = function(isValid,idNumber){
		$$.debug("调用addVideoStatus方法");
		if(idNumber){
			recordFuns.idNo = idNumber;
		}
		var ret = JSON.parse(wosa.addVideoStatus(recordFuns.idNo,isValid));
		if(codeAndTip.code.common.hardwareAvailable== ret.hResult){//调用方法同步返回值是成功
			$$.debug("addVideoStatus成功");
			if("continue" == recordFuns.type){
				recordFuns.afterStop();
			}
		}else if(codeAndTip.code.common.hardwareFailure == ret.hResult){//调用方法同步返回值是失败
			$$.debug("addVideoStatus失败"+JSON.stringify(ret));
			if("continue" == recordFuns.type){
				//点击continue，视频生成失败，回到faceToface页面从新录制
				$$.debug("点击continue，addVideoStatus失败，");
				popup("recordError_retry",recordFuns.language,function(){recordFuns.closeRecord();location.hash='faceToface';},null,ret.errorCode);
			}
		}else{//调用方法同步返回值是其他
			$$.debug("addVideoStatus方法的其他情况"+JSON.stringify(ret));
		}
	}
	//录像异常中断,出现确认弹框后发生的事件
	recordFuns.recordErrorFun = function(){
		recordFuns.asyncStopRecord(recordFuns.nextHash,recordFuns.idNo,recordFuns.type,"recordError",recordFuns.language);
	}
	
	/**
	 * 录像过程中出现异常中止的处理方法
	 * 当录像过程中出现错误,先stop(异步),再close,再addVideoStatus
	 * 视频录制中挂掉则重新录像
	 */
	
	recordFuns.recordErrorHandle = function(idNo,language,code,recordError){
		recordFuns.currentHash = location.hash.split("#")[1];//去掉#
		$$.debug(recordFuns.currentHash+"进入recordErrorHandle方法");
		//重写window.RecordAsynCallBack方法，不一直接收ErrorEvent
		window.RecordAsynCallBack = function(){}
		//视频录制过程中,异常中断,则需重新录制视频
		recordFuns.nextHash = "faceToface";
		recordFuns.type = null;
		recordFuns.idNo = idNo;
		recordFuns.language = language;
		if(recordError){
			recordFuns.recordError = recordError;
		}else{
			recordFuns.recordError = null
		}
		//收到异常中止视频的回调(ErrorEvent),弹框(返回首页活继续开户)
		popup("recordError_retry",language,recordFuns.recordErrorFun,null,code);
	}
	recordFuns.deleteByIdCardNo = function(idCardNo){
		return $$.sendMessageWithoutException("service/proxy/vtcService/mVTMAOSession/deleteByIdCardNo", JSON.stringify({
			'idCardNo': idCardNo
		})).then(function(res){
			$$.debug('调用deleteByIdCardNo接口。'+JSON.stringify(res));
			if(res.status == codeAndTip.code.common.success){
				$$.debug('点击exit或者没有stepData，删除customersession成功');
			}else{
				$.debug('点击exit或者没有stepData，删除customersession失败.'+JSON.stringify(res));
			}
		},function(res){
			$$.debug('服务器异常');
		});
	}

	recordFuns.asyncDeleteTempFiles = function(){
		$$.debug("调用公共asyncDeleteTempFiles方法");
		var ret = JSON.parse(wosa.asyncDeleteTempFiles());
		if(codeAndTip.code.common.hardwareAvailable== ret.hResult){//调用方法同步返回值是成功
			$$.debug("调用公共asyncDeleteTempFiles成功");
		}else if(codeAndTip.code.common.hardwareFailure == ret.hResult){//调用方法同步返回值是失败
			$$.debug("调用公共asyncDeleteTempFiles失败"+JSON.stringify(ret));
		}
	}
	recordFuns.deleteSMPPDF = function(smpPath){
		$$.debug("调用deleteSMPPDF方法");
		var ret = JSON.parse(wosa.deleteSMPPDF(smpPath));
		if(codeAndTip.code.common.hardwareAvailable== ret.hResult){//调用方法同步返回值是成功
			$$.debug("调用deleteSMPPDF删除成功");
		}else if(codeAndTip.code.common.hardwareFailure == ret.hResult){//调用方法同步返回值是失败
			$$.debug("调用deleteSMPPDF删除失败"+JSON.stringify(ret));
		}
	}
	recordFuns.deteleAllInformation = function(idCardNo,smpPath){
		$$.debug('删除本地文件，删除smp的PDF，删除customersession，修改视频状态');
		location.hash = 'home';
		$$.debug('已跳转至home');
		recordFuns.currentHash = null;
		recordFuns.nextHash = null;
		recordFuns.idNo = idCardNo;
		recordFuns.type = null;
		recordFuns.recordError = null;
		recordFuns.language = null;
		recordFuns.asyncDeleteTempFiles();
		if(idCardNo){
			recordFuns.deleteByIdCardNo(idCardNo);
			recordFuns.addVideoStatus(false,idCardNo);
		}
		if(smpPath){
			recordFuns.deleteSMPPDF(smpPath);
		}	
	}
	
	return recordFuns;
});
