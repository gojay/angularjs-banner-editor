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
$isCrop = isset($_REQUEST['crop']) ? $_REQUEST['crop'] : false ;

$fileImg  = $_FILES['file']['tmp_name'];
$fileName = $_FILES['file']['name'];
$fileType = $_FILES['file']['type'];
$ext      = pathinfo($fileName, PATHINFO_EXTENSION);

try{
	// do upload n resize
	$imagehand = new upload( $fileImg );
	$imagehand->file_dst_name_ext  = $ext;
	$imagehand->file_new_name_body = $name;
	$imagehand->file_overwrite     = true;
	$imagehand->image_resize       = true;
	if( $isCrop ) {
		$imagehand->image_ratio_crop = true;
		$imagehand->image_ratio_fill = true;	
	}
	$imagehand->image_x            = $width;
	$imagehand->image_y            = $height;
	$imagehand->image_convert      = $ext;
	$imagehand->Process($upload_dir);
	$imagehand->processed;

	sleep(3);

	$imgURL     = 'http://dev.angularjs/_learn_/angularjs-banner-editor/uploads/' . $imagehand->file_dst_name;
	$imgDataUri = 'data:' . $fileType . ';base64,' . base64_encode(file_get_contents($imagehand->file_dst_pathname));

	// send response
	echo json_encode(array(
		'url'     => $imgURL,
		'dataURI' => $imgDataUri
	));
} 
catch(Exception $e) {
	echo json_encode(array(
		'status'  => false,
		'message' => $e->getMessage()
	));
}

?>