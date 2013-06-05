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
					var toggleEl = (data.pricesInBottom) ? '#logo, #description' : '#logo, #description, #price' ;
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

				var displayTpl = true;
				$scope.displayTpl = function(evt, displaySVG){
					$(evt.currentTarget).parent().children().each(function(i, e){
						$(e).attr('disabled',false);
					});
					$(evt.currentTarget).attr('disabled',true);
					if(displaySVG == 'both'){
						$('#svg-editor > svg').each(function(i, e){ $(e).show(); });
						return;
					}
					displayTpl = false;
					$('#svg-editor > svg').each(function(i, e){ $(e).hide(); });
					$('#svg-editor > svg#svg-editor-'+displaySVG).show();
				};

				// start background reposition
				$scope.doBGReposition = function(evt){
					var $button  = $(evt.currentTarget);
					var $svgLast = $('#svg-editor > svg#svg-editor-enter');
					var $dropEl  = $('.drop-area');
					if($dropEl.is(':hidden')){
						$dropEl.fadeIn('slow');
						if(displayTpl) $svgLast.show();
						$button.html('<i class="icon-move"></i> Background Reposition');
					} else {
						$dropEl.fadeOut('slow');
						if(displayTpl) $svgLast.hide();
						$button.html('<i class="icon-ok"></i> Done');
					}
				};
			}
		};
	})
	.directive('pageEditor', function($compile){
		// Runs during compile
		return {
			restrict: 'EAC', // E = Element, A = Attribute, C = Class, M = Comment
			templateUrl: 'partials/components/fbPage.html',
			replace: true,
			controller: function($scope, $element, $attrs, $transclude) {
				$scope.disableInputBG = true;

				var self = this;

				this.setSVGImage = function(imgUri){
					self.imageBGTpl = imgUri;
					$scope.$apply(function(scope){
						scope.disableInputBG = false;
					});
					// var draw   = SVG('canvas').size(403, 403);
					// draw.attr('id', 1);
					// var image  = draw.image('http://dev.angularjs/_learn_/angularjs-banner-editor/uploads/bg_1.jpg', 403, 403);
					// image.attr('x',0);
					// image.attr('y',0);
					// var image2  = draw.image(imgUri, 403, 403);
					// image2.attr('x',0);
					// image2.attr('y',0);
				};

				this.imageValidation = function(file){
					// validation file image selected
					if (!(file.type && file.type.match('image.*'))) {
						// file type is not allowed 
						alert('Only JPG, PNG or GIF files are allowed');
						throw new Error('Only JPG, PNG or GIF files are allowed');
					}
					// max 10 mB
					else if (!(file.size && file.size < 10485760)) {
						// file size > 1MB
						alert('File is too big!!');
						throw new Error('File is too big!!');
					}
				};

				this.addList = function(svg){
					var $thumb = $('<div class="thumbnail border-none text-center"></div>').append($(svg).attr('style',''));
					var $li  = '<li class="span6 wait">'+
									'<div class="loading"><i class="icon-spinner icon-spin icon-large"></i> loading</div>'+ $thumb.prop('outerHTML')
							   '</li>';
					$('#page-templates > ul').append($li);
				};

				this.handleMultipleFiles = function(evt){
					var files = evt.target.files;
					console.log(files);

					if( self.imageBGTpl === undefined ) return;

					for (var i = 0; i < files.length; i++)
					{
						// create index
						var index = i + 1;
						// get blob file
						var file  = files[i];
						// image validation
						self.imageValidation(file);
						// resize file
						self.uploadFile({
							file  : file,
							name  : 'bg-' + index,
							width : 403,
							height: 403
						}, function(imgUri){
							var svg    = SVG('canvas').size(403, 403);
							var imgBG  = svg.image(imgUri, 403, 403);
							var imgTpl = svg.image(self.imageBGTpl, 403, 403);
							svg.attr('id', 'svg-page-' + index);
							imgTpl.maskWith(imgBG);
							// prepend bg image
							console.log($(svg));
							// add to list
							self.addList(svg.node);
						});
					}
				};
				this.uploadFile = function(data, callback){
					// object XMLHttpRequest
					var xhr = new XMLHttpRequest();

					// xhr response
					xhr.onload = function() {

						// OK
						if (this.status == 200) {
							// parse JSON response
							var response = JSON.parse(this.response);

							console.log('response', response);

							if( callback ) callback( response.url );

						}
						else
							alert('Error! An error occurred processing image');
					};

					// xhr open
					xhr.open('POST', 'upload.php', true);

					console.log(data);

					// buat form data
					var formData = new FormData();
					formData.append('file', data.file);
					formData.append('name', data.name);
					formData.append('width', data.width);
					formData.append('height', data.height);
					formData.append('crop', true);

					// xhr send request
					xhr.send(formData);
				};
			},
			link: function($scope, iElm, iAttrs, controller) {

				$('#button-main-template').click(function() {
					$('#input-main-template').click();
				});
				$('#button-background-template').click(function() {
					$('#input-background-template').click();
				});

				$('#input-main-template').bind('change', function(evt){
					var file = evt.target.files[0];

					// image validation
					controller.imageValidation(file);

					var fileReader = new FileReader();
					fileReader.onload = function(e){
						controller.setSVGImage(e.target.result);
					};
					// read as data uri
					fileReader.readAsDataURL(file);
				});
				$('#input-background-template').bind('change', controller.handleMultipleFiles);
			}
		};
	});