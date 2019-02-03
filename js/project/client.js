// JavaScript Document
$(document).ready(function(){

//---------------------CSS-------------------------
//隐藏折叠
$(".sidebar > .sidebar-hide").click(function(){
	$(".bd-container").css("padding-left","0px");
	$(".sidebar-show").show();
})
$(".sidebar-show").click(function(){
	$(".bd-container").css("padding-left","203px");
	$(".sidebar-show").hide();
})

//导航
$(".nav-next-btn").click(function(){
	if($(".row-nav")[0].scrollHeight>2*($(".row-nav")[0].clientHeight)){
		$(".row-nav").children(":visible:first").hide();
		$(".nav-prev-btn")[0].addEventListener("click",shownavPrev);
	}
})
function shownavPrev(){
	$(".row-nav").children(":hidden:last").show();
}

$(".row-nav > li").mousedown(function(e){
	var tg;
	if($(e.target).hasClass("row-li")){
		tg=$(e.target);
	}else if($(e.target).parent(".row-li").length){
		tg=$(e.target).parent();
	}
	tg.addClass("current");
	tg.siblings().removeClass("current");
	if(e.which=='1'){
		var followdiv=tg.parents("#hd").find(".nav-follow");
		if(tg[0].dataset.set!='true'){
	        followdiv.parents("#hd").css("height","114px");
	        followdiv.parents("#hd").siblings("#bd").css("top", "114px");
	        followdiv.hide();
		}else{  //istrue
	        followdiv.parents("#hd").css("height","148px");
	        followdiv.parents("#hd").siblings("#bd").css("top", "148px");
	        followdiv.show();
	        var followul=followdiv.find("ul");
	        followul.each(function(index,element){
	        	if(element.dataset.item == tg[0].dataset.map){
	        		$(element).show();
	        		$(element).siblings("ul").hide();
	        	}
	        })
		}
	}
})


//从级菜单
$(".nav-follow .tab-close").click(function(){
	$(".nav-follow").hide();
	$("#hd").css("height","114px");
	$("#hd").siblings("#bd").css("top","114px");
})

$(".nav-follow .follow-item").click(function(e){
	var tg;
	if($(e.target).hasClass("current")){
		tg=$(e.target);
	}else if($(e.target).parent(".follow-item").length){
		tg=$(e.target).parent(".follow-item");
	}
	if(!tg.hasClass("current")){
		tg.addClass("current");
		tg.siblings().removeClass("current");
	}
})

/**
 * 消息悬浮框
 */
$(".user-info .info-num").click(function(){
	$(".float-msg").show();
})
$(".msg-hd > .fa-times").click(function(){
	$(".float-msg").hide();
})
$(".msg-hd > .fa-arrows-h").click(function(){
	$(".float-msg").css("right","-480px");
	$(".fa-envelope-o").show();
	$(".fa-envelope-o")[0].addEventListener("click",showFloatMsg);
})
function showFloatMsg(){
	$(".float-msg").css("right","1px");
	$(".fa-envelope-o").hide();
}
function msgCount(){
    var toreadarr=$(".msg-tb> tbody >tr.toread button");
    var count=toreadarr.length;
    $(".hd-top > .user-info .info-num").text(count);
    $(".msg-content .msg-change > .receive span").text(count);
    if(count==0){
    	$(".hd-top > .user-info  > .user-avatar span").removeClass("info-num");
    	$(".hd-top > .user-info > .user-avatar span").text("");
    }
}
msgCount();

$(".msg-content .msg-change > a").click(function(e) {
	if($(e.target).hasClass('receive')){
		$(".msg-tb.receive").show();
		$(".msg-tb.send").hide();
	}else{
		$(".msg-tb.receive").hide();
		$(".msg-tb.send").show();
	}
	$(e.target).addClass('active');
	$(e.target).siblings().removeClass('active');
});

$(".msg-content .msg-control > button").click(function(e) {
	if($(e.target).hasClass('all-toread')){  //全部标为已读
		$(".msg-tb.receive> tbody >tr.toread button").text('已读');
		$(".msg-tb.receive> tbody >tr.toread").removeClass('toread');
	}else{   //彻底删除
		$(".msg-tb.receive> tbody").html("");
	}
	msgCount();
});
$(".msg-tb.receive> tbody >tr.toread button").click(function(e) {
	if($(e.target).text()=='待读'){
		$(e.target).text("已读");
	}else if($(e.target).text()=='待办'){
		var assignurl=$(e.target).parent().prev().prev().children('a').attr('href');
		window.open(assignurl);
	}
	$(e.target).parents("tr").removeClass("toread");//加条件！！
	msgCount();
});

$(".msg-tb> tbody >tr td .fa-close").click(function(e) {
	$(e.target).parents("tr").prop("outerHTML","");
	msgCount();
});
//模态框
$(".send-msg .file").on("change","input[type='file']",function(e){
    var fpath=$(this).val();
    var fzone=$(e.target).parent().next();
    var arr=fpath.split('\\');
    var fname=arr[arr.length-1];
    fzone.html('<i class="fa fa-mouse-pointer"></i>'+fname);
})
$(".send-msg .classify").on("click",function(e){
	$(e.target).next().children().click(function(ev) {
		var text=$(ev.target).text();
        var val=$(ev.target).val()||$(ev.target).attr('value');
        $(e.target).text(text);
        $(e.target).val(val);
	});
})
/**
 * 树形菜单
 */
$(".leftcolumn-nav .nav-li i").click(function(e){
	e.preventDefault();
    var itemtarget = $(e.target);
	if(itemtarget[0].tagName == "I" && itemtarget.parent().next().length != 0) {
		var toggleul = itemtarget.parent().next();
		if($(toggleul).is(':visible')) {
			$(toggleul).hide();
			if($(itemtarget).parent().parent().hasClass("current")) {
				$(itemtarget).parent().parent().removeClass("current");
			}
		} else {
			$(toggleul).show();
			$(itemtarget).parent().parent().addClass("current");
		}
	}
})

});
