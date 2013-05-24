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
				description : '='
			}, // {} = isolate, true = child, false/undefined = no change
			restrict: 'EAC', // E = Element, A = Attribute, C = Class, M = Comment
			templateUrl: 'partials/components/background-editor.html',
			// replace: true,
			// transclude: true,
			// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
			link: function($scope, iElm, iAttrs, controller) {
				imageReader.init({
					dropArea      : '#drop-area',
					inputFileEl   : '#input-background',
					inputFileText : 'Add Background'
				});
				imageReader.init({
					dropArea      : '#drop-area',
					inputFileEl   : '#input-logo',
					inputFileText : 'Add Logo'
				});
				imageReader.init({
					dropArea      : '#drop-area',
					inputFileEl   : '#input-price-1',
					inputFileText : 'Add Price 1'
				});
				imageReader.init({
					dropArea      : '#drop-area',
					inputFileEl   : '#input-price-2',
					inputFileText : 'Add Price 2'
				});
				imageReader.init({
					dropArea      : '#drop-area',
					inputFileEl   : '#input-price-3',
					inputFileText : 'Add Price 3'
				});

				// http://www.daniweb.com/web-development/threads/421183/saving-mathml-rendered-to-canvas-as-png
				// http://damien.antipa.at/2013/03/01/thoughts-on-rendering-html-markup-into-an-image-or-canvas/
				// http://people.mozilla.org/~roc/rendering-HTML-elements-to-canvas.html
				$scope.convert2 = function(evt) {
					// var svg = $('#svg-banner').html();
					
					/*canvg('canvas', svgfix(svg), {
						renderCallback: function() {
							var imgData = canvas.toDataURL('image/jpg');
							var img = new Image();
							$(img).load(function() {
								$("#convert-svg").html("");
								$(img).appendTo("#convert-svg");
							});
							img.src = imgData;

							$('canvas').remove();
						}
					});*/

					var svg = document.querySelector('svg'),
    					img = document.querySelector('img');

    				$(img).hide();

    				// var xml = (new XMLSerializer).serializeToString(svg);
  					// img.src = "data:image/svg+xml;charset=utf-8,"+xml;

					var svgxml = (new XMLSerializer).serializeToString(svg);
					var svgDataImage = new Blob([svgxml], {
						type: "image/svg+xml;charset=utf-8"
					});
					var DOMURL = (window.URL || window.webkitURL);
					var url = DOMURL.createObjectURL(svgDataImage);

					// var canvas = document.querySelector("canvas");
					// var ctx = canvas.getContext("2d");
					// var img = new Image();
					// img.onload = function() {
					// 	ctx.drawImage(img, 0, 0);
					// 	DOMURL.revokeObjectURL(url);
					// };
					// img.src = url;

					img.src = url;

					$('body')
						// .css('height', '300px')
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

					// var canvas = document.getElementById("canvas");
					// var ctx = canvas.getContext("2d");
					// var data = "data:image/svg+xml," +
					//            "<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'>" +
					//              "<foreignObject width='100%' height='100%'>" +
					//                "<div xmlns='http://www.w3.org/1999/xhtml' style='font-size:40px'>" +
					//                  "<em>I</em> like <span style='color:white; text-shadow:0 0 2px blue;'>cheese</span>" +
					//                "</div>" +
					//              "</foreignObject>" +
					//            "</svg>";
					// var img = new Image();
					// img.src = data;
					// img.onload = function() { ctx.drawImage(img, 0, 0); }

					// var svg = $('#svg-banner').html().replace(/>\s+/g, ">").replace(/\s+</g, "<").replace(/<canvas.+/g, "");
					// var svg_xml = (new XMLSerializer).serializeToString(svg);
					// console.log(svg_xml);
					// var ctx = myCanvas.getContext('2d');
					// var img = new Image;
					// img.onload = function(){ ctx.drawImage(img,0,0); };
					// img.src = "data:image/svg+xml;base64,"+btoa(svg_xml);
				};

				$scope.convert = function(evt){
					var svg = document.querySelector("svg");
					var img = document.querySelector("img");

					console.log(svg);

					svg.toDataURL("image/png", {
						callback: function(data) {
							img.setAttribute("src", data);
						}
					});
				};

				var imageReposition = $('#banner-background > image')[0];
				$('#background-image').draggable({
					disabled: true,
                    cursor: "move",
                    drag: function(event, ui) {
						console.log(ui.position);
						var pos = ui.position;
						var x = ( pos.top > 0 ) ? 0 : pos.top;
						var y = ( pos.left > 0 ) ? 0 : pos.left;
						imageReposition.setAttribute('x',x);
						imageReposition.setAttribute('y',y);
                    }
                });

				$scope.reposition = function(evt){
					console.log('reposition', evt.currentTarget);
					var $button = $(evt.currentTarget);
					var $dropEl = $('#drop-area');
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