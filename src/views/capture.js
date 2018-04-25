define(function (require) {
	var $ = require('jquery'),
		$$ = require('app/util'),
		model = require('./capture.model'),
		dialog = require('app/dialog/dialog'),
		template = require('text!./capture.template.html'),
		controller = require('./capture.controller'),
		imgViewer = require('viewer'),
		codeAndTip = require('../../codeAndTip'),
		popup=require('popup');
	var IMGWIDTH = 210;
	var customerID = '';
	var afterCollect = "accountType";
	var afterSubmit = "home"
	var continueDom = null;
	var submitDom  = null;
	var iframWrap = null;
	var mainMasker = null;
	var idCardNo = null;
	/**
	 * 对外暴露函数，用于视图加载
	 */
	var load = function () {
		$$.actionLog("enter capture page");
		render();
		bind();
		run();
	};

	/**
	 * 视图渲染
	 */
	function render() {
		controller.setModel(model);
		controller.setTemplate(template);
		controller.render($("#view-part-container")[0]);
	}
	
	/**
	 * 事件绑定
	 */
	function bind() {
		continueDom =$("#captureContinue");
		submitDom = $("#captureSubmit");
		modifyDom = $('#fileDeleteBtn');
		iframWrap = $("#iframeContainer");
		mainMasker = $("#pdfMainMask")
		colseIframBtn = $("#colseIframe");
		colseIframBtn.off('click').on("click",function(){
			iframWrap[0].innerHTML = '';
			$(this).hide();
			mainMasker.hide();
		})
		//点击拍照按钮
		$("#captureBtn").off("click").on("click",function(){
			if($(this).hasClass("disable")){
				return;
			}
			$$.showLoading();
			//打开摄像头后,"下一步","提交","退出"都不能点击
			continueDom.addClass("disabled").attr("disabled",true);
			submitDom.addClass("disabled").attr("disabled",true);
			modifyDom.addClass("disabled").attr("disabled",true);
			//打开摄像头（同步）
			controller.openResult(model.customer.idCardNo,function(){
				$$.hideLoading();
				continueDom.removeClass("disabled").attr("disabled",false);
				submitDom.removeClass("disabled").attr("disabled",false);
				modifyDom.removeClass("disabled").attr("disabled",false);
			});
		});  
		var fileInput = $("#uploadInput");
		var uploadBtn = $("#uploadBtn");
		//点击上传按钮
		$("#uploadBtn").off("click").on("click",function(){
			var _this = $(this);
			if(_this.hasClass("disable")){
				return;
			}
			fileInput.trigger("click");
		})
		fileInput.off("change").on("change",function(){
			var _fileVal = fileInput.val();
			if('' == _fileVal){
				return ;
			}else{
				modifyDom.addClass("disabled").attr("disabled",true);
			}
			uploadBtn.addClass("disable");
			var _fileName = _fileVal.split(".");
			var _suffix = _fileName[_fileName.length-1].toLowerCase( );
			if( fileInput && /^(doc|docx|jpg|png|pdf|xls|xlsx|xlsm)$/.test(_suffix)){
				var multipartFile = fileInput[0].files[0];
				var fileName = multipartFile.name;
				if(!/.*[\u4e00-\u9fa5]+.*$/.test(fileName)){
					$$.showLoading();
					controller.supportDocUpload(customerID, "exist").then(function(res,requestResult,XMLHTTPRequestResult) {
						//给c#设置token
				 		var token = XMLHTTPRequestResult.getResponseHeader("vtm-token-key");
						if(token){
				        	var result = window.external.Common.SetTokenValue(token);
				        	$$.debug("supportDocUpload设置token结果："+result);
						}
						fileInput.val('');
						if (codeAndTip.code.common.success == res.status && res.data && res.data.length > 0) {
							$$.debug('上传文件成功： ' + res.status);
							uploadBtn.removeClass("disable");
							var path = res.data[0][0];
							renderCapture(path);
						} else if (codeAndTip.code.capture.dupFileName == res.status) {
							$$.debug('同名文件： ' + res.status);
							var errType='duplicationFileName'
							var language = controller.getLocale();
							popup(errType,language)
							uploadBtn.removeClass("disable");
						}else if(codeAndTip.code.capture.emptyFile == res.status){
							$$.debug('文件大小为0KB： ' + res.status);
							var errType='fileEmpty'
							var language = controller.getLocale();
							popup(errType,language)
							uploadBtn.removeClass("disable");
						}else{
							$$.debug('上传文件失败： ' + res.status);
							var errType='uploadFailure'
							var language = controller.getLocale();
							popup(errType,language,"","",res.status);
							uploadBtn.removeClass("disable");
						}
						modifyDom.removeClass("disabled").attr("disabled",false);
						notEdit();
						$$.hideLoading();
					}, function(res) {
						modifyDom.removeClass("disabled").attr("disabled",false);
						$$.debug('上传文件请求失败： ' + JSON.stringify(res));
						fileInput.val('');
						uploadBtn.removeClass("disable");
		        		var errType='serviceError';
		    			var language = controller.getLocale();
		    			popup(errType,language);
						$$.hideLoading();
					});		
				}else{
					fileInput.val('');
					uploadBtn.removeClass("disable");
					var errType='fileNameError'
					var language = controller.getLocale();
					popup(errType,language,notEdit,null,null)
				}
			}else{
				var errType='formatError'
				var language = controller.getLocale();
				popup(errType,language,notEdit,null,null)
				
			}	
		})
		$("#refreshBtn").off("click").on("click",function(){
			var _this = $(this)
			if(_this.hasClass("disable")){
				return;
			}
			_this.addClass("disable");
			$$.debug("刷新获取文件列表")
			renderFiles();
		})
		//点击编辑按钮
		modifyDom.off("click").on("click",function(){
			$(".delete-icon-wrap").toggleClass('not-sow-del-wrap');
			$("#captureBtn,#uploadBtn").toggleClass("disable");
			$("#exitDeleteBtn").show();
			$("#refreshBtn").addClass("disable");
			continueDom.addClass("disable").attr("disabled",true);
			submitDom.addClass("disable").attr("disabled",true);
			$(this).hide();
		})
		//点击退出编辑按钮
		$("#exitDeleteBtn").off("click").on("click",function(){
			$(".delete-icon-wrap").toggleClass('not-sow-del-wrap');
			$("#captureBtn,#uploadBtn").toggleClass("disable");
			modifyDom.show();
			$("#refreshBtn").removeClass("disable");
			notEdit();
			continueDom.removeClass("disable").attr("disabled",false);
			submitDom.removeClass("disable").attr("disabled",false);
			$(this).hide();
		})
		//标记删除的按钮（图片顶部的圆圈，点击后变成红圈白X）
		$(".deleteFileFlag").off("click").on("click",function(e){
			$$.showLoading();
			var fileName = $(this).parent().parent().data("imgname");
			var fileNameArray = [];
			fileNameArray.push(fileName);
			var _this = this;
			$$.debug('capture页面文件删除： '+fileName);
			controller.deleteFile(customerID,fileNameArray).then(function(res){
				var status = res.status;
				if(res && res.status == codeAndTip.code.common.success){
					$(_this).parent().parent().remove();
					notEdit();
					$$.hideLoading();
				}else{
        			$$.debug('调用deleteFile接口异常：'+res.status);
        			var errType='deleteFileErr';
    				var language = controller.getLocale();
    				popup(errType,language);
        		}
			},function(res){
				$$.debug('capture页面文件删除失败： '+res.status);
				var errType='deleteFileErr';
				var language = controller.getLocale();
				popup(errType,language);
			})
			
		});
	}
	
	function clickOtherFiles(){
		$(".otherFiles").off("click").on("click",function(event){
			if($(event.target).hasClass("deleteFileFlag")){return;}
			iframWrap[0].innerHTML = ''
			var _iframSrc = $(this).find('a').data('otherfileurl');
			var splitWithDot = _iframSrc.split('.');
			var fileType = splitWithDot[splitWithDot.length-1].split('?d=')[0];
			var iframe = document.createElement("iframe");  
			if('PDF' == fileType.toUpperCase()){
				iframe.setAttribute("id","previewForPDF");
			    mainMasker.show();
			    colseIframBtn.show();
			}else{
				 iframe.style.display = "none"; 
			}
		    iframe.src = _iframSrc; 
		    iframWrap.append(iframe); 
		})
	}
	
	function run() {
		$("#js-exit").show();
		customerID = model.customer.idCardNo;
		$("#exitDeleteBtn").hide();
		renderFiles();
		if(afterCollect == window.captureNext){
			$$.statusStep(1,2);
			$$.updateCurrentStep({"idCardNo":model.customer.idCardNo,"stepData":"capture"}).then(function(res){
				$$.debug("updateCurrentStepSuceess--capture")
			},function(res){
				$$.debug("updateCurrentStepFail--capture:"+JSON.stringify(res))
			})
		}else if(afterSubmit == window.captureNext){
			$$.statusStep(7,4);
			$$.updateCurrentStep({"idCardNo":model.customer.idCardNo,"stepData":"captureSubmit"}).then(function(res){
				$$.debug("updateCurrentStepSuceess--capture")
			},function(res){
				$$.debug("updateCurrentStepFail--capture:"+JSON.stringify(res))
			})
		}
		//因为三个地方重复用了capture页面，因此在此将拍照和submit页面做了逻辑区分
		if(window.captureNext == "home"){
			submitDom.removeClass('disabled').attr("disabled",false);
			submitDom.show();
			continueDom.hide();
			submitDom.off("click").on("click", function () {
				$$.showLoading();
				$("#captureBtn").off("click");
				$("#uploadBtn").off("click");
				submitDom.addClass('disabled').attr("disabled",true);
				//更改视频状态,正常结束穿ture
				//controller.addVideoStatus(model.customer.idCardNo,true,model.customer.customerSession.idCardInfo.IDType);
				//location.hash = window.captureNext;
				var idCardType = model.customer.customerSession.idCardInfo.IDType;
				var idType = null;
				var numberValue = '';
				controller.captiva(customerID,idCardType,numberValue)
			});
		}else{
			submitDom.hide();
			continueDom.show();
			continueDom.off("click").on("click",function(){
				$$.beforChageHash().then(function(){
					location.hash = window.captureNext;
				})
			})
		}
		//激活图片预览功能
		$('.captureImg').viewer({
			url: 'data-path',
			navbar: false,
			scalable:false,
			movable:false,
			toolbar:false,
			tooltip:false
		});
	}
	//文件上传的失败处理
	function uploadExceptionHandel(code){
		if("FL0004" == code){
			popup("otherUploadImgError",controller.getLocale(),null,null,code);
		}else{
			popup("uploadImgError",controller.getLocale(),null,null,code);
		}
	}
	//拍照回调
	controller.cameraAsynCallBack({
		success:function(msg){
			continueDom.removeClass("disabled").attr("disabled",false);
			submitDom.removeClass("disabled").attr("disabled",false);
			var path = msg.FilePath;
			var pathArray = path.split("\\");
			var name = pathArray[pathArray.length-1];
			var _json = {
				"name":name,	
				"path":path
			}
			var jsonArry = [];
			jsonArry.push(_json);
			var uploadJson = {
					"files":jsonArry
			}
			$$.debug('capture页面拍照回调，调用上传接口前： '+path);
			//先执行上传的回调事件，再执行上传接口
			captureUploadCallback();
			var result = JSON.parse($$.uploadFile(customerID,uploadJson));
			if(codeAndTip.code.common.hardwareAvailable == result.hResult){
				$$.debug("MultFilesUpload同步执行成功");
			}else if(codeAndTip.code.common.hardwareFailure == result.hResult){
				$$.debug("MultFilesUpload同步执行失败");
				modifyDom.removeClass("disabled").attr("disabled",false);
				uploadExceptionHandel(result.errorCode);
				//popup("uploadImgError",controller.getLocale(),null,null,result.errorCode);
			}
		},
		cancel:function(msg){
			$$.debug("cameraAsynCallBack canceled");
			notEdit();
			continueDom.removeClass("disabled").attr("disabled",false);
			submitDom.removeClass("disabled").attr("disabled",false);
			$$.hideLoading();
		},
		error:function(msg){
			$$.debug("cameraAsynCallBack failed:"+msg.errorCode + "--" + msg.message);
			continueDom.removeClass("disabled").attr("disabled",false);
			submitDom.removeClass("disabled").attr("disabled",false);
			$$.hideLoading();
		}
	},customerID);

	//当没有文件的时候，编辑按钮不能点击
	function notEdit(){
		if(2 == $('#captureImgContainer>div').length){
			modifyDom.addClass('disabled');
			modifyDom.attr('disabled',true);
		}else{
			modifyDom.removeClass('disabled');
			modifyDom.attr('disabled',false);
		}
	}
	function reBindDelFun(){
		//给新添加的dom绑定事件
		$(".deleteFileFlag").off("click").on("click",function(e){
			$$.showLoading();
			var fileName = $(this).parent().parent().data("imgname");
			var fileNameArray = [];
			fileNameArray.push(fileName);
			var _this = this;
			controller.deleteFile(customerID,fileNameArray).then(function(res){
				var status = res.status;
				if(res && res.status == codeAndTip.code.common.success){
					$(_this).parent().parent().remove();
					notEdit();
					$$.hideLoading();
				}else{
        			$$.debug('调用deleteFile接口异常：'+res.status);
        			var errType='deleteFileErr';
    				var language = controller.getLocale();
    				popup(errType,language);
        		}	
			},function(res){
				$$.debug('调用deleteFile服务异常：'+res.status);
				var errType='deleteFileErr';
				var language = controller.getLocale();
				popup(errType,language);
			})
		})
	}
	//刷新加载图片文件
	function renderCapture(path){
		var _pathArray = path.split("/");
		var _fileName = _pathArray[_pathArray.length-1];
		var fileNameSplit = _fileName.split(".");
		var suffix = fileNameSplit[fileNameSplit.length-1].toLowerCase();
		path = path+"?d="+(new Date()).getTime();
		var _domStr = null;
		if("doc" == suffix || "docx" == suffix){
			_domStr = '<div class="otherFiles" data-imgName="'+_fileName+'"><div class="delete-icon-wrap not-sow-del-wrap"><i class="deleteFileFlag icon deleteFlag"></i></div><a data-otherfileurl="'+path+'"target="_blank"><img src="images/app/capture/icon_word.png" class="imgViewer" style="width:'+IMGWIDTH+'px"><div class="captureFileName">'+_fileName+'</div></a></div>'
			$("#uploadBtn").after(_domStr);
		}else if("xlsx" == suffix || "xls" == suffix){
			_domStr = '<div class="otherFiles" data-imgName="'+_fileName+'"><div class="delete-icon-wrap not-sow-del-wrap"><i class="deleteFileFlag icon deleteFlag"></i></div><a data-otherfileurl="'+path+'"target="_blank"><img src="images/app/capture/icon_excel.png" class="imgViewer" style="width:'+IMGWIDTH+'px"><div class="captureFileName">'+_fileName+'</div></a></div>'
			$("#uploadBtn").after(_domStr);
		}else if("pdf" == suffix){
			var filePdfName = _fileName.split(".")[0];
			//判断签过名的pdf不能被删除
			if(filePdfName && /^SmartForm_signed$/.test(filePdfName)){
				_domStr = '<div class="otherFiles" data-imgName="'+_fileName+'"><a data-otherfileurl="'+path+'"target="_blank"><img src="images/app/capture/icon_pdf.png" class="imgViewer" style="width:'+IMGWIDTH+'px"><div class="captureFileName">'+_fileName+'</div></a></div>'

			}else{
				_domStr = '<div class="otherFiles" data-imgName="'+_fileName+'"><div class="delete-icon-wrap not-sow-del-wrap"><i class="deleteFileFlag icon deleteFlag"></i></div><a data-otherfileurl="'+path+'"target="_blank"><img src="images/app/capture/icon_pdf.png" class="imgViewer" style="width:'+IMGWIDTH+'px"><div class="captureFileName">'+_fileName+'</div></a></div>'
			}
			$("#uploadBtn").after(_domStr);
		}else if("jpg" == suffix || "png" == suffix || "tif" == suffix){
			if("tif" == suffix || _fileName == (model.customer.idCardNo+"_IDcheck.jpg")){
				_domStr = '<div class="captureImg" data-imgName="'+_fileName+'"><img src="'+path+'" class="imgViewer" style="width:'+IMGWIDTH+'px"></div>'
			}else{
				_domStr = '<div class="captureImg" data-imgName="'+_fileName+'"><div class="delete-icon-wrap not-sow-del-wrap"><i class="deleteFileFlag icon deleteFlag"></i></div><img src="'+path+'" class="imgViewer" style="width:'+IMGWIDTH+'px"></div>'
			}
			
			$("#uploadBtn").after(_domStr);
			//激活图片预览功能
			$('.captureImg').viewer({
				url: 'data-path',
				navbar: false,
				scalable:false,
				movable:false,
				movable:false,
				toolbar:false
			});
		}
		reBindDelFun();
		clickOtherFiles();
	}
	/*刷新图片*/
	function renderFiles(){
		controller.refreshList(customerID).then(function(res,requestResult,XMLHTTPRequestResult){ 
			//给c#设置token
 			var token = XMLHTTPRequestResult.getResponseHeader("vtm-token-key");
			if(token){
	        	var result = window.external.Common.SetTokenValue(token);
	        	$$.debug("supportDocUpload设置token结果："+result);
			}
			var status = res.status;
     		if(res && res.status == codeAndTip.code.common.success){
     			$$.debug("刷新获取文件列表成功"+res.status);
    			$("#refreshBtn").removeClass("disable");
    			$(".captureImg").remove();
    			$(".otherFiles").remove();
    			var path = [];
    			path = res.data;
    			path.forEach(function(item){
    				renderCapture(item);
    			});
    			 notEdit()
     		}else{
     			$$.debug('调用refreshList接口异常：'+res.status);
     			var errType='serviceError';
 				var language = controller.getLocale();
 				popup(errType,language);
     		} 
		},function(err){
			$$.debug("刷新获取文件列表失败"+JSON.stringify(err));
			$("#refreshBtn").removeClass("disable");
			var errType='serviceError';
			var language = controller.getLocale();
			popup(errType,language);
		});
	}
	
	function captureUploadCallback(){
		window.CommonBridgeAsynCallBack = function(type,msg){
			if("MultFilesUpload" == type){
				var _msg = JSON.parse(msg);
				if(codeAndTip.code.common.hardwareAvailable == _msg.hResult){
					var _status = JSON.parse(_msg.data).status;
					if(codeAndTip.code.common.success == _status){
						$$.debug('capture页面开始上传 ');
						path = JSON.parse(_msg.data).data[0][0];
						var _pathArray = (JSON.stringify(path)).split("/");
						var _fileName = _pathArray[_pathArray.length-1];
						
						//var _domStr = '<div class="captureImg" data-imgName="'+_fileName+'"><i class="deleteFileFlag icon"></i><img src="'+path+'" class="imgViewer" style="width:'+IMGWIDTH+'px"><div class="captureFileName">'+_fileName+'</div></div>'
						var _domStr = '<div class="captureImg" data-imgName="'+_fileName+'"><div class="delete-icon-wrap not-sow-del-wrap"><i class="deleteFileFlag icon deleteFlag"></i></div><img src="'+path+'" class="imgViewer" style="width:'+IMGWIDTH+'px"></div>'
						$("#uploadBtn").after(_domStr);
						notEdit();
						$(".deleteFileFlag").off("click").on("click",function(){
							$(this).toggleClass("deleteFlag");
						});
						modifyDom.removeClass("disabled").attr("disabled",false);
						$('.captureImg').viewer({
							url: 'data-path',
							navbar: false,
							scalable:false,
							movable:false,
							toolbar:false,
							tooltip:false
						});
						reBindDelFun();
						$$.debug('capture页面上传成功 ');
					}else{
						$$.debug("java上传接口调用成功，上传失败,msg:"+msg);
						uploadExceptionHandel(_status);
						//popup("uploadImgError",controller.getLocale(),null,null,_status);
					}
					$$.hideLoading();
				}else if(codeAndTip.code.common.hardwareFailure == _msg.hResult){
					$$.debug("上传方法失败,上传失败，msg："+msg);
					uploadExceptionHandel(_msg.errorCode);
					//popup("uploadImgError",controller.getLocale(),null,null,_msg.errorCode);
				}
			}else if("AsyncDeleteDirsAndFiles" == type){
				$$.debug("删除smp的PDF的回调     AsyncDeleteDirsAndFiles  1");
			}
		}
	}
	return {
		load: load
	};
});
