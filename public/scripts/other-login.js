
$(document).ready(function(){
  try{        
    init();
  }catch(err){
    console.log(err);
  }
});

function init(){
    
  openMask();

  $.sessionTimeout({
      title: '会话超时',
      message: '由于您太长时间没有进行操作，您将被系统下线.',
      keepAliveUrl: '/keepalive',
      redirUrl: '/login',
      logoutUrl: '/sign/signout',
      logoutButton: '退出系统',
      keepAliveButton: '保持连接',      
      warnAfter: 600000, //10分钟没有操作则弹出提示框
      redirAfter: 610000, //提示框弹出10秒后，退出系统,
      countdownMessage: ' {timer} 秒后退出系统.',
      ignoreUserActivity: true,
      countdownBar: true
  });
  
  $.browser = $.browser || {}; 
  $.browser.mozilla = /firefox/.test(navigator.userAgent.toLowerCase());
  $.browser.webkit = /webkit/.test(navigator.userAgent.toLowerCase());
  $.browser.opera = /opera/.test(navigator.userAgent.toLowerCase());
  $.browser.msie = /msie/.test(navigator.userAgent.toLowerCase());     
  $.browser.chrome = /chrome/.test(navigator.userAgent.toLowerCase());   
  
  var socket = io.connect('/');

  socket.on("otherLogin", function(sessionId){
    if(sessId === sessionId){
      if($.browser.mozilla){
        alert("你的账号在其他位置登录，你已被迫下线！如需帮助请联系管理员。");
        window.location.reload();
      }else{
        bootbox.dialog({
            message: "你的账号在其他位置登录，你已被迫下线！如需帮助请联系管理员。",
            title: "提示",
            buttons: {
              success: {
                label: "确定",
                className: "green",
                callback: function() {
                  window.location.reload();
                }
              }
            },
            closeButton: false
        });
      }
    }
  });  
}

function doSignout(){
  window.location.href = "/sign/signout";
}

function openMask(){
  
   $.blockUI({
        message: "<img src='/static/img/ajax-loading.gif'>正在加载，请稍等... ...",
        baseZ: 1000,
        css: {
            border: '0',
            padding: '0',
            backgroundColor: 'none'
        },
        overlayCSS: {
            backgroundColor: '#555',
            opacity: 0.1,
            cursor: 'wait'
        }
    }); 
    
    //在每次添加蒙版时，自动增加一个函数用来在超时后取消模板
    window.setTimeout(function(){
      closeMask();
    }, 15000);
}

function closeMask(){
  $.unblockUI();
}

function onLoaded(){
  closeMask();
}

function isIE(){	
  if (navigator.userAgent.toLowerCase().indexOf("msie")>-1){
    return true;
  }else if (window.ActiveXObject || "ActiveXObject" in window){
    return true;
  }
  return false;
}
            
//禁用浏览器ctrl+滚轮快捷键
function scrollFunc(e)
{
  if (!e.ctrlKey ){
    return;
  }
  
  if (e && e.preventDefault){
    e.preventDefault();	
  }else{
    // A shortcut for stoping the browser action in IE
    window.event.returnValue = false;
  }
}
            
function stopDefault(e) {
  // Prevent the default browser action (W3C)
  e=e || window.event;
  if (e && e.ctrlKey && e.keyCode && (e.keycode==65 || e.keyCode==107 || e.keyCode==109)){
    if ( e && e.preventDefault ){
      e.preventDefault();
    }else{
      // A shortcut for stoping the browser action in IE
      window.event.returnValue = false;
    }
  }
}
			
/*注册事件*/
if(document.addEventListener){
    document.addEventListener('DOMMouseScroll',scrollFunc,false);
    document.addEventListener('keyup', stopDefault , false);
}//W3C
window.onmousewheel=document.onmousewheel=scrollFunc;//IE/Opera/Chrome/Safari
window.onkeyup=document.onkeyup=stopDefault;//IE/Opera/Chrome/Safari