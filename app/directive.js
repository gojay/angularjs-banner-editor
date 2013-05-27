/**
 * BannerComponents Module
 *
 * Description
 */
angular.module('BannerComponents', [])
	.directive('bannerEditor', function(imageReader){
		// Runs during compile
		return {
			scope: {
				title : '=',
				description : '=',
				price : '=',
				logo : '=',
				banner : '='
			}, // {} = isolate, true = child, false/undefined = no change
			restrict: 'EAC', // E = Element, A = Attribute, C = Class, M = Comment
			templateUrl: 'partials/components/banner-editor.html',
			replace: true,
			link: function($scope, iElm, iAttrs, controller) {
				// SVG to dataURI
				$scope.convert = function(evt){
					// get svg n convert foreignobject to xml
					var svg     = $('#svg-editor > svg')[0];
					var svg_xml = (new XMLSerializer()).serializeToString(svg);
					// get canvas dimensions
					var canvasDimensions = JSON.parse($('input[name="canvasDimensions"]').val());
					// create canvas
					var canvas    = document.createElement('canvas');
					canvas.width  = canvasDimensions.width;
					canvas.height = canvasDimensions.height;
					// get canvas context
					var ctx = canvas.getContext("2d");
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
							// Base64-encode the XML as data URL
							var img = new Image();
							img.onload = function(){
								// drawing canvas image
								ctx.drawImage(img, 0, 0);
								// convert canvas to datauri
								var imgDataURI = canvas.toDataURL('image/png');
								// create anchor element
								var downloadLink       = document.createElement('a');
								downloadLink.title     = 'Download banner';
								downloadLink.href      = imgDataURI;
								downloadLink.target    = '_blank';
								downloadLink.className = 'btn btn-success';
								downloadLink.innerHTML = 'Download banner';
								downloadLink.download  = 'banner.png';
								// append canvas n anchor
								iElm.append(canvas);
								iElm.append(downloadLink);
								// window.open(canvas.toDataURL('image/png'));
							};
							img.src = "data:image/svg+xml;base64," + btoa(svg_xml);
						}
					});
				};

				// binding background reposition
				$('body').bind('bgReposition', function(e, data){
					// define svg & image background element
					var $svg      = data.svg;
					var imageBG   = data.imageBG;
					var imageBgEl = imageBG.like;
					// get image background dimension
					var w = parseInt(imageBgEl.getAttribute('width')),
						h = parseInt(imageBgEl.getAttribute('height'));
					// get different size with canvas
					var maxW = parseInt(w - data.dimension.width),
						maxH = parseInt(h - data.dimension.height);
					// helper
					var toggleEl = (data.type == 3) ? '#logo, #description' : '#logo, #description, #price' ;
					var top, x, y = 0;
					// set draggable element
					var $bgDraggable = $('#background > rect', $svg).eq(0);
					// init draggable
					$bgDraggable.draggable({
						cursor: "move",
						containment: [0, 0, 810, 381],
						start: function(e, ui) {
							// hidden elements while dragging
							$(toggleEl, $svg).hide();
							$('#background > rect', $svg).eq(1).hide();
							// set x, y position
							x = parseInt(imageBgEl.getAttribute('x'));
							y = parseInt(imageBgEl.getAttribute('y'));
							// set start top position
							top = ui.position.top;
						},
						drag: function(event, ui) {
							var pos = ui.position;
							// calculate left n top, continues current position
							var calcLeft = x + pos.left;
							var calcTop  = y + (pos.top - top);
							// set max position
							var newX = (calcLeft > 0) ? 0 : (calcLeft < -maxW) ? -maxW : calcLeft;
							var newY = (calcTop > 0) ? 0 : (calcTop < -maxH) ? -maxH : calcTop;
							// set attribute position
							angular.forEach(imageBG, function(e){
								e.setAttribute('x', newX);
								e.setAttribute('y', newY);
							});							
						},
						stop: function(event, ui) {
							// show elements after dragging
							$(toggleEl, $svg).show();
							$('#background > rect', $svg).eq(1).show();
						}
					});
				});

				// start background reposition
				$scope.doBGReposition = function(evt){
					var $button  = $(evt.currentTarget);
					var $svgLast = $('#svg-editor > svg#svg-editor-enter');
					var $dropEl  = $('.drop-area');
					if($dropEl.is(':hidden')){
						$dropEl.fadeIn('slow');
						$svgLast.show();
						$button.html('<i class="icon-move"></i> Background Reposition');
					} else {
						$dropEl.fadeOut('slow');
						$svgLast.hide();
						$button.html('<i class="icon-ok"></i> Done');
					}
				};
			}
		};
	});