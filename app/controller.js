/**
 * BannerControllers Module
 *
 * Description
 */
angular.module('BannerControllers', [])
	.controller('BannerEditor', function($scope, $compile, imageReader){
		$scope.title           = 'Company Name, Contest Title, Contest';
		$scope.description     = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sit, fugit hic tempora dolorem non sunt incidunt velit quam distinctio cum.';
		$scope.content         = 'background';
		$scope.counterOfTitle       = $scope.counterTitle = 50;
		$scope.counterOfDescription = $scope.counterDescription = 225;

		$scope.logo  = { w:122, h:80 };
		$scope.price = {
			one: {
				text:'Enter price 1 description...',
				limit:75,
				counter:75
			},
			two: {
				text:'Enter price 2 description...',
				limit:75,
				counter:75
			},
			three: {
				text:'Enter price 3 description...',
				limit:75,
				counter:75
			}
		};
		$scope.$watch('price.one.text', function(input){
			$scope.price.one.counter = $scope.price.one.limit - input.length;
			if($scope.price.one.counter <= 0) {
				$scope.price.one.counter = 0;
				$scope.price.one.text = $scope.price.one.text.substring(0, $scope.price.one.limit);
			}
		});
		$scope.$watch('price.two.text', function(input){
			$scope.price.two.counter = $scope.price.two.limit - input.length;
			if($scope.price.two.counter <= 0) {
				$scope.price.two.counter = 0;
				$scope.price.two.text = $scope.price.two.text.substring(0, $scope.price.two.limit);
			}
		});
		$scope.$watch('price.three.text', function(input){
			$scope.price.three.counter = $scope.price.three.limit - input.length;
			if($scope.price.three.counter <= 0) {
				$scope.price.three.counter = 0;
				$scope.price.three.text = $scope.price.three.text.substring(0, $scope.price.three.limit);
			}
		});

		$scope.$watch('title', function(input){
			$scope.counterTitle = $scope.counterOfTitle - input.length;
			if($scope.counterTitle <= 0) {
				$scope.counterTitle = 0;
				$scope.title = $scope.title.substring(0, $scope.counterOfTitle);
			}
		});
		$scope.$watch('description', function(input){
			$scope.counterDescription = $scope.counterOfDescription - input.length;
			if($scope.counterDescription <= 0) {
				$scope.counterDescription = 0;
				$scope.description = $scope.description.substring(0, $scope.counterOfDescription);
			}
		});

		$scope.addWhitePlaceholder = function($event){
			var $placeholder = $($event.currentTarget);
			var rect = $('#svg-editor > svg > #logo > rect');
			if($placeholder.is(":checked")){
				rect.attr('fill', 'white');
			} else {
				rect.attr('fill', 'transparent');
			}
		};

		$scope.cancelShow = false;
		$scope.cancelTemplate = function($event){
			var $btn         = $($event.currentTarget);
			var $tpl         = $btn.siblings('#templates');
			var $editor      = $btn.siblings('#settings');

			$tpl.fadeOut(400, function(){
				$editor.show();
				$btn.hide();
			});
		};

		$scope.doSetting = function($event){
			var $btn         = $($event.currentTarget);
			var $btnCancel   = $btn.next();
			var $tpl         = $btn.siblings('#templates');
			var $editor      = $btn.siblings('#settings');
			var $tplContent  = $('.tab-content');
			var $svgEditor   = $('#svg-editor');
			var indexTpl     = $('#templates ul').find('li.active a').data('tpl');
			var tplShowPrice = $scope.tplShowPrice = indexTpl.match(/(\d)/)[0];

			if($tpl.is(':hidden')){
				$tpl.fadeIn(400, function(){
					$btn.text('Settings');
					$btnCancel.show();
					$tplContent.show();
					$editor.hide();
					$svgEditor.hide();
				});
				return;
			}

			// canvas dimensions
			var canvasDimensions = {width:810,height:381};
			if(tplShowPrice == 1)
				canvasDimensions = {width:810,height:381};
			else if(tplShowPrice == 2)
				canvasDimensions = {width:810,height:339};
			else if(tplShowPrice == 3)
				canvasDimensions = {width:810,height:685};
			// get SVG compiled
			var $svg = getSVGCompiled($tplContent, 'normal');
			var $svg2 = getSVGCompiled($tplContent, 'fb');

			$tpl.fadeOut(400, function(){
				$(this).hide();
				$tplContent.hide();
				$btn.text('Choose template');
				$btnCancel.hide();

				$editor.fadeIn(function(){
					$svgEditor.append($svg);
					$svgEditor.append($svg2);
					// create input hidden to set canvas dimensions
					var inputCanvas = document.createElement("input");
					inputCanvas.setAttribute("type", "hidden");
					inputCanvas.setAttribute("name", "canvasDimensions");
					inputCanvas.setAttribute("value", JSON.stringify(canvasDimensions));
					$svgEditor.append(inputCanvas);
					// show editor
					if($svgEditor.is(':hidden')) $svgEditor.show();
					// initialize image reader 
					imageReader.init({
						dropArea      : '#drop-background',
						inputFileEl   : '#input-background',
						inputFileText : 'Add Background',
						section		  : 'background',
						compile		  : function(changeEl, image){
							$('body').trigger('bgReposition', canvasDimensions);
							$('image.bg', $svg)[0].setAttribute('xlink:href',image.src);
							$('image.bg', $svg)[0].setAttribute('width', image.width);
							$('image.bg', $svg)[0].setAttribute('height', image.height);
							$('image.bg', $svg2)[0].setAttribute('xlink:href',image.src);
							$('image.bg', $svg2)[0].setAttribute('width', image.width);
							$('image.bg', $svg2)[0].setAttribute('height', image.height);
						}
					});
					imageReader.init({
						dropArea      : '#drop-area',
						inputFileEl   : '#input-logo',
						inputFileText : 'Add Logo',
						section		  : 'logo',
						compile		  : function(changeEl, image){
							// re-compile to injecting scope
							var $logo = $('#svg-editor > svg > #logo');
							var logoHolder = $('rect', $logo)[0];
							// inject logo holder (padding 20)
							logoHolder.setAttribute('xlink:href',image.src);
							logoHolder.setAttribute('width','{{getWH()}}');
							logoHolder.setAttribute('height','{{getHH()}}');
							// inject logo image
							changeEl.setAttribute('xlink:href',image.src);
							changeEl.setAttribute('width','{{logo.w}}');
							changeEl.setAttribute('height','{{logo.h}}');
							// remove old logo holder n image
							$logo.html('');
							// append new logo holder n image with inject scope
							$logo.append($compile(logoHolder)($scope));
							$logo.append($compile(changeEl)($scope));
							// applying scope
							$scope.$apply(function(scope){
								scope.image = image;
								scope.logo.w = parseInt(image.width);
								scope.logo.h = parseInt(image.height);
								scope.getWH = function(){
									return parseInt(scope.logo.w) + 20;
								};
								scope.getHH = function(){
									return parseInt(scope.logo.h) + 20;
								};
							});
						}
					});
					imageReader.init({
						dropArea      : '#drop-area',
						inputFileEl   : '#input-price-1',
						inputFileText : 'Add Price 1',
						section		  : 'price-1'
					});
					imageReader.init({
						dropArea      : '#drop-area',
						inputFileEl   : '#input-price-2',
						inputFileText : 'Add Price 2',
						section		  : 'price-2'
					});
					imageReader.init({
						dropArea      : '#drop-area',
						inputFileEl   : '#input-price-3',
						inputFileText : 'Add Price 3',
						section		  : 'price-3'
					});
				});
			});

			function getSVGCompiled($tplContent, type){
				var $svg = $('.active > svg', $tplContent).clone();
				$('#pattern', $svg).children().map(function(i,e){
					$(e).attr('id', function(index, id){
						return id.replace(/(\d+)/, function(fullMatch, n) {
							return 'editor-'+type;
						});
					}).find('image').attr('class','bg');
					console.log('pattern', $(e).attr('id'));
				});
				$('#shadow', $svg).children().map(function(i,e){
					$(e).attr('id', function(index, id){
						return id.replace(/(\d+)/, function(fullMatch, n) {
							return 'editor';
						});
					});
				});
				$('#background', $svg).children().map(function(i,e){
					if($(e).attr('fill') === undefined) return;
					if(i == 1 && type == 'normal') $(e).remove();
					$(e).attr('fill', function(index, id){
						return id.replace(/(\d+)/, function(fullMatch, n) {
							return 'editor-'+type;
						});
					});
				});
				$('#logo', $svg).children().map(function(i,e){
					if($(e).attr('id') !== undefined) {
						$(e).attr('id', function(index, id){
							return id.replace(/(\d+)/, function(fullMatch, n) {
								return 'editor';
							});
						});
					} else if($(e).attr('filter') !== undefined) {
						$(e).attr('filter', function(index, id){
							return id.replace(/(\d+)/, function(fullMatch, n) {
								return 'editor';
							});
						});
					}
					else return;
				});
				$('#price', $svg).children().map(function(i,e){
					if($(e).attr('id') === undefined) return;
					if(type == 'normal') {
						$('#price > text > tspan', $svg).text('Enter to Win!');
					}
					$(e).attr('id', function(index, id){
						return id.replace(/(\d+)/, function(fullMatch, n) {
							return 'editor-' + n;
						});
					});
				});

				return $compile($svg)($scope);
			}
		};
	});