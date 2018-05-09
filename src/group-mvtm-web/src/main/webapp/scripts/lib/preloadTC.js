define(['./app/util'],function ($$) {
	function loadImg(url, cb) {
	    var img = new Image();
	    img.src = url;
	    img.onload = cb;
	    img.onerror = cb;
	    $$.preloadImages.push(img);
	}
	
	function preloadTnc(){
		$$.showLoading();
		$$.getPdfUrl().then(function(data) {
			  var loadedCount  = 0;
			  var totalArray = ['images/app/common/checked.png',
			                    'images/app/common/loading.png',			
			            		'images/app/login/login_background.png',
			            		'images/app/login/login_background.png',
			            		'images/app/home/mvtm_logo_en.png',
			            		'images/app/home/mvtm_logo_en.png',
			            		'images/app/common/Close-button.png',
			            		'images/app/accountAgreement/agree-checkbox.png',
			            		'images/app/accountAgreement/agree-nocheckbox.png',
			            		'images/app/common/Close-button.png',
			            		'images/app/understandTnc/icon_arrow_Account.png',		
			            		'images/app/home/home-bg.jpg',
			            		'images/app/home/address-ico.png',
			            		'images/app/home/card-ico.png',
			            		'images/app/home/bank-card.png',
			            		'images/app/home/language.png',
			            		'images/app/home/mvtm_logo_zh.png',
			            		'images/app/identificationType/icon_idcard1.png',
			            		'images/app/identificationType/icon_passport.png',
			            		'images/app/identificationType/icon_card.png',
			            		'images/app/identificationType/icon_card_type_4.png',
			            		'images/app/common/main-bg.jpg',
			            		'images/app/common/point-hide.png',
			            		'images/app/common/triangle.png',
			            		'images/app/common/point-show.png',	
			            		'images/app/scanId/scanIdCard.jpg',	
			            		'images/app/animation/default.png',
			            		'images/app/animation/default.png',	
			            		'video/take-ID-card.png',
			            		'images/app/idNo/icon_input_number.png',	
			            		'images/app/capture/icon_word.png',
			            		'images/app/capture/icon_excel.png',
			            		'images/app/capture/icon_pdf.png',	
			            		'images/app/accountType/premiercard.png',
			            		'images/app/accountType/advancecard.png',	
			            		'images/app/accountType/personalcard.png',
			            		'images/app/accountType/right.png',	
			            		'images/app/common/next.png',
			            		'images/app/sacnBankCard/primaryCard.png',
			            		'images/app/sacnBankCard/advanceCard.png',
			            		'images/app/sacnBankCard/personalSynthesis.png',	
			            		'images/app/telephoneBankChoice/image_11.png',
			            		'images/app/telephoneBankChoice/image_arrow.png',	
			            		'images/app/facetoface/teller-img.png',	
			            		'images/app/readyTurnOnCamera/readyTurnOnCamera.jpg',
			            		'images/app/turnOnCamera/turnOnCamera.jpg',
			            		'images/app/turnOnCameraWaiting/turnOnCameraWaiting.jpg',
			            		'images/app/openFileForSign/openFileForSign.jpg',
			            		'images/app/enterPassword/set.png',		
			            		'images/app/enterPassword/setAgain.png',		
			            		'images/app/enterPassword/phone-open.png',	
			            		'images/app/enterPassword/phone-close.png',	
			            		'images/app/QR/image_mobilebanking.png',
			            		'images/app/QR/QRcodeMobileBanking.png',	
			            		'images/app/QR/wechat.png',
			            		'images/app/displayWeChat/wechatbanking.png',
			            		'images/app/rateExperience/star.png',
			            		'images/app/rateExperience/icon_completed.png',
			            		'images/app/rateExperience/QRCode.png',
			            		'images/app/enterPassword/password.png',
			            		'images/app/rateExperience/star-on.png'];
			  totalArray.push("images/app/common/Close-button.png");
			  totalArray.push("images/app/accountAgreement/agree-checkbox.png");
			  totalArray.push("images/app/accountAgreement/agree-nocheckbox.png");
			  totalArray.push("images/app/understandTnc/icon_arrow_Account.png");
			  for(var key in data){ 
				  console.log(key);
				  var imgArrayZH = data[key]["zh"]; 
				  var imgArrayEN = data[key]["en"];
				  
				  for(var i in imgArrayZH){ 
					  totalArray.push(imgArrayZH[i]);
				  }
				  for(var i in imgArrayEN){ 
					   totalArray.push(imgArrayEN[i]);
				  }
			  }
			  
			  for(var i in totalArray){
				  loadImg(totalArray[i],function(){
					  loadedCount++;
					  if(loadedCount == totalArray.length){
						  $$.debug("最后一张"+loadedCount);
						  //require完所有页面后再hide loading
						  //$$.hideLoading();
					  }
				  }); 
			  }
		});
	}
	return preloadTnc;
});
