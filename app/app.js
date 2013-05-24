/**
 * BannerApp Module
 *
 * Description
 */
angular.module('BannerApp', ['BannerProvider', 'BannerControllers', 'BannerComponents', 'BannerFilters'])
	.config(['$routeProvider', 'debugProvider', 'imageReaderProvider',
		function($routeProvider, debugProvider, imageReaderProvider){
			// enable/disable debuging
			debugProvider.setDebug(true);
			// routes
			$routeProvider
				.when('/', {
					templateUrl : 'partials/home.html',
					controller  : 'BannerEditor'
				})
				.otherwise({ redirectTo:'/' });
		}
	]);

function navController($scope){
	$scope.index = 0;
	$scope.navClick = function(index){
		$scope.index = index;
	};
}