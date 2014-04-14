/**
 * @fileOverview 编辑器主文件
 * @author skyzhou
 * @version 0.9
 */
 
/**
 *@module ve
 */
/**
 *@class ve
 */
var ve = {};
ve.util = ve.util || {};
ve.lib = ve.lib || {};
ve.$ = function(id){
	return document.getElementById(id);
};

;(function(v){
	document.domain = document.domain;
	var uniqid = 0;
	var editors = {};
	var initFn = [];
	var destroyFn = [];
	var readyFn = [];
	var iconUrl = 'http://qzonestyle.gtimg.cn/open_proj/proj_qcloud_v2/ac/light/dashboard/toolbar.png';

	//编辑器模版
	var editorTpl = QNOTE.TPL.EDITOR;

	/**
	 * 编辑器构造函数，通过传入配置信息在指定的容器里面创建一个可编辑的div层.
	 * @class ve.Create
	 * @constructor
	 * @param  {Object} option 参数配置
	 * @example
	 var ed = new ve.Create({
		 	container:$('container'),
		 	commands:['bold','underline','strikethrough'],
		 	width:"600px",
		 	height:"300px",
		 	imgUploadUrl:"http://skyzhou.com/test/upload.php"
	 	})
	 */
	function Create(option){

		//默认配置
		var config = {
			height:'300px',
			width:'100%',
			commands:['bold','italic', 'underline', 'FontSize', "forecolor",'backcolor', 'justifyleft','justifycenter','justifyright','image', 'createLink'],
			container:document.createElement('div'),
			fixedToolbar: 1,
			floatToolbar: 1,
			imgUploadUrl:''
		}

		for(var p in option){
			config[p] = option[p];
		}

		/**
		 * 编辑器配置信息
		 * @property config
		 * @type {Object}
		 * @for ve.Create
		 */
		this.config = config;


		/**
		 * 编辑器唯一ID
		 * @property id
		 * @type {String}
		 * @for ve.Create
		 */
		this.id = ++uniqid;
		

		var eId = 've_'+this.id;
		var sId = 'st_'+this.id;
		var fId = 'fl_'+this.id;
		var tbwId = 'toolbar_wrapper_'+this.id;

		/**
		 * 编辑器所在容器元素
		 * @property containerElement
		 * @type {htmlElement}
		 * @for ve.Create
		 */
		this.containerElement = config.container;
		this.containerElement.innerHTML = v.util.tmpl(editorTpl,{
			eId:eId,
			sId:sId,
			fId:fId,
			tbwId:tbwId,
			config:config
		});

		/**
		 * 编辑器元素
		 * @property editorElement
		 * @type {htmlElement}
		 * @for ve.Create
		 */
		this.editorElement = v.$(eId);
		this.statusElement = v.$(sId);
		this.floatElement = v.$(fId);
		this.fixedToolbarWrapperEl = v.$(tbwId);

		//实例属性
		this.panelinView = [];

		this._init();

		editors[editors] = this;
	}

	Create.prototype = {
		/**
		 * 初始化编辑器
		 * @private
		 */
		_init:function(){
			var that = this;
			v.util.insertStyleSheet(v.util.tmpl(QNOTE.TPL.STYLE,{ua:v.ua,icon:iconUrl}), 'editorStyle');

			for (var i=0,fn;fn = destroyFn[i];i++) {
				fn.call(this);
			}

			initFn.sort(function(a,b){
				return a.index - b.index
			});
			for(var i=0,fn;fn = initFn[i];i++){
				fn.call(this);
			}

			var tm = setInterval(function(){
				if(document.body){
					for(var i=0,fn;fn = readyFn[i];i++){
						fn.call(that);
					}
					clearInterval(tm);
					readyFn = [];
				}
			},100);
		},
		/**
		 * @for ve.Create
		 */
		/**
		 * 获取当前编辑器的内容
		 * @method getContent
		 * @return {String} 内容
		 */
		getContent:function(){
			return this.editorElement.innerHTML;
		},
		/**
		 * 提取当前编辑器内容的标题
		 * @method getTitle
		 * @return {String} 内容
		 */
		getTitle:function(){
			var divNode = document.createElement('div');
			divNode.innerHTML = this.editorElement.innerHTML;
			var ignores = divNode.getElementsByTagName('p');
			for (var i = 0, ignore; ignore = ignores[i]; i++){
				if (ignore.className == 'size') {
					ignore.innerHTML = '';
				}
			}
			
			divNode.innerHTML = divNode.innerHTML.replace(/<\!\-\-no gettitle start\-\->[\s\S]*<\!\-\-no gettitle end\-\->/gi,"");
			var text = divNode.innerText || divNode.textContent || "";
			text = text.replace(/(^\s+|\s+$)/g,'').substr(0,40);
			return text.split(/(\r\n|\r|\n)/)[0];
		},
		/**
		 * 设置编辑器内容
		 * @method setContent
		 * @param  {html} html html文本
		 */
		setContent:function(html,focus,ignore){
			this.editorElement.innerHTML = ignore?html:this.filterHtml(html);
			if(focus){
				this.focus();
			}
		},
		/**
		 * 使得当前编辑器获取焦点/光标
		 * @method focus
		 */
		focus:function(){
			this.setFocusAt(this.editorElement);
		},
		/**
		 * 将函数添加到ready队列，当编辑器初始化完成且document.body已load后执行
		 * @method onReady
		 * @param {Function} fn 函数
		 */
		onReady:function(fn){
			readyFn.push(fn);
		},
		/**
		 * 将编辑器append到指定的元素容器中
		 * @method appendTo
		 * @param {htmlElement} elem 容器
		 */
		appendTo:function(elem){
			elem.appendChild(this.editorElement);
		},

		filterHtml:function(html){
			return v.util.filterHtml(html);
		},

		uploadImage:function(imageBlob,url,options){
			var _self = this;
			var Upload = ve.lib.Upload;
            var loader = new Upload({
                url:url,
                name:"image",
                onprogress:function(name,p1,p2){
                	if(!options.progress || options.progress(name,p1,p2)){
	                    var p = parseInt(p1/p2*100);
	                    if(p>99){
	                        p=99;
	                    }
	                    _self.displayStatusBar("图片上传中："+p+"%");
                	}
                },
                oncomplete:function(data){
                   data = eval('('+data+')');
                   options.complete && options.complete(data)
                }
            });
            loader.addFile(imageBlob);
            loader.send();
		},
		/**
		 * 判断编辑器内容是否为空
		 * @method isEmpty
		 * @return  {Boolean} 
		 */
		isEmpty: function () {
			return (this.editorElement.innerHTML.replace(/<(?!img|embed).*?>/ig, '').replace(/&nbsp;/ig, ' ').replace(/\r\n|\n|\r/, '') == '');
		}
	}
	
	/**
	 * 扩展，为构造函数添加原型方法、静态方法，或为编辑器添加初始化函数
	 * 方法首字母为"$"的为静态方法，通过ve.$**调用。
	 * 前几个字符为"_init"的为初始化函数，会在编辑器初始化的时候被调用
	 * @method $extend
	 * @param  {Object} obj 方法集。
	 * @param {Number} index 添加次序，当有初始化方法时有效
	 * @for ve
	 */
	v.$extend = function(obj,index){
		var index = index || 999;
		for(var p in obj){
			if(p.charAt(0) == '$'){
				v[p] = obj[p];
			}
			else if(/^_init/.test(p)){
				obj[p].index = index;
				initFn.push(obj[p]);
			}
			else if(/^_destroy/.test(p)){
				destroyFn.push(obj[p]);
			}
			else{
				Create.prototype[p] = obj[p];
			}
			
		}
	}
	v.Create = Create;

	//预加载icon
	new Image().src = iconUrl;
})(ve);

