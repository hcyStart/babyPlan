define(['../BaseController', 'app/util','app/wosa', './idNo.model','../../systemResumeMapping','../../codeAndTip','app/dialog/dialog','../../popup','app/comInterface'], function (Base, $$,wosa, model,systemResumeMapping,codeAndTip,dialog,popup,comInterface) {
	var controller = new Base('idNo controller');
	controller.queryCusstomerSession =  function(){
		$$.debug("idno 查询customerSession发送请求到后端。");
		return $$.sendMessage("service/proxy/vtcService/mVTMAOSession/findByIdCardNo", JSON.stringify({
                "idCardNo":  model.customer.idCardNo
        }));
	}
	
	//校验用户是否通过prefill
	controller.PrefillInfoForMvtmPO = function() {
		var idCardInfo = model.customer.customerSession.idCardInfo;
		return $$.sendMessageWithoutException("service/proxy/vtcService/mVTMPrefill/prefillInfoForMvtm", JSON.stringify({
			'idNum': model.customer.idCardNo,
			'idType':idCardInfo.IDType,
			'status':0
		}));
	};
	
	//删除idCardNo数据
	function deleteAll(){
		var idCardInfo = model.customer.customerSession.idCardInfo;
		return $$.sendMessage("service/proxy/vtcService/mVTMAOSession/deleteByIdCardNo", JSON.stringify({
			'idCardNo': model.customer.idCardNo
		})).then(function(res){
			if(res.status == codeAndTip.code.common.success){
				$$.debug("customerSession删除成功");
				window.captureNext = "accountType";
				controller.saveCustomerSession();
				wosa.addVideoStatus(model.customer.idCardNo,false);
			}else if(codeAndTip.code.customerSession.notFound == res.status){
				$$.debug("idno customerSession，所查询信息不存在");
				var errType='serviceError';
				var language = controller.getLocale();
				popup(errType,language);
			}else{
				$$.debug("idno customerSession删除请求成功，但是数据删除失败");
				var errType='serviceError';
				var language = controller.getLocale();
				popup(errType,language);
			}
		});
	}
	
	
	//用户没有customerSession或者存在customerSession没有stepData时当做新用户处理，根据prefill结果给出提示。
	function newUser(dom){
		controller.PrefillInfoForMvtmPO().then(function (res) {
			if (res.status == codeAndTip.code.common.success && res.data.length > 0){
				var data = res.data[0];
				if(data.readTc == codeAndTip.code.prefillState.Read){
					model.customer.customerSession.prefillState = 1;
				}else{
					model.customer.customerSession.prefillState = 0;
				}
				//通过prill,没开户
				controller.saveCustomerSession();
				dom.removeClass("disabled").attr("disabled",false);
				//输入账号通过prefill
				//CM0001:用户未预注册或者预注册已过期
			}else if(res.status == codeAndTip.code.idNo.requireStatusEr){
				model.customer.customerSession.prefillState = 0;
				var errType='prefillError'
				var language = controller.getLocale();
				popup(errType,language,null,controller.saveCustomerSession,null);
				dom.removeClass("disabled").attr("disabled",false);
			}
		},function(){
			$$.debug("PrefillInfoForMvtmPO方法调用服务器异常,当做未查询到pre处理");
			model.customer.customerSession.prefillState = 0;
			var errType='prefillError'
			var language = controller.getLocale();
			popup(errType,language,null,controller.saveCustomerSession,null);
			dom.removeClass("disabled").attr("disabled",false);
		})
	}
	
	
	
	controller.checkCustomerSession = function (changeBtnSta,dom){
		
		try{
			
			controller.queryCusstomerSession().then(function(res){
				$$.debug("查询用户完成" + res.status);
				if (codeAndTip.code.idNo.requireNo == res.status && res.message) {
					$$.debug("idCardNo is required,it must not be null");
				}
				if(codeAndTip.code.customerSession.notFound == res.status){
					newUser(dom);
				}else{
					if( res.data && 0 == (res.data[0].status*1)){
						$$.debug("该用户已经开过户,但开户失败");
						if(0 == res.data[0].selectPhoneBanking*1){//不需要phonebanking
							$$.debug("idNo:该用户已经开过户,但开户失败。之前开户已选择不需要phoneBanking");
							model.customer.customerSession.selectPhoneBanking = 0;
						}else if(1 == res.data[0].selectPhoneBanking*1){//需要phoneBanking
							$$.debug("idNo:该用户已经开过户,但开户失败。之前开户已选择需要phoneBanking");
							model.customer.customerSession.selectPhoneBanking = 1;
						}
						if(null != res.data[0].issueNumber && null != res.data[0].cardNumber){//不需要phonebanking
							$$.debug("idNo:该用户已经开过户,但开户失败。之前开户已刷银行卡，且卡号保存成功");
							model.customer.cardNumber = res.data[0].cardNumber;
							model.customer.issueNumber = res.data[0].issueNumber;
						}
						if(res.data[0].cardType){
							model.customer.accountType = res.data[0].cardType;
						}
						//防止身份证开过一次户再开一次，变更语言类型或者staffid
						if(res.data && res.data[0].stepData){
							var _stepData = false;
							var _stepData = res.data[0].stepData;
							$$.debug("该用户已经开过户,但开户失败.之前的操作步骤是："+_stepData);
							//页面操作记录为文件收集(非提交页)和提交后(提交后前端认为是一个全新的顾客)
							if(systemResumeMapping.stepData.capture == _stepData){
								window.captureNext = "accountType"
							}else if(systemResumeMapping.stepData.captureSubmit == _stepData){
								window.captureNext = "home"
							}
							
							controller.PrefillInfoForMvtmPO().then(function (res) {
								if (res.status == codeAndTip.code.common.success && res.data.length > 0){
									//输入账号通过prefill
									var data = res.data[0];
									if(data.readTc == codeAndTip.code.prefillState.Read){
										model.customer.customerSession.prefillState = 1;
									}else{
										model.customer.customerSession.prefillState = 0;
									}
									var errType='queryCusPreSucError';
									var language = controller.getLocale();
									popup(errType,language,function(){deleteAll();dom.removeClass("disabled").attr("disabled",false);},function(){controller.updateCustomerSession(_stepData);dom.removeClass("disabled").attr("disabled",false);},null)
								}else if(res.status == codeAndTip.code.idNo.requireStatusEr){
									//输入账号未通过prefill
									model.customer.customerSession.prefillState = 0;
									var errType='queryCusPreErrError';
									var language = controller.getLocale();
									popup(errType,language,function(){deleteAll();dom.removeClass("disabled").attr("disabled",false);},function(){controller.updateCustomerSession(_stepData);dom.removeClass("disabled").attr("disabled",false);},null)
									
								}
							},function(){
								model.customer.customerSession.prefillState = 0;
								var errType='queryCusPreErrError'
								var language = controller.getLocale();
								popup(errType,language,function(){deleteAll();dom.removeClass("disabled").attr("disabled",false);},function(){controller.updateCustomerSession(_stepData);dom.removeClass("disabled").attr("disabled",false);},null)
								$$.debug("服务器异常。");
							})
						}else{
							//有开户记录没有stepData，先清除记录然后当成新用户来处理。
							comInterface.deleteByIdCardNo(model.customer.idCardNo);
							newUser();
						}
					}else if( res.data && 1 == (res.data[0].status*1)){
						$$.debug("该用户已经开户完成。");
						var errType='openedUserErr';
						var language = controller.getLocale();
						popup(errType,language);
					}	
				}						      
			},function(err){
				changeBtnSta();
				//此处是否不应该影响业务继续???????
//				location.hash = "capture";
				$$.debug("查询开户情况失败。");
				$$.debug("idno customerSession 查询失败。"+ JSON.stringify(err));     
			});
		}catch(e){
			$$.debug("idno customerSession 身份证信息保存出现异常"+ e); 
		}
	}
	controller.saveCustomerSession = function(){
		var idCardInfo = model.customer.customerSession.idCardInfo;
		$$.debug("保存customerSession发送请求到后端");
		return $$.sendMessage("service/proxy/vtcService/mVTMAOSession/save", JSON.stringify({
                "staffId":  $$.staffId,
                "idCardNo": model.customer.idCardNo,
                "language": controller.getLocale().toUpperCase(),
                "idCardType": idCardInfo.IDType,
                "mvtmId": $$.machineInfo.HostName,
                //以下属性是system resume功能需要的
                "stepData": model.customer.customerSession.stepData
        })).then(function(res){
        	$$.debug("idno customerSession初始数据保存成功");
        	if(res && res.status == codeAndTip.code.common.success){
        		$$.debug("idno customerSession 身份证信息保存请求成功");
        		$$.beforChageHash().then(function(){
        			location.hash = "capture";
				})
        	}else if(codeAndTip.code.customerSession.alredyExit == res.status){
        		$$.debug("idno customerSession，信息已存在");
				var errType='serviceError';
				var language = controller.getLocale();
				popup(errType,language);
        	}else{
        		$$.debug("idno customerSession 身份证信息保存请求成功，但是出现其他错误");
				var errType='serviceError';
				var language = controller.getLocale();
				popup(errType,language);
        	}
        },function(res){
        	$$.debug("idno customerSession初始数据保存失败"+ JSON.stringify(res));
        });
	}
	
	controller.updateCustomerSession = function(_stepData){
		var idCardInfo = model.customer.customerSession.idCardInfo;
		$$.debug("idno 更新customerSession到发送请求到后端。");
		//update更新必须是全字段更新
		return $$.sendMessage("service/proxy/vtcService/mVTMAOSession/updateMultipleParamsByIdCardNo", JSON.stringify({            
            "staffId": $$.staffId,
            "idCardNo": model.customer.idCardNo,
            "language": controller.getLocale().toUpperCase(),
            "mvtmId": $$.machineInfo.HostName,
            "idCardType": idCardInfo.IDType
        })).then(function(res){
        	$$.debug("idno customerSession更新数据成功"+ res.status);
            if(res && res.status == codeAndTip.code.common.success){
        		$$.debug("idno customerSession 身份证信息更新请求成功");
            	if(_stepData){
            		$$.beforChageHash().then(function(){
            			location.hash = systemResumeMapping[_stepData];
    				})
            	}
            }else if(codeAndTip.code.customerSession.notFound == res.status){
				$$.debug("idno customerSession 身份证信息不存在");
				var errType='serviceError';
				var language = controller.getLocale();
				popup(errType,language);
            }
            else{
				$$.debug("idno customerSession 身份证信息更新请求成功，但是更新失败");
				var errType='serviceError';
				var language = controller.getLocale();
				popup(errType,language);
            }
        },function(res){
        	$$.debug("idno customerSession更新数据失败"+ JSON.stringify(res));
        });
	}


	

	return controller;
});
