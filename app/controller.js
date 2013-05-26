/**
 * BannerControllers Module
 *
 * Description
 */
angular.module('BannerControllers', [])
	.controller('BannerEditor', function($scope, $compile, imageReader){
		// banner model
		$scope.banner = {
			title : {
				text    : 'Company Name, Contest Title, Contest',
				limit   : 50,
				counter : 50
			},
			description : {
				text    : 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sit, fugit hic tempora dolorem non sunt incidunt velit quam distinctio cum.',
				limit   : 225,
				counter : 255
			},
			logo : {
				w : 122,
				h : 80,
				margin : 20
			},
			price : {
				one: {
					text   : 'Enter price 1 description...',
					limit  : 75,
					counter: 75
				},
				two: {
					text    : 'Enter price 2 description...',
					limit   : 75,
					counter : 75
				},
				three: {
					text    : 'Enter price 3 description...',
					limit   : 75,
					counter : 75
				}
			}
		};

		// scope watchers
		$scope.$watch('banner.title.text', function(input){
			$scope.banner.title.limit = $scope.banner.title.counter - input.length;
			if($scope.banner.title.limit <= 0) {
				$scope.banner.title.limit = 0;
				$scope.banner.title.text = $scope.banner.title.text.substring(0, $scope.banner.title.text.counter);
			}
		});
		$scope.$watch('banner.description.text', function(input){
			$scope.banner.description.limit = $scope.banner.description.counter - input.length;
			if($scope.banner.description.limit <= 0) {
				$scope.banner.description.limit = 0;
				$scope.banner.description.text = $scope.banner.description.text.substring(0, $scope.banner.description.text.counter);
			}
		});
		$scope.$watch('banner.price.one.text', function(input){
			$scope.banner.price.one.counter = $scope.banner.price.one.limit - input.length;
			if($scope.banner.price.one.counter <= 0) {
				$scope.banner.price.one.counter = 0;
				$scope.banner.price.one.text = $scope.banner.price.one.text.substring(0, $scope.banner.price.one.limit);
			}
		});
		$scope.$watch('banner.price.two.text', function(input){
			$scope.banner.price.two.counter = $scope.banner.price.two.limit - input.length;
			if($scope.banner.price.two.counter <= 0) {
				$scope.banner.price.two.counter = 0;
				$scope.banner.price.two.text = $scope.banner.price.two.text.substring(0, $scope.banner.price.two.limit);
			}
		});
		$scope.$watch('banner.price.three.text', function(input){
			$scope.banner.price.three.counter = $scope.banner.price.three.limit - input.length;
			if($scope.banner.price.three.counter <= 0) {
				$scope.banner.price.three.counter = 0;
				$scope.banner.price.three.text = $scope.banner.price.three.text.substring(0, $scope.banner.price.three.limit);
			}
		});

		var dimensions = {
			'tpl-1' : {
				width:810,
				height:381
			},
			'tpl-2' : {
				width:810,
				height:339
			},
			'tpl-3' : {
				width:810,
				height:685
			}
		};

		$scope.yes = function(evt){
			console.log('yes');
			$('#question').trigger('renew');
		};
		$scope.no = function(evt){
			console.log('no');
			$('.blockOverlay').click();
		};

		$scope.doSetting = function($event){
			var $btnTemplate   = $($event.currentTarget);
			var $btnCancel     = $btnTemplate.next();
			var $templateField = $btnTemplate.siblings('#templates');
			var $settingField  = $btnTemplate.siblings('#settings');
			var $contentField  = $('#banner-editor .tab-content');
			var $svgEditor     = $('#svg-editor');
			var $actEditor     = $('#action-editor');
			var tplShowPrice   = $scope.tplShowPrice = $('ul > li.active > a', $templateField).data('tpl').match(/(\d)/)[0];

			var settings = {
				field : {
					template : $templateField,
					setting  : $settingField,
					content  : $contentField
				},
				btn: {
					template : $btnTemplate,
					cancel   : $btnCancel
				},
				editor : {
					svg    : $svgEditor,
					action : $actEditor
				},
				tplShowPrice : tplShowPrice
			};

			// clear the svg editor
			if($btnTemplate.hasClass('renew')){
				/*$('#question').bind('renew', function(){
					var self = this;
					bannerSetting(settings, true, function(){
						$('.blockOverlay').click();
						$(self).unbind('renew');
					});
				});
				$.blockUI({
					message: $('#question'),
					css: {
						background : 'transparent',
						border     : 'none',
						top        : ($(window).height() - 239) / 2 + 'px',
						left       : ($(window).width() - 379) / 2 + 'px',
						width      : '397px'
					}
				});
				$('.blockOverlay').attr('title','Click to cancel').click($.unblockUI);
				return;*/
				$btnTemplate.removeClass('renew');
				$settingField.find('form')[0].reset();
				$svgEditor.html('');
			}
			// return to the templates
			if($templateField.is(':hidden')){
				$btnCancel.show();
				$actEditor.hide();
				$templateField.fadeIn(400, function(){
					$btnTemplate.addClass('renew').text('Settings');
					$contentField.show();
					$settingField.hide();
					$svgEditor.hide();
				});
				return;
			}

			bannerSetting(settings, false);
		};

		var bannerSetting = function( options, renew, callback ){
			var $tpl          = options.field.template;
			var $settingField = options.field.setting;
			var $tplContent   = options.field.content;
			var $btnTemplate  = options.btn.template;
			var $btnCancel    = options.btn.cancel;
			var $editorSVG    = options.editor.svg;
			var $editorAction = options.editor.action;
			var tplShowPrice  = options.tplShowPrice;

			if( renew ){
				$btnTemplate.removeClass('renew');
				$settingField.find('form')[0].reset();
				$editorSVG.html('');
			}

			// canvas dimensions
			var canvasDimensions = dimensions['tpl-' + tplShowPrice];
			// compile SVG (inject scope)
			var $svg = getSVGCompiled($tplContent, 'like', tplShowPrice);
			// var $svg2 = getSVGCompiled($tplContent, 'enter', tplShowPrice);
			$tpl.fadeOut(400, function(){
				$(this).hide();
				$tplContent.hide();
				$btnCancel.hide();
				$btnTemplate.text('Choose template');

				$settingField.fadeIn(function(){
					$editorSVG.append($svg);
					// $editorSVG.append($svg2);
					// create input hidden to set canvas dimensions
					// will be used to image conversion
					var inputCanvas = document.createElement("input");
					inputCanvas.setAttribute("type", "hidden");
					inputCanvas.setAttribute("name", "canvasDimensions");
					inputCanvas.setAttribute("value", JSON.stringify(canvasDimensions));
					$editorSVG.append(inputCanvas);

					// show editor
					if($editorSVG.is(':hidden')) $editorSVG.show();
					// initialize image reader 
					imageReader.init({
						dropArea      : '#drop-background',
						inputFileEl   : '#input-background',
						inputFileText : 'Add Background',
						section       : 'background',
						compile       : function(buttonEl, changeEl, image){
							// change the button text to 'Edit'
							buttonEl.innerHTML = buttonEl.innerHTML.replace(/add/i, 'Edit');
							// svg like
							var imageBgEl = $('image.bg', $svg)[0];
							imageBgEl.setAttribute('xlink:href',image.src);
							imageBgEl.setAttribute('width', image.width);
							imageBgEl.setAttribute('height', image.height);
							imageBgEl.setAttribute('x', 0);
							imageBgEl.setAttribute('y', 0);
							// bgReposition
							$editorAction.show();
							$('#drop-background').css('height', canvasDimensions.height + 'px');
							$('body').trigger('bgReposition', {svg:$svg, type:tplShowPrice, canvasDimensions:canvasDimensions});
							// svg like
							// $('image.bg', $svg2)[0].setAttribute('xlink:href',image.src);
							// $('image.bg', $svg2)[0].setAttribute('width', image.width);
							// $('image.bg', $svg2)[0].setAttribute('height', image.height);
						}
					});
					imageReader.init({
						dropArea      : '#drop-logo',
						inputFileEl   : '#input-logo',
						inputFileText : 'Add Logo',
						section       : 'logo',
						compile       : function(buttonEl, changeEl, image){
							buttonEl.innerHTML = buttonEl.innerHTML.replace(/add/i, 'Edit');
							// re-compile to injecting scope
							var $logo = $('#svg-editor > svg > #logo');
							var logoHolder = $('rect', $logo)[0];
							// inject logo holder (padding 20)
							logoHolder.setAttribute('xlink:href',image.src);
							logoHolder.setAttribute('width','{{getWH()}}');
							logoHolder.setAttribute('height','{{getHH()}}');
							// inject logo image
							changeEl.setAttribute('xlink:href',image.src);
							changeEl.setAttribute('width','{{banner.logo.w}}');
							changeEl.setAttribute('height','{{banner.logo.h}}');
							// remove old logo holder n image
							$logo.html('');
							// append new logo holder n image with inject scope
							$logo.append($compile(logoHolder)($scope));
							$logo.append($compile(changeEl)($scope));
							// applying scope
							$scope.$apply(function(scope){
								scope.banner.logo.w = parseInt(image.width);
								scope.banner.logo.h = parseInt(image.height);
								// calculate image placeholder
								scope.getWH = function() {
									return parseInt(scope.banner.logo.w) + scope.banner.logo.margin;
								};
								scope.getHH = function() {
									return parseInt(scope.banner.logo.h) + scope.banner.logo.margin;
								};
								// calculate aspect ratio image height
								scope.$watch('banner.logo.w', function(input) {
									var ratio = [input / image.width, image.height / image.height];
									var aspectRatio = Math.min(ratio[0], ratio[1]);
									scope.banner.logo.h = parseInt(image.height * aspectRatio);
								});
							});
						}
					});
					imageReader.init({
						dropArea      : '#drop-price-1',
						inputFileEl   : '#input-price-1',
						inputFileText : 'Add Price 1',
						section       : 'price-1',
						compile       : function(buttonEl, changeEl, image){
							buttonEl.innerHTML = buttonEl.innerHTML.replace(/add/i, 'Edit');
							changeEl.setAttribute('xlink:href',image.src);
						}
					});
					imageReader.init({
						dropArea      : '#drop-area',
						inputFileEl   : '#input-price-2',
						inputFileText : 'Add Price 2',
						section       : 'price-2',
						compile       : function(buttonEl, changeEl, image){
							buttonEl.innerHTML = buttonEl.innerHTML.replace(/add/i, 'Edit');
							changeEl.setAttribute('xlink:href',image.src);
						}
					});
					imageReader.init({
						dropArea      : '#drop-area',
						inputFileEl   : '#input-price-3',
						inputFileText : 'Add Price 3',
						section       : 'price-3',
						compile       : function(buttonEl, changeEl, image){
							buttonEl.innerHTML = buttonEl.innerHTML.replace(/add/i, 'Edit');
							changeEl.setAttribute('xlink:href',image.src);
						}
					});

					if(callback) callback();
				});
			});
		}

		var getSVGCompiled = function ($tplContent, type, tplIndex){
			var $svg = $('.active > svg', $tplContent).clone();
			$('#pattern', $svg).children().map(function(i,e){
				$(e).attr('id', function(index, id){
					return id.replace(/(\d+)/, function(fullMatch, n) {
						return 'editor-'+type;
					});
				}).find('image').attr('class','bg');
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
				if(i == 1 && type == 'enter') $(e).remove();
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
				if(type == 'enter') {
					var oldX = $('#price > text', $svg)[0].getAttribute('x'), x = 0;
					if(tplIndex == 1) x = parseInt(oldX) + 37;
					else if(tplIndex == 2) x = parseInt(oldX) + 47;
					else if(tplIndex == 3) x = parseInt(oldX) + 57;
					$('#price > text > tspan', $svg).text('Enter to Win!');
					$('#price > text > tspan', $svg)[0].setAttribute('x',x);
				}
				$(e).attr('id', function(index, id){
					return id.replace(/(\d+)/, function(fullMatch, n) {
						return 'editor-' + n;
					});
				});
			});
			return $compile($svg)($scope);
		};

		$scope.cancelTemplate = function($event){
			var $btn           = $($event.currentTarget);
			var $btnSettings   = $btn.prev();
			var $tpl           = $btn.siblings('#templates');
			var $settingField = $btn.siblings('#settings');
			var $tplContent    = $('.tab-content');
			var $svgEditor     = $('#svg-editor');

			$tpl.fadeOut(400, function(){
				$btn.hide();
				$btnSettings.removeClass('renew');
				$tplContent.hide();
				$settingField.show();
				$svgEditor.show();
			});
		};
		$scope.addWhitePlaceholder = function(event){
			var $placeholder = $(event.currentTarget);
			var $rect = $('#svg-editor > svg > #logo > rect');
			if($placeholder.is(":checked")){
				$rect.attr('fill', 'white');
			} else {
				$rect.attr('fill', 'transparent');
			}
		};
	});