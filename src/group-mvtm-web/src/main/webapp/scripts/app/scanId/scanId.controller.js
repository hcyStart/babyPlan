define(['../BaseController', 'app/util', './scanId.model','../../codeAndTip','app/wosa','../../popup','../../systemResumeMapping'], function (Base, $$, model,codeAndTip,wosa,popup,systemResumeMapping) {
	var controller = new Base('scanId controller');
	    controller.IDCInit = function(callbacks){    	    
	    	 window.IdCardReaderAsynCallBack = function (type, handWareResult) {//身份证和护照回调
			    $$.debug('AsynIDCardReaderCallBack 返回事件类行：'+type+"获得结果:",handWareResult);
                var resultAll = JSON.parse(handWareResult);
				var hResult = resultAll.hResult;
				var hData = JSON.parse(resultAll.data);
				var hCode = resultAll.Code;
				var hBuffer = hData.Buffer;
                 switch(type){
                      //插入身份证事件
                     case codeAndTip.code.scanid.MediaInsertedEvent:
                    	 if(codeAndTip.code.common.hardwareAvailable == hResult && codeAndTip.code.scanid.MediaInserted == hCode){ 
                    		 $$.debug('身份证已经插入模块');
                    	  	 callbacks.insert.call(null);
                    	 }
                    	  break;
                     case codeAndTip.code.scanid.ReadCardComplete:
                        //	 alert('hResult:'+hResult);
                    	// alert('hResult:'+codeAndTip.code.scanid.TimeOut);
                    	  if(codeAndTip.code.common.hardwareAvailable == hResult  && codeAndTip.code.scanid.ReadRawData == hCode){
                          	$$.debug('身份证信息获取成功');
							if(model){
								 $$.debug("将身份证用户信息保存，用于smartForm个人信息预填");
								 model.customer.customerSession.idCardInfo = hBuffer;
								 //专门用于身份证呢号存放，方便后面存取
								 model.customer.idCardNo = hBuffer.chip.IDCardNO;
								 model.customer.customerSession.idCardInfo.IDType = codeAndTip.code.scanid.idCardType;
						    }
							//先判断身份证是否有效或者年龄是否满足18岁
							if(!calcAge()){
								//等ui设计直接弹出dialog返回首页
								$$.debug("用户未满18周岁，不能开户。"); 
								var invalidUserType = "age";
							 	callbacks.invalidUser.call(null,invalidUserType);
							 	return false;
							}
							 if(!checkIdCardExpiryDate()){
								$$.debug("身份证已过期，不能开户。");
								var invalidUserType = "expire";
								callbacks.invalidUser.call(null,invalidUserType);
								return false;
							}
							//判断身份证是否扫描成功并且有路径
							if (hBuffer && hBuffer.frontstatus == "ok" && hBuffer.backstatus == "ok") {
								 $$.isGotIDCardInfo = true;	
								 $$.debug("获取的身份证状态"+ $$.isGotIDCardInfo);
								 $$.scanIDStatus = "";
								callbacks.success.call(null, {
									detail: hBuffer.PhotoFileName,
									front:  hBuffer.front,
									back: hBuffer.back
								});
							} else {
								callbacks.invalidCard.call(null);
							}
                    	 }else if(codeAndTip.code.scanid.TimeOut == hResult){
                    		 $$.debug("获取的身份证状态扫描超时"+handWareResult);
                    		 callbacks.TimeOut.call(null);
                    	 }else if(codeAndTip.code.scanid.InvalidMedia == hResult){
                    		 $$.debug("获取的身份证状态无效身份证"+handWareResult);
                    		 callbacks.invalidCard.call(null);
                    	 }else if(codeAndTip.code.scanid.IDCHardwareError == hResult){
                    		 $$.debug("获取的身份证损坏或者未连接："+handWareResult);
                    		 callbacks.handWareError.call(null,resultAll);
                    	 }                    	 
                    	 break;
                     case codeAndTip.code.scanid.MediaRemovedEvent:
                    	 $$.debug('身份证已经被拔出');
                    	 callbacks.remove.call(null);                   	 
                     break;
	                default:                	 
				    break;
                 }
		    };
		    controller.cannelScanId();
			try{
				var  scanIdTimeOut = 60000;//设置扫描身份证超时时间
			    var cardResult = wosa.readIDCardDataAsync(scanIdTimeOut);
			    callbacks.readCardSuc.call(null,cardResult);
			}catch(e){
				$$.debug("调用身份证信息模块保存出现异常"+ e); 
			}
		}
	    function calcAge(){
	    	var idCardInfo = model.customer.customerSession.idCardInfo;
	        var currentDate = new Date().getTime();
	        var Birthday = idCardInfo.chip.Born;
			var Birthdaystr = Birthday.slice(0,4)+'-'+Birthday.slice(4,6)+"-"+Birthday.slice(6);
	        Birthday = new Date(Birthdaystr).getTime();
	        if((Birthday<currentDate)&&((currentDate-Birthday)<=(6570*24*60*60*1000))){ 
	        	 $$.debug("用户未满18周岁，不能开户。"); 
	              return false; 
	          }else{ 
	              $$.debug("用户已满18周岁，能开户。");
	        	  return true;  
	          } 

	    }
	    function checkIdCardExpiryDate(){
	    	var idCardInfo = model.customer.customerSession.idCardInfo;
	    	var currentDate = new Date().getTime();
	        var ValidExpiryDate = idCardInfo.chip.UserLifeEnd;
			var ValidExpiryDatestr = ValidExpiryDate.slice(0,4)+'-'+ValidExpiryDate.slice(4,6)+"-"+ValidExpiryDate.slice(6);	    	 
		    ValidExpiryDate = new Date(ValidExpiryDatestr).getTime();
		     if(currentDate&&ValidExpiryDate&&ValidExpiryDate<currentDate){
	        	$$.debug("身份证已过期，不能开户。");
	        	return false;
	        }else{
	        	$$.debug("身份证未过期，能开户。")
	        	return true;
	        }		     
	    }
		controller.checkUser = function(){
			return $$.sendMessage("service/proxy/vtcService/customerCheck/enquireCustomer", JSON.stringify({
	                "cardNo":  model.customer.idCardNo
	        }));
		}
		controller.cannelScanId = function(){
			try{
			    var  scancardResult = wosa.IdcAsyncCancel();
			    $$.debug("scanid跳转页面,调用停止身份证扫描结果： "+ scancardResult);
			}catch(e){
				$$.debug("scanid跳转页面,调用停止扫描身份证出现异常"+ e); 
			}
		}
	return controller;
});
