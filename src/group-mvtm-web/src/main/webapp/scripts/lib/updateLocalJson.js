/**
 * type的内容有:
 * 1.customerSession : customerSession
 * 2.上传文件或拍照文件 : files
 * 3.所有文件是否有效(判断是否需要上传) : allowUploadFlag
 *   
 * key的内容有:
 * 1.证件类型 : IDType
 * 2.证件号码 : idCardNo
 * 3.预注册信息 : prefillState
 * 4.银行卡类型 : accountType
 * 5.电话银行需求 : selectPhoneBanking
 * 6.银行卡号 : cardNumber
 * 7.银行加密卡号 : issueNumber
 * 8.systemResume页面 : stepData
 */

define([],function() {
   var localFile = {};
   //获取该js的全局变量证件号码
   localFile.setGlobalAttr = function(idNo){
	   if(localFile.identityNumber){
		   return 
	   }else{
		   localFile.identityNumber = idNo;
	   }
   }
   //初始化json
   localFile.initLocalRecords = function(){
	   window.jsonData = {
			"customerSession":{},
			"files":{},
			"allowUploadFlag":false,
	    }
	   localFile.identityNumber = null;
	   localFile.wirteJson(window.jsonData);
	   return window.jsonData
   }
   //在初始化的基础上增加或修改一个属性(三个Type已经确定)
   localFile.uploadAttr = function(type,key,value){
	   if(!window.jsonData){
		   localFile.initLocalRecords();
	   }
	   window.jsonData[type][key] = value;
	   localFile.wirteJson(window.jsonData);
	   return window.jsonData;
   }
   //一次性更新同一个Type 下的多个属性,dataObj是一个json
   localFile.uploadMulAttrs = function(type,dataObj){
	   if(!window.jsonData){
		   localFile.initLocalRecords();
	   }
	   for(var key in dataObj){
		   window.jsonData[type][key] = dataObj[key];
	   }
	   localFile.wirteJson(window.jsonData);
	   return window.jsonData;
   }
   //删除某个属性
   localFile.removeAttr =  function(type,key){
	   if(type && key && window.jsonData && ("customerSession" == type || "files" == type || "allowUploadFlag" == type)){
		    delete window.jsonData[type][key]
			if(localFile.wirteJson(window.jsonData)){
				return window.jsonData;//删除成功
			};
	   }else{
		   alert("参数错误");
	   }
   }
   //确认此份文件需要上传
   localFile.confirmUpload = function(){
	   window.jsonData.allowUploadFlag = true;
	   localFile.wirteJson(window.jsonData);
	   return window.jsonData;
   }
   
   localFile.getLocalJson = function(){
	   window.jsonData = localFile.readJson();
	   if(window.jsonData ){
		   return window.jsonData;
	   }else{
		   return localFile.initLocalRecords();
	   }
   }
   
   localFile.destroyJson = function(){
	   window.jsonData = null;
	   localFile.wirteJson(null);
   }
   
   localFile.wirteJson = function(jsonData){
	   var _str = JSON.stringify(jsonData);
	   window.localStorage.setItem("offLineTest",_str);
   }
   
   localFile.readJson = function(){
	  var str = window.localStorage.getItem("offLineTest");
	  return JSON.parse(str);
   }
   
   return localFile;
});
