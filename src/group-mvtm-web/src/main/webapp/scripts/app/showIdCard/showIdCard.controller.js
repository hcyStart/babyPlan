define(['../BaseController', 'app/util','./showIdCard.model'], function (Base, $$,model) {
	var controller = new Base('showIdCard controller');

	controller.idValidatior = function() {
			var idCardInfo = model.customer.customerSession.idCardInfo;
			return $$.sendMessage("service/proxy/vtcService/idValidatorForMvtm/idCheck", JSON.stringify({
				'fullName': idCardInfo.chip.Name,
				'iDNumber':model.customer.idCardNo
			}));
	};

	return controller;
});
