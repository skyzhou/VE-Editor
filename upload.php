<?php
error_reporting(0);
define('UPLOADS','uploads/');
$svr = $_SERVER;
$file = $_FILES['image'];
$format = $_GET['format'];

$pre =  (isset($svr['HTTPS'])&&strtolower($svr['HTTPS'])=='on'?'https':'http').'://'. $svr['HTTP_HOST'].(($p = $svr['SERVER_PORT'])!=80 AND $p != 443 ? ":$p" : '');

$arr = explode('/', $svr["REQUEST_URI"]);
array_pop($arr);
$pre .= implode('/',$arr).'/';


$result = array(
	"code"=>1001,
	"size"=>$file['size']/1024,
	"name"=>$file['name'],
	"msg"=>"文件名不合法",
	"url"=>""
);
if(ereg("^image\/(png|jpg|jpeg|gif|pjpeg)$",strtolower($file['type']))){
	 $fileName = UPLOADS .md5(time()).'.'.end(explode('.', $file['name']));
	 move_uploaded_file($file["tmp_name"],$fileName);
	 $result['code'] = 0;
	 $result['url'] = $pre.$fileName;
}

$result = json_encode($result);

if($format == 'html'){
	$result = '<html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /></head><body><script type="text/javascript">document.domain="'.$svr['HTTP_HOST'].'";frameElement.callback('.$result.');</script></body></html>';

}
echo $result;