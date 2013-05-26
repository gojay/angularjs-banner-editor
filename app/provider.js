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
						section       : 'background',
						changeEl      : null,
						compile       : null
					};

					/* auto merging default options */

					var config = self.config = $.extend({}, defaults, options);

					/* create better input file with the button element */

					// create the button input file ID
					var buttonFileId = config.inputFileEl + '-button';
					// check the button input file
					if($(buttonFileId).length) $(buttonFileId).remove();
					if($(config.inputFileEl).is(':visible')) $(config.inputFileEl).addClass('hide');
					// create the button input file
					var buttonField = document.createElement('button');
					buttonField.setAttribute('id', buttonFileId.replace(/\#/, ''));
					buttonField.setAttribute('class', 'btn');
					buttonField.innerHTML = config.inputFileText;
					// append child
					$(config.inputFileEl).parent().prepend(buttonField);
					// the button file event
					$(buttonFileId).click(function() {
						$(config.inputFileEl).click();
					});
					self.config['buttonEl'] = buttonField;

					/* input file event */

					$(config.inputFileEl).bind('change', {config : config}, function(evt){
						var file   = evt.target.files[0];
						var config = evt.data.config;
						console.log('config',config);
						console.log('change',file);
						self.handleReadImage(file, config);
					});

					/* drag n drop events */

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

					var buttonEl = config.buttonEl;
					var changeEl = config.changeEl;
					var fr     = new FileReader();
					fr.onload = function(e) {
						console.log('onload target', e.target);

						var image = new Image();
						image.onload = function(){
							console.log(image.width, image.height);
							/*if(! /price/.test(config.section) ){
								changeEl.setAttribute('xlink:href', e.target.result);
								changeEl.setAttribute('width', image.width);
								changeEl.setAttribute('height', image.height);
							}*/
							if( config.compile ) config.compile(buttonEl, changeEl, image);
						};
						image.src = e.target.result;
					};

					// read as data url
					fr.readAsDataURL(file);
				}
			};
		};
	});