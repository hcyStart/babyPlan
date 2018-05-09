define(['../BaseController', 'app/util','./accountType.model'], function (Base, $$, model) {
    var controller = new Base('accountType controller');
	controller.updateAccountType = function(){
		return $$.sendMessage("service/proxy/vtcService/mVTMAOSession/updataCardTypeByIdCardNo", JSON.stringify({
                "idCardNo": model.customer.idCardNo,
                "cardType": model.accountType
        }));
	}    
    return controller;
});
