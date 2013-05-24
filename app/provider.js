/**
 * BannerProvider Module
 *
 * Description
 */
angular.module('BannerProvider', [])
	.provider('debug', function(){
		var isActive = false;

		this.setDebug = function(isActive) {
			isActive = isActive;
			var consoleHolder = console;
			if (isActive === false) {
				consoleHolder = console;
				console       = {};
				console.log   = function() {};
			}
			else console = consoleHolder;
		};

		this.$get = function(){
			return;
		};
	})
	.provider('imageReader', function(){
		this.$get = function(){
			return {
				init: function(options){
					var self = this;

					var $svg = $('#svg-editor > svg');
					switch(options.section){
						case 'logo':
							options.changeEl = $svg.find('image#logo-image-editor')[0];
							break;
						case 'background':
							options.changeEl = $svg.find('image.bg')[0];
							break;
						case 'price-1':
							options.changeEl = $svg.find('image#price-image-editor-1')[0];
							break;
						case 'price-2':
							options.changeEl = $svg.find('image#price-image-editor-2')[0];
							break;
						case 'price-3':
							options.changeEl = $svg.find('image#price-image-editor-3')[0];
							break;
					}

					var defaults = {
						dropArea      : '#drop-area',
						inputFileEl   : '#input-file',
						inputFileText : 'Upload File',
						section	: 'background',
						changeEl  : null,
						compile : null
					};
					// auto merge default options
					var config = self.config = $.extend({}, defaults, options);

					// create button file for better input file

					// create button input file ID
					var buttonFileId = config.inputFileEl + '-button';
					// check button input file is created
					if($(buttonFileId).length) return;
					// check input file is visible, set hidden if visible
					if($(config.inputFileEl).is(':visible')) $(config.inputFileEl).addClass('hide');
					// create button field
					var buttonField = document.createElement('button');
					buttonField.setAttribute('id', buttonFileId.replace(/\#/, ''));
					buttonField.setAttribute('class', 'btn');
					buttonField.innerHTML = config.inputFileText;
					$(config.inputFileEl).parent().prepend(buttonField);
					// event button file 
					$(buttonFileId).click(function() {
						$(config.inputFileEl).click();
					});

					// event input file 

					$(config.inputFileEl).bind('change', {config : config}, function(evt){
						var file = evt.target.files[0];
						var config = evt.data.config;
						self.handleReadImage(file, config);
					});

					// drag n drop events

					$(config.dropArea)
						// event drop 
						.bind('drop', function(evt){
							evt.stopPropagation();
							evt.preventDefault();

							$(config.dropArea).removeClass('over');

							var original = evt.originalEvent,
								file     = original.dataTransfer.files[0];

							console.log('drop original', original);

							self.handleReadImage(file, config);
						})
						// event drag over
						.bind('dragover', function(evt) {
							evt.stopPropagation();
							evt.preventDefault();
						})
						// event drag enter
						.bind('dragenter', function(evt) {
							evt.stopPropagation();
							evt.preventDefault();
							$(config.dropArea).addClass('over');
						})
						// event drag leave
						.bind('dragleave', function(evt) {
							evt.stopPropagation();
							evt.preventDefault();

							var target = evt.target;
							if ($(this).find(evt.target).length) {
								$(config.dropArea).removeClass('over');
							}
						});
				},

				handleReadImage: function(file, config){
					if (!file.type.match('image.*')) return;

					var changeEl = config.changeEl;
					var fr     = new FileReader();
					fr.onload = function(e) {
						console.log('onload target', e.target);

						var image = new Image();
						image.onload = function(){
							console.log(image.width, image.height);
							/*console.log('is price ', /price/.test(config.section));
							if(! /price/.test(config.section) ){
								changeEl.setAttribute('xlink:href', e.target.result);
								changeEl.setAttribute('width', image.width);
								changeEl.setAttribute('height', image.height);
							}*/
							if( config.compile ) config.compile(changeEl, image);
						};
						image.src = e.target.result;
					};

					// read as data url
					fr.readAsDataURL(file);
				}
			};
		};
	});