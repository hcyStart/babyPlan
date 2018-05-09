define(['../BaseModel'], function (Base) {
    var model = new Base('dialog model');
    model.locale = {
        'en': {
            'backHome-header': 'Back to home',
            'backHome-container': 'Are you sure you want to return to the home page?',
            'backHome-footer-confirm-btn': 'Confirm',
            'backHome-footer-cancel-btn': 'Cancel',
            'backLogin-header': 'Back to login',
            
            'blacklist-header': '',
            'blacklist-container': '',
            'blacklist-footer-backHome-btn': 'OK',
            
            'scannFaile-header': 'Unable to scan ID card',
            'scannFaile-container-1': '',
            'scannFaile-container-2': 'Please try again.',
            'scannFaile-footer-backHome-btn': 'Back to home',
            'scannFaile-footer-retry-btn': 'Retry',
            
            'noId-header': 'We are sorry',
            'noId-container': 'No insert of ID card,timed out',
            'noId-footer-backHome-btn': 'Back to home',
            'noId-footer-retry-btn': 'Retry',
            
            'backLogin-container': 'Are you sure you want to return to the login page?',
            'backLogin-footer-confirm-btn': 'Confirm',
            'backLogin-footer-cancel-btn': 'Cancel',

            'customer-not-available': 'System cannot find the pre-registration information of this user. Please check your input .',
            'closing-prompt-btn-again':'Refill',
            'closing-prompt-btn-continue': 'Continue'
        },
        'zh': {
            'backHome-header': '返回首页',
            'backHome-container': '您确定要返回首页吗？',
            'backHome-footer-confirm-btn': '确认',
            'backHome-footer-cancel-btn': '取消',
            'backLogin-header': '退出登录',
            
            'scannFaile-header': '无法识别 ',
            'scannFaile-container-1': '',
            'scannFaile-container-2': '身份证读取不成功， 请重试。',
            'scannFaile-footer-backHome-btn': '返回首页',
            'scannFaile-footer-retry-btn': '重试',
            
            'noId-header': '抱歉',
            'noId-container': '未插入身份证，操作超时',
            'noId-footer-backHome-btn': '返回首页',
            'noId-footer-retry-btn': '重试',
            
            'blacklist-header': '',
            'blacklist-container': '',
            'blacklist-footer-backHome-btn': '确认',
            
            'backLogin-container': '您确定要退出登录吗？',
            'backLogin-footer-confirm-btn': '确认',
            'backLogin-footer-cancel-btn': '取消',

            'customer-not-available': '系统无法找到该用户的预注册信息， 请检查输入是否正确。',
            'closing-prompt-btn-again':'重新输入',
            'closing-prompt-btn-continue': '继续'



        }
    }
    return model;
});