requirejs.config({
    baseUrl: 'scripts/lib',
    paths: {
        app: '../app'
    },
	waitSeconds: 0
});
require(['app/wosa','app/bootstrap'], function (wosa) {
	/**
	*以下均监听整个浏览器窗口,而非当前文档
	*/
	//禁用鼠标右键
	window.oncontextmenu = function(){   
	   return false;   
	}
	//禁止手势操作(左滑右滑什么的)
	window.ontouchstart = function () {
	    event.preventDefault();
	};
	//当有页面缩放的时候,调用C#接口还原程序分辨率
	window.onresize = function(){
		wosa.restoreZoom();
		console.log("resize,此处需要调用C#方法");
	};
	window.onmousewheel = scrollFunc;
	//开启滚轮
	function scrollFunc(event) {     
      // IE  
      event.cancelBubble=true;  
      event.returnValue = false;  
	  return false;  
	} 
	window.onkeydown = function (event) {
		//禁止alt+左箭头和alt+右箭头跳转页面
	    if ((event.altKey) &&
	        ((event.keyCode == 37) ||   
	        (event.keyCode == 39))) {  
	        event.preventDefault();
	    }
	    //禁用F5
	    if (event.keyCode==116){   
		    event.keyCode = 0;
		    event.cancelBubble = true;
		    return false;
		}
/*	    //禁止ctrl+任何键控制页面
	    if (event.ctrlKey) {
	        event.preventDefault();
	    }*/
	    //在非input和textarea的情况下使用backspace,禁止回退页面
	    if (event.keyCode == 8 && (!event.target.nodeName == 'INPUT' || !event.target.nodeName == 'TEXTAREA')){
			event.preventDefault();
	    }        
	    //防止打开新页面
	    if (event.ctrlKey && (event.keyCode == 66 || event.keyCode == 78 || event.keyCode == 81 || event.keyCode == 87 || event.keyCode == 69 || event.keyCode == 84 || event.keyCode == 85 || event.keyCode == 79 || event.keyCode == 80 || event.keyCode == 70 || event.keyCode == 72 || event.keyCode == 76 || event.keyCode == 187 || event.keyCode == 189 || event.keyCode == 115)){
	    	event.preventDefault(); 
	    }
	    //防止shift+F10打开菜单栏
	    if (event.shiftKey && event.keyCode == 121){
	    	event.preventDefault()
	    }; 
	}	    
});

