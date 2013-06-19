/**
 * ImageCreatorApp Module
 *
 * Description
 */
angular.module('ImageCreatorApp', ['ImageCreatorProvider', 'ImageCreatorControllers', 'ImageCreatorComponents', 'ImageCreatorFilters'])
	.config(['$routeProvider', '$locationProvider', 'debugProvider', 'PageProvider', 'transitionProvider', 'imageReaderProvider',
		function($routeProvider, $locationProvider, debugProvider, PageProvider, transitionProvider, imageReaderProvider){
			// enable/disable debuging
			debugProvider.setDebug(true);
			// transition config  
			transitionProvider.setStartTransition('expandIn');
			transitionProvider.setPageTransition('tumble');
			transitionProvider.setPage('html');
			// routes
			$routeProvider
				.when('/', {
					templateUrl : 'partials/home.html',
					controller  : 'HomeController',
					resolve: {
						delay: function($q, $timeout) {
							var delay = $q.defer();
							$timeout(delay.resolve, 1000);
							return delay.promise;
						}
					}
				})
				.when('/banner', {
					templateUrl : 'partials/banner.html',
					controller  : 'BannerController',
					resolve: {
						delay: function($q, $timeout) {
							var delay = $q.defer();
							$timeout(delay.resolve, 1000);
							return delay.promise;
						}
					}
				})
				.when('/feed', {
					template    : '<feed-creator></feed-creator>',
					controller  : 'FeedController',
					resolve: {
						delay: function($q, $timeout) {
							var delay = $q.defer();
							$timeout(delay.resolve, 1000);
							return delay.promise;
						}
					}
				})
				.when('/splash', {
					templateUrl : 'partials/splash.html',
					controller  : 'SplashController',
					resolve: {
						delay: function($q, $timeout) {
							var delay = $q.defer();
							$timeout(delay.resolve, 1000);
							return delay.promise;
						}
					}
				})
				.otherwise({ redirectTo:'/' });

			// $locationProvider.html5Mode(true);
		}
	])
	.run(function($rootScope, transition) {
		$rootScope.$on('$routeChangeStart', function(scope, next, current) {
			console.log('Changing from '+angular.toJson(current)+' to '+angular.toJson(next));
			transition.change();
		});
	});