
$(document).ready(function(){
  try{

    // $(document).bind('keydown', 'Ctrl+a', function (e){
    //   e.preventDefault();
    // });
        
    init();
  }catch(err){
    consel.log(err);
  }
});

function init(){
    
  openMask();
  
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