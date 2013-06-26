/**
 * ImageCreatorProvider Module
 *
 * Description
 */
angular.module('ImageCreatorProvider', [])
	.provider('Page', function(){
		this.$get = function(){
			return {
				title: '',
				isContent: false,
				setTitle: function(title) {
					this.title = title;
				},
			};
		};
	})
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
	.provider('transition', function(){
		// default
		this.selector        = 'body';
		this.startTransition = 'rotateInRight';
		this.pageTransition  = 'slide';
		this.transition      = {};

		this.setStartTransition = function(startTransition){
			this.startTransition = startTransition;
		};
		this.setPage = function(selector){
			this.selector = selector;
		};
		this.setPageTransition = function(type){
			this.pageTransition = type;
			switch(this.pageTransition){
				case 'whirl':
					this.transition._in = 'whirlIn';
					this.transition.out = 'whirlOut';
					break;

				case 'rotate':
					this.transition._in = 'rotateInLeft';
					this.transition.out = 'rotateOutLeft';
					break;

				case 'tumble':
					this.transition._in = 'tumbleIn';
					this.transition.out = 'tumbleOut';
					break;

				default     :
				case 'slide':
					this.transition._in = 'slideInSkew';
					this.transition.out = 'slideOutSkew';
					break;
			}
		};

		this.$get = function(){
			var selector        = this.selector;
			var startTransition = this.startTransition;
			var pageTransition  = this.pageTransition;
			var classOut        = this.transition.out;
			var classIn         = this.transition._in;
			return {
				isPerspective: function(){
					var perspective = ['whirl', 'rotate', 'tumble'];
					return perspective.indexOf(pageTransition) != -1 ;
				},
				getElement: function(){
					if(selector == 'body' || angular.equals($(selector), [])) return $('body');

					console.log('pageTransition', pageTransition, this.isPerspective());
					if( this.isPerspective() ){
						var height    = $('body').height();
						var top       = $(selector).offset().top;
						var setHeight = height - top;
						$(selector).css('height', setHeight + 'px');
					}

					return $(selector);
				},
				start: function(){
					$('body').addClass(startTransition);
					setTimeout(function(){
						console.log('change html, body css');
						$('html').css({'background':'#fff'});
						$('body').removeClass(startTransition);
					}, 1000);
				},
				change: function(){
					var self  = this;
					var $page = this.getElement();
					// http://api.jquery.com/delay/
					// http://api.jquery.com/queue/
					$page.addClass(classOut).delay(1000).queue(function(next) {

						$(this).removeClass(classOut);
						$(this).addClass(classIn);

						setTimeout(function() {
							if( self.isPerspective() ){
								$page.css('height', '100%');
								$page.removeClass(classIn);
							}
						}, 1000);

						next();
					});
				}
			};
		};
	})
	.provider('imageReader', function(){
		this.$get = function(){
			return {
				init: function(options){
					var self = this;

					var $svg_like  = $('#svg-editor > svg').eq(0);
					var $svg_enter = $('#svg-editor > svg').eq(1);
					switch(options.section){
						case 'logo':
							options.changeEl = {
								like  : $svg_like.find('image#logo-image-editor-like')[0],
								enter : $svg_enter.find('image#logo-image-editor-enter')[0]
							};
							break;
						case 'background':
							options.changeEl = {
								like  : $svg_like.find('#banner-background-editor-like > image')[0],
								enter : $svg_enter.find('#banner-background-editor-enter > image')[0]
							};
							break;
						case 'price-1':
							options.changeEl = {
								like  : $svg_like.find('#price-image-editor-like-1 > image')[0],
								enter : $svg_enter.find('#price-image-editor-enter-1 > image')[0]
							};
							break;
						case 'price-2':
							options.changeEl = {
								like  : $svg_like.find('#price-image-editor-like-2 > image')[0],
								enter : $svg_enter.find('#price-image-editor-enter-2 > image')[0]
							};
							break;
						case 'price-3':
							options.changeEl = {
								like  : $svg_like.find('#price-image-editor-like-3 > image')[0],
								enter : $svg_enter.find('#price-image-editor-enter-3 > image')[0]
							};
							break;
						case 'splash':
							options.changeEl = $svg_like.find('#logo > image').eq(0)[0];
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
					if($(buttonFileId).length) {
						$(buttonFileId).remove();
						var $parent = $(config.inputFileEl).parent();
						$(config.inputFileEl).remove();
						var inputFile = document.createElement('input');
						inputFile.setAttribute('type', 'file');
						inputFile.setAttribute('id', config.inputFileEl.replace(/\#/, ''));
						inputFile.setAttribute('class', 'hide');
						$parent.append(inputFile.outerHTML);
					}
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
						self.handleReadImage(file, config);
					});

					/* drag n drop events

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
						}); */
				},

				handleReadImage: function(file, config){
					var self = this;

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

					console.log('file', file);

					var buttonEl = config.buttonEl;
					var changeEl = config.changeEl;
					var fr    = new FileReader();
					fr.onload = (function(file){
						return function(e){
							console.log('onload target', file);
							var image = new Image();
							image.onload = function(){
								console.log(image.width, image.height);
								if( config.compile ) config.compile(buttonEl, changeEl, file, image);
							};
							image.src = e.target.result;
						}
					})(file);

					// read as data url
					fr.readAsDataURL(file);
				},

				uploadFile: function(data, callback) {

					var self = this;

					// object XMLHttpRequest
					var xhr = new XMLHttpRequest();

					// xhr response
					xhr.onload = function() {

						console.log('XHR load', this);

						// OK
						if (this.status == 200) {
							// parse JSON response
							var response = JSON.parse(this.response);

							console.log('response', response);

							if( callback ) callback( response );

						}
						else
							alert('Error! An error occurred processing image');
					};

					// xhr open
					xhr.open('POST', 'upload.php', true);

					// buat form data
					var formData = new FormData();
					formData.append('file', data.file);
					formData.append('width', data.size.width);
					formData.append('height', data.size.height);
					formData.append('name', data.name);

					// xhr send request
					xhr.send(formData);
				}
			};
		};
	});