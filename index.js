//noinspection JSUnresolvedVariable
(function(isNode, isAngular) {

	var validatorGenerators = {
		contextGt: function(param){
			return function(value){
				if(value && this[param] && value<=this[param]) throw 'contextGt';
			}
		},
		contextFuture: function(param){
			return function(){
				var now = new Date();
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
				if(value.trim().isEmpty()){
					throw new Error('required')
				}
			}
		},
		isInteger: function(){
			return function(value){
				var x;
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
				var regex = new RegExp(options.exp);
				if(!regex.test(string)){
					throw new Error(options.name || 'regex-not-matched')
				}
			}
		},
		isFloat: function(options){
			return function(number){
				if(Number(number) !== number && number % 1 !== 0){
					throw new Error(options.name || 'regex-not-matched')
				}
			}
		},
	};

	var sharedValidators = {
		email:validatorGenerators.isRegex({
			exp:/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
			name: 'email'
		}),
		password: validatorGenerators.minMaxLength({min: 3, max: 10}),
		name: validatorGenerators.isRegex({exp:/^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/}),
		phone: validatorGenerators.isRegex({exp:/^[0-9]*$/}),
		postCode: validatorGenerators.isRegex({exp:/^[0-9]{5}$/}),
		url: validatorGenerators.isRegex({exp:/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/}),
		ip: validatorGenerators.isRegex({exp:/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/}),
		city: validatorGenerators.isRegex({exp:/^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/}),
		minLength: validatorGenerators.minMaxLength,
		required: validatorGenerators.isRegex({
			exp:/^(?!\s*$).+/,
			name:'required'
		}),
		isInteger: validatorGenerators.isInteger(),
		isExact: validatorGenerators.isExact({as:'undefined'}),
		isPositive: validatorGenerators.isPositive(),
		isRegex:validatorGenerators.isRegex({exp:/^([a-z0-9]{5,})$/}),
		minMaxLength: validatorGenerators.minMaxLength({min:5, max:25}),
		float:validatorGenerators.isRegex({exp:/^(\-|\+)?(\d*)(\.,\d*)?$/}),
		isFloat:validatorGenerators.isFloat(),
		_confirmPassword: function(){
			if(this.password!==this.confirmPassword){
				throw new Error(1);
			}
		},
		auctionEndDate: function(value, scope){
			var self = this;
			if(scope){
				alert(scope);
				console.log('auctionEndDate scope.');
				self = scope;
			}
			if(self.state !== 'draft'){
				//noinspection JSUnresolvedVariable
				if(self.endDate < new Date()){
					throw new Error('endDateBla')
				}
			}
		},
		w_hasUniqueBulstat: function(){
			//noinspection JSUnresolvedVariable
			if(!this.hasUniqueBulstat){
				throw new Error(1);
			}
		},
	};

	sharedValidators.schemas = {
		User: {
			name: ['required', 'name'],
			email: ['required','email'],
			password: ['required', 'password'],
			type: [],
			UserId: [],
			isVerified: []
		},
		Category:{
			title:['required'],
			name:['required'],
		}
	};

	if (isAngular) {
		//noinspection JSUnresolvedVariable
		var angularModule = angular.module('aux-shared-validators', []);
		angularModule.constant('ValidatorGenerators', [validatorGenerators]);
		angularModule.constant('sharedValidators', sharedValidators);
	}

	if (isNode) {
		module.exports = {
			applySchemaValidators:function (attributes, model){
				if(sharedValidators.schemas[model]){
					for(var attribute in attributes){
						attributes[attribute].validate = attributes[attribute].validate  || {};
						if(sharedValidators.schemas[model][attribute]){
							for(var validatorName of sharedValidators.schemas[model][attribute]){
								attributes[attribute].validate[validatorName] = sharedValidators[validatorName];
							}
						}
					}
				}
			},
			sharedValidators: sharedValidators,
		}

	}

})(typeof module !== 'undefined' && module.exports,  typeof angular !== 'undefined');