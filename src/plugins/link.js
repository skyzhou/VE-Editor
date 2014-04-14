
;(function(v){
	v.$addPlugin({
		command:'createLink',
		description:"添加链接",
		panel:v.util.tmpl(QNOTE.TPL.CREATELINK,{}),
		onAfterDialog:function(panel){
			var that = this;
			var href = 'http://';
            that.saveRange();
			var frame = v.util.writeFrame(
				"v_add_link",
				panel.firstChild,
				v.util.tmpl(QNOTE.TPL.CL_IFRAME,{domain:document.domain,href:href}),
				function(link){
                    var range = that.getRange();
                    that.selectRange(range);

					if(link){
                        var text = range.toString && range.toString();
                        // 有选中文本
						if (text) {
                            that.execCommand('createLink', link, {from:'dialog'});
                        }
                        // 无选中文本，手动插入
                        else {
                            // 有range要插入，没有range制造range也要插入
                            that.editorElement.focus();
                            range = that.getRange();
                            // 插入
                            range.insertNode($('<a>').attr('href', link).text(link)[0]);
                            that.displayPanel(null,{delay:300});
                        }
					}
					else{
						that.execCommand('unlink','unlink',{from:'dialog'});	
					}
				},
				{height:"30px",width:"360px"}
			);
		}
	});
})(ve);