define(['../BaseController','app/util','app/wosa','./takeIdCard.model','../../popup','../../systemResumeMapping','app/comInterface'], function (Base, $$, wosa, model, popup, systemResumeMapping,comInterface) {
    var controller = new Base('takeIdCard controller');
    var hasPreFlag = false;//默认是没有pre的
    var hasStepDataFlag = false;//默认没有stepData
    var hasCustomerSession = false;//默认没有customerSession
    var nextButton = null;//next按钮
	controller.checkCustomerSession = function(nextBtn){
		nextButton = nextBtn;
		 //查询customerSession,判断是否有过开户操作记录
		controller.queryCusstomerSession().then(function(res){
			hasStepDataFlag = false;//变量重置,默认stepData为空
		 	hasPreFlag = false;//变量重置,默认pre不通过
		 	hasCustomerSession = false;//变量重置,默认没有customerSession
			var stepData = null;//默认systemResume的步骤为null
			$$.debug("takeIdCard页面调用queryCusstomerSession查询用户完成");
			//没有身份证号的情况(model.customer.idCardNo为空),该情况已经在scanId处理
			if (codeAndTip.code.scanid.requireCard == res.status && res.message) {
				$$.debug("idCardNo is required,it must not be null");
			}
			//没有任何开户记录(目前java端只返回两种情况,一种是没有customerSession,一种是有customerSession)
			if(codeAndTip.code.customerSession.notFound == res.status){
				$$.debug("没有customerSession");
				$$.debug("调用cosSessionPreHandle前，hasStepDataFlag："+hasStepDataFlag+",stepData:"+stepData+",hasCustomerSession:"+hasCustomerSession);
				controller.cosSessionPreHandle(hasStepDataFlag,stepData,hasCustomerSession);
			}else{
				if(res.data && 1 == (res.data[0].status*1)){//开户成功
					$$.debug("该用户已开过户");
					var errType='openedUserErr';
					var language = controller.getLocale();
					popup(errType,language);
				}else{
					//有开户记录
					//有开户记录的情况下,有stepData情况
					$$.debug("customerSession存在");
					hasCustomerSession = true;
					if(0 == res.data[0].selectPhoneBanking*1){//不需要phonebanking
						$$.debug("takeIdCard:该用户已经开过户,但开户失败。之前开户已选择不需要phoneBanking");
						model.customer.customerSession.selectPhoneBanking = 0;
					}else if(1 == res.data[0].selectPhoneBanking*1){//需要phoneBanking
						$$.debug("takeIdCard:该用户已经开过户,但开户失败。之前开户已选择需要phoneBanking");
						model.customer.customerSession.selectPhoneBanking = 1;
					}
					if(res.data[0].issueNumber && res.data[0].cardNumber){//不需要phonebanking
						$$.debug("takeIdCard:该用户已经开过户,但开户失败。之前开户已刷银行卡，且卡号保存成功");
						model.customer.cardNumber = res.data[0].cardNumber;
						model.customer.issueNumber = res.data[0].issueNumber;
						
					}
					if(res.data[0].cardType){
						model.customer.accountType = res.data[0].cardType;
					}
					if(res.data && res.data[0].stepData){
						stepData = res.data[0].stepData;
						hasStepDataFlag = true;
						if(systemResumeMapping.stepData.capture == stepData){
							window.captureNext = "accountType"
						}else if(systemResumeMapping.stepData.captureSubmit == stepData){
							window.captureNext = "home"
						}
						$$.debug("拿到stepData："+stepData);
					}else{
						hasStepDataFlag = false;
						$$.debug("没有拿到stepData");
					}
					$$.debug("调用cosSessionPreHandle前，hasStepDataFlag："+hasStepDataFlag+",stepData:"+stepData+",hasCustomerSession:"+hasCustomerSession);
					controller.cosSessionPreHandle(hasStepDataFlag,stepData,hasCustomerSession);
				}
			}	
		 },function(err){
			 //请求失败的情况下让next button可以点
			 nextButton.removeClass("disabled").attr("disabled",false);
			 $$.debug("customerSession 查询失败。"+ JSON.stringify(err));     
		 })
	 }

	//没有customerSession的情况下的pre的弹框和页面跳转处理
	controller.noSessionPreHandle = function(hasPreFlag){
		//没有customerSession,有pre,无提示,页面直接跳转
		if(hasPreFlag){
			controller.saveCustomerSession("showIdCard");
		}else{//没有customerSession,没有pre,给提示后跳转页面(popup可以返回选择证件类型页面和继续开户)
			//idCardPerfillError:系统无法找到该用户的预注册信息，是否继续开户？
			var language = controller.getLocale();
			//idCardPerfillError:统无法找到该用户的预注册信息，是否继续开户？
			popup("idCardPerfillError",language,function(){location.hash = "identificationType"},function(){controller.saveCustomerSession("showIdCard")},null);
		}
	}
	
	//没有customerSession的情况下的pre的弹框和页面跳转处理
	controller.hasSessionPreHandle = function(hasStepDataFlag,hasPre,stepData){
		var language = controller.getLocale();
		//有stepData,有pre
		if(hasStepDataFlag && hasPre){
			//queryCusPreSucError:是否继续上一次未完成的申请？
			popup("queryCusPreSucError",language,controller.deleteAll,function(){controller.updateCustomerSession(stepData)},null);
		}else if(hasStepDataFlag && !hasPre){//有stepData没有pre
			//queryCusPreErrError:该用户没有提交预注册信息，是否继续上一次未完成的申请？
			popup("queryCusPreErrError",language,controller.deleteAll,function(){controller.updateCustomerSession(stepData)},null);
		}else if(!hasStepDataFlag && hasPre){//没有stepData,当做没有customerSession的新用户
			controller.deleteAll("showIdCard");
		}else if(!hasStepDataFlag && !hasPre){//没有stepData没有pre
			//idCardPerfillError:系统无法找到该用户的预注册信息，是否继续开户？
			popup("idCardPerfillError",language,function(){location.hash = "identificationType"},controller.deleteAll,null);
		}else{
			$$.debug("hasSessionPreHandle参数出现异常");
		}
	}
	
	//没有customerSession的情况下的pre处理
	controller.cosSessionPreHandle = function(hasStepDataFlag,stepData,hasCustomerSession){
		$$.debug("调用cosSessionPreHandle，hasStepDataFlag："+hasStepDataFlag+",stepData:"+stepData+',hasCustomerSession:'+hasCustomerSession);
		controller.PrefillInfoForMvtmPO().then(function (res) {
			//客户做过pre并且查询成功
			if (res.status == codeAndTip.code.common.success && res.data.length > 0){
				$$.debug("查询到pre--takeIdCard页面");
				hasPreFlag = true;
				var data = res.data[0];
				//客户已经阅读过T&C
				if(data.readTc == codeAndTip.code.prefillState.Read){
					model.customer.customerSession.prefillState = 1;
				}else{//客户没有阅读过T&C
					model.customer.customerSession.prefillState = 0;
				}
			}else if(res.status == codeAndTip.code.idNo.requireStatusEr){//客户没有做过pre,默认没有阅读过PDF
				$$.debug("没有查询到pre--takeIdCard页面");
				hasPreFlag = false
				model.customer.customerSession.prefillState = 0;
			}else{
				$$.debug("PrefillInfoForMvtmPO出现的其他情况--takeIdCard页面,当做未查询到pre处理")
				hasPreFlag = false;
				model.customer.customerSession.prefillState = 0;
			}
			$$.debug("hasPreFlag:"+hasPreFlag+"，prefillState:"+model.customer.customerSession.prefillState);
			if(hasCustomerSession){
				$$.debug("调用hasSessionPreHandle，hasStepDataFlag："+hasStepDataFlag+",hasPreFlag:"+hasPreFlag+"stepData:"+stepData);
				controller.hasSessionPreHandle(hasStepDataFlag,hasPreFlag,stepData);
			}else{
				$$.debug("调用noSessionPreHandle，hasPreFlag："+hasPreFlag)
				controller.noSessionPreHandle(hasPreFlag);
			}
			
		},function(){
			$$.debug("PrefillInfoForMvtmPO方法调用服务器异常,当做未查询到pre处理");
			hasPreFlag = false;//pre查询失败的情况下当做
			model.customer.customerSession.prefillState = 0;
			if(hasCustomerSession){
				controller.hasSessionPreHandle(hasStepDataFlag,hasPreFlag,stepData);
			}else{
				controller.noSessionPreHandle(hasPreFlag);
			}
		})
	}
	
    //查询customerSession
	controller.queryCusstomerSession =  function(){
		$$.debug("takeIdCard 查询customerSession发送请求到后端。");
		return $$.sendMessage("service/proxy/vtcService/mVTMAOSession/findByIdCardNo", JSON.stringify({
                "idCardNo":  model.customer.idCardNo
        }));
	}
	
	//保存customerSession
	controller.saveCustomerSession = function(nextHash){
		var idCardInfo = model.customer.customerSession.idCardInfo;
		$$.debug("takeIdCard 保存customerSession发送请求到后端。");
		return $$.sendMessage("service/proxy/vtcService/mVTMAOSession/save", JSON.stringify({
                "staffId": $$.staffId,
                "name": idCardInfo.chip.Name,
                "address": idCardInfo.chip.Address,
                "sex": idCardInfo.chip.Sex == "男" ? 'M' : 'F',
                "nation": idCardInfo.chip.Nation,
                "born": idCardInfo.chip.Born,
                "idCardNo": idCardInfo.chip.IDCardNO,
                "language": controller.getLocale().toUpperCase(),
                "grantDept": idCardInfo.chip.GrantDept,
                "userLifeBegin": idCardInfo.chip.UserLifeBegin,
                "userLifeEnd": idCardInfo.chip.UserLifeEnd,
                "mvtmId": $$.machineInfo.HostName,
                "idCardType": codeAndTip.code.scanid.idCardType
        })).then(function(res){
			$$.debug("takeIdCard customerSession 身份证信息保存成功,准备跳转至showIdCard页面");
			if(res && res.status == codeAndTip.code.common.success){
				$$.debug("customerSession 身份证信息保存请求成功");
				if(nextHash){
					$$.beforChageHash().then(function(){
						location.hash = nextHash;
					})
				}
			}else if(codeAndTip.code.customerSession.alredyExit == res.status){
				$$.debug("takeIdCard customerSession 信息已存在");
				var errType='serviceError';
				var language = controller.getLocale();
				popup(errType,language);
			}else{
				$$.debug("takeIdCard customerSession 身份证信息保存请求成功，但是出现其他错误");
				var errType='serviceError';
				var language = controller.getLocale();
				popup(errType,language);
			}
			 //请求失败的情况下让next button可以点
			 nextButton.removeClass("disabled").attr("disabled",false);
		},function(err){
			$$.debug("takeIdCard customerSession 身份证信息保存失败。"+ JSON.stringify(err));  
			 //请求失败的情况下让next button可以点
			 nextButton.removeClass("disabled").attr("disabled",false);
 		});
	}
	
	//更新customerSession
	controller.updateCustomerSession = function(stepData){
		var idCardInfo = model.customer.customerSession.idCardInfo;
		$$.debug("takeIdCard 更新customerSession 更新发送请求到后端。");
		return $$.sendMessage("service/proxy/vtcService/mVTMAOSession/updateMultipleParamsByIdCardNo", JSON.stringify({
                "staffId": $$.staffId,
                "idCardNo": idCardInfo.chip.IDCardNO,
                "language":  controller.getLocale().toUpperCase(),
                "mvtmId": $$.machineInfo.HostName,
                "idCardType": codeAndTip.code.scanid.idCardType
        })).then(function(res){
			$$.debug("takeIdCard customerSession 身份证信息更新成功。" + JSON.stringify(res));
			if(res && res.status == codeAndTip.code.common.success){
				$$.debug("takeIdCard customerSession 身份证信息更新请求成功。");
				if(stepData){
					$$.debug("即将跳转至"+stepData+"页面");
					$$.beforChageHash().then(function(){
						location.hash = systemResumeMapping[stepData];
					})
				}
			}else if(codeAndTip.code.customerSession.notFound == res.status){
				$$.debug("takeIdCard customerSession 身份证信息更新请求成功，但是更新失败");
				var errType='serviceError';
				var language = controller.getLocale();
				popup(errType,language);
			}else{
				$$.debug("takeIdCard customerSession 身份证信息更新请求成功，但是更新失败");
				var errType='serviceError';
				var language = controller.getLocale();
				popup(errType,language);
			}
			 //请求失败的情况下让next button可以点
			 nextButton.removeClass("disabled").attr("disabled",false);
		},function(err){
			 //请求失败的情况下让next button可以点
			 nextButton.removeClass("disabled").attr("disabled",false);
			$$.debug("takeIdCard customerSession 身份证信息更新失败。"+ JSON.stringify(err));                       			
 		});	
	}
	
	//校验用户是否通过prefill
	controller.PrefillInfoForMvtmPO = function() {
		var idCardInfo = model.customer.customerSession.idCardInfo;
		return $$.sendMessageWithoutException("service/proxy/vtcService/mVTMPrefill/prefillInfoForMvtm", JSON.stringify({
			'idNum': model.customer.idCardNo,
			'idType':codeAndTip.code.scanid.idCardType,
			'status':0
		}));
	};

	//删除idCardNo数据
	controller.deleteAll = function(){
		var idCardInfo = model.customer.customerSession.idCardInfo;
		return $$.sendMessage("service/proxy/vtcService/mVTMAOSession/deleteByIdCardNo", JSON.stringify({
			'idCardNo': model.customer.idCardNo
		})).then(function(res){
			if(codeAndTip.code.common.success == res.status){
				//删除后需要重新给window.captureNext赋值，保证capture页面跳转正确
				window.captureNext = "accountType";
				controller.saveCustomerSession("showIdCard");
				//删除视频,防止customerSession删除成功,但是视频依然存在且上传
				wosa.addVideoStatus(model.customer.idCardNo,false);
			}else if(codeAndTip.code.customerSession.notFound == res.status){
        		$$.debug("idno customerSession，信息已存在");
				var errType='serviceError';
				var language = controller.getLocale();
				popup(errType,language);
			}else{
				$$.debug("takeIdCard 请求成功,但是删除数据失败"); 
				var errType='serviceError';
				var language = controller.getLocale();
				popup(errType,language);
			}
		});
	}	
	
	return controller;
});
