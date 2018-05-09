define(['../BaseController', 'app/util','./telephoneBankChoice.model','../../codeAndTip'], function (Base, $$, model,codeAndTip) {
	var controller = new Base('telephoneBankChoice controller');
	var language = controller.getLocale();
	controller.updateAccountType = function(){
		$$.sendMessage("service/proxy/vtcService/mVTMAOSession/updataCardTypeByIdCardNo", JSON.stringify({
                "idCardNo": model.customer.idCardNo,
                "cardType": model.accountType
        })).then(function(res){ 	
          	if(codeAndTip.code.common.success == res.status){
            	$$.debug('更新卡种类成功 ，更新成功  :'+ res.status);
            	controller.updateCardNumber();
            }else if(codeAndTip.code.customerSession.notFound == res.status){
             	$$.debug('更新卡类型时，信息未找到'+ res.status);
         		var errType='serviceError';
         		popup(errType,language); 
            }else{
            	$$.debug('更新卡种请求成功，但是更新失败  :'+ res.status);
         		var errType='serviceError';
         		popup(errType,language);
            }
            	 
         },function(err){
            $$.debug('更新卡种类失败   :'+ JSON.stringify(err));
         });
	}  
	//更新customerSession中的银行卡卡号
	controller.updateCardNumber = function(){
		//system resume 时会清楚这两个model的值，所以后面要用到这两个值时，一定要从数据库内取
		$$.sendMessage("service/proxy/vtcService/mVTMAOSession/updateCardNumberByIdCardNoAndIdCardType", JSON.stringify({
            "idCardNo": model.customer.idCardNo,
            "cardNumber": model.customer.cardNumber,
            "issueNumber": model.customer.issueNumber
         })).then(function(res){ 	
        	 if(codeAndTip.code.common.success == res.status){
        		 $$.debug('更新银行卡卡号信息类成功 ，更新成功  ');
        		 controller.updatePhoneBankingStatus()
        	 }else if(codeAndTip.code.customerSession.notFound == res.status){
         		$$.debug('更新银行卡卡号信息类时，信息未找到'+ JSON.stringify(res));
    			var errType='serviceError';
    			popup(errType,language); 
        	 }else{
        		$$.debug('更新银行卡卡号信息类请求成功，但是更新失败  :'+ JSON.stringify(res));
    			var errType='serviceError';
    			popup(errType,language);
        	 }
        	 
        },function(err){
             $$.debug('更新银行卡卡号信息类失败   :'+ JSON.stringify(err));
        });
	}
	//更新customerSession中的PhoneBanking
	controller.updatePhoneBankingStatus = function(){
		$$.sendMessage("service/proxy/vtcService/mVTMAOSession/updataSelectPhoneBankingByIdCardNo", JSON.stringify({
                "idCardNo": model.customer.idCardNo,
                "selectPhoneBanking": model.customer.customerSession.selectPhoneBanking
        })).then(function(res){
           	if(codeAndTip.code.common.success == res.status){
        		$$.debug('更新phoneBanking状态成请求功  ，更新成功  :'+ res.status);
    			$$.beforChageHash().then(function(){
    				 location.hash = 'faceToface';
				})
        	}else if(codeAndTip.code.customerSession.notFound == res.status){
        		 $$.debug('更新phoneBanking未找到信息 :'+ res.status);
 				 var errType='serviceError';
 				 var language = controller.getLocale();
 				 popup(errType,language,function(){$("#fbInTleChoice").removeClass("disabled").attr("disabled",false)},function(){$("#fbInTleChoice").removeClass("disabled").attr("disabled",false)},null);
        	}else{
        		$$.debug('更新phoneBanking状态请求成功 ，但是更新失败  :'+ res.status);
				var errType='serviceError';
				var language = controller.getLocale();
				popup(errType,language,function(){$("#fbInTleChoice").removeClass("disabled").attr("disabled",false)},function(){$("#fbInTleChoice").removeClass("disabled").attr("disabled",false)},null);
        	}
		},function(err){
			$$.debug('更新phoneBanking状态失败   :'+ err);
		});;
	}
	return controller;
});
