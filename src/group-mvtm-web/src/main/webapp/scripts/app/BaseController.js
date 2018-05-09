define(['./wosa','versionInfo'], function (wosa,versionInfo) {
	function BaseController(id) {
		this.id = id;
	}

	BaseController.prototype = {
			setModel: function(model) {
				this.model = model;
			},
			setTemplate: function(template) {
				this.template = template;
			},
			render: function(container) {
				// 获取local language
				var language = this.getLocale();
				
				// 获取模板
				var templateStr = this.template;
				
				// 根据local language读取model中的resource
				if(this.model.locale && this.model.locale[language]){
					var resourceObj = this.model.locale[language];
					
					var regS = null;
					
					// 替换模板
					for(var key in resourceObj){
						regS = new RegExp("\\{" + key + "\\}", "g");
						templateStr = templateStr.replace(regS, resourceObj[key]);
					}
				}
				
				// 加载页面
				container.innerHTML = templateStr;
			},
			
			changeLocale: function(locale) {
				locale = locale || 'en';
				sessionStorage.setItem('locale', locale);
			},
			
			getLocale: function() {
				return sessionStorage.getItem('locale') || 'zh';
			}
			
	};
	return BaseController;
});
