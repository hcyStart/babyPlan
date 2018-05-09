define(['../BaseController', 'app/util', './scanId.model'], function (Base, $$, model) {
	var controller = new Base('scanId controller');
	    controller.IDCInit = function(callbacks){   
	    	//连接背甲身份证信息
	    	 window.AsyncGetIDCardInfoCallBack = function (handWareResult) {//身份证和护照回调
			    $$.debug('AsyncGetIDCardInfoCallBack '+JSON.stringify(handWareResult));
		                var resultAll = JSON.parse(handWareResult),
						    hResult = resultAll.hResult,
						    hBuffer = resultAll.IDCardInfo;
                            if("WFS_SUCCESS"==hResult && '#scanId' == location.hash){
                            	$$.debug('身份证信息获取成功');
								if(model){
									 $$.debug("将身份证用户信息保存，用于smartForm个人信息预填"+JSON.stringify(hBuffer));
									 model.customer.customerSession.idCardInfo = hBuffer;
									 //专门用于身份证呢号存放，方便后面存取
									 model.customer.idCardNo = hBuffer.IDNumber;
							    }
								if(calcAge()){
									$$.debug("用户未满18周岁，不能开户。");
									return false;
								}else if(checkIdCardExpiryDate()){
									$$.debug("身份证已过期，不能开户。");
									return false;
								}
								//保存完身份证信息后，将身份证信息保存到
								controller.checkCustomerSession();								
								if (hBuffer && hBuffer.PhotoPathFornt  && hBuffer.PhotoPathBack) {
									 $$.debug("扫描身份证信息状态"+ $$.scanIDStatus);
									 $$.scanIDStatus = "";
									callbacks.success.call(null, {
										front:  hBuffer.PhotoPathFornt,
										back: hBuffer.PhotoPathBack
									});
								} else {
									callbacks.invalid.call(null);
								}
                     } else {
                    	 callbacks.error.call(null,resultAll);
                     }
		    };
		    $$.debug('开始启用身份证模块');
		    var  cardResult =  controller.wosa.asyncGetIDCardInfo();		   
		    $$.debug('启用身份证模块结果'+cardResult);
		    callbacks.readCardSuc.call(null,cardResult);
		}
	    controller.checkCustomerSession = function(){
			try{
				controller.queryCusstomerSession().then(function(res){
					$$.debug("查询用户完成" + JSON.stringify(res));
					if ("Il0001" == res.status && res.message) {
						$$.debug("idCardNo is required,it must not be null");
					}
					if('000' == res.status && ! res.data[0]){
						controller.saveCustomerSession();
					}else{
						if( res.data && 0 == (res.data[0].status*1)){
							$$.debug("该用户已经开过户,但开户失败");   
							//防止身份证开过一次户再开一次，变更语言类型或者staffid
							controller.updateCustomerSession();
						}else if( res.data && 1 == (res.data[0].status*1)){
							$$.debug("该用户已经开户完成。");
						}
					}							      
				},function(err){
					$$.debug("customerSession 查询失败。"+ JSON.stringify(err));     
				});
			}catch(e){
				$$.debug("customerSession 身份证信息保存出现异常"+ e); 
			}
	    }
	    function calcAge(){
	    	var idCardInfo = model.customer.customerSession.idCardInfo;
	        var currentDate = new Date().getTime();
	        var Birthday = idcardInfo.Birthday;
			var Birthdaystr = Birthday.slice(0,4)+'-'+Birthday.slice(4,6)+"-"+Birthday.slice(6);
	        Birthday = new Date(Birthdaystr).getTime();
	        if((Birthday<currentDate)&&((currentDate-Birthday)<=(6570*24*60*60*1000))){ 
	        	 $$.debug("用户未满18周岁，不能开户。"); 
                  return true; 

	          }else{ 
                  $$.debug("用户已满18周岁，能开户。") 
	        	  return false;  
              } 

	    }
	    function checkIdCardExpiryDate(){
	    	var idCardInfo = model.customer.customerSession.idCardInfo;
	    	var currentDate = new Date().getTime();
	        var ValidExpiryDate = idcardInfo.ValidExpiryDate;
			var ValidExpiryDatestr = ValidExpiryDate.slice(0,4)+'-'+ValidExpiryDate.slice(4,6)+"-"+ValidExpiryDate.slice(6);	    	 
		    ValidExpiryDate = new Date(ValidExpiryDatestr).getTime();
		     if(currentDate&&ValidExpiryDate&&ValidExpiryDate<currentDate){
		        	$$.debug("身份证已过期，不能开户。");
		        	return true;
		        }else{
		        	$$.debug("身份证未过期，能开户。")
		        	return false;
		        }		     
	    }
		controller.checkUser = function(){
			return $$.sendMessage("service/proxy/vtcService/customerCheck/enquireCustomer", JSON.stringify({
	                "cardNo":  model.customer.idCardNo
	        }));
		}
		controller.queryCusstomerSession =  function(){
			$$.debug("查询customerSession发送请求到后端。");
			return $$.sendMessage("service/proxy/vtcService/mVTMAOSession/findByIdCardNo", JSON.stringify({
	                "idCardNo":  model.customer.idCardNo||'1234'
	        }));
		}
		controller.saveCustomerSession = function(){
			var idCardInfo = model.customer.customerSession.idCardInfo;
			$$.debug("保存customerSession发送请求到后端。");
			return $$.sendMessage("service/proxy/vtcService/mVTMAOSession/save", JSON.stringify({
	                "staffId": $$.staffId,
	                "name": idCardInfo.Name,
	                "address": idCardInfo.Address,
	                "sex": idCardInfo.Gender == "男" ? 0 : 1,
	                "nation": idCardInfo.Nation,
	                "born": idCardInfo.Birthday,
	                "idCardNo": idCardInfo.IDNumber,
	                "language": controller.getLocale(),
	                "grantDept": idCardInfo.IssueDepartment,
	                "userLifeBegin": idCardInfo.ValidFromDate,
	                "userLifeEnd": idCardInfo.ValidExpiryDate,
	                "idCardType": "I"
	        })).then(function(res){
				$$.debug("customerSession 身份证信息保存成功。" + JSON.stringify(res));
			},function(err){
				$$.debug("customerSession 身份证信息保存失败。"+ JSON.stringify(err));                       			
     		});
		}
		controller.updateCustomerSession = function(){
			var idCardInfo = model.customer.customerSession.idCardInfo;
			$$.debug("customerSession 更新发送请求到后端。");
			return $$.sendMessage("service/proxy/vtcService/mVTMAOSession/updateMultipleParamsByIdCardNo", JSON.stringify({
	                "staffId": $$.staffId,
	                "idCardNo": idCardInfo.IDNumber,
	                "language":  controller.getLocale(),
	                "idCardType": "I"
	        })).then(function(res){
				$$.debug("customerSession 身份证信息更新成功。" + JSON.stringify(res));
			},function(err){
				$$.debug("customerSession 身份证信息更新失败。"+ JSON.stringify(err));                       			
     		});	
		}
	return controller;
});
