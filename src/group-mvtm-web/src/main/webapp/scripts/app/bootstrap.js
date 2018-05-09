define(['jquery', './util'], function ($, $$) {


	$(function () {
		
		if(location.hash =="#login"){
			load(hashToPath('login'));
		}else{
			$$.goTo('login');
		}

		/*
		 监听hashchange切换view
		 */
		$(window).on('hashchange', function () {
			var hash = location.hash;
			if(hash.indexOf('_') !== -1){
				hash = hash.substring(0, hash.indexOf('_'));
			}
			if("#scanId" == hash || "#waiting" == hash || "#takeIdCard" == hash || "#faceToface" == hash || "#readyTurnOnCamera" == hash || "#turnOnCameraWaiting" == hash || "#turnOnCamera" == hash){
				$("#view-part-container").addClass("main-padding-nobg");
			}else{
				$("#view-part-container").removeClass("main-padding-nobg");
			}
			$("#mainMask").hide();
			load(hashToPath(hash));
		});
		//禁用Backspace按键，防止浏览器页面回退
		document.addEventListener('keydown',function(event){
			if ( event.keyCode == 8 && event.target.tagName != 'INPUT' && event.target.tagName != 'TEXTAREA') {
				event.preventDefault();
			}		
		})
		
		function hashToPath(hash) {
			if (hash.indexOf('#') !== -1) {
				hash = hash.substring(1);
			}
			return 'app/' + hash + '/' + hash;
		}

		function load(path) {
			require([path], function (view) {
				view.load();
			});
		}
	});
});
