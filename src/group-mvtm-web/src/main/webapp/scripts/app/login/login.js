define(function(require) {
	var $ = require('jquery'),
		$$ = require('app/util'),
		model = require('./login.model'),
		template = require('text!./login.template.html'),
		controller = require('./login.controller'),
		codeAndTip = require('../../codeAndTip'),
		preloadTC = require('../../preloadTC'),
		preloadFiles = require('../../preloadFiles'),
		checkInternet=require('../../checkInternet');
		require(preloadFiles,function(){
			//$$.hideLoading();
			var loginButton = $("#js-login");
			var usernameVal = $("#username").val(),
			passwordVal = $("#password").val()
			if(usernameVal == "" || passwordVal == "" || $("#loading").is(":visible")){
				loginButton.addClass("disabled")
				loginButton.attr("disabled","disabled");
			}else{
				loginButton.removeClass("disabled")
				loginButton.removeAttr("disabled","");
			}
		});
	/**
	 * 对外暴露函数，用于视图加载
	 */
	var load = function () {
		render();
		bind();
		run();
		if(!$$.notLoadTCFlag){
			preloadTC();
			$$.notLoadTCFlag = true;
		}
	};

	/**
	 * 视图渲染
	 */
	function render() {
		controller.setModel(model);
		controller.setTemplate(template);
		controller.render($$.getViewContainer());
	}
	
	/**
	 * 清空账号密码
	 */
	function clearInput(){
		$('#username').val("");
		$('#password').val("");
	}

	/**
	 * 事件绑定
	 */
	function bind() {
		var loginButton = $("#js-login");

		function keyDown(){
			var usernameVal = $("#username").val(),
				passwordVal = $("#password").val()

			if(usernameVal == "" || passwordVal == "" || $("#loading").is(":visible")){
				loginButton.addClass("disabled")
				loginButton.attr("disabled","disabled");
			}else{
				loginButton.removeClass("disabled")
				loginButton.removeAttr("disabled","");
			}
		}

		$("#username,#password").on('input',keyDown);
		$(document).keydown(function(event){ 
			if(("#login"== location.hash) && (event.keyCode == 13)){ //绑定回车 
				loginButton.click();
			} 
		}); 
		loginButton.on('click', function () {
				var username = $('#username').val(),
					password = $('#password').val(),
					loginFlag = true;//放开AO
				loginButton.addClass("disabled")
				loginButton.attr("disabled","disabled");
				if(loginFlag){
					controller.staffLogon(username, password).then(function (res){
						loginButton.removeClass("disabled")
						loginButton.removeAttr("disabled","");
						if (codeAndTip.code.common.success == res.status && res.data.length > 0) {
							var data = res.data[0];
							var logonInfo = data.logonInfo;
							var logonFlag = false;
							if (logonInfo) {
								for (info in logonInfo) {
									if ("MVTM-App" == logonInfo[info]) {
										$$.staffId = data.username;										
										//调应底层方法获取设备名称
										getmachineInfo();										
										//getTNCImage();
										logonFlag = true;
										$$.beforChageHash().then(function(){
											location.hash = 'home';
										})
										break;
									}
								}
								if(logonFlag == false){
									$$.debug('柜员登录失败,无权限');
									$(".noAuthority").show().siblings('em').hide();
									clearInput();
								}
							}
						}else if(res.status == codeAndTip.code.login.acountError){
							$$.debug('返回LG0001无权限');
							$(".noAuthority").show().siblings('em').hide();
							clearInput();
						}
					},function(res){
						try{
							var responseText = JSON.parse(res.responseText)||{};
						}catch(e){
							var responseText = {};
						}
						if(codeAndTip.code.common.error == responseText.status){
							$$.debug('报500账号或密码错误')
							$(".InputError").show().siblings('em').hide();
							clearInput();
						}else{
					 			loginButton.removeClass("disabled")
					 			loginButton.removeAttr("disabled","");
					 			$$.debug('service请求失败');
					 			$(".requestError").show().siblings('em').hide();
					 			clearInput();
					 	} 
					})
				}else{
					//dummy数据登录
					$$.staffId = 'testStaff';
					$$.machineInfo = {HostName:"testhost"}||{};
					//getTNCImage();
					$$.beforChageHash().then(function(){
						location.hash = 'home';
					})
				}
			});


		//选择语言
		var defaultEnglish = $('.loginLanguage .defaultEnglish'),
			choiceOfLanguage = $('.loginLanguage .select')
		defaultEnglish.on('click',function(){
			choiceOfLanguage.toggleClass('select');
		});
		var selectEnglish = $('.loginLanguage .select .selectEnglish'),
			selectChinese = $('.loginLanguage .select .selectChinese')
		selectEnglish.on('click',function(){
			choiceOfLanguage.addClass('select');
			var _languageType = "en";
			controller.changeLocale(_languageType);
			load();
			defaultEnglish.html($(this).html());
			$('.view-login .logo img').attr('src','./images/app/home/mvtm_logo_en.png')
		})
		selectChinese.on('click',function(){
			choiceOfLanguage.addClass('select');	
			var _languageType = "zh";
			controller.changeLocale(_languageType);
			load();
			defaultEnglish.html($(this).html());
			$('.view-login .logo img').attr('src','./images/app/home/mvtm_logo_zh.png')
		})
	}

	function run(){
		$(".view-container").removeClass("home-bg");
		//每次登录重新清空上次的登录人的staffid
		$$.staffId ='';
		if('zh' == controller.getLocale()){
			$('.loginLanguage>div span').html('中文');
		}else{
			$('.loginLanguage>div span').html('English');
		}
		//默认为英文界面
		//controller.changeLocale('en');
		//加载版本信息
		$("#vInfoInLogin").text(controller.versionInformation);
		//监听网络是否连接异常,不要注掉。。要不老提defect
/*		if($$.checkTimer){
			clearInterval($$.checkTimer)
		}
		$$.checkTimer = setInterval(netErr,10000);*/
	} 
	
	//监听网络是否连接异常
/*	function netErr(){
		var img=new Image(); 
		img.src = "images/app/common/checked.png?time="+(new Date()).getTime();
		img.onerror = function(){
			$$.debug("网络连接失败--例行网络检查");
			checkInternet("netWorkErr",controller.getLocale(),null,null,null);
		}
	}*/
		//调应底层方法获取设备名称
	function getmachineInfo(){
		try{
			var _getmachineResult = controller.getTerminalInfo();
			if(_getmachineResult.hResult == "WFS_SUCCESS"){
				$$.debug('硬件设备获取信息成功');
				 $$.machineInfo = JSON.parse(_getmachineResult.data)||{};
			}else{
				$$.debug('硬件设备获取信息失败  但是不能影响流程 result'+_getmachineResult);
			}						
		}catch(e){
			$$.debug("获取设备名称出现异常"+ e); 
		}
	}
	//预加载tnc的pdf图片信息
	function getTNCImage(){
		var _pdfName = ["general","tariff","debit","premier","advance","phonebank"];
		var imageArr=[];
		$$.getPdfUrl().then(function(data) {
			_pdfName.forEach(function(item,index){	
				imageArr = imageArr.concat(data[item][controller.getLocale()]);
			});
			createImgDom.call(this,imageArr);
		});
	}
	function createImgDom(imageArr){
		var images = []; 
		for(var i = 0;i< imageArr.length;i++){
			images[i] = new Image();
			images[i].src =  imageArr[i];
		}	
	}
	
	return {
		load: load
	};
})