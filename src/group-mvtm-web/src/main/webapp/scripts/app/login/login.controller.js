define(['../BaseController', 'app/util','app/wosa'], function(Base,$$,wosa) {
	var controller = new Base('login controller');

	controller.staffLogon = function(username,password) {
		return $$.sendMessage("service/proxy/vtcService/authformvtm/staffLogon", JSON.stringify({
			'type': 'mVTM',
			'username': username,
			'password':password
		}));
	};
	controller.getTerminalInfo = function(){
		return ret = JSON.parse(wosa.GetTerminalInfo());
	}
	

	return controller;
});
