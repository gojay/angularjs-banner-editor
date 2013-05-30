/**
 * BannerFilters Module
 *
 * Description
 */

 angular.module('BannerFilters', [])
	.filter('comaToNewLine', function() {
		return function(input) {
			return input.replace(/,/g, '<div style="clear:both; margin-top:5px;"></div>');
		};
	})
	.filter('newLineToBr', function() {
		return function(input) {
			return input.replace(/\n/g, '<div style="clear:both; margin-top:5px;"></div>');
		};
	})
	.filter('newLineToDblBr', function() {
		return function(input) {
			return input.replace(/\n/g, '<div style="clear:both; margin-top:5px;"></div><div style="clear:both; margin-top:5px;"></div>');
		};
	});