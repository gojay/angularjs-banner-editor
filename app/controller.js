/**
 * ImageCreatorControllers Module
 *
 * Description
 */
angular.module('ImageCreatorControllers', [])
	.controller('MainController', function($scope, Page, transition){
		$scope.page = Page;
	})
	.controller('HomeController', function($scope, Page, transition){
		// set title n disable content
		Page.setTitle('');
		Page.isContent = false;
	})
	.controller('BannerController', function($scope, $compile, Page, transition, imageReader){
		// set title n enable content
		Page.setTitle('| Banner');
		Page.isContent = true;
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
				w : 0,
				h : 0,
				margin : 0
			},
			price : {
				title: 'This Month\'s Prizes',
				one: {
					text   : 'Enter prize 1 description',
					limit  : 75,
					counter: 75
				},
				two: {
					text    : 'Enter prize 2 description',
					limit   : 75,
					counter : 75
				},
				three: {
					text    : 'Enter prize 3 description',
					limit   : 75,
					counter : 75
				}
			}
		};

		$scope.isNoPrize = false;

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
		$scope.$watch('banner.price.title', function(input){
			$scope.banner.price.title = input;
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
			'tpl-0' : {
				logo : {
					pos : {
						placeholder:{
							x:20,
							y:5
						},
						image:{
							x:25,
							y:10
						}
					},
					image : {
						width:122,
						height:80
					}
				},
				background : {
					width:810,
					height:381
				}
			},
			'tpl-1' : {
				logo : {
					pos : {
						placeholder:{
							x:20,
							y:5
						},
						image:{
							x:25,
							y:10
						}
					},
					image : {
						width:122,
						height:80
					}
				},
				background : {
					width:810,
					height:381
				},
				price : {
					width:340,
					height:183
				}
			},
			'tpl-2' : {
				logo : {
					pos : {
						placeholder:{
							x:20,
							y:5
						},
						image:{
							x:25,
							y:10
						}
					},
					image : {
						width:122,
						height:80
					}
				},
				background : {
					width:810,
					height:339
				},
				price : {
					width:203,
					height:130
				}
			},
			'tpl-3' : {
				logo : {
					pos : {
						placeholder:{
							x:20,
							y:5
						},
						image:{
							x:45,
							y:10
						}
					},
					image : {
						width:122,
						height:80
					}
				},
				background : {
					width:770,
					height:315
				},
				price : {
					width:250,
					height:250
				}
			},
			'tpl-4' : {
				logo : {
					pos : {
						placeholder:{
							x:129,
							y:9
						},
						image:{
							x:134,
							y:14
						}
					},
					image : {
						width:226,
						height:56
					}
				},
				background : {
					width:810,
					height:339
				},
				price : {
					width:208,
					height:109
				}
			},
			'tpl-5' : {
				logo : {
					pos : {
						placeholder:{
							x:79,
							y:9
						},
						image:{
							x:84,
							y:14
						}
					},
					image : {
						width:226,
						height:56
					}
				},
				background : {
					width:810,
					height:339
				},
				price : {
					width:170,
					height:68
				}
			},
			'tpl-6' : {
				logo : {
					pos : {
						placeholder:{
							x:129,
							y:9
						},
						image:{
							x:134,
							y:14
						}
					},
					image : {
						width:226,
						height:56
					}
				},
				background : {
					width:810,
					height:339
				},
				price : {
					width:137,
					height:68
				}
			}
		};

		$scope.doSetting = function($event){
			var $btnTemplate     = $($event.currentTarget);
			var $btnCancel       = $btnTemplate.next();
			var $templateField   = $btnTemplate.siblings('#templates');
			var $settingField    = $btnTemplate.siblings('#settings');
			var $contentField    = $('#banner-editor .tab-content');
			var $displayTplField = $('#banner-editor #display-tpl');
			var $svgEditor       = $('#svg-editor');
			var $actEditor       = $('#action-editor');
			var $liActive        = $('ul > li.active > a', $templateField);
			var pricesInBottom   = $liActive.data('priceBottom');
			var tplDimension     = $liActive.data('tpl');
			var tplShowPrice     = $scope.tplShowPrice = $liActive.data('price').match(/(\d)/)[0];
			
			var settings = {
				field : {
					template   : $templateField,
					setting    : $settingField,
					displayTpl : $displayTplField,
					content    : $contentField
				},
				btn: {
					template : $btnTemplate,
					cancel   : $btnCancel
				},
				editor : {
					svg    : $svgEditor,
					action : $actEditor
				},
				attributes : {
					tplDimension    : tplDimension,
					pricesInBottom  : pricesInBottom,
					tplShowPrice    : tplShowPrice
				}
			};

			// alert overwrite
			if($btnTemplate.hasClass('overwrite')){
				$('#popup-overwrite').bind('overwrite', function(){
					var self = this;
					$('.blockOverlay').click();
					bannerSetting(settings, true);
				});
				// show message
				$.blockUI({
					message: $('#popup-overwrite'),
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
				$templateField.show(400, function(){
					$btnCancel.show();
					$btnTemplate.addClass('overwrite').html('<i class="icon-cog"></i> Settings');
					$contentField.show();
					$settingField.hide();
					$displayTplField.hide();
					$svgEditor.hide();
					$actEditor.hide();
				});
				return;
			}
			bannerSetting(settings, false);
		};

		$scope.overwiriteTplYes = function(evt){
			$('#popup-overwrite').trigger('overwrite');
		};
		$scope.overwiriteTplNo = function(evt){
			$('.blockOverlay').click();
			$('#templates').trigger('cancelTemplate');
		};

		var bannerSetting = function( options, overwrite ){
			var $tpl          = options.field.template;
			var $settingField = options.field.setting;
			var $tplContent   = options.field.content;
			var $displayTpl   = options.field.displayTpl;
			var $btnTemplate  = options.btn.template;
			var $btnCancel    = options.btn.cancel;
			var $editorSVG    = options.editor.svg;
			var $editorAction = options.editor.action;
			var tplDimension  = options.attributes.tplDimension;
			var pricesInBottom = options.attributes.pricesInBottom;
			var tplShowPrice  = options.attributes.tplShowPrice;

			console.log('settings', options);
			// tooltip
			$('a').tooltip();

			if( overwrite ){
				// remove class overwrite
				$btnTemplate.removeClass('overwrite');
				// clear all setting input file
				$('input[type="file"]', $settingField).each(function(e,i){
					$(this).val('');
				});
			}

			// canvas dimensions
			var canvasDimensions    = dimensions[tplDimension];
			var logoDimension       = canvasDimensions['logo'];
			var backgroundDimension = canvasDimensions['background'];
			var priceDimension      = canvasDimensions['price'];

			// empty prize
			if(priceDimension === undefined) {
				$scope.isNoPrize = true;
			} else {
				$scope.isNoPrize = false;
			}

			// compile SVG (inject scope)
			var tplIndex = tplDimension.match(/(\d)/)[0];
			var $svg = getSVGCompiled($tplContent, 'like', tplIndex);
			var $svg2 = getSVGCompiled($tplContent, 'enter', tplIndex);
			$tpl.hide(400, function(){
				$(this).hide();
				$tplContent.hide();
				$btnCancel.hide();
				$btnTemplate.html('<i class="icon-list"></i> Choose Template');

				$settingField.show(400,function(){
					$displayTpl.show();
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
					inputCanvas.setAttribute("value", JSON.stringify(backgroundDimension));
					// append canvas
					$editorSVG.append(inputCanvas);
					// set height drop background same as canvas dimension
					$('#drop-background').css('height', backgroundDimension.height + 'px');

					// show editor
					if($editorSVG.is(':hidden')) $editorSVG.show();
					/* initialize image reader */
					// background
					imageReader.init({
						dropArea      : '#drop-background',
						inputFileEl   : '#input-background',
						inputFileText : 'Select an image',
						section       : 'background',
						compile       : function(buttonEl, changeEl, blob, image){
							console.log('changeEl', changeEl);

							var labelEl = $(buttonEl).parent().siblings('label')[0];
							if((image.width <= backgroundDimension.width && image.height <= backgroundDimension.height) ){
								// change the button text to 'Edit'
								labelEl.innerHTML = labelEl.innerHTML.replace(/upload/i, 'Edit');
								// re-compile to injecting scope
								for(var i in changeEl){
									changeEl[i].setAttribute('xlink:href',image.src);
									changeEl[i].setAttribute('width', image.width);
									changeEl[i].setAttribute('height', image.height);
								}
								return;
							}

							// define crop selection
							var cropSelection = {};
							// create temporary image for cropping
							image.setAttribute('id', 'temp-crop-image hide');
							// append to body
							document.querySelector('body').appendChild(image);
							var $tempImg = $(image);
							// calculating crop center
							var x1 = parseInt((image.width - backgroundDimension.width) / 2);
							var y1 = parseInt((image.height - backgroundDimension.height) / 2);
							var pos = {
								x1 : x1,
								y1 : y1,
								x2 : parseInt(x1 + backgroundDimension.width),
								y2 : parseInt(y1 + backgroundDimension.height)
							};
							// show crop popup
							$.blockUI({
								message   : $tempImg,
								overlayCSS:{
									cursor : 'default'
								},
								css: {
									cursor : 'default',
									border : 'none',
									top    : ($(window).height() - image.height) / 2 + 'px',
									left   : ($(window).width() - image.width) / 2 + 'px',
									width  : image.width + 'px'
								},
								onBlock: function(){
									$tempImg.imgAreaSelect({
										x1 : pos.x1,
										y1 : pos.y1,
										x2 : pos.x2,
										y2 : pos.y2,
										resizable : false,
										handles   : true,
										fadeSpeed : 200,
										onInit    : function(img, selection){
											console.log('imgAreaSelect init', 'x', -selection.x1, 'y', -selection.y1);
											// set cropSelection
											cropSelection = selection;
											var $handle = $('.imgareaselect-handle').parent();
											$handle.parent().append($compile('<div id="crop-wrapper"><button class="btn" ng-click="cropHandle(\'crop\')"><i class="icon-crop"></i> Crop</button><button class="btn btn-primary" ng-click="cropHandle(\'ratio\')"><i class="icon-resize-full"></i> Aspect Ratio</button><button class="btn btn-success" ng-click="cropHandle(\'fit\')"><i class="icon-fullscreen"></i> Auto Fit</button><button class="btn btn-danger" ng-click="cropHandle(\'cancel\')">Cancel</button></div>')($scope));
										},
										onSelectStart : function(){
											console.log('imgAreaSelect start');
										},
										onSelectChange : function(img, selection){
											if(!selection.width || !selection.height) return;
											console.log('imgAreaSelect change', 'x', -selection.x1, 'y', -selection.y1);
										},
										onSelectEnd : function(img, selection){
											console.log('imgAreaSelect end');
											// set cropSelection
											cropSelection = selection;
										}
									});
								}
							});
							$scope.cropHandle = function(act){
								// remove imgAreaSelect
								$tempImg.imgAreaSelect({remove:true});
								$.unblockUI({
									onUnblock: function() {
										$tempImg.remove();
										$('#crop-wrapper').remove();
										// change the button text to 'Edit'
										labelEl.innerHTML = labelEl.innerHTML.replace(/upload/i, 'Edit');
										// crop
										if(act == 'crop'){
											// change image src, dimension n position
											for(var i in changeEl){
												changeEl[i].setAttribute('xlink:href',image.src);
												changeEl[i].setAttribute('width', image.width);
												changeEl[i].setAttribute('height', image.height);
												changeEl[i].setAttribute('x', -Math.abs(cropSelection.x1));
												changeEl[i].setAttribute('y', -Math.abs(cropSelection.y1));
											}
											// background reposition
											$editorAction.show();
											$('body').trigger('bgReposition', {
												svg            : $svg,
												imageBG        : changeEl,
												pricesInBottom : pricesInBottom,
												dimension      : backgroundDimension
											});
										}
										// aspect ratio
										else if(act == 'ratio'){
											// change image src only
											for(var i in changeEl){
												changeEl[i].setAttribute('xlink:href',image.src);
											}
										}
										// auto fit
										else if(act == 'fit'){
											$.blockUI({ 
												message: '<i class="icon-spinner icon-spin icon-large"></i> Please wait...',
												css: {
													border: '1px solid #007dbc'
												}
											});
											imageReader.uploadFile({
												file: blob,
												name: 'background',
												size: backgroundDimension
											}, function(response){
												console.log('response', response);
												console.log('changeEl', changeEl);
												for(var i in changeEl){
													changeEl[i].setAttribute('xlink:href',response.dataURI);
												}
												$.unblockUI();
											});
										}
									}
								});
							};
						}
					});
					// logo
					imageReader.init({
						dropArea      : '#drop-logo',
						inputFileEl   : '#input-logo',
						inputFileText : 'Select an image',
						section       : 'logo',
						compile       : function(buttonEl, changeEl, blob, image){
							// change text label input file
							var labelEl = $(buttonEl).parent().siblings('label')[0];

							$.blockUI({
								message: '<i class="icon-spinner icon-spin icon-large"></i> Please wait...',
								css: {
									border: '1px solid #007dbc'
								}
							});
							// upload to resize
							imageReader.uploadFile({
								file: blob,
								name: 'logo',
								size: logoDimension.image
							}, function(response){
								console.log('logoDimension', logoDimension);
								// change image src only
								angular.forEach(changeEl, function(e,i){
									var logo = {
										parent : $(e).parent(),
										holder : $(e).prev()[0],
										image  : e
									};
									// inject logo holder (padding 20)
									// logo.holder.setAttribute('width','{{getWH()}}');
									// logo.holder.setAttribute('height','{{getHH()}}');
									// inject logo image
									logo.image.setAttribute('xlink:href',response.dataURI);
									logo.image.setAttribute('width','{{banner.logo.w}}');
									logo.image.setAttribute('height','{{banner.logo.h}}');
									logo.image.setAttribute('x','{{banner.logo.x}}');
									logo.image.setAttribute('y','{{banner.logo.y}}');
									// remove old logo image n holder
									logo.parent.html('');
									// append new logo image n holder with inject scope
									// logo.parent.append($compile(logo.holder)($scope));
									logo.parent.append(logo.holder);
									logo.parent.append($compile(logo.image)($scope));
								});

								// applying scope
								$scope.$apply(function(scope){
									scope.banner.logo.w = logoDimension.image.width;
									scope.banner.logo.h = logoDimension.image.height;
									scope.banner.logo.x = logoDimension.pos.image.x;
									scope.banner.logo.y = logoDimension.pos.image.y;
									console.log('scope', scope);
									// calculate image position (center)
									// calculate aspect ratio image height
									scope.$watch('banner.logo.w', function(input) {
										if(parseInt(input) <= logoDimension.image.width){
											// dimension
											var ratio = [input / logoDimension.image.width, logoDimension.image.height / logoDimension.image.height];
											var aspectRatio = Math.min(ratio[0], ratio[1]);
											scope.banner.logo.h = parseInt(logoDimension.image.height * aspectRatio);
											// position
											var dx = (logoDimension.image.width + 10) - parseInt(input);
											var dy = (logoDimension.image.height + 10) - parseInt(scope.banner.logo.h);
											var x = (dx <= 0) ? scope.banner.logo.x : (dx / 2) + logoDimension.pos.placeholder.x;
											scope.banner.logo.x = (tplIndex == 3) ? x + 20 : x ;
											scope.banner.logo.y = (dy <= 0) ? scope.banner.logo.y : (dy / 2) + logoDimension.pos.placeholder.y;
										}
										else {
											scope.banner.logo.w = logoDimension.image.width;
											scope.banner.logo.h = logoDimension.image.height;
										}
									});
								});
								$.unblockUI();
							});
						}
					});

					// empty prize
					if(priceDimension === undefined) return;

					// callback price compile
					var priceCompile = function(buttonEl, changeEl, blob, image){
						var labelEl = $(buttonEl).parent().siblings('label')[0];
						// auto strecth, if image dimension less than background dimension
						if(image.width <= backgroundDimension.width && image.height <= backgroundDimension.height)
						{
							// change label text
							labelEl.innerHTML = labelEl.innerHTML.replace(/upload/i, 'Edit');
							// re-compile to injecting scope
							angular.forEach(changeEl, function(e,i){
								e.setAttribute('xlink:href',image.src);
							});
							return;
						}
						// define crop selection
						var cropSelection = {};
						// create temporary image for cropping
						image.setAttribute('id', 'temp-crop-image');
						// append to body
						document.querySelector('body').appendChild(image);
						var $tempImg = $(image);
						// calculating crop center
						var x1 = parseInt((image.width - priceDimension.width) / 2);
						var y1 = parseInt((image.height - priceDimension.height) / 2);
						var pos = {
							x1 : x1,
							y1 : y1,
							x2 : parseInt(x1 + priceDimension.width),
							y2 : parseInt(y1 + priceDimension.height)
						};
						// show crop popup
						$.blockUI({
							message   : $tempImg,
							overlayCSS:{
								cursor : 'default'
							},
							css: {
								cursor : 'default',
								border : 'none',
								top    : ($(window).height() - image.height) / 2 + 'px',
								left   : ($(window).width() - image.width) / 2 + 'px',
								width  : image.width + 'px'
							},
							onBlock: function(){
								$tempImg.imgAreaSelect({
									x1 : pos.x1,
									y1 : pos.y1,
									x2 : pos.x2,
									y2 : pos.y2,
									resizable : false,
									handles   : true,
									fadeSpeed : 200,
									onInit    : function(img, selection){
										console.log('imgAreaSelect init', 'x', -selection.x1, 'y', -selection.y1);
										// set cropSelection
										cropSelection = selection;
										var $handle = $('.imgareaselect-handle').parent();
										$handle.parent().append($compile('<div id="crop-wrapper"><button class="btn" ng-click="cropHandle(\'crop\')"><i class="icon-crop"></i> Crop</button><button class="btn btn-primary" ng-click="cropHandle(\'ratio\')"><i class="icon-resize-full"></i> Aspect Ratio</button><button class="btn btn-success" ng-click="cropHandle(\'fit\')"><i class="icon-fullscreen"></i> Auto Fit</button><button class="btn btn-danger" ng-click="cropHandle(\'cancel\')">Cancel</button></div>')($scope));
									},
									onSelectStart : function(){
										console.log('imgAreaSelect start');
									},
									onSelectChange : function(img, selection){
										if(!selection.width || !selection.height) return;
										console.log('imgAreaSelect change', 'x', -selection.x1, 'y', -selection.y1);
									},
									onSelectEnd : function(img, selection){
										console.log('imgAreaSelect end');
										// set cropSelection
										cropSelection = selection;
									}
								});
							}
						});
						$scope.cropHandle = function(act){
							$tempImg.imgAreaSelect({remove:true});
							$.unblockUI({
								onUnblock: function() {
									$tempImg.remove();
									$('#crop-wrapper').remove();
									// change the button text to 'Edit'
									labelEl.innerHTML = labelEl.innerHTML.replace(/upload/i, 'Edit');
									// crop
									if(act == 'crop'){
										// change image src, dimension n position
										for(var i in changeEl){
											changeEl[i].setAttribute('xlink:href',image.src);
											changeEl[i].setAttribute('width', image.width);
											changeEl[i].setAttribute('height', image.height);
											changeEl[i].setAttribute('x', -Math.abs(cropSelection.x1));
											changeEl[i].setAttribute('y', -Math.abs(cropSelection.y1));
										}
									}
									// ascpect ratio
									else if(act == 'ratio'){
										// change image src only
										for(var j in changeEl){
											changeEl[j].setAttribute('xlink:href',image.src);
										}
									}
									// auto fit
									else if(act == 'fit'){
										$.blockUI({
											message: '<i class="icon-spinner icon-spin icon-large"></i> Please wait...',
											css: {
												border: '1px solid #007dbc'
											}
										});
										imageReader.uploadFile({
											file: blob,
											name: 'prize',
											size: priceDimension
										}, function(response){
											for(var j in changeEl){
												changeEl[j].setAttribute('xlink:href',response.dataURI);
											}
											$.unblockUI();
										});
									}
								}
							});
						};
					};
					// prizes
					imageReader.init({
						dropArea      : '#drop-price-1',
						inputFileEl   : '#input-price-1',
						inputFileText : 'Select an image',
						section       : 'price-1',
						compile       : priceCompile
					});
					imageReader.init({
						dropArea      : '#drop-area',
						inputFileEl   : '#input-price-2',
						inputFileText : 'Select an image',
						section       : 'price-2',
						compile       : priceCompile
					});
					imageReader.init({
						dropArea      : '#drop-area',
						inputFileEl   : '#input-price-3',
						inputFileText : 'Select an image',
						section       : 'price-3',
						compile       : priceCompile
					});
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
			});
			$('#shadow', $svg).children().map(function(i,e){
				$(e).attr('id', function(index, id){
					return id.replace(/(\d+)/, function(fullMatch, n) {
						return 'editor';
					});
				});
			});
			$('#background', $svg).children().map(function(i,e){
				if($(e).attr('fill') !== undefined) {
					$(e).attr('fill', function(index, id){
						return id.replace(/(\d+)/, function(fullMatch, n) {
							return 'editor-'+type;
						});
					});
				}
				else if(i == 1) {
					if(type == 'enter') {
						$(e).remove();
						return;
					}

					e.setAttribute('width', '{{banner.fb.w}}');
					e.setAttribute('height', '{{banner.fb.h}}');
					e.setAttribute('x', '{{getX()}}');
					// compile banner fb 
					$scope.banner.fb = {
						w:283,
						h:67
					};
					$scope.$watch('banner.fb.w', function(input){
						var ratio = [input / 283, 67 / 67];
						var aspectRatio = Math.min(ratio[0], ratio[1]);
						$scope.banner.fb.h = parseInt(67 * aspectRatio);
					});
					$scope.getX = function(){
						var calc = 810 - $scope.banner.fb.w;
						return tplIndex == 3 ? calc - 20 : calc ;
					}
				}
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

			// has prize
			if( $('#price', $svg).length )
			{
				var _index = 1;
				$('#price', $svg).children().map(function(i,e){
					if($(e).attr('id') === undefined) return;
					/* 
					var x = [586,542,345,96,168,198];
					if(type == 'enter') {
						var x = [586,542,345,96,168,198];
						$('#price > text > tspan', $svg).text('Enter to Win!');
						$('#price > text > tspan', $svg).attr('x', x[tplIndex-1]);
					}
					*/
					if(type == 'enter') {
						$('#price .prize-description', $svg).text('Enter to Win!');
					}
					$(e).attr('id', function(index, id){
						return id.replace(/(\d+)/, function(fullMatch, n) {
							return 'editor-'+ type + '-' + _index;
						});
					});
					_index++;
				});
			}

			return $compile($svg)($scope);
		};

		$scope.cancelTemplate = function($event){
			$('#templates').trigger('cancelTemplate');
		};

		$scope.hideLogo = function(event){
			var $chHide = $(event.currentTarget);
			$('#svg-editor > svg').each(function(i,e){
				var $logo = $(e).find('#logo').eq(0);
				console.log($logo);
				if($chHide.is(":checked")){
					$logo.hide();
					$chHide.parents('.accordion-inner').children().each(function(x,z){
						if(x > 0){
							$(z).hide('slow');
						}
					});
				} else {
					$logo.show();
					$chHide.parents('.accordion-inner').children().each(function(x,z){
						if(x > 0){
							$(z).show('slow');
						}
					});
				}
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

		function createCanvas(svg, callback){
			var svg_xml = (new XMLSerializer()).serializeToString(svg);
			var canvas  = document.createElement('canvas');
			// get canvas context
			var ctx = canvas.getContext("2d");
			var img = new Image();
			img.onload = function(){
				canvas.width  = img.width;
				canvas.height = img.height;
				ctx.drawImage(img, 0, 0);
				var imgDataURI = canvas.toDataURL('image/jpg');
				callback(img, imgDataURI);
			};
			img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent( svg_xml )));
		}

		// SVG to dataURI
		$scope.convert = function(evt){
			$.blockUI({
				message: $('#popup-loading-img'),
				overlayCSS:{
					opacity : '0.8'
				},
				css: {
					background : 'transparent',
					border     : 'none',
					top        : ($(window).height() - 350) / 2 + 'px',
					left       : ($(window).width() - 375) / 2 + 'px',
					width      : '350px'
				}
			});

			var zip = new JSZip();

			$('#svg-editor > svg').each(function(){ $(this).show(); });
			var svg_like  = $('#svg-editor > svg').eq(0)[0];
			var svg_enter = $('#svg-editor > svg').eq(1)[0];
			// get canvas dimensions
			// var canvasDimensions = JSON.parse($('input[name="canvasDimensions"]').val());
			// create canvas banner like
			createCanvas(svg_like, function(imgLike, imgDataURILike){
				// add banner like to zip
				var imgURI = imgDataURILike.replace(/^data:image\/(png|jpg);base64,/, "");
				zip.file('banner_like.jpg', imgURI, {base64: true});
				// create download anchor
				var downloadLinkLike       = document.createElement('a');
				downloadLinkLike.title     = 'Download Banner Like';
				downloadLinkLike.href      = imgDataURILike;
				downloadLinkLike.target    = '_blank';
				downloadLinkLike.className = 'btn btn-success';
				downloadLinkLike.innerHTML = '<i class="icon-download-alt"></i> Download Banner Like';
				downloadLinkLike.download  = 'banner-like.jpg';
				// create canvas banner enter
				createCanvas(svg_enter, function(imgEnter, imgDataURIEnter){
					// add banner img to zip
					var imgURI = imgDataURIEnter.replace(/^data:image\/(png|jpg);base64,/, "");
					zip.file('banner_enter.jpg', imgURI, {base64: true});
					// create download anchor
					var downloadLinkEnter       = document.createElement('a');
					downloadLinkEnter.title     = 'Download Banner Enter';
					downloadLinkEnter.href      = imgDataURIEnter;
					downloadLinkEnter.target    = '_blank';
					downloadLinkEnter.className = 'btn btn-success';
					downloadLinkEnter.innerHTML = '<i class="icon-download-alt"></i> Download Banner Enter';
					downloadLinkEnter.download  = 'banner-enter.jpg';
					// set image class
					imgLike.className  = 'span12';
					imgEnter.className = 'span12';
					// define generate element
					var $generate = $('#popup-result-generate-image-modal');
					var $generateBody = $generate.find('.modal-body');
					// create template banner list
					var tplImages = '<li class="span6 banner-like">' +
										'<div class="thumbnail">' + imgLike.outerHTML +
											'<div class="caption">' +
												'<h3>Banner Like</h3>' +
												'<p>This is banner like description</p>'+
												'<p>'+ downloadLinkLike.outerHTML +'</p>' +
											'</div>' +
										'</div>' +
									'</li>'+
									'<li class="span6 banner-like">' +
										'<div class="thumbnail">' + imgEnter.outerHTML +
											'<div class="caption">' +
												'<h3>Banner Enter</h3>' +
												'<p>This is banner enter description</p>'+
												'<p>'+ downloadLinkEnter.outerHTML +'</p>' +
											'</div>' +
										'</div>' +
									'</li>';
					// append banner images
					$generateBody.find('ul').html('');
					$generateBody.find('ul').append(tplImages);
					// generate zip link
					var DOMURL = window.URL || window.mozURL;
					var downloadlink = DOMURL.createObjectURL(zip.generate({type:"blob"}));
					// get zipe selement n set attribute
					var zipEl      = $generate.find('.download-zip')[0];
					zipEl.download = 'banner.zip';
					zipEl.href     = downloadlink;
					// open popup
					setTimeout(function() {
						$.unblockUI({
							onUnblock: function() {
								$generate.modal('show');
							}
						});
					}, 1000);
				});
			});
		};

		// http://stackoverflow.com/questions/3142007/how-to-either-determine-svg-text-box-width-or-force-line-breaks-after-x-chara
		// http://documentup.com/wout/svg.js
		// https://github.com/wout/svg.textflow.js
		$scope.foreignToSVGXML = function(evt){
			var $svg = $('#svg-editor > svg').eq(0);
			var description   = $('#description', $svg)[0];
			var foreignobject = $('#description', $svg).children().last()[0];
			console.log(foreignobject);
			console.log(foreignobject.getAttribute('width'));
			// calc x, y position
			var x = parseInt(foreignobject.getAttribute('x')) + 20;
			var y = parseInt(foreignobject.getAttribute('y')) + 35; // 163
			// get title html, then split into array by br tags
			var titles = [];
			var $title    = $(foreignobject).find('h3');
			var tFontSize = parseInt($title.css('font-size').replace(/\px/, ''));
			var tHTML     = $title.html();
			var tLineH    = parseInt(tFontSize * 1.2);
			if(/<br[^>]*>/.test(tHTML)) titles = tHTML.split(/<br[^>]*>/gi);
			else titles.push(tHTML);
			// get paragraph html, then replace br tags into new line
			var $p        = $(foreignobject).find('p');
			var pHTML     = $p.html();
			var pFontSize = parseInt($p.css('font-size').replace(/\px/, ''));
			var paragraph = /<br[^>]*>/.test(pHTML) ? pHTML.replace(/<br[^>]*>/gi, '\n') : pHTML ;

			var svgNS = "http://www.w3.org/2000/svg";
			for(var i in titles) {
				var newText = document.createElementNS(svgNS,"text");
				newText.setAttributeNS(null,"x", x);
				newText.setAttributeNS(null,"y", y);
				newText.setAttributeNS(null,"font-family", "Rockwell");
				newText.setAttributeNS(null,"font-size", tFontSize);
				newText.setAttributeNS(null,"fill", "white");

				var textNode = document.createTextNode(titles[i]);
				newText.appendChild(textNode);
				description.appendChild(newText);

				y += tLineH;
			}
			// create svg dummy for replacing description foreign object
			var svg    = SVG('canvas');
			var tWidth = parseInt(foreignobject.getAttribute('width')) - 40;
			var tDesc  = svg.textflow(paragraph).size(tWidth);
			tDesc.font({ family: 'Arial', size: pFontSize });
			tDesc.attr({
				fill:'white',
				x:x,
				y:245
			});
			// increament el tspan attr dy (2px), not in first child
			$('#'+tDesc.node.id).children().each(function(i,e){
				if(i === 0) return;
				var dy = parseFloat(e.getAttribute('dy'));
				e.setAttribute('dy', parseFloat(dy + 2.0));
			});
			// get svg
			var canvas = $('#canvas svg')[0];
			// append to description
			description.appendChild(canvas);
			// remove old description
			$(foreignobject).remove();
			
			// http://updates.html5rocks.com/2011/08/Saving-generated-files-on-the-client-side
			// http://www.html5rocks.com/en/tutorials/file/filesystem/#toc-file-writing
			// var svg = $('#svg-editor > svg').eq(0)[0];
			// var svg_xml = (new XMLSerializer()).serializeToString(svg);

			// var bb = new BlobBuilder();
			// bb.append(svg_xml);
			// var blob = bb.getBlob("application/svg+xml;charset=" + svg.characterSet);
			// saveAs(blob, "test.svg");
			// 
			// var DOMURL = window.URL || window.webkitURL || window.mozURL;
			// var img = new Image();
			// var svg = new Blob([svg_xml], {type: "image/jpeg;charset=utf-8"});
			// var url = DOMURL.createObjectURL(svg);
			// console.log(url);
			// img.onload = function() {
			//     DOMURL.revokeObjectURL(url);
			//     $('body').append(img.outerHTML);
			// };
			// img.src = url;

			// var canvas    = document.createElement('canvas');
			// // get canvas context
			// var ctx = canvas.getContext("2d");
			// var img = new Image();
			// img.onload = function(){
			// 	canvas.width  = img.width;
			// 	canvas.height = img.height;
			// 	ctx.drawImage(img, 0, 0);

			// 	$('body').append(canvas.outerHTML);

			// var file = dataURItoBlob("data:image/svg+xml;base64," + btoa(svg_xml));
			// console.log(file);
			// var url = window.URL.createObjectURL(file);
			// var img2 = new Image();
			// img2.onload = function(){
			// 	// Clean up after
			// 	window.URL.revokeObjectURL(url);
			// };
			// img2.src = url;
			// $('body').append(img2.outerHTML);

			// 	// var fd = new FormData();
			// 	// fd.append('file', file);

			// 	// var xhr = new XMLHttpRequest();
			// 	// xhr.open('POST', 'upload.php', true);
			// 	// xhr.onload= function(e) {
			// 	// 	console.log('onload', e);
			// 	// 	// status ok
			// 	// 	if (this.status == 200) {
			// 	// 		var response = JSON.parse(this.response);
			// 	// 		console.log(response);

			// 	// 		var canvas2 = document.createElement('canvas');
			// 	// 		var ctx2 = canvas2.getContext("2d");
			// 	// 		var img2 = new Image();
			// 	// 		img2.onload = function(){
			// 	// 			canvas2.width  = img2.width;
			// 	// 			canvas2.height = img2.height;
			// 	// 			ctx2.drawImage(img2, 0, 0);
			// 	// 			$('body').append(img2);
			// 	// 			var du = canvas2.toDataURL('image/png');
			// 	// 			console.log(du);
			// 	// 		};
			// 	// 		img2.src = response.data;
			// 	// 	}
			// 	// };
			// 	// // send
			// 	// xhr.send(fd);

			// 	// $('body').append(img.outerHTML);
			// };
			// img.src = "data:image/svg+xml;base64," + btoa(svg_xml);
		};

		function dataURItoBlob(dataURI) {
		    var byteString;
			if (dataURI.split(',')[0].indexOf('base64') >= 0)
			    byteString = atob(dataURI.split(',')[1]);
			else
			    byteString = unescape(dataURI.split(',')[1]);
			var array = [];
			for (var i = 0; i < byteString.length; i++) {
				array.push(byteString.charCodeAt(i));
			}

			var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
			return new Blob([new Uint8Array(array)], {
				type: mimeString
			});
		}
	})
	.controller('FeedController', function($scope, Page, transition){
		// set title n enable content
		Page.setTitle('| Feed');
		Page.isContent = true;
	})
	.controller('SplashController', function($scope, $compile, Page, transition, imageReader){
		Page.setTitle('| Splash');
		Page.isContent = true;

		$(window).scroll(function(){
			if ($(window).scrollTop() > 100) {
		        $('aside').css('top', 10);
		    } else {
		    	 $('aside').css('top', 100);
		    }
		});

		$scope.splash = {
			editor: {
				logo : {
					w:null,
					h:null,
					x:null,
					y:null
				},
				ch : {
					x:null,
					y:null
				}
			},
			dimensions: {
				iphone4: {
					width  : 640,
					height : 920
				},
				iphone5: {
					width  : 640,
					height : 1096
				},
				ipad: {
					width  : 1536,
					height : 2048
				}
			},
			logo: {
				iphone4: {
					width  : 447,
					height : 220,
					x:97,
					y:120
				},
				iphone5: {
					width  : 447,
					height : 220,
					x:97,
					y:164
				},
				ipad: {
					width  : 1009,
					height : 354,
					x:257,
					y:422
				}
			},
			ch: {
				iphone4: {
					x : 167,
					y : 608
				},
				iphone5: {
					x : 167,
					y : 745
				},
				ipad: {
					x : 405,
					y : 1043
				}
			}
		};

		var splashType = null;

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


		$scope.doSetting = function($event){
			var $btnTemplate = $($event.currentTarget);
			var $btnCancel       = $btnTemplate.next();
			var $templateField   = $btnTemplate.siblings('#templates');
			var $settingField    = $btnTemplate.siblings('#settings');
			var $contentField    = $('#splash-editor .tab-content');
			var $svgEditor       = $('#svg-editor');
			var $liActive        = $('ul > li.active > a', $templateField);
			var tplShowSplash    = $scope.tplShowSplash = $liActive.data('splash');

			splashType = tplShowSplash;
			
			var settings = {
				field : {
					template   : $templateField,
					setting    : $settingField,
					content    : $contentField
				},
				btn: {
					template : $btnTemplate,
					cancel   : $btnCancel
				},
				editor : {
					svg : $svgEditor
				},
				attributes : {
					tplShowSplash : tplShowSplash
				}
			};

			// alert overwrite
			if($btnTemplate.hasClass('overwrite')){
				$('#popup-overwrite').bind('overwrite', function(){
					var self = this;
					$('.blockOverlay').click();
					$('span.jPicker').remove();
					$.jPicker.List[0].color.active.val('ahex', 'FFFFFFFF'); //last 2 are alpha
					bannerSetting(settings, true);
				});
				// show message
				$.blockUI({
					message: $('#popup-overwrite'),
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
				$templateField.show(400, function(){
					$btnCancel.show();
					$btnTemplate.addClass('overwrite').html('<i class="icon-cog"></i> Settings');
					$contentField.show();
					$settingField.hide();
					$svgEditor.hide();
				});
				return;
			}
			bannerSetting(settings, false);
		};

		$scope.cancelTemplate = function($event){
			$('#templates').trigger('cancelTemplate');
		};

		$scope.overwiriteTplYes = function(evt){
			$('#popup-overwrite').trigger('overwrite');
		};
		$scope.overwiriteTplNo = function(evt){
			$('.blockOverlay').click();
			$('#templates').trigger('cancelTemplate');
		};

		var bannerSetting = function( options, overwrite ){
			var $tpl          = options.field.template;
			var $settingField = options.field.setting;
			var $tplContent   = options.field.content;
			var $btnTemplate  = options.btn.template;
			var $btnCancel    = options.btn.cancel;
			var $editorSVG    = options.editor.svg;
			var tplShowSplash = options.attributes.tplShowSplash;

			console.log('settings', options);
			// tooltip
			$('a').tooltip();

			if( overwrite ){
				// remove class overwrite
				$btnTemplate.removeClass('overwrite');
				// clear all setting input file
				$('input[type="file"]', $settingField).each(function(e,i){
					$(this).val('');
				});
			}

			// canvas dimensions
			var logoDimension = $scope.splash.logo[tplShowSplash];
			var chDimension   = $scope.splash.ch[tplShowSplash];

			console.log('logoDimension', tplShowSplash, logoDimension);

			// compile SVG (inject scope)
			var $svg = getSVGCompiled($tplContent, 'splash', chDimension);
			$tpl.hide(400, function(){
				$(this).hide();
				$tplContent.hide();
				$btnCancel.hide();
				$btnTemplate.html('<i class="icon-list"></i> Choose Template');

				$settingField.show(400,function(){
					// clear editor
					$editorSVG.html('');

					// append svg
					$editorSVG.append($svg);

					// show editor
					if($editorSVG.is(':hidden')) $editorSVG.show();
					
					// input color picker
					$('#input-background-color').jPicker({
						window : {
							effects :  { type: 'fade' },
							position : {
								x : 'screenCenter',
								y : 'center'
							}
						},
						images : {
							clientPath : 'assets/css/jpicker/images/'
						}
					}, function(color, context) {
			          	var all = color.val('all');
			          	if( all.hex == 'ffffff' ){
			          		$('rect', $svg)[0].setAttribute('stroke', 'black');
			          		$('#logo-footer-color', $svg).hide();
			          		$('#logo-footer-white', $svg).show();
			          	} else {
			          		$('rect', $svg)[0].setAttribute('stroke', 'transparent');
			          		$('#logo-footer-color', $svg).show();
			          		$('#logo-footer-white', $svg).hide();
			          	}
			        	$('rect', $svg)[0].setAttribute('fill', '#' + all.hex);
			        }, function(color, context) {
			          	var all = color.val('all');
			          	if( all.hex === 'ffffff' ){
			          		$('#logo-footer-color', $svg).hide();
			          		$('#logo-footer-white', $svg).show();
			          	} else {
			          		$('#logo-footer-color', $svg).show();
			          		$('#logo-footer-white', $svg).hide();
			          	}
			        	$('rect', $svg)[0].setAttribute('fill', '#' + all.hex);
			        });

					/* initialize image reader */
					
					// logo
					imageReader.init({
						dropArea      : '#drop-logo',
						inputFileEl   : '#input-logo',
						inputFileText : 'Select an image',
						section       : 'splash',
						compile       : function(buttonEl, changeEl, blob, image){
							// change text label input file
							var labelEl = $(buttonEl).parent().siblings('label')[0];
							labelEl.innerHTML = labelEl.innerHTML.replace(/upload/i, 'Edit');

							console.log('changeEl', changeEl);

							$.blockUI({
								message: '<i class="icon-spinner icon-spin icon-large"></i> Please wait...',
								css: {
									border: '1px solid #007dbc'
								}
							});
							// upload to resize
							imageReader.uploadFile({
								file: blob,
								name: 'splash',
								size: logoDimension
							}, function(response){
								console.log(response);
								var $parent = $(changeEl).parent();
								// change image src only
								changeEl.setAttribute('xlink:href', response.dataURI);
								changeEl.setAttribute('width','{{splash.editor.logo.w}}');
								changeEl.setAttribute('height','{{splash.editor.logo.h}}');
								changeEl.setAttribute('x','{{splash.editor.logo.x}}');
								changeEl.setAttribute('y','{{splash.editor.logo.y}}');
								// remove old image logo
								$('image', $parent).eq(0).remove();
								// then prepend new compiled image logo
								$parent.append($compile(changeEl)($scope));
								// applying scope
								$scope.$apply(function(scope){
									scope.splash.editor.logo.w = logoDimension.width;
									scope.splash.editor.logo.h = logoDimension.height;
									scope.splash.editor.logo.x = logoDimension.x;
									scope.splash.editor.logo.y = logoDimension.y;
									// watchers, update y logo horizontal
									scope.$watch('splash.editor.logo.y', function(input){
										scope.splash.editor.logo.y = input;
										$("#slider-vertical-header").slider( "option", "value", (h - input) );
									});
									// slider
									var h = $scope.splash.dimensions[splashType].height;
									$("#slider-vertical-header").slider({
										orientation: "vertical",
										min: 0,
										max: h,
										value: (h - logoDimension.y),
										slide: function( event, ui ) {
											var y = h - ui.value;
											$scope.$apply(function(scope){
												scope.splash.editor.logo.y = y;
											});
										}
									});
								});
								$.unblockUI();
							});
						}
					});
				});
			});
		}

		var getSVGCompiled = function ($tplContent, type, chDimension){
			var $svg = $('.active > svg', $tplContent).clone();
			$svg.attr('id', 'svg-editor-'+type);
			
			$('#logo', $svg).children().map(function(i,e){
				if($(e).attr('id') !== undefined) {
					$(e).attr('id', function(index, id){
						return id.replace(/(\d+)/, function(fullMatch, n) {
							return 'editor-'+type;
						});
					});
					if(i > 0) e.setAttribute('y', '{{splash.editor.ch.y}}');
				}
			});

			var h = $scope.splash.dimensions[splashType].height;

			$scope.splash.editor.ch.y = chDimension.y;
			$scope.$watch('splash.editor.ch.y', function(input){
				$scope.splash.editor.ch.y = input;
				$("#slider-vertical-footer").slider( "option", "value", (h - input) );
			});

			$("#slider-vertical-header").slider({
				orientation: "vertical",
				min: 0,
				max: 0,
				value: 0
			});

			$("#slider-vertical-footer").slider({
				orientation: "vertical",
				min: 0,
				max: h,
				value: (h - chDimension.y),
				slide: function( event, ui ) {
					var y = h - ui.value;
					console.log(y);
					$scope.$apply(function(scope){
						scope.splash.editor.ch.y = y;
					});
				}
			});

			return $compile($svg)($scope);
		};

		// SVG to dataURI
		$scope.convert = function(evt){
			$.blockUI({
				message: $('#popup-loading-img'),
				overlayCSS:{
					opacity : '0.8'
				},
				css: {
					background : 'transparent',
					border     : 'none',
					top        : ($(window).height() - 350) / 2 + 'px',
					left       : ($(window).width() - 375) / 2 + 'px',
					width      : '350px'
				}
			});

			var svg  = $('#svg-editor > svg')[0];
			// create canvas banner like
			createCanvas(svg, function(img, imgDataURI){
				// create download anchor
				var downloadLink       = document.createElement('a');
				downloadLink.title     = 'Download '+ splashType +' splash screen';
				downloadLink.href      = imgDataURI;
				downloadLink.target    = '_blank';
				downloadLink.className = 'btn btn-success';
				downloadLink.innerHTML = '<i class="icon-download-alt"></i> Download';
				downloadLink.download  = 'splash-'+ splashType +'.jpg';
				// set image class
				img.className  = 'span12';
				// define generate element
				var $generate = $('#popup-result-generate-image-modal');
				var $generateBody = $generate.find('.modal-body');
				// create template banner list
				var tplImages = '<li class="span12 banner-like">' +
									'<div class="thumbnail">' + img.outerHTML +
										'<div class="caption">' +
											'<h3>Splash Screen</h3>' +
											'<p>This is preview splash scrren for '+ splashType +'</p>'+
											'<p>'+ downloadLink.outerHTML +'</p>' +
										'</div>' +
									'</div>' +
								'</li>';
				// append banner images
				$generateBody.find('ul').html('');
				$generateBody.find('ul').append(tplImages);
				// open popup
				setTimeout(function() {
					$.unblockUI({
						onUnblock: function() {
							$generate.modal('show');
							$('.download-zip', $generate).hide();
						}
					});
				}, 1000);
			});
		};

		// create canvas to generate image
		function createCanvas(svg, callback){
			var svg_xml = (new XMLSerializer()).serializeToString(svg);
			var canvas  = document.createElement('canvas');
			// get canvas context
			var ctx = canvas.getContext("2d");
			var img = new Image();
			img.onload = function(){
				canvas.width  = img.width;
				canvas.height = img.height;
				ctx.drawImage(img, 0, 0);
				var imgDataURI = canvas.toDataURL('image/jpg');
				callback(img, imgDataURI);
			};
			img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent( svg_xml )));
		}
	});