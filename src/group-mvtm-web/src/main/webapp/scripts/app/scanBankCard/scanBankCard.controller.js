define(['../BaseController', 'app/util', './scanBankCard.model','../../codeAndTip','app/wosa','../../popup','../../systemResumeMapping'], function (Base, $$, model,codeAndTip,wosa,popup,systemResumeMapping) {
	var controller = new Base('scanBankCard controller');
	 controller.trackReaderInit = function(callbacks){ 
		 window.TrackReaderAsyncCallBack = function (type, handWareResult) {//扫描银行卡回调
			$$.debug('TrackReaderAsyncCallBack 银行卡扫描 返回事件类行：'+type+'获得结果:',handWareResult);
			var resultAll = JSON.parse(handWareResult);
			var hResult = resultAll.hResult;
			var hData = JSON.parse(resultAll.data);
			var hCode = resultAll.Code;
			var hBuffer = hData.Buffer;
			switch(type){
	        //银行卡插入事件
	        case codeAndTip.code.scanid.MediaInsertedEvent:
		       	 if(codeAndTip.code.common.hardwareAvailable == hResult && codeAndTip.code.scanid.MediaInserted == hCode){ 
		       		 $$.debug('银行卡已经插入模块');
		       	  	 callbacks.insert.call(null);
		       	 }
	       	  break;
	         case codeAndTip.code.sacnBankCard.ReadRawDataComplete:
	         	  if(codeAndTip.code.common.hardwareAvailable == hResult  && codeAndTip.code.scanid.ReadRawData == hCode){
	               	$$.debug('银行卡卡号信息获取成功');
						//判断银行卡是否扫描成功并且有路径
					  if (hBuffer && hBuffer.track2 && "ok" == hBuffer.track2status) {
							 $$.isGotBankCardInfo = true;	
							 var cardDetailInfo = hBuffer.track2.split('=');
							 $$.debug("获取的银行卡卡号信息状态"+ $$.isGotBankCardInfo);
							 model.customer.cardNumber  = cardDetailInfo[0];
							 var issueNumberInfo = cardDetailInfo[1];
							 var issueNumber = null;
							if (issueNumberInfo && issueNumberInfo.length > 8) {
								issueNumber = issueNumberInfo.substring(7, 8);
							}
							 model.customer.issueNumber = issueNumber;
							 $$.debug("已经获取到获银行卡卡号信息");
							 callbacks.success.call(null);
						} else {
							 $$.debug("获取的银行卡卡号信息扫描不全"+JSON.stringify(hBuffer));
							callbacks.invalidCard.call(null);
						}
	         	 }else if(codeAndTip.code.scanid.TimeOut == hResult){
	         		 $$.debug("获取的银行卡卡号信息扫描超时"+hResult);
	         		 callbacks.TimeOut.call(null);
	         	 }else if(codeAndTip.code.scanid.InvalidMedia == hResult){
	         		 $$.debug("获取的银行卡卡号信息状态无效银行卡"+hResult);
	         		 callbacks.invalidCard.call(null);
	         	 }else if(codeAndTip.code.sacnBankCard.scanBankHandwareError == hResult){
	        		 $$.debug("获取的银行卡模块损坏或者设备未连接："+hResult);
	        		 callbacks.handWareError.call(null,resultAll);
	        	 }
	         	 break;
		         case codeAndTip.code.scanid.MediaRemovedEvent:
		        	 $$.debug('银行卡已经被拔出');
		        	 callbacks.remove.call(null);                   	 
		         break;
			}
		 };
		 //始终保持当前事件只有一个执行
		controller.cannelScanBankCard(); 
		try{
			var  scanBankCardTimeOut = 60000,//设置扫描银行卡超时时间
			     track = "track1|track2|track3";//银行卡刷卡的磁道 
		    var cardResult = wosa.readAsyncReadRawDataAsync(track,scanBankCardTimeOut);
		    $$.debug("获取的银行卡卡号信息状态成功"+cardResult);
		    callbacks.readCardSuc.call(null,cardResult);
		}catch(e){
			$$.debug("调用银行卡卡号信息模块保存出现异常"+ e); 
		}
	 }
	//更新银行卡卡号
		controller.updateCardNumber = function(){
			//system resume 时会清楚这两个model的值，所以后面要用到这两个值时，一定要从数据库内取
			return $$.sendMessage("service/proxy/vtcService/mVTMAOSession/updateCardNumberByIdCardNoAndIdCardType", JSON.stringify({
                "idCardNo": model.customer.idCardNo,
                "cardNumber": model.customer.cardNumber,
                "issueNumber": model.customer.issueNumber
             }));
		}
	//取消银行卡扫描
	  controller.cannelScanBankCard = function(){
		try{
		    var  cancelscancardResult = wosa.trackReaderAsyncCancel();
		    $$.debug("sacnBankCard页面,调用停止扫描银行卡节果： "+ cancelscancardResult);
		}catch(e){
			$$.debug("sacnBankCard页面,调用停止扫描银行卡出现异常"+ e); 
		}
	  }
	return controller;
});
