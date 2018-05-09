define(function (require) {
	var $ = require('jquery'),
		$$ = require('app/util'),
		dialog = require('app/dialog/dialog'),
		model = require('./home.model'),
		template = require('text!./home.template.html'),
		controller = require('./home.controller'),
		wosa = require('app/wosa'),
		popup=require('popup');


	/**
	 * 对外暴露函数，用于视图加载
	 */
	var load = function (toggleLanguage) {
		$$.actionLog("enter home page");
		render();
		bind();
		run(toggleLanguage);
		//返回首页重置所有硬件的方法
	//	controller.resetAllHardWare();
	};

	function hidePopup(){
		$("#home-maskLayer").hide();
		$(".layer-ui").hide();
	}

	/**
	 * 视图渲染
	 */
	function render() {
		controller.setModel(model);
		controller.setTemplate(template);
		controller.render($$.getViewContainer());
	}

	/**
	 * 事件绑定
	 */
	function bind() {
		
		$("#js-loginOut").on("click", function () {
		    //进入首页开始上传视屏到服务器
			controller.getUpLoadVideoStatusInit({
				getUpLoadVideoStatusSuc:function (hResult){
					$$.debug("获取上传文件状态成功");
					var uploadFileResult = JSON.parse(hResult.data);
                    if(uploadFileResult.WaitCount == 0){
            			var errType='logOutError'
            			var language = controller.getLocale();
            			if("#home" == location.hash){
            				popup(errType,language);
            			}
                    }else{
            			var errType='watingFileExcetption';
            			var language = controller.getLocale();
            			var code = "";
            			if(language == "en"){
            				code = uploadFileResult.WaitCount + " video files waiting to be uploaded."; 
            			}else{
            				code = uploadFileResult.WaitCount + "份视频等待上传，请勿退出。"; 
            			}  
            			if("#home" == location.hash){
            				popup(errType,language,null,null,code);
            			}
                    }
				},
				getUpLoadVideoStatusFail:function(hResult){
					$$.debug("获取上传文件状态失败,但是不去隔断流程"+hResult);
				}
			});
		});
		/**
		 * this is poc end
		 * */
		$("#js-switch-language").off().on("click", function () {
			$$.debug("点击切换语言种类"+controller.getLocale());
			var language = controller.getLocale();
			var handWareLanguage = '';
			if ("zh" == language) {
				language = "en";
				handWareLanguage = 'en-US';
				//切换语言种类
				$("#link-css").attr("href", "css/reset-"+ language +".css");
				window.currentLanguage = language;
				controller.changeLocale(language);
				wosa.setHandWareLanguageAsync(handWareLanguage);
				load(true);
			} else {
				language = "zh";
				handWareLanguage = 'zh-CN';
				//切换语言种类
				$("#link-css").attr("href", "css/reset-"+ language +".css");
				window.currentLanguage = language;
				controller.changeLocale(language);
				wosa.setHandWareLanguageAsync(handWareLanguage);
				load(true);
			}
		});
		$(".open-account-btn").on("click", function(){
			$("#js-loginOut").off('click');
			//点击开户停止上传视屏到服务器
			controller.stopUpLoadVideoInit({
					stopUpLoadSuc: function (){
						$$.debug("停止上传video成功");
						$$.uploadFlag = true;
					},
					stopUpLoadFail:function(hResult){
						$$.debug("停止上传video失败"+hResult);
					}
				});
			//初始化model.customerSession
			controller.setCustomerSession();
			$$.beforChageHash().then(function(){
				location.hash='identificationType';
			})
		});
		
		
		
	}
	function run(toggleLanguage) {
		hidePopup();
		if($$.uploadFlag){
			 controller.startUpLoadVideoInit({
				 startUpLoadSuc:function (){
					$$.debug("开始上传video成功");
					$$.uploadFlag = false;
			    },
			    startUpLoadFail:function(hResult){
			    	$$.debug("开始上传video失败"+hResult);
				}
			 });
		}
		$$.localLanguage = controller.getLocale();
		if($$.localLanguage =="zh"){
	          $('#lanen').show();
	          $('#lanzh').hide();
	          $("#imghomelogo").attr("src","./images/app/home/mvtm_logo_"+ $$.localLanguage +".png");
	    }else{
	          $('#lanen').hide();
	          $('#lanzh').show();
	          $("#imghomelogo").attr("src","./images/app/home/mvtm_logo_"+ $$.localLanguage +".png");
	    }
		//加载版本信息
		$("#vInfoInHome").text(controller.versionInformation);
		window.captureNext = 'accountType';//用于capture页面,区分是文件收集还是submit
		window.continueOpenAccount = "";//false表示第一次开户，ture表示前一次开户中断，
		//回首页身份证重置次数和扫描状态清空
		$$.scanNum = 0;
		$$.retrysetPinCard = 0;//重置卡密码失败重置次数
		$$.phoneNumberRetry= 0;//重置电话银行码失败重置次数
		$$.scanIDStatus = '';		
		//初始化时判断语言并加载对应样式
		$("#link-css").attr("href", "css/reset-"+ $$.localLanguage +".css");
		//如果切换语言
		if(toggleLanguage){
			$(".view-container").addClass("home-bg");
			$("#link-css").attr("href", "css/reset-"+ $$.localLanguage +".css");
			dialog.load();
			$('.main-padding').scrollTop(0);
		}else{
			//重置身份证错误
			$$.IDCardErrorFlag = false;
			$$.debug("初始化语言种类："+controller.getLocale());
			//第一次初始化根据当前语言判断传入硬件的参数
			if('en'==$$.localLanguage){
				wosa.setHandWareLanguageAsync("en-US");
			}else{
				wosa.setHandWareLanguageAsync("zh-CN");
			}
			$(".view-container").addClass("home-bg");
			$("#link-css").attr("href", "css/reset-"+ $$.localLanguage +".css");
			dialog.load();
			$('.main-padding').scrollTop(0);
		}

	}
	return {
		load: load
	};
});
