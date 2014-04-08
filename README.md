# VE-Editor



* 轻量（48k）
* 无依赖（只需引入ve.min.js）
* 兼容性好（ie6+、chrome、firefox等主流浏览器）
* 可扩展（功能插件化，API完善）
* 支持浮动工具栏编辑


## 效果

![screenshot](https://raw.github.com/skyzhou/VE-Editor/master/demo/ve-editor.jpg)

__demo__: [http://skyzhou.com/ve/demo/index.html](http://skyzhou.com/ve/demo/index.html)

1、引入ve.min.js

```html

<script src="ve.min.js"> </script>

```

2、指定编辑器所在容器

```html
<div id="editor"></div>
```

3、在指定的容器里创建编辑器实例

```javascript
var ed =new ve.Create({
		commands:['FontSize','bold','underline','strikethrough','italic',"forecolor",'backcolor','justifyleft','justifycenter','justifyright','createLink','image'],
        container:ve.$("editor"),
        height:'300px',
        width:'700px',
        imgUploadUrl:'http://skyzhou.com/ve/upload.php'
	});
```
4、没有第四步了，这就是全部



## 参数配置

* commands:需要启用的插件，详见【插件】
* container:编辑器所在容器，默认空元素
* height:编辑器的高度，默认300px
* width:编辑器的宽度，默认100%
* imgUploadUrl:图片上传地址，详见【图片上传】
* fiexdToolbar:是否启用固定工具栏，默认启用
* floatToolbar:是否启用浮动工具栏，默认启用



## 图片上传

如果启用了"image"插件，需要设置imgUploadUrl，imgUploadUrl的传参和返回如下（可参考upload.php）：

* 传参

	image:文件内容
	format:指定返回格式，可选格式（html,json）

* 回参

	code:返回码，如果成功则为0
	url:图片的完整url地址，带协议
	msg:如果出错，定义出错原因

## 插件


* bold 加粗
* italic 斜体
* underline 下划线
* forecolor 前景色
* strikethrough 删除线
* createLink 创建链接
* image 插入图片
* backcolor 背景色
* FontSize 字体
* justifyleft 居左
* justifyright 居右
* justifycenter 居中

## 目录结构

```
ve-editor/
├── demo				
├── src/				
├    ├──lib				公共函数
├    ├──marks			标记语言扩展集
├    ├──plugins			插件集
├    ├──template		Html模版
├    ├──edior.js		主程序
├    ├──event.js		事件处理
├    ├──keyborad.js		键盘处理
├    ├──mark.js			标记语言接口
├    ├──plugins.js		插件接口
├    ├──range.js		选区处理
├    ├──toolbar.js		工具栏处理
├── Gruntfile.js
├── package.json
├── ve.js
└── ve.min.js
```

## License

MIT


