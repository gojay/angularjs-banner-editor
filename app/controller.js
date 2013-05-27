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
				text    : 'Company Name, Company Contest, Contest',
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
					text   : 'Enter price 1 description',
					limit  : 75,
					counter: 75
				},
				two: {
					text    : 'Enter price 2 description',
					limit   : 75,
					counter : 75
				},
				three: {
					text    : 'Enter price 3 description',
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

		$('#templates').bind('cancelTemplate', function(e){
			$(this).fadeOut(400, function(){
				$(this).hide();
				$('.tab-content').hide();
				$(this).next().removeClass('overwrite');
				$(this).siblings('#cancelTpl').hide();
				$(this).siblings('#settings').show();
				$('#svg-editor').show();
			});
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
			},
			'tpl-4' : {
				width:810,
				height:339
			},
			'tpl-5' : {
				width:810,
				height:339
			},
			'tpl-6' : {
				width:810,
				height:339
			}
		};

		$scope.overwiriteTplYes = function(evt){
			$('#alert-overwrite').trigger('overwrite');
		};
		$scope.overwiriteTplNo = function(evt){
			$('.blockOverlay').click();
			$('#templates').trigger('cancelTemplate');
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

			// alert overwrite
			if($btnTemplate.hasClass('overwrite')){
				$('#alert-overwrite').bind('overwrite', function(){
					var self = this;
					$('.blockOverlay').click();
					bannerSetting(settings, true);
				});
				// show message
				$.blockUI({
					message: $('#alert-overwrite'),
					css: {
						background : 'transparent',
						border     : 'none',
						top        : ($(window).height() - 479) / 2 + 'px',
						left       : ($(window).width() - 649) / 2 + 'px',
						width      : '649px'
					}
				});
				$('.blockOverlay').attr('title','Click to cancel').click($.unblockUI);
				return;
			}
			// return to the templates
			if($templateField.is(':hidden')){
				$btnCancel.show();
				$actEditor.hide();
				$templateField.fadeIn(400, function(){
					$btnTemplate.addClass('overwrite').text('Settings');
					$contentField.show();
					$settingField.hide();
					$svgEditor.hide();
				});
				return;
			}

			bannerSetting(settings, false);
		};

		var bannerSetting = function( options, overwrite ){
			var $tpl          = options.field.template;
			var $settingField = options.field.setting;
			var $tplContent   = options.field.content;
			var $btnTemplate  = options.btn.template;
			var $btnCancel    = options.btn.cancel;
			var $editorSVG    = options.editor.svg;
			var $editorAction = options.editor.action;
			var tplShowPrice  = options.tplShowPrice;

			if( overwrite ){
				// remove class overwrite
				$btnTemplate.removeClass('overwrite');
				// clear all setting input file
				$('input[type="file"]', $settingField).each(function(e,i){
					$(this).val('');
				});
			}

			// canvas dimensions
			var canvasDimensions = dimensions['tpl-' + tplShowPrice];
			// compile SVG (inject scope)
			var $svg = getSVGCompiled($tplContent, 'like', tplShowPrice);
			var $svg2 = getSVGCompiled($tplContent, 'enter', tplShowPrice);
			$tpl.hide(400, function(){
				$(this).hide();
				$tplContent.hide();
				$btnCancel.hide();
				$btnTemplate.text('Choose template');

				$settingField.show(400,function(){
					// clear editor
					$editorSVG.html('');
					// append svg
					$editorSVG.append($svg);
					$editorSVG.append($svg2);
					// create input hidden to set canvas dimensions
					// will be used to image conversion
					var inputCanvas = document.createElement("input");
					inputCanvas.setAttribute("type", "hidden");
					inputCanvas.setAttribute("name", "canvasDimensions");
					inputCanvas.setAttribute("value", JSON.stringify(canvasDimensions));
					// append canvas
					$editorSVG.append(inputCanvas);
					// set height drop background same as canvas dimension
					$('#drop-background').css('height', canvasDimensions.height + 'px');

					// show editor
					if($editorSVG.is(':hidden')) $editorSVG.show();
					// initialize image reader 
					imageReader.init({
						dropArea      : '#drop-background',
						inputFileEl   : '#input-background',
						inputFileText : 'Add Background',
						section       : 'background',
						compile       : function(buttonEl, changeEl, image){
							console.log('changeEl', changeEl);
							// change the button text to 'Edit'
							buttonEl.innerHTML = buttonEl.innerHTML.replace(/add/i, 'Edit');
							// re-compile to injecting scope
							for(var i in changeEl){
								changeEl[i].setAttribute('xlink:href',image.src);
								changeEl[i].setAttribute('width', image.width);
								changeEl[i].setAttribute('height', image.height);
								changeEl[i].setAttribute('x', 0);
								changeEl[i].setAttribute('y', 0);
							}
							// bgReposition
							$editorAction.show();
							$('body').trigger('bgReposition', {
								svg        : $svg,
								imageBG    : changeEl,
								type       : tplShowPrice,
								dimension  : canvasDimensions
							});
						}
					});
					imageReader.init({
						dropArea      : '#drop-logo',
						inputFileEl   : '#input-logo',
						inputFileText : 'Add Logo',
						section       : 'logo',
						compile       : function(buttonEl, changeEl, image){
							// change text button input file
							buttonEl.innerHTML = buttonEl.innerHTML.replace(/add/i, 'Edit');
							// re-compile to injecting scope
							angular.forEach(changeEl, function(e,i){
								var logo = {
									parent : $(e).parent(),
									holder : $(e).prev()[0],
									image  : e
								};
								// inject logo holder (padding 20)
								logo.holder.setAttribute('width','{{getWH()}}');
								logo.holder.setAttribute('height','{{getHH()}}');
								// inject logo image
								logo.image.setAttribute('xlink:href',image.src);
								logo.image.setAttribute('width','{{banner.logo.w}}');
								logo.image.setAttribute('height','{{banner.logo.h}}');
								// remove old logo image n holder
								logo.parent.html('');
								// append new logo image n holder with inject scope
								logo.parent.append($compile(logo.holder)($scope));
								logo.parent.append($compile(logo.image)($scope));
							});
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
							// change text button input file
							buttonEl.innerHTML = buttonEl.innerHTML.replace(/add/i, 'Edit');
							// set image src
							angular.forEach(changeEl, function(e,i){
								e.setAttribute('xlink:href',image.src);
							});
						}
					});
					imageReader.init({
						dropArea      : '#drop-area',
						inputFileEl   : '#input-price-2',
						inputFileText : 'Add Price 2',
						section       : 'price-2',
						compile       : function(buttonEl, changeEl, image){
							// change text button input file
							buttonEl.innerHTML = buttonEl.innerHTML.replace(/add/i, 'Edit');
							// set image src
							angular.forEach(changeEl, function(e,i){
								e.setAttribute('xlink:href',image.src);
							});
						}
					});
					imageReader.init({
						dropArea      : '#drop-area',
						inputFileEl   : '#input-price-3',
						inputFileText : 'Add Price 3',
						section       : 'price-3',
						compile       : function(buttonEl, changeEl, image){
							// change text button input file
							buttonEl.innerHTML = buttonEl.innerHTML.replace(/add/i, 'Edit');
							// set image src
							angular.forEach(changeEl, function(e,i){
								e.setAttribute('xlink:href',image.src);
							});
						}
					});

					// centering header text price
					var $text  = $('#price > text', $svg2);
					var $tspan = $text.find('tspan');
					// calculate new x position
					var newX = parseInt(($text.width() - $tspan.width()) / 2) + parseInt($text[0].getAttribute('x'));
					// set x position
					$tspan[0].setAttribute('x',newX);
				});
			});
		}

		var getSVGCompiled = function ($tplContent, type, tplIndex){
			var $svg = $('.active > svg', $tplContent).clone();
			$svg.attr('id', 'svg-editor-'+type);
			$('#pattern', $svg).children().map(function(i,e){
				$(e).attr('id', function(index, id){
					return id.replace(/(\d+)/, function(fullMatch, n) {
						return 'editor-'+type;
					});
				});
				if( $(e).find('image').length ){
					$(e).find('image').attr('id', 'background-image-editor-'+type);
				}
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
							return 'editor-'+type;
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
					$('#price > text > tspan', $svg).text('Enter to Win!');
				}
				$(e).attr('id', function(index, id){
					return id.replace(/(\d+)/, function(fullMatch, n) {
						return 'editor-'+ type + '-' + n;
					});
				});
			});
			return $compile($svg)($scope);
		};

		$scope.cancelTemplate = function($event){
			$('#templates').trigger('cancelTemplate');
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