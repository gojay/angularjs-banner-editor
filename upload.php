<?php
// Upload
include 'class.upload.php';

function data_uri($file, $mime) {
  	$contents=file_get_contents($file);
  	$base64=base64_encode($contents);
  	return "data:$mime;base64,$base64";
}

$upload_dir = dirname(__FILE__) . DIRECTORY_SEPARATOR . 'uploads';

$name   = $_REQUEST['name'];
$width  = $_REQUEST['width'];
$height = $_REQUEST['height'];

$fileImg  = $_FILES['file']['tmp_name'];
$fileName = $_FILES['file']['name'];
$fileType = $_FILES['file']['type'];
$ext      = pathinfo($fileName, PATHINFO_EXTENSION);

// do upload n resize
$imagehand = new upload( $fileImg );
$imagehand->file_dst_name_ext  = $ext;
$imagehand->file_new_name_body = $name;
$imagehand->file_overwrite     = true;
$imagehand->image_resize       = true;
// $imagehand->image_ratio_crop   = true;
$imagehand->image_x            = $width;
$imagehand->image_y            = $height;
$imagehand->image_convert      = $ext;
$imagehand->Process($upload_dir);
if( !$imagehand->processed ) throw new Exception("Error upload $fileName");

sleep(2);

// create data uri
echo json_encode(array(
	'url' => data_uri($imagehand->file_dst_pathname, $fileType)
));
?>