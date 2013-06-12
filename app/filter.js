/**
 * ImageCreatorFilters Module
 *
 * Description
 */

 angular.module('ImageCreatorFilters', [])
	.filter('comaToNewLine', function() {
		return function(input) {
			return input.replace(/,/g, '<br>');
		};
	})
	.filter('newLineToBr', function() {
		return function(input) {
			return input.replace(/\n/g, '<br>');
		};
	})
	.filter('newLineToDblBr', function() {
		return function(input) {
			return input.replace(/\n/g, '<br><br>');
		};
	});