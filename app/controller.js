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
			var priceBottom      = $liActive.data('priceBottom');
			var tplDimension     = $liActive.data('tpl');
			var tplShowPrice     = $scope.tplShowPrice = $liActive.data('price').match(/(\d)/)[0];
			
			var settings = {
				field : {
					template : $templateField,
					setting  : $settingField,
					displayTpl : $displayTplField,
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
				attributes : {
					tplDimension : tplDimension,
					priceBottom  : priceBottom,
					tplShowPrice : tplShowPrice
				}
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
				$templateField.show(400, function(){
					$btnCancel.show();
					$btnTemplate.addClass('overwrite').text('Settings');
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
			$('#alert-overwrite').trigger('overwrite');
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
			var priceBottom   = options.attributes.priceBottom;
			var tplShowPrice  = options.attributes.tplShowPrice;

			console.log('settings', options);

			if( overwrite ){
				// remove class overwrite
				$btnTemplate.removeClass('overwrite');
				// clear all setting input file
				$('input[type="file"]', $settingField).each(function(e,i){
					$(this).val('');
				});
			}

			// canvas dimensions
			var canvasDimensions = dimensions[tplDimension];
			// compile SVG (inject scope)
			var tplIndex = tplDimension.match(/(\d)/)[0] - 1;
			var $svg = getSVGCompiled($tplContent, 'like', tplIndex);
			var $svg2 = getSVGCompiled($tplContent, 'enter', tplIndex);
			$tpl.hide(400, function(){
				$(this).hide();
				$tplContent.hide();
				$btnCancel.hide();
				$btnTemplate.text('Choose template');

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
								svg         : $svg,
								imageBG     : changeEl,
								priceBottom : priceBottom,
								dimension   : canvasDimensions
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
					var x = [586,542,345,96,168,198];
					$('#price > text > tspan', $svg).text('Enter to Win!');
					$('#price > text > tspan', $svg).attr('x', x[tplIndex]);
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

		function createCanvas(svg, canvasDimensions, callback){
			var svg_xml = (new XMLSerializer()).serializeToString(svg);
			var canvas    = document.createElement('canvas');
			canvas.width  = canvasDimensions.width;
			canvas.height = canvasDimensions.height;
			// get canvas context
			var ctx = canvas.getContext("2d");
			var img = new Image();
			img.onload = function(){
				ctx.drawImage(img, 0, 0);
				var imgDataURI = canvas.toDataURL('image/png');
				callback(img, imgDataURI);
			};
			img.src = "data:image/svg+xml;base64," + btoa(svg_xml);
		}

		// SVG to dataURI
		$scope.convert = function(evt){
			$.blockUI({
				message: $('#loading-problem'),
				css: {
					background : 'transparent',
					border     : 'none',
					top        : ($(window).height() - 350) / 2 + 'px',
					left       : ($(window).width() - 375) / 2 + 'px',
					width      : '350px'
				}
			});

			$('#svg-editor > svg').each(function(){ $(this).show(); });
			var svg_like  = $('#svg-editor > svg').eq(0)[0];
			var svg_enter = $('#svg-editor > svg').eq(1)[0];
			// get canvas dimensions
			var canvasDimensions = JSON.parse($('input[name="canvasDimensions"]').val());
			// create canvas banner like
			createCanvas(svg_like, canvasDimensions, function(imgLike, imgDataURILike){
				// create download anchor
				var downloadLinkLike       = document.createElement('a');
				downloadLinkLike.title     = 'Download Banner Like';
				downloadLinkLike.href      = imgDataURILike;
				downloadLinkLike.target    = '_blank';
				downloadLinkLike.className = 'btn btn-success';
				downloadLinkLike.innerHTML = 'Download Banner Like';
				downloadLinkLike.download  = 'banner-like.png';
				// create canvas banner enter
				createCanvas(svg_enter, canvasDimensions, function(imgEnter, imgDataURIEnter){
					// create download anchor
					var downloadLinkEnter       = document.createElement('a');
					downloadLinkEnter.title     = 'Download Banner Enter';
					downloadLinkEnter.href      = imgDataURIEnter;
					downloadLinkEnter.target    = '_blank';
					downloadLinkEnter.className = 'btn btn-success';
					downloadLinkEnter.innerHTML = 'Download Banner Enter';
					downloadLinkEnter.download  = 'banner-enter.png';
					// set image class
					imgLike.className  = 'span12';
					imgEnter.className = 'span12';
					// define generate element
					var $generate = $('#result-generate-image');
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
					$generate.find('ul').append(tplImages);
					// open popup
					setTimeout(function() {
						$.unblockUI({
							onUnblock: function() {
								$.blockUI({
									overlayCSS:{
										border : '3px solid #006DCC'
									},
									message: $generate,
									css: {
										cursor: 'default',
										top    : ($(window).height() - $generate.height()) / 2 + 'px',
										left   : ($(window).width() - $generate.width()) / 2 + 'px',
										width  : $generate.width() + 'px',
										height : $generate.height() + 'px'
									}
								});
								$('.blockOverlay').attr('title', 'Click to cancel').click($.unblockUI);
							}
						});
					}, 3000);
				});
			})
			// get svg n convert foreignobject to xml
			// var svg_like = $('#svg-editor > svg').eq(0)[0];
			// var svg_xml_like = (new XMLSerializer()).serializeToString(svg_like);
			// var svg_enter = $('#svg-editor > svg').eq(1)[0];
			// var svg_xml_enter = (new XMLSerializer()).serializeToString(svg_enter);
			// // get canvas dimensions
			// var canvasDimensions = JSON.parse($('input[name="canvasDimensions"]').val());
			// // create canvas
			// var canvas    = document.createElement('canvas');
			// canvas.width  = canvasDimensions.width;
			// canvas.height = canvasDimensions.height;
			// // get canvas context
			// var ctx = canvas.getContext("2d");
			// // Base64-encode the XML as data URL
			// var imgLike = new Image();
			// imgLike.onload = function(){
			// 	// drawing canvas image
			// 	// ctx.drawImage(imgLike, 0, 0);
			// 	// convert canvas to datauri
			// 	var imgDataURI = canvas.toDataURL('image/png');
			// 	// create anchor element
			// 	var downloadLink       = document.createElement('a');
			// 	downloadLink.title     = 'Download banner';
			// 	downloadLink.href      = imgDataURI;
			// 	downloadLink.target    = '_blank';
			// 	downloadLink.className = 'btn btn-success';
			// 	downloadLink.innerHTML = 'Download banner';
			// 	downloadLink.download  = 'banner.png';
			// 	// append canvas n anchor
			// 	// $('#svg-editor')
			// 	// 	.append(canvas)
			// 	// 	.append(downloadLink);
			// 	// window.open(canvas.toDataURL('image/png'));
			// 	imgLike.className = 'span12';

			// 	var imgEnter = new Image();
			// 	imgEnter.onload = function(){

			// 	};
			// 	imgEnter.src = "data:image/svg+xml;base64," + btoa(svg_xml);

			// 	var $generate     = $('#result-generate-image');
			// 	var $generateList = $generate.find('ul');
			// 	var tpl = '<li class="span6 banner-like">' +
			// 				'<div class="thumbnail">' +
			// 					imgLike.outerHTML +
			// 					'<div class="caption">' +
			// 						'<h3>Banner Like</h3>' +
			// 						'<p>This is banner description</p>'+
			// 						'<p>'+ downloadLink.outerHTML +'</p>' +
			// 					'</div>' +
			// 				'</div>' +
			// 			'</li>';
			// 	$generateList
			// 		.append(tpl)
			// 		.append(tpl);

			// 	setTimeout(function() {
			// 		$.unblockUI({
			// 			onUnblock: function() {
			// 				$.blockUI({
			// 					border: '1px solid #006DCC',
			// 					message: $generate,
			// 					css: {
			// 						cursor: 'default',
			// 						top    : ($(window).height() - $generate.height()) / 2 + 'px',
			// 						left   : ($(window).width() - $generate.width()) / 2 + 'px',
			// 						width  : $generate.width() + 'px',
			// 						height : $generate.height() + 'px'
			// 					}
			// 				});
			// 				$('.blockOverlay').attr('title', 'Click to cancel').click($.unblockUI);
			// 			}
			// 		});
			// 	}, 300);
			// };
			// imgLike.src = "data:image/svg+xml;base64," + btoa(svg_xml);
		};

		$scope.test = function(evt){
			var self = evt.currentTarget;
			$.blockUI({
				timeout: 3000,
				message: $('#loading-problem'),
				css: {
					background : 'transparent',
					border     : 'none',
					top        : ($(window).height() - 350) / 2 + 'px',
					left       : ($(window).width() - 375) / 2 + 'px',
					width      : '350px'
				},
				onUnblock: function() {
					$.blockUI({
						border    : '1px solid #0044cc',
						message   : $('#result'),
						css : {
							cursor: 'default',
							top   : ($(window).height() - $('#result').height()) / 2 + 'px',
							left  : ($(window).width() - $('#result').width()) / 2 + 'px',
							width : $('#result').width() + 'px'
						}
					});
					$('.blockOverlay').attr('title','Click to cancel').click($.unblockUI);
				}
			});
		};
	});