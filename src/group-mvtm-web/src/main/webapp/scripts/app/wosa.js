define(['./util'], function ($$) {
	var ext = window.external;

	/****************************************身份证扫描器****************************************/

	/**
	 * 获取身份证读卡器的状态信息
	 * @param   {number}    timeout     超时时间(ms)
	 * @returns {string}                函数执行结果，不包含数据信息
	 */
	function getIDCardReaderStatusAsync() {
		var result = ext.IdCardReader.SyncStatus();
		$$.debug('enter method [getIDCardReaderStatusAsync] : ' + result);
		return result;
	}
	/**
	 * 取消身份证扫描
	 * @returns {string}                函数执行结果，不包含数据信息
	 */
	function IdcAsyncCancel() {
		$$.debug('enter method [AsyncCancel]');
		var result = ext.IdCardReader.AsyncCancel();
		$$.debug('enter method [IdcAsyncCancel] : ' + result);
		return result;
	}

	/**
	 * 读取身份证信息
	 * @param   {number}    timeout     超时时间(ms)
	 * @returns {string}                函数执行结果，不包含数据信息
	 */
	function readIDCardDataAsync(timeout) {
		$$.debug('enter method [readIDCardDataAsync] 读取身份证超时时间'+ timeout);
		var result = ext.IdCardReader.AsyncScanIdPassport(timeout);
		$$.debug('enter method [readIDCardDataAsync]');
		return result;
	}

	/**
	 * 重置身份证读卡器
	 * @param   {number}    timeout     超时时间(ms)
	 * @returns {string}                函数执行结果，不包含数据信息
	 */
	function resetIDCardReaderAsync(timeout) {
		var result = ext.IdCardReader.AsyncReset(timeout);
		$$.debug('enter method [resetIDCardReaderAsync] : ' + result);		
		return result;
	}

	/**
	 * 异步退出身份证
	 * @param   {number}    timeout     超时时间(ms)
	 * @returns {string}                函数执行结果，不包含数据信息
	 */
	function ejectIDCardReaderAsync(timeout) {
		 var  result = ext.IdCardReader.AsyncEjectCard(timeout);
		 $$.debug('return [ejectIDCardReaderAsync] : ' + result);
		 return result;
	}
	/**
	 * 设置底层PDF的语言
	 * @param   {string}    language     语言类型[中文:zh-CN;英文:en-US]
	 * @returns {string}                函数执行结果，不包含数据信息
	 */
	function setHandWareLanguageAsync(language) {
		$$.debug('enter method [setHandWareLanguageAsync]'+language);
	   var  result = ext.Common.SetLanguage(language);
	    $$.debug('return [setHandWareLanguageAsync] : ' + result);
		 return result;
	}
	/*
	 * 背甲连接身份证硬件
	 *
	 */
		/**
		 * 设置底层PDF的语言
		 * 
		 * @returns {string}                函数执行结果，不包含数据信息
		 */
		function asyncGetIDCardInfo() {
			$$.debug('enter method [asyncGetIDCardInfo]');
		    var  result = ext.MT3Y.AsyncGetIDCardInfo();
		    $$.debug('return [asyncGetIDCardInfo] : ' + result);
			return result;
			
		}
		
	    window.AsyncGetIDCardInfoCallBack = function (handWareResult) {
			$$.debug('enter method [AsyncGetIDCardInfoCallBack] : handWareResult:'+ handWareResult);
		};
	//身份证监听事件
    window.IdCardReaderAsynCallBack = function (type,handWareResult) {
		$$.debug('enter method [IdCardReaderAsynCallBack] : type:'+ type+' handWareResult:'+ handWareResult);
	};

	//摄像头的回调事件,因为录像功能的启动的结束在整个流程中只调用了一遍,因此不需要特殊处理
    window.RecordAsynCallBack = function (type,handWareResult) {
		$$.debug('enter method [RecordAsynCallBack] : type:'+ type+' handWareResult:'+ handWareResult);
	};

	/**
	 * 打开录屏工具
	 * @param   {Num}         视频窗口展示的位置(距上,距左)
	 * @returns {string}      函数执行结果(成功或失败)，不包含数据信息
	 */
	function asyncOpenRecord(top,left) {
		$$.debug('enter method [openRecord]');
	    var  result = ext.Record.AsyncOpenRecord(top,left);
	    $$.debug('return [openRecord] : ' + result);
		return result;
	}

	/**
	 * 开始录屏(异步接口)
	 * @param   {num,string,num}         证件类型,业务类型,staffID
	 * @returns {string}      函数执行结果(成功或失败)，不包含数据信息
	 */
	function asyncStartRecord(id, BusinessType, StaffID) {
		$$.debug('enter method [asyncStartRecord]');
	    var  result = ext.Record.AsyncStartRecord(id, BusinessType, StaffID);
	    $$.debug('return [asyncStartRecord]');
		return result;
	}
	
	/**
	 * 停止录像并生成视频(异步接口)
	 */
	function asyncStopRecord() {
		$$.debug('enter method [asyncStopRecord]');
	    var  result = ext.Record.AsyncStopRecord();
	    $$.debug('return [asyncStopRecord] : ' + result);
		return result;
	}
	
	/**
	 * 关闭摄像头
	 */
	function closeRecord() {
		$$.debug('enter method [closeRecord]');
	    var  result = ext.Record.CloseRecord();
	    $$.debug('return [closeRecord] : ' + result);
		return result;
	}
	/**
	 *打开需要签名的PDF
	 */
	function smpPdfSignature(id){
		$$.debug('enter method [smpPdfSignature]');
	    var  result = ext.PDF.SMPPDFSignature(id);
	    $$.debug('return [smpPdfSignature] : ' + result);
		return result;
	}
	/**
	 *关闭需要签名的PDF
	 */
	function closePDFViewer(){
		$$.debug('enter method [closePDFViewer]');
	    var  result = ext.PDF.ClosePDFViewer();
	    $$.debug('return [closePDFViewer] : ' + result);
		return result;
	}
	/**
	 * 删除本地视频
	 */
	function clearTempFile(){
		$$.debug('enter method [clearTempFile]');
	    var  result = ext.Record.ClearTempFile();
	    $$.debug('return [clearTempFile] : ' + result);
		return result;
	}
	/**
	 * 获取设备信息
	 */
	function GetTerminalInfo(){
		$$.debug('enter method [GetTerminalInfo]');
	    var  result = ext.Common.GetTerminalInfo();
	    $$.debug('return [GetTerminalInfo] ');
		return result;
	}
	/**
	 * 检查pdf接口是否完好
	 */
	function CheckSMPPDFisReady(idCardNo){
		$$.debug('enter method [CheckSMPPDFisReady]');
	    var  result = ext.PDF.CheckSMPPDFisReady(idCardNo);
	    $$.debug('return [CheckSMPPDFisReady] ');
		return result;
	}	
	/**
	 * 录像状态标识.在录像正常完成的情况下,submit页面调用时,bIsValid为true,异常退出的情况下bIsValid为false
	 * 参数1 string,参数2 bool
	 */
	function addVideoStatus(idNo,isValid){
		$$.debug('enter method [addVideoStatus] status:'+isValid);
	    var  result = ext.Record.AddVideoStatus(idNo,isValid);
	    $$.debug('return [addVideoStatus] : ' + result);
		return result;
	}
	/**
	 * 当屏幕分辨率变大时,调用该接口让app恢复原分辨率
	 */
	function restoreZoom(){
		$$.debug('enter method [RestoreZoom]');
	    var  result = ext.Common.RestoreZoom();
	    $$.debug('return [RestoreZoom],result'+result);
		return result;
	}
	/**
	 * 删除SMP所生成的PDF
	 */
	function deleteSMPPDF(path){
		$$.debug('enter method [AsyncDeleteDirsAndFiles]');
	    var  result = ext.common.AsyncDeleteDirsAndFiles(path);
	    $$.debug('return [AsyncDeleteDirsAndFiles] : ' + result);
		return result;
	}
	/**
	 *  删除临时文件 
	 */
	function asyncDeleteTempFiles(){
		$$.debug('enter method [asyncDeleteTempFiles]');
	    var  result = ext.Common.AsyncDeleteTempFiles();
	    $$.debug('return [asyncDeleteTempFiles] : ' + result);
		return result;
	}
	/**
	 * 拍照功能--打开摄像头
	 */
	function cameraStart(){
		$$.debug('enter method [cameraStart]');
	    var  result = ext.Camera.Start();
	    $$.debug('return [cameraStart] : ' + result);
		return result;
	}
	/**
	 * 上传视屏功能--开始异步上传文件 
	 */
	function videoStartSFTPUpload(){
		$$.debug('enter method [videoStartSFTPUpload]');
	    var  result = ext.SFTPUpload.AsyncStartSFTPUpload();
	    $$.debug('return [videoStartSFTPUpload] : ' + result);
		return result;
	}
	/**
	 * 上传视屏功能功能--获取当前状态
	 */
	function videoUploadGetStatus(){
		$$.debug('enter method [videoUploadGetStatus]');
	    var  result = ext.SFTPUpload.GetStatus();
	    $$.debug('return [videoUploadGetStatus] : ' + result);
		return result;
	}
	/**
	 * 上传视屏功能功能--停止上传
	 */
	function videoStopUpload(){
		$$.debug('enter method [videoStopUpload]');
	    var  result = ext.SFTPUpload.StopUpload();
	    $$.debug('return [videoStopUpload] : ' + result);
		return result;
	}
	/**
	 *拍照功能下，关闭摄像头 
	 **/
	function closeCamra(){
		$$.debug('enter method [closeCamra]');
	    var  result = ext.Camera.Close();
	    $$.debug('return [closeCamra] : ' + result);
		return result;
	}
	
	
	/****************************************银行卡读卡器****************************************/
	
	/**
	 * 获取银行卡读卡器的状态信息
	 * 
	 * @returns {string}                函数执行结果，不包含数据信息
	 */
	function getTrackReaderStatusAsync() {
		var result = ext.TrackReader.SyncStatus();
		$$.debug('enter method [getTrackReaderStatusAsync] result : ' + result);
		return result;
	}
	/**
	 * 取消所有银行卡扫描
	 * @returns {string}                函数执行结果，不包含数据信息
	 */
	function trackReaderAsyncCancel() {
		var result = ext.TrackReader.AsyncCancel();
		$$.debug('enter method [trackReaderAsyncCancel]  result : ' + result);
		return result;
	}

	/**
	 * 读取银行卡卡号信息
	 * @param   {number}    timeout     超时时间(ms)
	 * @returns {string}                函数执行结果，不包含数据信息
	 */
	function readAsyncReadRawDataAsync(track,timeout) {
		$$.debug('enter method [readAsyncReadRawDataAsync] 刷卡磁道， 读取银行卡超时时间'+track+","+ timeout);
		var result = ext.TrackReader.AsyncReadRawData(track,timeout);
		$$.debug('enter method [readAsyncReadRawDataAsync]  result');
		return result;
	}

	/**
	 * 重置银行卡读卡器
	 * 
	 * @returns {string}                函数执行结果，不包含数据信息
	 */
	function resetTrackReaderAsync() {
		$$.debug('enter method [resetTrackReaderAsync] ');
		var result = ext.TrackReader.AsyncReset();
		$$.debug('enter method [resetTrackReaderAsync] result : ' + result);		
		return result;
	}
	//银行卡异步回调事件
	 window.TrackReaderAsyncCallBack = function (type,handWareResult) {
			$$.debug('enter method [TrackReaderAsyncCallBack] : type:'+ type);
	};
	
	/****************************************密码键盘****************************************/

	/**
	 * 同步获取密码键盘的状态信息
	 * 
	 * @returns {string}                函数执行结果，不包含数据信息
	 */
	function getPinpadStatusSync() {
		$$.debug('enter method [getPinpadStatusSync]');
		return result = ext.Pinpad.SyncStatus();
		$$.debug('enter method [getPinpadStatusSync] : ' + result);
	}

	/**
	 * 重置密码键盘状态
	 * @returns {string}                函数执行结果，不包含数据信息
	 */
	function resetPinpadStatusAsync() {
		$$.debug('enter method [getPinpadStatusSync]');
		return result = ext.Pinpad.AsyncReset();
		$$.debug('enter method [resetPinpadStatusAsync] : ' + result);
	}

	/**
	 * 激活密码键盘，等待输入
	 * @param   {number}    usMaxLen      最大输入长度
	 * @param   {number}    bAutoEnd     到达长度时，是否自动结束 {0: 需手动确认 | 1: 自动结束}
	 * @param   {number}    timeout     超时时间(ms)
	 * @returns {string}                函数执行结果，不包含数据信息
	 */
	function getPinpadDataAsync(usMaxLen,bAutoEnd,strActiveKeys,strTerminateKeys,timeout) {
		$$.debug('enter method [getPinpadDataAsync]  超时时间:'+usMaxLen+','+bAutoEnd+','+timeout);
		return result = ext.Pinpad.AsyncGetData(usMaxLen,bAutoEnd,strActiveKeys,strTerminateKeys,timeout);
		$$.debug('return method [getPinpadDataAsync] : ' + result);
	}
	
	/**
	 * 取消密码键盘输入
	 * @returns {string}                函数执行结果，不包含数据信息
	 */
	function PinAsyncCancel() {
		$$.debug('enter method [PinAsyncCancel]');
		return result = ext.Pinpad.AsyncCancel();
		$$.debug('return method [PinAsyncCancel] : ' + result);
	}
	
	/**
	 * 软加密获取卡密码密文 
	 * @param   {string}    strPassword      密码明文
	 * @param   {string}    strCardNo    卡号
	 * @returns {string}                函数执行结果，不包含数据信息
	 */
	function getCardSecretKey(strPassword,strCardNo) {
		$$.debug('enter method [getCardSecretKey]');
		return result = ext.Pinpad.GetCardSecretKey(strPassword,strCardNo);
		$$.debug('return method [getCardSecretKey]');
	}
	
	/**
	 * 软加密获取phoneBank密码密文 
	 * @param   {string}    strPassword      密码明文
	 * @param   {string}    strPBN   pbn
	 * @returns {string}                函数执行结果，不包含数据信息
	 */
	function getTeleSecretKey(strPassword,strPBN) {
		$$.debug('enter method [getTeleSecretKey]');
		return result = ext.Pinpad.GetTeleSecretKey(strPassword,strPBN);
		$$.debug('return method [getTeleSecretKey]');
	}
	
	//密码键盘异步回调事件
	window.PinAsyncCallBack =  function (type,handWareResult) {
			$$.debug('enter method [PinAsyncCallBack] : type:'+ type);
	};
	/**
	 * 传递token给c#
	 * @param   {string}    strTokenValue     
	 */
	function setTokenValue(token) {
		$$.debug('enter method [setTokenValue]');
	   var  result = ext.Common.SetTokenValue(token);
	    $$.debug('return [setTokenValue] ');
		 return result;
	}
	return {
		getIDCardReaderStatusAsync: getIDCardReaderStatusAsync,
		readIDCardDataAsync: readIDCardDataAsync,
		IdcAsyncCancel: IdcAsyncCancel,
		resetIDCardReaderAsync: resetIDCardReaderAsync,
		ejectIDCardReaderAsync: ejectIDCardReaderAsync,
		asyncGetIDCardInfo: asyncGetIDCardInfo,
		setHandWareLanguageAsync: setHandWareLanguageAsync,
		asyncOpenRecord:asyncOpenRecord,
		asyncStartRecord:asyncStartRecord,
		asyncStopRecord:asyncStopRecord,
		closeRecord:closeRecord,
		smpPdfSignature:smpPdfSignature,
		closePDFViewer:closePDFViewer,
		clearTempFile:clearTempFile,
		GetTerminalInfo:GetTerminalInfo,
		CheckSMPPDFisReady:CheckSMPPDFisReady,
		addVideoStatus:addVideoStatus,
		restoreZoom:restoreZoom,
		deleteSMPPDF:deleteSMPPDF,
		asyncDeleteTempFiles:asyncDeleteTempFiles,
		cameraStart:cameraStart,
		videoStartSFTPUpload:videoStartSFTPUpload,
		videoUploadGetStatus:videoUploadGetStatus,
		videoStopUpload:videoStopUpload,
		closeCamra:closeCamra,
		getTrackReaderStatusAsync: getTrackReaderStatusAsync,
		trackReaderAsyncCancel: trackReaderAsyncCancel,
		readAsyncReadRawDataAsync: readAsyncReadRawDataAsync,
		resetTrackReaderAsync: resetTrackReaderAsync,
		getPinpadStatusSync: getPinpadStatusSync,
		resetPinpadStatusAsync: resetPinpadStatusAsync,
		getPinpadDataAsync: getPinpadDataAsync,
		PinAsyncCancel: PinAsyncCancel,
		getCardSecretKey:getCardSecretKey,
		getTeleSecretKey:getTeleSecretKey,
		setTokenValue:setTokenValue
	}
});
