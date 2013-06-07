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
				$scope.disableInputBG     = true;
				$scope.isGenerateDisabled = true;

				$scope.finishedImages = 0;
				$scope.countImages    = 0;

				var self  = this;
				var index = 1;

				// handle single file (template image)
				this.handleTplFile = function(evt){
					var file = evt.target.files[0];
					// validation file image selected
					self.imageValidation(file);
					// file reader
					var fileReader = new FileReader();
					fileReader.onload = function(e){
						self.imageTpl = e.target.result;
						$scope.$apply(function(scope){
							scope.disableInputBG = false;
						});
					};
					// read as data uri
					fileReader.readAsDataURL(file);
				};
				// handle multiple files (background images)
				this.handleMultipleFiles = function(evt){
					var files      = evt.target.files;
					var countFiles = files.length;
					var requests   = [];
					var sizes      = 0;
					// check image tpl is exists
					if( self.imageTpl === undefined ) return;
					// preparing page
					$('#page-templates').addClass('prepare');
					// looping files
					angular.forEach(files, function(file,i){
						// validation file image selected
						self.imageValidation(file);
						// file reader
						var fileReader = new FileReader();
						fileReader.onload = (function(blob){
							return function(e){
								var svg    = SVG('canvas').size(403, 403);
								var imgBG  = svg.image(e.target.result, 395, 395);
								var imgTpl = svg.image(self.imageTpl, 403, 403);
								// add svg id
								svg.attr('id', 'svg-page-' + index);
								imgBG.attr({
									x:5,
									y:5,
									class: 'background'
								});
								// imgTpl.maskWith(imgBG);
								sizes += blob.size;
								requests.push({
									blob:blob,
									size:sizes,
									index:index
								});
								// add to list
								var callback = null;
								// do uploads, if is the last
								if(requests.length == countFiles) {
									callback = function(){
										console.info('start chainedMultipleUpload...');
										setTimeout(function() {
											$('#page-templates').removeClass('prepare').addClass('ready');
											$scope.$apply(function(scope){
												scope.countImages = countFiles;
											});
											self.chainedMultipleUpload(requests, sizes).done(function(response){
												console.log(response);
												// update progress bar completed
												$('.progress').removeClass('progress-striped active').addClass('progress-success');
												// applying isGenerateDisabled to false
												$scope.$apply(function(scope){
													scope.isGenerateDisabled = false;
												});
											});
										}, 3000);
									};
								}
								// add to list
								self.addImgList({id:'img-page-'+index, imguri:e.target.result}, callback);
								self.addSVGList(svg.node, callback);
								// increase index
								index++;
							};
						})(file);
						// read as data uri
						fileReader.readAsDataURL(file);
					});
				};
				// image validation
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
				// add to list
				this.addImgList = function(data){
					var $li  = '<li class="span3 wait">'+
									'<div class="wait"><i class="icon-spinner icon-spin icon-large"></i> Waiting...</div>'+
									'<div class="loading"><i class="icon-spinner icon-spin icon-4x"></i> <span>Processing..</span></div>'+
									'<img id="'+ data.id +'" src="'+ data.imguri +'" />'+
								'</li>';
					$('#page-templates ul.img-list').append($li);
				};
				this.addSVGList = function(svg, callback){
					var $thumb = $('<div class="thumbnail border-none text-center"></div>').append($(svg).attr('style',''));
					var $li  = '<li class="span6 wait">' +
									'<div class="wait"><i class="icon-spinner icon-spin icon-large"></i> Waiting...</div>' +
									'<div class="loading"><i class="icon-spinner icon-spin icon-4x"></i> <span>Processing..</span></div>' +
									$thumb.prop('outerHTML') +
								'</li>';
					$('#page-templates ul.svg-list').append($li);
					if(callback) callback();
				};

				// monitoring multiple uploads
				this.chainedMultipleUpload = function(requests, sizes){
					var deferred = $.Deferred();
					// get count requests
					var countRequest = requests.length;
					// do upload
					var promises = requests.reduce(function(promise, request, _index){
						// get index
						var index = request.index;
						return promise.pipe(function(){
							// get elements
							var $imgIndex = $('#img-page-' + index);
							var $svgIndex = $('#svg-page-' + index);
							// get list element
							var $liImg = $imgIndex.parents('li');
							var $liSVG = $svgIndex.parents('li');
							// change loading class
							$liImg.removeClass('wait').addClass('loading');
							$liSVG.removeClass('wait').addClass('loading');
							// upload to resize
							return self.uploadFile({
								file  : request.blob,
								name  : 'bg-' + request.index,
								index : request.index,
								width : 395,
								height: 395,
								crop  : true
							}).pipe(function(response){
								console.log('response', index, response);
								// change image
								$svgIndex.find('image.background')[0].setAttribute('xlink:href',response.url);
								// remove loading
								$liImg.removeClass('loading');
								// $liImg.addClass('success');
								$liSVG.removeClass('loading');
								// create percentage
								var percent = Math.round((request.size / sizes) * 100);
								// update progress bar
								$('.progress > .bar').css('width', percent + '%');
								// applying finished images
								$scope.$apply(function(scope){
									scope.finishedImages = index;
								});
								// send completed
								if(index >= countRequest) return 'Completed';
							});
						});
					}, deferred.promise());

					// start chain
					deferred.resolve();

					// return final promise
					return promises;
				};
				// upload to resize file
				this.uploadFile = function(data){
					console.log(data);
					// create form data
					var formData = new FormData();
					formData.append('file', data.file);
					formData.append('name', data.name);
					formData.append('width', data.width);
					formData.append('height', data.height);
					formData.append('crop', true);
					// ajax upload
					return $.ajax({
						// processData and contentType must be false to prevent jQuery
						processData	: false,
						contentType	: false,
						type		: 'POST',
						url			: 'upload.php',
						data		: formData,
						dataType	: 'json'
					});
				};
			},
			link: function($scope, iElm, iAttrs, controller) {
				// event listener button input file
				$('#button-main-template').click(function() {
					$('#input-main-template').click();
				});
				$('#button-background-template').click(function() {
					$('#input-background-template').click();
				});
				// event listener input file
				$('#input-main-template').bind('change', controller.handleTplFile);
				$('#input-background-template').bind('change', controller.handleMultipleFiles);
			}
		};
	});