define(['./app/util','./jquery'],function ($$,$) {
	var mainMask = $("#mainMask");
	var popupTips = {
		en:{
			formatError:'Sorry, this file format is not supported. Please use Word, Excel, PDF or JPG.',
			logOutError:'Do you want to logout?',
			prefillError:'System cannot find the pre-registration information of this user. Please check your input.',
			queryCusPreSucError:'Continue previous application?',
			queryCusPreErrError:'Pre-registration information not found for this customer, continue the previous application?',
			recordError_retry:'Video recording system issue, the current video is interrupted, the camera will be turned off automatically, and system will back to the page of the Open-the-recording-device page, please try again. Error code:　',
			recordFailed:'Video recording failed, please contact the administrator. ErrorCode: ',
			idcardAgeError:'Sorry, HSBC customers must be older than 18 years old.',
			idcardExpiredError:'ID Card has expired. Please provide valid identification document.',
			idcardTimeOut:'Please put the ID card on the scanner.',
			addVideoStatusError:'',
			invialdIdcardRetry:'Unable to scan ID card. Please try again.',
			invialdIdcardRetryFail:'Sorry, Unable to read ID card. You can select other identification document types to continue the account opening, such as passport.',
			idcardHandWareError:"Scanner issue. If the scanner can't be recovered after restarting the tablet, please contact the administrator. Error code:　",
			serviceError:'Service unavailable due to server error. please contact our maintenance hotline: 021-38886000.',
			chooseExit:'Current application can not be resumed after exit, Do you wish to end your application?',
			retryClosePdf:'To close the PDF failure, click retry',
			serversRetryError:"Service unavailable due to server error. please contact our maintenance hotline: 021-38886000.",
			checkSMPPDFisReadyError:"Please complete following steps: Complete CDD approval, Create customer account, review and confirm smart form information with customer.",
			cameraStartFailed_retry_1:"Camera issue. If camera can't be recovered after restarting the tablet, please contact the administrator. Error code:　",
			cameraStartFailed_retry_2:"Camera issue. Please contact the administrator. Error code:　",
			cameraStartFailed_retry_3:"The camera failed to open. Please try again. Error code:　",
			pdfNotFound:"Not found the signature file, please go to e-form system to regenerate this file again. Error code: ",
			pdfRetry:"System issue, please open the e-form and sign again. Error code:　",
			pdfResume:"System issue, please restart your tablet. Error code:　",
			idNoInputErrOne:"Please enter a document number of less than ten bits.",
			idNoInputErrTwo:"Please input number or letter.",
			watingFileExcetption:"Don't logout. ",
			systemException: 'System issue, please restart your tablet. Error code:　',
			captivaErr:'Failed to upload files to Captiva, please contact administrator. Error code:　',
			gwisErr:'Failed to upload files to GWIS, please contact administrator. Error code:　',
			addVideoErr:"System issue, please restart your device. If it still doesn't work after retry, please contact administrator. Error code:　",
			openedUserErr:"You have already opened an account and cannot continue the account opening business.<br/> Please contact our bank clerk at the branch.",
			duplicationFileName:"A file with the same name already exists.",
			fileEmpty:"Upload failed. It's an empty file. Please select again.",
			uploadFailure:"File upload failed, please try again. Error code: ",
			idCardPerfillError:"System cannot find the pre-registration information of this user. Do you want to continue?",
			uploadImgError:"File upload failed, please try again. Error code: ",
			otherUploadImgError:"File upload failed, please upload again. If it still doesn't work after retry, please contact administrator. Error code: ",
			uploadPDFError_canRety:'File upload failed, please try again. Error code:　',
			connectBlueTheechError:'Scanner connection fail. Please restart the scanner and connect to the Bluetooth device again. Error code: ',
			netWorkErr:'Server connection error, please check your network.',
			fileNameError:'The file name cannot contain Chinese characters, please select again.',
			requirejsError:'System issue, please login again.',
			deleteFileErr:'Failed to delete the file, please try again. ',
			scanBankCardTimeOut:'Please swipe your debit card on card reader.',
			invialdBankCardRetry:'Sorry, bank card reading failed. Please try again.',
			bankCardHandWareError:"Card reader issue. If the function can't be recovered after restarting the tablet, please contact the administrator. Error code: ",
			closeBankCardHandWareError:"Card reader issue. If the function can't be recovered after restarting both the tablet and peripherals, please contact the administrator. Error code: ",
			setPinTimeOut:"Please enter your PIN.",
		    setPinLengthError:"The PIN you just entered is invalid. The PIN should be 6 digits. Please try again.",
		    serPinNotConsistent:"<div id='setPinFail'><i class='icon set-pin-fail'></i><span>Sorry, the PIN you just entered does not match the one you entered before. Please re-enter the PIN.</span></div>",
		    setPasswordSuc:'<div id="setPin"><i class="icon open"></i><span>Your PIN has been set successfully.</span></div>',
		    setPasswordSucP:'<div id="setPin"><i class="icon open"></i><span>Your PIN has been set successfully.</span><p id="setPinTipEN">Now please set phone banking PIN.</p></div>',
		    phoneBankNumberTimeOut:"Please enter your PIN.",
		    phoneBankNumberLengthError:"The PIN you just entered is invalid. The PIN should be 6 digits. Please try again.",
		    phoneBankNumberNotConsistent:"<div id='setPinFail'><i class='icon set-pin-fail'></i><span>Sorry, the PIN you just entered does not match the one you entered before. Please re-enter the PIN.</span></div>",
		    phoneBankNumbersetpinServerError:"PIN setting failed, please re-enter.",
		    setpinServerError:"PIN setting failed, please re-enter.",
		    setpinRetryFail:"The password fails online, and the bank clerk will provide you with a password letter.",
		    setpinPasswordHandwareError:"PIN pad issue. If the function can't be recovered after restarting the tablet, please contact the administrator. Error code: ",
		    enterPasswordSetPinRsErr:"Failed to get Encrypted data, If the function can't be recovered after restarting the tablet, please contact the administrator.Error code: ",
		    phoneBankNumberSetPinRsErr:"Failed to get Encrypted data, If the function can't be recovered after restarting the tablet, please contact the administrator.Error code: ",
		    setpinYHHandWareError: "PIN pad issue. If the function can't be recovered after restarting both the tablet and peripherals, please contact the administrator. Error code: "
		},
		zh:{
			formatError:'抱歉，不支持此文件格式。支持的文件类型为：Word， Excel， PDF， JPG。',
			logOutError:'您是否要退出当前账号？',
			prefillError:'系统无法找到该用户的预注册信息， 请检查输入是否正确。',
			queryCusPreSucError:'是否继续上一次未完成的申请？',
			queryCusPreErrError:'该用户没有提交预注册信息，是否继续上一次未完成的申请？',
			idcardAgeError:'抱歉 ，客户年龄需年满18岁。',
			idcardExpiredError:'您的身份证已过有效期，请提供有效证件。',
			idcardTimeOut:'请将身份证放在扫描器上。',
			invialdIdcardRetry:'抱歉，身份证读取不成功， 请重试。',
			invialdIdcardRetryFail:'抱歉，该身份证无法识别，您可以选择其他证件类型继续进行开户服务， 如护照等。',
			recordError_retry:'视频录制系统异常，当前录像中断，系统将自动关闭摄像头，并且界面返回到开启录像设备页面，请重试。Error code：',
			recordFailed:'视频录制失败，请联系管理员。ErrorCode：',
			idcardHandWareError:'身份证扫描仪设备异常，重启设备后如不能恢复，请联系管理员。Error code：',
			serviceError:'服务器异常，本机服务暂停，请联系维护热线： 021-38886000。',
			chooseExit:'返回首页后当前业务无法恢复， 是否要结束当前业务？ ',
			retryClosePdf:'关闭PDF失败，请点击重试。',
			serversRetryError:"服务器异常，本机服务暂停，请联系维护热线： 021-38886000。",
			checkSMPPDFisReadyError:"请先完成以下步骤： 完成CDD批准， 创建客户账号并提交申请表。",
			cameraStartFailed_retry_1:"拍照设备异常，重启设备后如不能恢复，请联系管理员。Error code：",
			cameraStartFailed_retry_2:"拍照设备异常，请联系管理员。Error code：",
			cameraStartFailed_retry_3:"摄像设备开启失败，请重试。",
			pdfNotFound:"没有找到该客户的签名文件，请到e-form系统重新生成该文件。Error code：",
			pdfRetry:"系统异常，请再次打开开户申请表格并重新签名。Error code：",
			pdfResume:"系统异常，请重启计算机。Error code：",
			idNoInputErrOne:"请输入小于十位的证件号。",
			idNoInputErrTwo:"请输入数字或字母。",
			watingFileExcetption:"还有",
			systemException: '系统异常，请重启计算机。Error code：',
			captivaErr:'文件上传Captiva失败，请联系管理员。Error code：',
			gwisErr:'文件上传GWIS失败，请联系管理员。Error code：',
			addVideoErr:"系统异常，请重启设备，重新尝试后如不能恢复请联系管理员。Error code：",
			openedUserErr:"您已经开过户，无法继续办理开户业务，请前往分行与我们的银行职员联络。",
			duplicationFileName:"该同名文件已存在。",
			fileEmpty:"上传失败。所选文件为空文件， 请重新选择。",
			uploadFailure:"文件上传失败，请重新尝试。Error code：",
			idCardPerfillError:"系统无法找到该用户的预注册信息，是否继续开户？",
			uploadImgError:'文件上传失败，请重新尝试。Error code：',
			otherUploadImgError:'文件上传失败，请重新上传，重新尝试后如不能恢复，请联系管理员。Error code：',
			uploadPDFError_canRety:'文件上传失败，请重新尝试Error code：',
			connectBlueTheechError:'身份证扫描仪连接失败，请检测蓝牙连接或重启手持终端。Error code：',
			netWorkErr:'服务器连接异常，请检查本机的网络连接。',
			fileNameError:'文件名称不能含有中文， 请重新选择。',
			requirejsError:'系统异常，请重新登录。',
			deleteFileErr:'删除该文件失败,请重试。',
			scanBankCardTimeOut:'请在刷卡机上刷卡。',
			invialdBankCardRetry:'抱歉，银行卡读取不成功，请重试。',
			bankCardHandWareError:"刷卡模块异常，重启电脑后如不能恢复，请联系管理员。Error code：",
			closeBankCardHandWareError:'刷卡模块异常，重启电脑和手持终端后如不能恢复，请联系管理员。Error code：',
			setPinTimeOut:"请输入密码。",
			setPinLengthError:"您输入的密码无效，长度必须为6位数字，请重试。",
			serPinNotConsistent:"<div id='setPinFail'><i class='icon set-pin-fail'></i><span>抱歉！两次密码输入不一致，请重新设置密码。</span></div>",
			setPasswordSuc:'<div id="setPin"><i class="icon open"></i><span>您的密码已设置成功。</span></div>',
			setPasswordSucP:'<div id="setPin"><i class="icon open"></i><span>您的密码已设置成功。</span><p id="setPinTipZH">接下来请您设置电话银行密码。</p></div>',
			phoneBankNumberTimeOut:"请输入密码。",
			phoneBankNumberLengthError:"您输入的密码无效，长度必须为6位数字，请重试。",
			phoneBankNumberNotConsistent:"<div id='setPinFail'><i class='icon set-pin-fail'></i><span>抱歉！两次密码输入不一致，请重新设置密码。</span></div>",
			phoneBankNumbersetpinServerError:"设置密码失败，请重新输入。",
			setpinRetryFail:"在线设置密码失败,银行职员将为您提供密码函英语。",
			setpinServerError:"设置密码失败，请重新输入。",
			setpinPasswordHandwareError:"密码键盘模块异常，重启电脑后如不能恢复，请联系管理员。Error code：",
			enterPasswordSetPinRsErr:"获取密文失败，重启电脑后如不能恢复，请联系管理员。Error code：",
			phoneBankNumberSetPinRsErr:"获取密文失败，重启电脑后如不能恢复，请联系管理员。Error code：",
			setpinYHHandWareError: "密码键盘模块异常，重启电脑和手持终端后如不能恢复，请联系管理员。Error code："
		}	
			
	}
	var popupBtnTips = {
		en:{
			recordError_retry:{
				leftBtnTip:"OK"
			},
			recordFailed:{
				leftBtnTip:"Back to Home"
			},
			formatError:{
				leftBtnTip:'OK'
			},
			idcardTimeOut:{
				leftBtnTip:'OK',
			},
			invialdIdcardRetry:{
				leftBtnTip:"Back to Home",
				rightBtnTip:"Retry"
			},
			invialdIdcardRetryFail:{
				leftBtnTip:"Select Other Identification Document",
				rightBtnTip:"Back to Home"	
			},
			idcardHandWareError:{
				leftBtnTip:"Back to Home"
			},
			logOutError:{
				leftBtnTip:"Cancel",
				rightBtnTip:"Logout"
			},
			idcardAgeError:{
				leftBtnTip:'Back to Home'
			},
			idcardExpiredError:{
				leftBtnTip:"Select Other Identification Document",
				rightBtnTip:"Back to Home"				
			},
			prefillError:{
				leftBtnTip:"Refill",
				rightBtnTip:"Continue"
			},
			queryCusPreSucError:{
				leftBtnTip:"No",
				rightBtnTip:"Yes"
			},
			queryCusPreErrError:{
				leftBtnTip:"No",
				rightBtnTip:"Yes"
			},
			serviceError:{
				leftBtnTip:"Back to Home"
			},
			chooseExit:{
				leftBtnTip:"No",
				rightBtnTip:"Yes"
			},
			retryClosePdf:{
				leftBtnTip:"retry"
			},
			serversRetryError:{
				leftBtnTip:"Back to Home"
			},
			checkSMPPDFisReadyError:{
				leftBtnTip:"OK"
			},
			cameraStartFailed_retry_1:{
				leftBtnTip:"Back to Home"
			},
			cameraStartFailed_retry_2:{
				leftBtnTip:"Back to Home"
			},
			cameraStartFailed_retry_3:{
				leftBtnTip:"Back to Home",
				rightBtnTip:"Retry"
			},
			pdfNotFound:{
				leftBtnTip:"OK"
			},
			pdfRetry:{
				leftBtnTip:"OK"
			},
			pdfResume:{
				leftBtnTip:"OK"
			},
			idNoInputErrOne:{
				leftBtnTip:"OK"
			},
			idNoInputErrTwo:{
				leftBtnTip:"OK"
			},
			watingFileExcetption:{
				leftBtnTip:"OK"
			},
			systemException:{
				leftBtnTip:"OK"
			},
			captivaErr:{
				leftBtnTip:"Back to Home "
			},
			gwisErr:{
				leftBtnTip:"Back to Home "
			},
			addVideoErr:{
				leftBtnTip:"OK"
			},
			openedUserErr:{
				leftBtnTip:"Back to Home "
			},
			duplicationFileName:{
				leftBtnTip:'OK'
			},
			fileEmpty:{
				leftBtnTip:'OK'
			},
			uploadFailure:{
				leftBtnTip:'OK'
			},
			idCardPerfillError:{
				leftBtnTip:"Select Other Identification Document",
				rightBtnTip:"Continue"	
			},
			uploadImgError:{
				leftBtnTip:'OK'
			},
			otherUploadImgError:{
				leftBtnTip:'OK'
			},
			uploadPDFError_canRety:{
				leftBtnTip:'Back to Home',
				rightBtnTip:'Retry'
			},
			connectBlueTheechError:{
				leftBtnTip:'OK'
			},
			netWorkErr:{
				leftBtnTip:'OK'
			},
			fileNameError:{
				leftBtnTip:'OK'
			},
			requirejsError:{
				leftBtnTip:'OK'
			},
			deleteFileErr:{
				leftBtnTip:'OK'
			},
			scanBankCardTimeOut:{
				leftBtnTip:'OK',
			},
			invialdBankCardRetry:{
				leftBtnTip:"OK"
			},
			bankCardHandWareError:{
				leftBtnTip:"OK"
			},
			closeBankCardHandWareError:{
				leftBtnTip:"OK"
			},
			setPinTimeOut:{
				leftBtnTip:'OK'
			},
			setPinLengthError:{
				leftBtnTip:'OK'
			},
			serPinNotConsistent:{
				leftBtnTip:'OK'
			},
			setPasswordSuc:{
				leftBtnTip:'OK'
			},
			setPasswordSucP:{
				leftBtnTip:'OK'
			},
			phoneBankNumberTimeOut:{
				leftBtnTip:'OK',
			},
			phoneBankNumberLengthError:{
				leftBtnTip:'OK'
			},
			phoneBankNumberNotConsistent:{
				leftBtnTip:'OK'
			},
			setpinPasswordHandwareError:{
				leftBtnTip:'OK'
			},
			setpinServerError:{
				leftBtnTip:'OK'
			},
			phoneBankNumbersetpinServerError:{
				leftBtnTip:'OK'
			},
			setpinRetryFail:{
				leftBtnTip:'Continue'
			},
			enterPasswordSetPinRsErr:{
				leftBtnTip:'OK'
			},
			phoneBankNumberSetPinRsErr:{
				leftBtnTip:'OK'
			},
			setpinYHHandWareError:{
				leftBtnTip:'OK'
			}
		},
		zh:{
			recordError_retry:{
				leftBtnTip:"确定"
			},
			recordFailed:{
				leftBtnTip:"返回首页"
			},
			formatError:{
				leftBtnTip:'确定'
			},
			idcardTimeOut:{
				leftBtnTip:'确定',
			},
			invialdIdcardRetry:{
				leftBtnTip:"返回首页",
				rightBtnTip:"重试"
			},
			invialdIdcardRetryFail:{
				leftBtnTip:"选择其他证件类型",
				rightBtnTip:"返回首页"		
			},
			idcardHandWareError:{
				leftBtnTip:"返回首页"
			},
			logOutError:{
				leftBtnTip:"取消",
				rightBtnTip:"退出登录"
			},
			idcardAgeError:{
				leftBtnTip:'返回首页'
			},
			idcardExpiredError:{
				leftBtnTip:"选择其他证件类型",
				rightBtnTip:"返回首页"				
			},
			prefillError:{
				leftBtnTip:"重新输入",
				rightBtnTip:"继续"
			},
			queryCusPreSucError:{
				leftBtnTip:"否",
				rightBtnTip:"是"
			},
			queryCusPreErrError:{
				leftBtnTip:"否",
				rightBtnTip:"是"
			},
			serviceError:{
				leftBtnTip:"返回首页"
			},
			chooseExit:{
				leftBtnTip:"继续开户",
				rightBtnTip:"返回首页"
			},
			retryClosePdf:{
				leftBtnTip:"重试"
			},
			serversRetryError:{
				leftBtnTip:"返回首页"
			},
			checkSMPPDFisReadyError:{
				leftBtnTip:"确定"
			},
			cameraStartFailed_retry_1:{
				leftBtnTip:"返回首页"
			},
			cameraStartFailed_retry_2:{
				leftBtnTip:"返回首页"
			},
			cameraStartFailed_retry_3:{
				leftBtnTip:"返回首页",
				rightBtnTip:"重试"
			},
			pdfNotFound:{
				leftBtnTip:"确定"
			},
			pdfRetry:{
				leftBtnTip:"确定"
			},
			pdfResume:{
				leftBtnTip:"确定"
			},
			idNoInputErrOne:{
				leftBtnTip:"确定"
			},
			idNoInputErrTwo:{
				leftBtnTip:"确定"
			},
			watingFileExcetption:{
				leftBtnTip:"确定"
			},
			systemException:{
				leftBtnTip:"确定"
			},
			captivaErr:{
				leftBtnTip:"返回首页"
			},
			gwisErr:{
				leftBtnTip:"返回首页"
			},
			addVideoErr:{
				leftBtnTip:"确定"
			},
			openedUserErr:{
				leftBtnTip:"返回首页"
			},
			duplicationFileName:{
				leftBtnTip:'确定'
			},
			fileEmpty:{
				leftBtnTip:'确定'
			},
			uploadFailure:{
				leftBtnTip:'确定'
			},
			idCardPerfillError:{
				leftBtnTip:"选择其他证件类型",
				rightBtnTip:"继续"	
			},
			uploadImgError:{
				leftBtnTip:'确定'
			},
			otherUploadImgError:{
				leftBtnTip:'确定'
			},
			uploadPDFError_canRety:{
				leftBtnTip:"返回首页",
				rightBtnTip:"重试"
			},
			connectBlueTheechError:{
				leftBtnTip:'确定'
			},
			netWorkErr:{
				leftBtnTip:'确定'
			},
			fileNameError:{
				leftBtnTip:'确定'
			},
			requirejsError:{
				leftBtnTip:'确定'
			},
			deleteFileErr:{
				leftBtnTip:'确定'
			},
			scanBankCardTimeOut:{
				leftBtnTip:'确定',
			},
			invialdBankCardRetry:{
				leftBtnTip:'确定'
			},
			bankCardHandWareError:{
				leftBtnTip:"确定"
			},
			closeBankCardHandWareError:{
				leftBtnTip:"确定"
			},
			setPinTimeOut:{
				leftBtnTip:'确定',
			},
			setPinLengthError:{
				leftBtnTip:'确定'
			},
			serPinNotConsistent:{
				leftBtnTip:'确定'
			},
			setPasswordSuc:{
				leftBtnTip:'确定'
			},
			setPasswordSucP:{
				leftBtnTip:'确定'
			},
			phoneBankNumberTimeOut:{
				leftBtnTip:'确定',
			},
			phoneBankNumberLengthError:{
				leftBtnTip:'确定'
			},
			phoneBankNumberNotConsistent:{
				leftBtnTip:'确定'
			},
			setpinPasswordHandwareError:{
				leftBtnTip:'确定'
			},
			setpinServerError:{
				leftBtnTip:'确定'
			},
			phoneBankNumbersetpinServerError:{
				leftBtnTip:'确定'
			},
			setpinRetryFail:{
				leftBtnTip:'下一步'
			},
			enterPasswordSetPinRsErr:{
				leftBtnTip:'确定'
			},
			phoneBankNumberSetPinRsErr:{
				leftBtnTip:'确定'
			},
			setpinYHHandWareError:{
				leftBtnTip:'确定'
			}
		}		
	}
	var popupFuns = {
			recordError_retry:{leftBtnFun:function(){
				location.hash = 'faceToface';
			}},
			cameraStartFailed_retry_1:{
				leftBtnFun:function(){}
			},
			cameraStartFailed_retry_2:{
				leftBtnFun:function(){}
			},
			cameraStartFailed_retry_3:{
				leftBtnFun:function(){},
				rightBtnFun:function(){}
			},
			pdfNotFound:{
				leftBtnFun:function(){}
			},
			pdfRetry:{
				leftBtnFun:function(){}
			},
			pdfResume:{
				leftBtnFun:function(){}
			},
			recordFailed:{leftBtnFun:function(){}},
			formatError:{
				leftBtnFun:function(){
					$('#uploadBtn').removeClass('disable');
					$("#uploadInput").val('');
				}
			},
			idcardAgeError:{
				leftBtnFun:function(){
					location.hash = "home";
				}
			},
			idcardExpiredError:{
				leftBtnFun:function(){
					location.hash = "identificationType";
				},
				rightBtnFun:function(){
					location.hash = "home";
				}		
			},
			invialdIdcardRetry:{
				leftBtnFun:function(){
					location.hash = "home";
				},
				rightBtnFun:function(){
					$$.beforChageHash().then(function(){
						$$.scanNum++;	
						location.hash = "scanId_" + new Date().getTime();
					});
				}	
			},
			invialdIdcardRetryFail:{
				leftBtnFun:function(){
					location.hash = "identificationType";
				},
				rightBtnFun:function(){
					location.hash = "home";
				}
			},
			idcardHandWareError:{
				leftBtnFun:function(){
					location.hash = "home";
				}
			},
			logOutError:{
				leftBtnFun:function(){
					$("#home-maskLayer").hide()
					},
				rightBtnFun:function(){
					$("#home-maskLayer").hide()
					$$.uploadFlag = true;
					location.hash = "login";
					}
			},
			prefillError:{
				leftBtnFun:function(){
						$('.idNumber').val("");
						$('.idNumber').focus();    
					},
				rightBtnFun:function(){
				}
			},
			queryCusPreSucError:{
				leftBtnFun:function(){},
				rightBtnFun:function(){}
			},
			queryCusPreErrError:{
				leftBtnFun:function(){},
				rightBtnFun:function(){}
			},
			idcardTimeOut:{
				leftBtnFun:function(){
					$$.beforChageHash().then(function(){
						location.hash = "scanId_" + new Date().getTime();
					})
				}
			},
			serviceError:{
				leftBtnFun:function(){
					location.hash = "home";
			    }
			},
			chooseExit:{
				leftBtnFun:function(){},
				rightBtnFun:function(){}
			},
			retryClosePdf:{
				leftBtnFun:function(){}
			},
			serversRetryError:{
				leftBtnFun:function(){
					location.hash = "home";
			    }
			},
			checkSMPPDFisReadyError:{
				leftBtnFun:function(){}
			},
			cameraStartFailed_1:{
				leftBtnFun:function(){}
			},
			cameraStartFailed_2:{
				leftBtnFun:function(){}
			},
			cameraStartFailed_3:{
				leftBtnFun:function(){},
				rightBtnFun:function(){}
			},
			idNoInputErrOne:{
				leftBtnFun:function(){
					var idNoNext = $('#idNo-next')
					idNoNext.addClass('disabled').attr("disabled",true);
					$('.idNumber').val("");
					$('.idNumber').focus();
				}
			},
			idNoInputErrTwo:{
				leftBtnFun:function(){
					var idNoNext = $('#idNo-next')
					idNoNext.addClass('disabled').attr("disabled",true);
					$('.idNumber').val("");
					$('.idNumber').focus();
				}
			},
			watingFileExcetption:{
				leftBtnFun:function(){}
			},
			systemException:{
				leftBtnFun:function(){}
			},
			captivaErr:{
				leftBtnFun:function(){
					location.hash = "home";
			    }
			},
			gwisErr:{
				leftBtnFun:function(){
					location.hash = "home";
			    }
			},
			addVideoErr:{
				leftBtnFun:function(){}
			},
			openedUserErr:{
				leftBtnFun:function(){
					location.hash = "home";
			    }
			},
			duplicationFileName:{
				leftBtnFun:function(){}
			},
			fileEmpty:{
				leftBtnFun:function(){}
			},
			uploadFailure:{
				leftBtnFun:function(){}
			},
			idCardPerfillError:{
				leftBtnFun:function(){},
				rightBtnFun:function(){}
			},
			uploadImgError:{
				leftBtnFun:function(){}
			},
			otherUploadImgError:{
				leftBtnFun:function(){}
			},
			uploadPDFError_canRety:{
				leftBtnFun:function(){},
				rightBtnFun:function(){}
			},
			connectBlueTheechError:{
				leftBtnFun:function(){}
			},
			netWorkErr:{
				leftBtnFun:function(){}
			},
			fileNameError:{
				leftBtnFun:function(){}
			},
			requirejsError:{
				leftBtnFun:function(){window.location.reload()}
			},
			deleteFileErr:{
				leftBtnFun:function(){}
			},
			scanBankCardTimeOut:{
				leftBtnFun:function(){
					$$.beforChageHash().then(function(){
						location.hash = "scanBankCard_" + new Date().getTime();
					})
				}
			},
			invialdBankCardRetry:{
				leftBtnFun:function(){
					$$.beforChageHash().then(function(){
						location.hash = "scanBankCard_" + new Date().getTime();
					})
				}
			},
			bankCardHandWareError:{
				leftBtnFun:function(){
					
				}
			},
			closeBankCardHandWareError:{
				leftBtnFun:function(){
					
				}
			},
			setPinTimeOut:{
				leftBtnFun:function(){
					$$.beforChageHash().then(function(){
						location.hash = "enterPassword_" + new Date().getTime();
					})
				}
			},
			setPinLengthError:{
				leftBtnFun:function(){
					$$.beforChageHash().then(function(){
						location.hash = "enterPassword_" + new Date().getTime();
					})
				}
			},
			serPinNotConsistent:{
				leftBtnFun:function(){
					$$.beforChageHash().then(function(){
						location.hash = "enterPassword_" + new Date().getTime();
					})
				}
			},
			setPasswordSuc:{
				leftBtnFun:function(){}
			},
			setPasswordSucP:{
				leftBtnFun:function(){}
			},
			phoneBankNumberTimeOut:{
				leftBtnFun:function(){
					$$.beforChageHash().then(function(){
						location.hash = "phoneBankNumber_" + new Date().getTime();
					})
				}
			},
			phoneBankNumberLengthError:{
				leftBtnFun:function(){
					$$.beforChageHash().then(function(){
						location.hash = "phoneBankNumber_" + new Date().getTime();
					})
				}
			},
			phoneBankNumberNotConsistent:{
				leftBtnFun:function(){
					$$.beforChageHash().then(function(){
						location.hash = "phoneBankNumber_" + new Date().getTime();
					})
				}
			},
			setpinPasswordHandwareError:{
				leftBtnFun:function(){
					
				}				
			},
			setpinServerError:{
				leftBtnFun:function(){
					$$.beforChageHash().then(function(){
						$$.retrysetPinCard++;
						location.hash = "enterPassword_" + new Date().getTime();
					})
				}	
			},
			phoneBankNumbersetpinServerError:{
				leftBtnFun:function(){
					$$.beforChageHash().then(function(){
						$$.phoneNumberRetry++;
						location.hash = "phoneBankNumber_" + new Date().getTime();
					})
				}	
			},
			setpinRetryFail:{
				leftBtnFun:function(){
					location.hash = "displayQR";
				}
			},
			enterPasswordSetPinRsErr:{
				leftBtnFun:function(){}
			},
			phoneBankNumberSetPinRsErr:{
				leftBtnFun:function(){}
			},
			setpinYHHandWareError:{
				leftBtnFun:function(){}
			}
	}
	
	var showPopup = function (popupName,language,leftEvent,rightEvent,code){
		if(("prefillError" == popupName || "queryCusPreSucError" == popupName || "queryCusPreErrError" == popupName) && "#idNo" != location.hash && "#takeIdCard" != location.hash){
			$$.debug(popupName +"===" + location.hash);
			return;
		}else if("uploadPDFError_canRety" == popupName && "#openFileForSign" != location.hash){
			$$.debug("uploadPDFError_canRety:"+ location.hash);
			return;
		}
		$$.debug('showPopup params：'+popupName+','+language+','+code+",cunrrent page:"+location.hash+",leftEvent:"+leftEvent+",rightEvent"+rightEvent);
		$$.hideLoading();
		if(!language){
			language = "zh";
		}
		var _domStr = null;
		if(code){
			_domStr = '<div id="popupWrap"><p id="popupTipWrap">'+popupTips[language][popupName]+code+'</p>';
		}else{
			_domStr = '<div id="popupWrap"><p id="popupTipWrap">'+popupTips[language][popupName]+'</p>';
		}
		
		var funNum = 0;
		if(leftEvent&&rightEvent){
			funNum = 2;
		}else if(leftEvent || rightEvent){
			funNum = 1;
		}
		var _funNum = null;
		var objOfFun = popupFuns[popupName];
		for(var fun in objOfFun){
			++_funNum;
		}
		funNum = Math.max(funNum,_funNum);
		//如果只有一个button的情况下
		if(1 == funNum){
			if("Back to Home" == popupBtnTips[language][popupName].leftBtnTip || "返回首页" == popupBtnTips[language][popupName].leftBtnTip){
				
				_domStr = _domStr + '<div id="popupBtnWrap"><button type="button" id="popupLeftBtn">'+popupBtnTips[language][popupName].leftBtnTip+'</button></div>';
			}else{
				_domStr = _domStr + '<div id="popupBtnWrap"><button type="button" id="popupLeftBtn" class="only-popup-btn">'+popupBtnTips[language][popupName].leftBtnTip+'</button></div>';
			}
		}else if(2 == funNum){
			_domStr = _domStr + '<div id="popupBtnWrap"><button type="button" id="popupLeftBtn">'+popupBtnTips[language][popupName].leftBtnTip+'</button><button type="button" id="popupRightBtn">'+popupBtnTips[language][popupName].rightBtnTip+'</button></div>';
		}else{
			$$.debug("button参数错误"+funNum);//提醒开发用的
		}
		mainMask[0].innerHTML = _domStr;
		mainMask.show();
		if(1 == funNum){
			$("#popupLeftBtn").off("click").on("click",function(){
				$$.debug("点击唯一的button");
				mainMask.hide();
				//如果函数是参数,存在的情况下
				if(leftEvent){
					$$.debug("执行leftEvent");
					leftEvent();
					$$.debug("leftEvent执行完毕");
				}
				popupFuns[popupName].leftBtnFun();
				$$.debug("唯一button的click事件结束");
			})
		}else if(2 == funNum){
			$("#popupLeftBtn").off("click").on("click",function(){
				$$.debug("点击左侧的button");
				mainMask.hide();
				if(leftEvent){
					$$.debug("执行leftEvent");
					leftEvent();
					$$.debug("leftEvent执行完毕");
				}
				popupFuns[popupName].leftBtnFun();
				$$.debug("左侧button的click事件结束");
			});
			$("#popupRightBtn").off("click").on("click",function(){
				$(this).addClass("disabled");
				//在retry的时候让客户视觉上知道点击了retry按钮
				if("canRety" == popupName.split("_")[1]){
					$$.debug("点击右侧的button");
					var timer = setTimeout(function(){
						mainMask.hide();
						if(rightEvent){
							$$.debug("执行rightEvent");
							rightEvent();
							$$.debug("rightEvent执行成功");
						}
						popupFuns[popupName].rightBtnFun();
						$$.debug("右侧button的click事件结束,有timeout");
						clearTimeout(timer);
					},800)
				}else{
					$$.debug("点击右侧的button");
					mainMask.hide();
					if(rightEvent){
						$$.debug("执行rightEvent");
						rightEvent();
						$$.debug("rightEvent执行成功");
					}
					popupFuns[popupName].rightBtnFun();
					$$.debug("右侧button的click事件结束");
				}
			});
		}else{
			$$.debug("参数错误");//提醒开发用的
		}
		$$.debug('return result params'+popupName+','+language+','+code+','+funNum);
	}
	return showPopup;
});
