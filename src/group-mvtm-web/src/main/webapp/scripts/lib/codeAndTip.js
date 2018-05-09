define([],function() {
   var codeAndTip = {
	   code:{
	       common:{
	       	   success:"000",
	       	   error:"999",
	       	   hardwareAvailable:"WFS_SUCCESS",
	       	   hardwareFailure:"WFS_ERROR",
	       	   hardwareCancel:"WFS_CANCEL"
	       },
	       login:{
	    	   acountError:"LG0001" //返回status为LG0001,没有data,账号或密码错误
	       },
	       capture:{
	       		dupFileName:"EX0002",//重名文件
	       		emptyFile:"FL0002",//文件大小为0KB
	       },
	       idNo:{
	       		requireNo:"Il0001",//需要输入卡号
	       		requireStatusEr:"CM0001"//未检测到预注册
	       		
	       },
	       openFileForSign:{
	    	   stopComplete:"StopComplete",
	    	   pdFUpLoad:"PDFUpLoad",
	    	   redo:"Redo",
	    	   signComplete:'SignComplete',
	    	   pdfError:'Error'
	       },
	       //在codeAndTip中也有用到
	       readyTurnOnCamera:{
	    	   openComplete:"OpenComplete",
	    	   startComplete:"StartComplete",
	    	   stopComplete:"StopComplete",
	    	   errorEvent:"ErrorEvent"
	       },
		   scanid:{
			   requireCard: "Il0001",//身份证卡必须
	           MediaInsertedEvent: "MediaInsertedEvent",//身份证插入事件
	           ReadCardComplete: "ReadCardComplete",//身份证读取完成事件
	           MediaRemovedEvent: "MediaRemovedEvent",//身份证取走事件
	           MediaInserted: "WFS_EXEE_IDC_MEDIAINSERTED",
	           HardwareErrorEvent: "HardwareErrorEvent",
	           IDCHardwareError: "WFS_ERR_HARDWARE_ERROR",
	           ReadRawData: "WFS_CMD_IDC_READ_RAW_DATA",
	           InvalidMedia: 'WFS_ERR_IDC_INVALIDMEDIA',
	           TimeOut: 'WFS_ERR_TIMEOUT',
	           cardinvalidRetry: "invalidRetry",
	           cardRetryFail: "invalid",
	           cardinvalidAge:"invalidAge",
	           cardinvalidCard: "invalidCard",
	           DeviceStatusEvent: "DeviceStatusEvent",
	           DeviceStatusOFFline: "WFS_STAT_DEVOFFLINE",
	           DeviceStatusONline: "WFS_STAT_DEVONLINE",
	           DeviceName: "IDCardReader",
	           idCardType: "I"
		   },
		   understandTnc:{
			   notRegPreFill: "CM0001"//CM0001:用户未预注册或者预注册已过期
		   },
		   showIdcard:{
			   GTZerror: "ID50001"//ID50001:后台请求国政通失败
		   },
		   prefillState:{
			   Read: "Y" //prefill已读pdf
		   },
		   customerSession:{
			   alredyExit:"CM0002",
			   notFound:"CM0001"
		   },
		   sacnBankCard:{
			   ReadRawDataComplete:"ReadRawdataComplete",
			   DeviceName:"STCardReader",
			   scanBankHandwareError:"WFS_ERR_HARDWARE_ERROR"
		   },
		   enterPassword:{
			   pinKeyEvent:"PinkeyEvent",
			   pinKeyCode:"WFS_EXEE_PIN_KEY",
			   getPinDataEvent:'GetDataComplete',
			   getPinDataCode:'WFS_CMD_PIN_GET_DATA',
			   getPinDataCompEnter:'WFS_PIN_COMPENTER',
			   getPinDataCompClear:'WFS_PIN_COMPCLEAR',
			   getPinDataInfo:"WFS_PIN_COMPCONTINUE ",
			   enterPasswordHandwareError:"WFS_ERR_HARDWARE_ERROR"
		   }
	   },
	   tip:{
	       idNo:{
	       		userNotExist:"This user does not exist",//用户不存在
	       }
	   }
   }
   return codeAndTip;
});
