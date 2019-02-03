// JavaScript Document
$(document).ready(function(){

//----------------CSS实现---------------------

$(".li_1").click(function(){
	$("#table_nav").html("平台信息管理");
	$("#wrap_1").attr("style","display:block");
	$("#wrap_2").attr("style","display:none");
	$("#wrap_3").attr("style","display:none");
	$("#wrap_4").attr("style","display:none");
	$("#wrap_5").attr("style","display:none");
	$("#wrap_6").attr("style","display:none");
});
//
$(".li_3").click(function(){
	$("#table_nav").html("数据信息管理");
	$("#wrap_1").attr("style","display:none");
	$("#wrap_2").attr("style","display:none");
	$("#wrap_3").attr("style","display:block");
	$("#wrap_4").attr("style","display:none");
	$("#wrap_5").attr("style","display:none");
	$("#wrap_6").attr("style","display:none");
});
});