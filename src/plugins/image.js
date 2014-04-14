
;(function(v){
	//图片尺寸 0-原图 1-100*100 2-160*800 3-200*200 4*400*400 5-800*800 6-1280*1600
	v.$addPlugin({
		command:'image',
		panel:v.util.tmpl(QNOTE.TPL.UPLOADIMG,{}),
		onAfterDialog:function(panel,callback){
			var that = this;
			var div = panel.children[0];
			var action = that.config.imgUploadUrl;
			action += /\?/.test(action)?'&':'?'+'t='+new Date();
			var frame = v.util.writeFrame(
				'v_img_upload',
				div,
				v.util.tmpl(QNOTE.TPL.IMG_IFRAME,{
					domain:document.domain,
					name:'image',
					action:action}
				),
				function(data){
					if(!data){
						that.displayPanel();
						return;
					}
					if(data.url){
						var src = data.url;
						if(callback){
							callback({src:src});
						}
						else{
							that.execCommand("insertimage",src);
						}
						that.displayStatusBar();
					}
					else{
						
						if(callback){
							callback({msg:data.msg || "上传出错！"});
						}
						else{
							that.displayStatusBar(data.msg || "上传出错！");
						}
					}
					that.displayPanel();
				},
				{height:"134px",width:"365px"}
			);
		},
		onInit:function(){
			var that = this;
			v.util.bindEvt(this.editorElement,'dragenter',function(){});
			v.util.bindEvt(this.editorElement,'dragover',function(){});
			v.util.bindEvt(this.editorElement,"drop",function(evt){
				var files=evt.dataTransfer.files;
				if(files && /image/.test(files[0].type)){
					that.uploadImage(files[0],action+"&format=json",{
						complete:function(data){
							if(!data){
								return;
							}
							if(data.url){
								var src = data.url;
								that.execCommand("insertimage",src);
								that.displayStatusBar();
							}
							else{
							}
							return true;
						}
					});
	        	}
			});
		}
	});
	v.$addPlugin({
		command:"insertimage",
		execCommand:function(src,callback){
			var img = document.createElement('img');
			img.src = src;
			img.setAttribute("_event","ve-img");
			this.insertNode(img);
		}
	})
})(ve);