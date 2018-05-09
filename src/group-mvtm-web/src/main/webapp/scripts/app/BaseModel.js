define(function () {
	function BaseModel(title) {
		this.title = title;
	}

	BaseModel.prototype = {
		getTitle: function () {
			return this.title;
		},
		setCustomer: function (customer) {
			BaseModel.prototype.customer = customer;
		},
		setTransactionRecord: function (transactionRecord) {
			BaseModel.prototype.transactionRecord = transactionRecord;
		},
		setAccountType: function (accountType) {
			BaseModel.prototype.accountType = accountType;
		},
		setFileName: function(fileName) {
			BaseModel.prototype.fileName = fileName;
		},
		getFileName: function() {
			return BaseModel.prototype.fileName;
		}
	};

	return BaseModel;
});
