// 登录表单验证
 $(document).ready(function() {
     $("form :input").blur(function(){
         var $parent = $(this).parent();
         $parent.find(".msg").remove();

         if($(this).is("#input_username")){
             if($.trim(this.value) == "" ){ //$.trim()方法，去掉首位空格
                 var errorMsg = "* 请输入正确的用户名！";
                 $parent.append("<span class='msg onError' style='color: #d9534f; font-size:small; padding-left: 90px; font-weight: lighter'>" +errorMsg + "</span>");
             }
             else{
                 $parent.find(".error").remove();
                 var $required_c=document.createElement("i");
                 $required_c.setAttribute("class","fa fa-check-circle-o msg onSuccess");
                 $required_c.setAttribute("style","color:#5e5e5e");
                 $(this).parent().append($required_c);
             }
         }
         //验证密码
         if($(this).is("#input_password")){
             if($.trim(this.value) == "" || $.trim(this.value).length < 6){
                 var errorMsg = "* 请输入至少六位的密码！";
                 $parent.append("<span class='msg onError' style='color: #d9534f; font-size:small; padding-left: 90px; font-weight: lighter'>" +errorMsg + "</span>");
             }
             else{
                 $parent.find(".error").remove();
                 var $required_c=document.createElement("i");
                 $required_c.setAttribute("class","fa fa-check-circle-o msg onSuccess");
                 $required_c.setAttribute("style","color:#5e5e5e");
                 $(this).parent().append($required_c);
             }
         }
     })
      .keyup(function(){
          $(this).triggerHandler("blur");//triggerHandler 防止事件执行完后，浏览器自动为标签获得焦点
      })
      .focus(function(){
          $(this).triggerHandler("blur");
      })
     //点击重置按钮时，触发文本框的失去焦点事件
     $(".btn_login").click(function(){
         //trigger 事件执行完后，浏览器会为submit按钮获得焦点
         $("form .required:input").trigger("blur");
         var numError = $("form .onError").length;
         if(numError){
             return false;
         }
     });

     /*$(".btn_login").click(function() {
         var username = $("#input_username").val();
         var password = $("#input_password").val();
         $.ajax({
             type: "POST",
             url: "http://47.106.76.115:8088/lechang-bpm/loginController/login",
             data: {
                 username: username
                 password: password
             },

         });
     });*/
})