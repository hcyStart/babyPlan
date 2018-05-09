define(['../BaseModel'], function (Base) {
    var model = new Base('accountType model');
    model.locale = {
        'en': {
            'Premier':'Premier',
            'Eligibility': 'Eligibility',
            'Minimum': 'Minimum Total Relationship Balance <br> CNY 500,000 / equivalent foreign currency<br>or more.(Not applicable for CEPS customer)',
            'Benefits':'Benefits',
            'Dedicated': 'Dedicated relationship manager',
            'Anytime': 'Anytime worldwide privileged service',
            'Enjoy':'Enjoy exclusive banking products and <br> rewards',
            'SelectPremier': 'Select Premier',
            'Advance': 'Advance',
            'Total':'Minimum Total Relationship Balance <br> CNY 100,000 / equivalent foreign currency<br>or more.(Not applicable for CEPS customer)',
            'Convenient': 'Secure and convenient digital platform',
            'Tailored':'Customized financial service and support',
            'preferential': 'Enjoy preferential offers and',
            'rewards':'rewards',
            'SelectAdvance': 'Select Advance',
            'continue':'Continue',
            'Personal':'Personal Banking',
            'describe':'Only for CEPS customer',
            'SalaryAccount':'Exclusive employee payroll accounts and corresponding monthly <br/>service fee waiver',
            'Discount':'Ample offers and rewards covering a range of<br>personal financial products and services',
            'charge':'Service fee preferential offer',
            'SelectPersonal':'Select Personal Banking',
            
            
            'accept':'I have read, understood and accepted the Personal Account General Terms and Conditions. I agree and accept the account type and the relevant account tariff, including but not limited to the Monthly Service Fee that will be charged if the above requirement for minimum Total Relationship Balance is not met.',
            'premierDetail':'A Monthly Service Fee of CNY 300 (or its equivalent in any other currencies) will be charged every month if the Total Relationship Balance of all the accounts under the same customer number fall below CNY 500, 000/equivalent in the previous month.',
            'advanceDetail':'A Monthly Service Fee of CNY 100 (or its equivalent in any other currencies) will be charged every month if the combined average daily balances of all the accounts under the same customer number fall below CNY 100, 000 or equivalent in the previous month.　(the Monthly Service Fee will be waived if and only during the period when there is any outstanding home mortgage loan maintained in the same customer of the Advance Account.)'
        },
        'zh': {
            'Premier':'卓越理财',
            'Eligibility': '申请资格',
            'Minimum': '月内日均总余额人民币50万元以上<br>或等额外币（不适用于公司雇员专<br>享计划客户）',
            'Benefits':'特点',
            'Dedicated': '您专属的客户经理',
            'Anytime': '全天候无疆界的优先服务',
            'Enjoy':'尊享卓越理财金融产品和奖励',
            'SelectPremier': '选择卓越理财',
            'Advance': '运筹理财',
            'Total':'月内日均总余额人民币10万元以上<br>或等额外币（不适用于公司雇员专<br>享计划客户）',
            'Convenient': '安全便捷的数字化平台',
            'Tailored':'量身定制的金融服务和支持',
            'preferential': '享受运筹理财产品和优惠',
            'rewards':'',
            'SelectAdvance': '选择运筹理财',
            'continue':'下一步',
            'Personal':'个人综合银行',
            'describe':'仅适用于在公司雇员专享计划下开立工资账户的客户',
            'SalaryAccount':'专属员工工资账户及相应服务月费减免',
            'Discount':'丰富优惠礼遇涵盖一系列个人金融产品及服务',
            'charge':'服务费率优惠',
            'SelectPersonal':'选择个人综合银行',      
            
            
            'accept':'我已阅读、理解并接受《个人账户一般条款》。我同意并接受所申请账户类型和对应之费率，包括但不限于不能满足上述最低账户日均总余额要求时可能收取的服务月费。',
            'premierDetail':'如同一客户号码下的所有账户的月内日均总余额低于人民币500,000元或等值金额，本行将每月收取人民币300元或等值外币的服务月费。',
            'advanceDetail':'如同一客户号码下的所有账户的月内日均总余额低于人民币100,000元或等值金额，本行将每月收取人民币100元或等值外币的服务月费。（如果运筹理财账户之同一客户号码下持有住房按揭贷款，在而且仅在住房按揭贷款尚未清偿期间，服务月费将予以免收。）'
        }
    }
    return model;
});