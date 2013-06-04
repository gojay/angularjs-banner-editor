<?php
$usmap = 'uploads/blob.svg';
$im = new Imagick();
$svg = file_get_contents($usmap);

$im->readImageBlob($svg);

/*png settings
$im->setImageFormat("png24");
$im->resizeImage(720, 445, imagick::FILTER_LANCZOS, 1);  // Optional, if you need to resize
*/
/*jpeg*/
$im->setImageFormat("jpeg");
$im->adaptiveResizeImage(810, 381); // Optional, if you need to resize

$im->writeImage('uploads/blob.jpg'); // (or .jpg)
$im->clear();
$im->destroy();
?>