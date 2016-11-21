
(function(isNode, isAngular) {

'use strict'

let validatorGenerators = {
	contextGt: function(param){
		return function(value){
			if(value && this[param] && value<=this[param]) throw 'contextGt';
		}
	},
	contextFuture: function(param){
		return function(){
			let now = new Date();
			console.log(this[param].getTime(), now.getTime());
			if(this[param] && this[param] <= now) throw 'contextFuture';
		}
	},
	gt: function(options){
		return function(value){
			if(value<=options) throw 'gt';
		}
	},
	minMaxLength: function(options){
		return function(value){
			if(options.min && value.length < options.min){
				throw new Error('password-min-length')
			}
			if(options.max && value.length > options.max){
				throw new Error('password-max-length')
			}
		}
	},
	required: function(){
		return function(value){
			if(value == null || value == "" || value.length <= 0){
				throw new Error('required')
			}
		}
	},
	isInteger: function(){
		return function(value){
			let x;
			if(isNaN(value)){
				throw new Error('not-a-number')
			}else{
				return (x = parseFloat(value), (0 | x) === x)
			}
		}
	},
	isExact: function(options){
		return function(value){
			if(typeof value === options.as){
				throw new Error('')
			}else{
				return !!value
			}
		}
	},
	isPositive: function(){
		return function(value){
			if (value <= 0) {
				throw new Error('positive');
			}
		}
	},
	isPositiveOrZero: function(){
		return function(value){
			if (value < 0) {
				throw new Error('positive');
			}
		}
	},
	inFuture: function(){
		return function(value) {
			if (value <= Date.now()) {
				throw new Error('inFuture');
			}
		}
	},
	isRegex: function(options){
		return function(string){
			let regex = new RegExp(options.exp);
			if(!regex.test(string)){
				throw new Error(options.name || 'regex-not-matched')
			}
		}
	}
};

let sharedValidators = {
	email:validatorGenerators.isRegex({
		exp:/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
		name: 'email',
	}),
	password: validatorGenerators.minMaxLength({min: 3, max: 10}),

	name: validatorGenerators.isRegex({exp:/^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/}),
	phone: validatorGenerators.isRegex({exp:/^[0-9]*$/}),
	postCode: validatorGenerators.isRegex({exp:/^[0-9]{5}$/}),
	url: validatorGenerators.isRegex({exp:/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/}),
	ip: validatorGenerators.isRegex({exp:/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/}),
	city: validatorGenerators.isRegex({exp:/^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/}),
	minLength: validatorGenerators.minMaxLength,
	required: validatorGenerators.required(),
	isInteger: validatorGenerators.isInteger(),
	isExact: validatorGenerators.isExact({as:'undefined'}),
	isPositive: validatorGenerators.isPositive(),
	isRegex:validatorGenerators.isRegex({exp:/^([a-z0-9]{5,})$/}),
	minMaxLength: validatorGenerators.minMaxLength({min:5, max:25}),
	_confirmPassword: function(){
		if(this.password!==this.confirmPwd){
			throw new Error(1);
		};
	},
	auctionEndDate: function(value, $scope){
		let self = this;
		if($scope){
			alert($scope)
			console.log('auctionEndDate scope.');
			self = $scope;
		}
		if(self.state !== 'draft'){
			if(self.endDate < new Date()){
				throw new Error('endDateBla')
			}
		}
	}
};


	if (isAngular) {
		var angularModule = angular.module('aux-shared-validators', []);
		angularModule.constant('ValidatorGenerators', [validatorGenerators]);
		angularModule.constant('sharedValidators', sharedValidators);
		console.log('Loaded shared validators', 'isAngular: ', isAngular);
	}

	if (isNode) {
		module.exports = {
			validators: sharedValidators,
			ValidatorGenerators: validatorGenerators
		};
		console.log('Loaded shared validators', 'isNode: ', isNode);
		// validators.startInFuture.call({start:new Date()})
	}



})(typeof module !== 'undefined' && module.exports,  typeof angular !== 'undefined');


