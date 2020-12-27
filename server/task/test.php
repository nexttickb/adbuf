<?php


function getId($url){
	file_get_contents($url);
	$location = '';
	for($i = 0; $i < count($http_response_header); $i++){
		if(strstr($http_response_header[$i], 'Location')){
			$location = $http_response_header[$i];
			break;
		}
	}
	$res = explode('/', parse_url($location, PHP_URL_PATH));
	return $res[count($res) - 2];
}

echo getId('https://vt.tiktok.com/ZSPuqB7o/');

?>
