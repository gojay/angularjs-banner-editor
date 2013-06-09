/**
 * ImageCreatorComponents Module
 *
 * Description
 */
angular.module('ImageCreatorComponents', [])
	.directive('bannerCreator', function(imageReader){
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
			templateUrl: 'partials/components/banner-creator.html',
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
	.directive('feedCreator', function(Page, $compile){
		// Runs during compile
		return {
			restrict: 'EAC', // E = Element, A = Attribute, C = Class, M = Comment
			templateUrl: 'partials/components/feed-creator.html',
			replace: true,
			controller: function($scope, $element, $attrs, $transclude) {

				/* section : template */

				$scope.bg = {
					type  : 0,
					radius: 0,
					crop  : true
				};
				$scope.isHiddenTpl = false;
				// scope watchers
				$scope.$watch('bg.radius', function(radius){
					$scope.bg.radius = radius;
				});
				$scope.$watch('isHiddenTpl', function(isHidden){
					var opacity = isHidden ? 0.2 : 1;
					$('#preview-tpl > svg > image').css('opacity', opacity);
				});

				$scope.doNextStep = function(){
					console.log($scope);
				};

				/* section : background */

				$scope.disableInputBG      = true;
				$scope.isDownloadDisabled  = true;
				$scope.finishedImages = 0;
				$scope.countImages    = 0;

				var self  = this;
				var index = 1;

				this.zip = new JSZip();

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
												// generated zip 
												var DOMURL = window.URL || window.mozURL;
												var link   = DOMURL.createObjectURL(self.zip.generate({type:"blob"}));
												// set anchor link
												var aZip = document.getElementById('downloadZip');
												aZip.download = "images.zip";
												aZip.href     = link;
												// applying isGenerateDisabled to false
												$scope.$apply(function(scope){
													scope.isDownloadDisabled = false;
												});
												// update completed progress
												$('.progress').removeClass('progress-striped active').addClass('progress-success');
												$('.progress > .bar > span').html('<i class="icon-ok"></i> Completed');
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
						alert('File '+ file.name +' is not image. Only JPG, PNG or GIF files are allowed');
						throw new Error('Only JPG, PNG or GIF files are allowed');
					}
					// max 10 mB
					else if (!(file.size && file.size < 10485760)) {
						// file size > 1MB
						alert('File '+ file.name +' is too big!!');
						throw new Error('File is too big!!');
					}
				};
				// add to list
				this.addImgList = function(data){
					var $li  = '<li class="span3 wait">'+
									'<div class="wait"><i class="icon-spinner icon-spin icon-large"></i> Waiting...</div>'+
									'<div class="upload"><i class="icon-spinner icon-spin icon-4x"></i> <span>Uploading..</span></div>'+
									'<div class="generate"><i class="icon-spinner icon-spin icon-4x"></i> <span>Generating..</span></div>'+
									'<img id="'+ data.id +'" src="'+ data.imguri +'" />'+
								'</li>';
					$('#page-templates ul.img-list').append($li);
				};
				this.addSVGList = function(svg, callback){
					var $thumb = $('<div class="thumbnail border-none text-center"></div>').append($(svg).attr('style',''));
					var $li  = '<li class="span6 wait">' +
									'<div class="wait"><i class="icon-spinner icon-spin icon-large"></i> Waiting...</div>'+
									'<div class="upload"><i class="icon-spinner icon-spin icon-4x"></i> <span>Uploading..</span></div>'+
									'<div class="generate"><i class="icon-spinner icon-spin icon-4x"></i> <span>Generating..</span></div>'+
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
					// looping upload
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
							// change upload view
							$liImg.switchClass('wait', 'upload', 0);
							$liSVG.switchClass('wait', 'upload', 0);
							// upload to resize
							return self.uploadFile({
								file  : request.blob,
								name  : 'bg-' + request.index,
								width : 395,
								height: 395,
								crop  : true
							}).pipe(function(response){
								console.log('response', index, response);
								// change bg image
								// $imgIndex.attr('src', response.dataURI);
								$svgIndex.find('image.background')[0].setAttribute('xlink:href',response.dataURI);
								// change generate view
								$liImg.switchClass('upload', 'generate', 0);
								$liSVG.switchClass('upload', 'generate', 0);
								// generate image
								return self.generateImage($svgIndex[0]).done(function(imgDataURI){
									// add to zip
									self.zip.file('image-'+index+'.jpg', imgDataURI, {base64: true});
									// applying finished images
									$scope.$apply(function(scope){
										scope.finishedImages = index;
									});
									// remove generated view
									$liImg.removeClass('generate');
									$liSVG.removeClass('generate');
									// create percentage
									var percent = Math.round((request.size / sizes) * 100);
									// update progress bar
									$('.progress > .bar').css('width', percent + '%');
									// send completed
									if(index >= countRequest) return 'Completed';
								});
							});
						});
					}, deferred.promise());

					// starting chain
					deferred.resolve();

					// return final promise
					return promises;
				};
				// upload to resize image
				this.uploadFile = function(data){
					console.log(data);
					// create form data
					var formData = new FormData();
					formData.append('file', data.file);
					formData.append('name', data.name);
					formData.append('width', data.width);
					formData.append('height', data.height);
					formData.append('crop', data.crop);
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
				// SVG generate image
				this.generateImage = function(svg){
					var deferred = $.Deferred();

					console.log('generating image..');

					var svg_xml = (new XMLSerializer()).serializeToString(svg);
					// create canvas
					var canvas = document.createElement('canvas');
					// get canvas context
					var ctx = canvas.getContext("2d");
					// create image
					var img = new Image();
					img.onload = function(){
						// set canvas dimension
						canvas.width  = img.width;
						canvas.height = img.height;
						// draw image
						ctx.drawImage(img, 0, 0);
						// convert to image jpeg
						var imgDataURI = canvas.toDataURL('image/jpeg');
						// send response
						setTimeout(function() {
							deferred.resolve(imgDataURI);
						}, 2000);
					};
					img.src = "data:image/svg+xml;base64," + btoa(svg_xml);

					return deferred.promise();
				};
			},
			link: function($scope, iElm, iAttrs, controller) {
				// http://api.jqueryui.com/spinner/#entry-examples
				$("#spinner").spinner({
					min:0, max: 100,
					spin: function( event, ui ) {
						console.log(ui.value);
						$scope.$apply(function(scope){
							scope.bg.radius = ui.value;
						});
					}
				});
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