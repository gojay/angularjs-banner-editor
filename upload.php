<?php
error_reporting(0);
if (move_uploaded_file($_FILES['file']['tmp_name'], 'uploads/' . $_FILES['file']['name'] . '.jpg')) {
    echo json_encode(array('status' => 'ok'));
} else {
    header('HTTP', true, 500);
}
?>