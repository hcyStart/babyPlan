define(function(require) {
    var $ = require('jquery'),
        $$ = require('app/util'),
        model = require('./accountType.model'),
        template = require('text!./accountType.template.html'),
        controller = require('./accountType.controller'),
    	popup = require('../../popup'),
	    codeAndTip = require('../../codeAndTip');
    /**
     * 对外暴露函数，用于视图加载
     */
    var load = function() {
        $$.actionLog("enter accountType page");
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
    	var accountTypeNextBtn = $("#accountType-next");
        $(".select-cards").off().on("click", function(event) {
            event.preventDefault();          
            // 保存信息
            $('.select-cards').find('input').removeProp('checked');
            accountTypeNextBtn.removeClass("disabled").attr("disabled",false);;
            $(this).find('input').prop('checked', true);
        });

        accountTypeNextBtn.off().on("click", function() {//debugger;
            if ($("#advance-card").prop("checked") || $("#premier-card").prop("checked")||$("#staffPremier-card").prop("checked")){
            	
            	//accountTypeNextBtn.attr("disabled",true);
                // 保存卡信息
                var selectCardArr = $(".select-cards").find('input');
                for(var i = 0; i < selectCardArr.length; i++){
                    if(true == selectCardArr[i].checked){
                        model.setAccountType($(selectCardArr[i]).attr("data-type"));
                    }
                }
                model.customer.accountType = model.accountType;
                location.hash = "scanBankCard";
                /*controller.updateAccountType().then(function(res){ 	
                	 if(codeAndTip.code.common.success == res.status){
                		 $$.debug('更新卡种类成功 ，更新成功  :'+ res.status);
                		 model.customer.accountType = model.accountType;
            			 $$.beforChageHash().then(function(){
            				 location.hash = "scanBankCard";
        				 })
                	 }else if(codeAndTip.code.customerSession.notFound == res.status){
                 		$$.debug('更新卡类型时，信息未找到'+ res.status);
						var errType='serviceError';
						var language = controller.getLocale();
						popup(errType,language); 
                	 }else{
                		$$.debug('更新卡种请求成功，但是更新失败  :'+ res.status);
						var errType='serviceError';
						var language = controller.getLocale();
						popup(errType,language);
                	 }
                	 
                },function(err){
                	accountTypeNextBtn.attr("disabled",false);
	                 $$.debug('更新卡种类失败   :'+ JSON.stringify(err));
	            }); */               
            }
        });
 
        //点击卡种类中问"问号"弹出相应的"申请资格"
        $('#premierDetailQuestionMark').on('click',function(){$('#advanceDetail,#advanceDetailForZH').hide();$('#premierDetail').show();});
        $('#advanceDetailQuestionMark').on('click',function(){$('#premierDetail').hide();$('#advanceDetail,#advanceDetailForZH').show();});
        //当有"申请资格"弹框出现的时候,点击当前页面(不包含header,main-lefter,main-righter)则关闭"申请资格"弹框
        $('#accountDeatilContainer').on('click',function(e){
            if('block'==$('#premierDetail').css('display')||'block'==$('#advanceDetail').css('display')||'block'==$('#advanceDetailForZH').css('display')){
                if(!$(e.target).hasClass('question-mark')&&!$(e.target).hasClass('account-detail')){
                    $('#advanceDetail,#advanceDetailForZH').hide();
                    $('#premierDetail').hide()
                }
            }
        })
    }
    function run() {
        $$.statusStep(2,1);
      //重写扫描银行卡页面防止它在别的页面弹出框
		 window.TrackReaderAsyncCallBack = function (){}
        if('zh'==controller.getLocale()){
        	$('#advanceDetail').attr('id','advanceDetailForZH');
        }
		$$.updateCurrentStep({"idCardNo":model.customer.idCardNo,"stepData":"accountType"}).then(function(res){
			$$.debug("updateCurrentStepSuceess--accountType")
		},function(res){
			$$.debug("updateCurrentStepFail--accountType:"+JSON.stringify(res))
		})
        $("#js-exit").show();
    }

    return {
        load: load
    };
});
