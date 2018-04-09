// JavaScript Document
$(document).ready(function() {
    $('.con_ul li .con_n').click(function(){ 
	   $(this).next().slideToggle();//获取当前点击对象的下一个兄弟级，实现折叠效果切换
	})
});
  
 
