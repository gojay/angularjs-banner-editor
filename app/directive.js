/**
 * BannerComponents Module
 *
 * Description
 */
angular.module('BannerComponents', [])
	.directive('backgroundEditor', function(imageReader){
		// Runs during compile
		return {
			scope: {
				title : '=',
				description : '=',
				price : '=',
				logo : '=',
				isEditor : '='
			}, // {} = isolate, true = child, false/undefined = no change
			restrict: 'EAC', // E = Element, A = Attribute, C = Class, M = Comment
			templateUrl: 'partials/components/background-editor.html',
			// replace: true,
			// transclude: true,
			// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
			link: function($scope, iElm, iAttrs, controller) {

				// imageReader.init({
				// 	dropArea      : '#drop-background',
				// 	inputFileEl   : '#input-background',
				// 	inputFileText : 'Add Background'
				// });
				// imageReader.init({
				// 	dropArea      : '#drop-area',
				// 	inputFileEl   : '#input-logo',
				// 	inputFileText : 'Add Logo'
				// });
				// imageReader.init({
				// 	dropArea      : '#drop-area',
				// 	inputFileEl   : '#input-price-1',
				// 	inputFileText : 'Add Price 1'
				// });
				// imageReader.init({
				// 	dropArea      : '#drop-area',
				// 	inputFileEl   : '#input-price-2',
				// 	inputFileText : 'Add Price 2'
				// });
				// imageReader.init({
				// 	dropArea      : '#drop-area',
				// 	inputFileEl   : '#input-price-3',
				// 	inputFileText : 'Add Price 3'
				// });

				// http://www.daniweb.com/web-development/threads/421183/saving-mathml-rendered-to-canvas-as-png
				// http://damien.antipa.at/2013/03/01/thoughts-on-rendering-html-markup-into-an-image-or-canvas/
				// http://people.mozilla.org/~roc/rendering-HTML-elements-to-canvas.html
				$scope.convert2 = function(evt) {

					var svg = $('#svg-editor svg')[0],
    					img = document.querySelector('img'),
    					canvas = document.querySelector('canvas'),
    					ctx = canvas.getContext("2d");

    				$(img).hide();

					var svgxml = (new XMLSerializer).serializeToString(svg);
					var svgDataImage = new Blob([svgxml], {
						type: "image/svg+xml;charset=utf-8"
					});
					var DOMURL = (window.URL || window.webkitURL);
					var url = DOMURL.createObjectURL(svgDataImage);
					img.onload = function(){
						ctx.drawImage(img, 0, 0, img.width, img.height);
    					DOMURL.revokeObjectURL(url);
    					// window.open(canvas.toDataURL('image/png'));
					};
					img.src = url;

					$('body')
						.block({
							timeout: 3000,
							message: '<h1>Processing</h1>',
							css: {
								top: '50%',
								border: '3px solid #a00'
							},
							onUnblock: function() {
								$('#convert-result').css('height', 'auto');
								$(img).show();
							}
						});
				};

				$scope.convert = function(evt){

					var svg = $('#svg-editor svg')[0];
					var svg_xml = (new XMLSerializer()).serializeToString(svg);
					var canvasDimensions = JSON.parse($('input[name="canvasDimensions"]').val());
					var canvas = document.createElement('canvas');
					var ctx = canvas.getContext("2d");
					canvas.width  = canvasDimensions.width;
					canvas.height = canvasDimensions.height;
					var downloadLink = document.createElement('a');
					// $('body').css('height', '800px')
					$.blockUI({
						timeout: 3000,
						message: '<h2>Please wait...</h2>',
						css: {
							top: '50%',
							border: '3px solid #a00'
						},
						onUnblock: function() { 
							// Base64-encode the XML as data URL
							var img = new Image();
							img.onload = function(){
								ctx.drawImage(img, 0, 0);
								var imgDataURI = canvas.toDataURL('image/png');
								downloadLink.title = 'Download banner';
								downloadLink.href = imgDataURI;
								downloadLink.target = '_blank';
								downloadLink.className = 'btn btn-success';
								downloadLink.innerHTML = 'Download banner';
								downloadLink.download = 'banner.png';
								iElm.append(canvas);
								iElm.append(downloadLink);
								// window.open(canvas.toDataURL('image/png'));
							};
							img.src = "data:image/svg+xml;base64," + btoa(svg_xml);
			            }
					});


					/*svg.toDataURL("image/png", {
						callback: function(data) {
							img.setAttribute("src", data);
							// window.open(data);
						}
					});*/
				};

				$('body').bind('bgReposition', function(e, canvasDimensions){
					var $svg = $('#svg-editor > svg');
					var imageReposition = $('image.bg', $svg)[0];
					var maxW = imageReposition.getAttribute('width') - canvasDimensions.width,
						maxH = imageReposition.getAttribute('height') - canvasDimensions.height,
						x = imageReposition.getAttribute('x'),
						y = imageReposition.getAttribute('y');

					var $bgDraggable = $('#background > rect', $svg).eq(0);
					console.log('$bgDraggable', $bgDraggable[0]);
					$bgDraggable.draggable({
	                    cursor: "move",
						start: function(e, ui) {
							$('#logo', $svg).hide();
							$('#description', $svg).hide();
							$('#price', $svg).hide();
							console.log('start', ui.position);
							console.log('start', x, y);
							ui.position.top = y;
							ui.position.left = x;
	                    },
	                    drag: function(event, ui) {
							var pos = ui.position;
							var newX = (pos.left > 0) ? 0 : (Math.abs(pos.left) > maxW) ? -Math.abs(maxW) : pos.left;
							var newY = (pos.top > 0) ? 0 : (Math.abs(pos.top) > maxH) ? -Math.abs(maxH) : pos.top;
							imageReposition.setAttribute('x',newX);
							imageReposition.setAttribute('y',newY);
							console.log(pos);
	                    },
	                    stop: function(event, ui) {
							console.log('stop', ui.position);
							x = ui.position.left;
							y = ui.position.top;
							$('#logo', $svg).show();
							$('#description', $svg).show();
							$('#price', $svg).show();
	                    }
	                });
				});

				$scope.reposition = function(evt){
					console.log('reposition', evt.currentTarget);
					var $button = $(evt.currentTarget);
					var $dropEl = $('#drop-background');
					if($dropEl.is(':hidden')){
						$dropEl.show();
						$button.html('<i class="icon-move"></i> Background Reposition');
						$('#background-image').draggable('disable');
					} else {
						$dropEl.hide();
						$button.html('<i class="icon-ok"></i> Done');
						$('#background-image').draggable('enable');
					}
				};
			}
		};
	});