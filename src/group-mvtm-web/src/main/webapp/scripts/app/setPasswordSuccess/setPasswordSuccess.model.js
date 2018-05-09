define(['../BaseModel'], function (Base) {
    var model = new Base('setPasswordSuccess model');
    model.locale = {
        'en': {
            'title-one-1': 'Password setting success',
            'continue':'Continue'
        },
        'zh': {
            'title-one-1': '密码设置成功',
            'continue':'下一步'
        }
    }
    return model;
});