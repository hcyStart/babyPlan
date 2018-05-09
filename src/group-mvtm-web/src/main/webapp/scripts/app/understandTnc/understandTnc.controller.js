define(['../BaseController','app/util', './understandTnc.model'], function (Base,$$,model) {
	var controller = new Base('understandTnc controller');
	controller.PrefillInfoForMvtmPO = function(idNum,idType) {
		var idCardInfo = model.customer.customerSession.idCardInfo;
		return $$.sendMessage("service/proxy/vtcService/mVTMPrefill/prefillInfoForMvtm", JSON.stringify({
			'idNum': idNum,
			'idType':idType,
			'status':0
		}));
	};


	return controller;
});
