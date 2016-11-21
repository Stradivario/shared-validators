import sharedValidators from 'app/config/shared-validators';

let validators = angular.module('validators', [sharedValidators.name]);

validators.factory('validators', ['sharedValidators', function(sharedValidators) {
		var clientValidatorGenerators= {
			isInteger2: function(options){
				return function(value){
					if(options.min && value.length < options.min){
						throw new Error('password-min-length');
					}
					if(options.max && value.length > options.max){
						throw new Error('password-max-length');
					}
				}
			},

		};

		var clientValidators = {
			isInteger2: clientValidatorGenerators.isInteger2({min:15, max:20}),
			checked: function(value){
				if(!value){
					throw new Error(1);
				}
			},
		};

		for (var attributeName in clientValidators) { sharedValidators[attributeName] = clientValidators[attributeName]}


		return sharedValidators;
}]);

export default validators;