// JavaScript Document
$(document).ready(function(){

//----------------*全局变量*--------------------
var FContent=document.getElementById("iframe").contentWindow;
var Modalli,Modalmousetg;    //改成函数静态属性 改改改！！！
var mousetg;//已经是jquery变量！！！

//----------------*数据结构*--------------------
var menuAttr=[
    {id:"e1", name:"级别项设置"},
    {id:"e2", name:"定义设置"},
    {id:"e3", name:"数据绑定"},
    {id:"e4", name:"新建选项"},
    {id:"e5", name:"删除该项"}
];
var navArr=[
    {id:"fn1", name:"新建导航项"},
    {id:"fn2", name:"新建二级导航"},
    {id:"fn3", name:"定义设置"},
    {id:"fn4", name:"删除该项"}
]
//----------------*元素封装*--------------------
//-------基本元素
function el_Create(idname, classname, domname) { //改构造函数名
	this.dom = document.createElement(domname);
	if(arguments[0] != "")
		$(this.dom).attr({
			id: idname
		});
	if(arguments[1] != "")
		$(this.dom).attr({
			class: classname
		});
}

//-------sidebar nav-li
function LeftColumnItem(idname, classname, contenttext) {
	el_Create.call(this, idname, classname, "li");
	this.content = contenttext;
	var a = new el_Create("", "", "a");
	var i = new el_Create("", "", "i");
	var span = new el_Create("", "", "span");
	$(span.dom).html(contenttext);
	$(a.dom).attr("href","#");
	$(a.dom).append(i.dom);
	$(a.dom).append(span.dom);
	$(this.dom).append(a.dom);
	$(i.dom).on("click", opentogglenav);
}
LeftColumnItem.prototype = new el_Create();

//--------hd-nav row-nav li follow-item
function RownavItem(idname, classname, contenttext, type) { //传一个类型值
	el_Create.call(this, idname, classname, "li");
	var a = new el_Create("", "", "a");
	this.contenttext = contenttext;
	$(a.dom).attr("href","#");
	$(this.dom).append(a.dom);
	$(a.dom).html(contenttext);
	if(arguments[3] == '0') {
		$(this.dom).on("mousedown", cssControl1);
	} else if(arguments[3] == '1') {
		$(this.dom).on("mousedown", cssControl2); //把cssControl写在一起！！       
	}
}
RownavItem.prototype = new el_Create();

//-------RightControlDiv
function RightControlDiv(menuDiv, menuArry, type) { //传一个类型值判断
	this.menuAttr = menuArry;
	this.menuDiv = menuDiv;
	var ul = new el_Create("", "","ul");
	this.menuDiv.append(ul.dom);
	for(var index in menuArry) {
		var li = new el_Create(menuArry[index].id, "menuli", "li");
		var a = new el_Create(index, "menua", "a");
		$(a.dom).html(menuArry[index].name);
		$(li.dom).append(a.dom);
		$(ul.dom).append(li.dom);
	}
}
RightControlDiv.prototype.targetJudge = function(target, type) {//赋值全局mousetg
	if(arguments[1] == 'aside') {
		if(target.tagName == "SPAN" || target.tagName == "I") {
			mousetg = $(target).parent().parent(); 
		} else if(target.tagName == "LI" || target.tagName == "DIV") {
			mousetg = $(target);
		} else if(target.tagName == "A") {
			mousetg = $(target).parent();
		}
	} //判斷target dom
	else if(arguments[1] == 'nav') {
		if(target.tagName == "A") {
			mousetg = $(target).parent();
		} else if(target.tagName == "LI" || target.tagName == "DIV" || target.tagName == "UL") {
			mousetg = $(target); /*保留！！*/
		}
	}
}
//----------------*事件函数*--------------------

//鼠标右击事件    
FContent.window.oncontextmenu = function(e) {
	contextMenuRightControl(e);
	contextMenuRightControl2(e);
};

$(FContent.window).on("mousedown", function(e) {
	if($(e.target).parents(".menudiv").length) {
		return;
	} else {
		$(".menudiv").remove();
	}
});

//modal
$("#setbtn").on("click", e1_appendSiblingNodes);
$("#setbtn").on("click", e1_appendChildrenNodes);
$("#setbtn").on("click", e2_setElementsName);
$("#navbtn").on("click", fn3_setItemName);
//风格切换
$(".styleitem").on("click", styleChange);

//|主函数|

//风格切换
function styleChange(e) {
	if($(e.target)[0].tagName == 'A')
		var styleitem = $(e.target).parent();
	var linklist = FContent.document.getElementsByTagName("link");
	var index = $(styleitem).index();
	if(index == 0) {
		$(linklist).get([3]).rel = "stylesheet";
		$(linklist).get([4]).rel = "alternate";
	} else if(index == 1) {
		$(linklist).get([4]).rel = "stylesheet";
		$(linklist).get([3]).rel = "alternate";
	}
}

//右键
function contextMenuRightControl2(e) {
	var ev = e || event; //兼容性
	var outOfFrame = $("#iframe").offset(); 
	var contextMenuDiv = new el_Create("", "menudiv", "div");
	contextMenuDiv.dom.style.left = ev.pageX + outOfFrame.left + "px"; //上下文菜单位置
	contextMenuDiv.dom.style.top = ev.pageY + outOfFrame.top + "px";
	ev.preventDefault();
	if($(e.target).parents(".sidebar").length != 0 || $(e.target).hasClass("sidebar")) { //左树右键
		var contextMenu = new RightControlDiv(contextMenuDiv.dom, menuAttr, "aside");
		contextMenu.targetJudge(ev.target, "aside");
		$(document.body).append(contextMenu.menuDiv);
		Modalli = $(".menuli").slice(0, -2); //赋值全局Modalli
		$(Modalli).attr({ "data-toggle": "modal","data-target": "#Modal_2" });
		$(contextMenu.menuDiv).on("click", openModalDlg);
		$($(".menuli")[3]).on("click", e4_newElements);
		$($(".menuli")[4]).on("click", e5_deleteElements);
		return false;
	} else if($(e.target).parents(".hd-nav").length != 0 || $(e.target).hasClass("hd-nav") || $(e.target).parents(".nav-follow").length != 0 || $(e.target).hasClass("nav-follow")) { //顶部导航右键
		var contextMenu = new RightControlDiv(contextMenuDiv.dom, navArr, "nav");
		contextMenu.targetJudge(ev.target, "nav");
		$(document.body).append(contextMenu.menuDiv);
		$($(".menuli")[0]).on("click", fn1_newRownavItem);
		$($(".menuli")[1]).on("click", fn2_createFollownav);
		$($(".menuli")[2]).attr({ "data-toggle": "modal","data-target": "#Modal_1" });
		$($(".menuli")[3]).on("click", fn4_deleteRownavItem);
	}
}

//增加同级节点
function e1_appendSiblingNodes(e) {
	if($(Modalmousetg).text() == "级别项设置") {
		var num = $("#Sibling_num").val();
		for(var x = 1; x <= num; x++) {
			var item = new LeftColumnItem("", "nav-li", "[Column-item]");
			$(mousetg).parent().append(item.dom);
		}
		if($(mousetg).hasClass("li-target")) {
			$(mousetg).remove();
		}
	}
}

//增加子级节点
function e1_appendChildrenNodes(e) {
	if($(Modalmousetg).text() == "级别项设置") {
		if($(mousetg).hasClass("nav-li")) {
			$(mousetg).addClass("current");
			var li = $(e.target);
			var num = $("#Chilren_num").val();
			var chilrenul;
			if(!$(mousetg).children(".togglenav").length) {
				chilrenul = $(new el_Create("", "togglenav", "ul"))[0].dom;
				$(mousetg).append(chilrenul);
			} else {
				chilrenul = $(mousetg).children(".togglenav");
			}
			for(var x = 1; x <= num; x++) {
				var item = new LeftColumnItem("", "nav-li", "[Column-item]");
				$(chilrenul).append(item.dom);
			}
		}
	}
}

//定义設置
function e2_setElementsName() {
	if($(Modalmousetg).text() == "定义设置") {
		var text = $("#LiName_input").val();
		if(mousetg.hasClass("nav-li")) { //菜单单元
			var span = mousetg.children().children("span");
			$(span).text(text);
		}
		var url = $("#connect-url_2").val();
		if(url) {
			mousetg.find('a').attr("href",url);
		}
	}
}

//新建
function e4_newElements(e) {
	if($(mousetg).hasClass("left-tree")) { //新建菜单分区   //改改改！！
		var WrapDiv = new CreateWrapDivnav();
		if(!$(mousetg).children().hasClass("divnavul")) {
			$(mousetg).children().wrapAll(WrapDiv.wrapdiv.dom);
			$(mousetg).prepend(WrapDiv.divnav.dom);
		} else {
			$(mousetg).children(".divnavul").append(WrapDiv.divnavli.dom);
			$(WrapDiv.divnavli.dom).siblings().css({
				"background-color": "rgb(31, 82, 154)",
				"box-shadow": "0px 0px"
			});
			$(mousetg).children(".wrapdiv").hide();
			var LeftColumntop = WrapDiv.CreateLeftColumntop();
			$(mousetg).append(LeftColumntop);
			$(LeftColumntop).wrapAll(WrapDiv.wrapdiv.dom);
			$(WrapDiv.wrapdiv.dom).show();
		}
		var Mapdiv = WrapDiv.wrapdiv.dom;
		WrapDiv.divnavli.dom.addEventListener("click", changeWrapDiv);
	} else if($(mousetg).hasClass("divnavli")) { //新建菜单parent级
		var LeftColumnli = new LeftColumnItem("", "LeftColumn", "[Column]");
		$(LeftColumnli.dom).addClass("LeftColumn-parent");
		if($(mousetg).siblings().length != 0) {
			var LeftColumnultop = $($(mousetg).parent().siblings(".wrapdiv").get($(mousetg).index())).children(".LeftColumnultop");
			if($(LeftColumnultop).children(".LeftColumntop").length != 0) {
				$(LeftColumnultop).children(".LeftColumntop").remove();
				$(LeftColumnultop).append(LeftColumnli.dom);
			} else {
				$(LeftColumnultop).append(LeftColumnli.dom);
			}
		} else {
			var LeftColumnultop = $(mousetg).parent().next().children();
			if($(LeftColumnultop).children(".LeftColumntop").length != 0) {
				$(LeftColumnultop).children(".LeftColumntop").remove();
				$(LeftColumnultop).append(LeftColumnli.dom);
			} else {
				$(LeftColumnultop).append(LeftColumnli.dom);
			}
		}
	} else if($(mousetg).hasClass("nav-li")) { //新建菜单子级
		var LeftColumnli = new LeftColumnItem("", "nav-li", "[Column-item]");
		$(mousetg).children(".togglenav").append(LeftColumnli.dom);
	}
}

//删除
function e5_deleteElements(e) {
	if($(mousetg).hasClass("divnavli")) { //改改改！！
		var Mapdiv = $(mousetg).parent().siblings(".wrapdiv").get($(mousetg).index());
		$(Mapdiv).siblings(".wrapdiv").show(); //这里因为只有两个navli！到时改	
		$(mousetg).siblings().css({
			"background-color": "#1a4289",
			"box-shadow": "0px 0px"
		});
		$(Mapdiv).remove();
		$(mousetg).remove();
	} else if($(mousetg).hasClass("nav-li")) {
		$(mousetg).remove();
	}
}

//新建导航按钮
function fn1_newRownavItem(e) {
	if($(mousetg).parents(".hd-nav").length != 0) {
		var li = new RownavItem("", "row-li", "[navitem]", "0");
		$(mousetg).parents(".hd-nav").find(".row-nav").append(li.dom);
	} else if($(mousetg).parents(".nav-follow").length != 0) {
		var followli = new RownavItem("", "follow-item", "[followitem]", "1");
		var parentli = fn2_createFollownav.current;
		parentli.followitem.push(followli);
		$(mousetg).parents(".follow-content").children("ul:visible").append(followli.dom);
	}
}

//新建二级导航
function fn2_createFollownav(e) {
	if(mousetg.hasClass("current")) {
		var followArry = [];
		mousetg.followitem = followArry;
		var dataset = "map-" + randomForData();
		mousetg[0].setAttribute("data-set", "true");
		mousetg[0].setAttribute("data-map", dataset);
		fn2_createFollownav.current = mousetg;
		var navfollowdiv = $(mousetg).parents("#hd").find(".nav-follow");
		if(navfollowdiv.is(":hidden") && mousetg.followitem.length == 0) { //初始化状态！初始化到fn1执行
			navfollowdiv.parents("#hd").css("height", "148px");
			navfollowdiv.parents("#hd").siblings("#bd").css("top", "148px");
			navfollowdiv.show(); //换成固定的函数！！
			navfollowdiv.find("ul").hide();
			var ul = new el_Create("", "", "ul");
			navfollowdiv.children().append(ul.dom);
			ul.dom.setAttribute("data-item", dataset);
		}
	}
}

//定义导航名称
function fn3_setItemName(e) {
	var itemname = $("#NavName_input").val();
	$(mousetg).children().text(itemname);
	var url = $("#connect-url_1").val();
	if(url) {
		mousetg.find('a').attr("href",url);
	}
}

//删除导航                                            还要再删除掉mapping ul
function fn4_deleteRownavItem(e) {
	if($(mousetg)[0].tagName == "LI") {
		$(mousetg).remove();
	}
}

//|监听函数|

//模态框响应 
function openModalDlg(e) {
	var ModalaClicking = $(e.target);
	var ModalContents = $(".ModalBodyContents").children();
	var ModalContentsArray = Array.from(ModalContents);
	var ModalliArray = Array.from(Modalli);
	if($(ModalaClicking).hasClass("menua")) {
		Modalmousetg = $(ModalaClicking).parent();
		for(var index in ModalliArray) {
			if($(ModalliArray[index]).text() == $(Modalmousetg).text()) {
				$(".ModalBodyContents").prev().find("strong").text($(ModalliArray[index]).text());
				$(".menudiv").hide();
				$(ModalContentsArray[index]).show();
				$($(ModalContentsArray[index]).siblings()).hide();
			}
		}
	}
}

//展开菜单    
function opentogglenav(e) {
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
}

function randomForData() {
	var n = Math.random();
	var k = n * Math.pow(10, 5);
	var z = Math.round(k);
	return z;
}

function cssControl1(e) {
	var tg;
	if($(e.target).hasClass("row-li")) {
		tg = $(e.target);
	} else if($(e.target).parent(".row-li").length) {
		tg = $(e.target).parent();
	}
	tg.addClass("current");
	tg.siblings().removeClass("current");
	if(e.which == '1') {
		var followdiv = tg.parents("#hd").find(".nav-follow");
		if(tg[0].dataset.set != 'true') {
			followdiv.parents("#hd").css("height", "114px");
			followdiv.parents("#hd").siblings("#bd").css("top", "114px");
			followdiv.hide();
		} else { //istrue
			followdiv.parents("#hd").css("height", "148px");
			followdiv.parents("#hd").siblings("#bd").css("top", "148px");
			followdiv.show();
			var followul = followdiv.find("ul");
			followul.each(function(index, element) {
				if(element.dataset.item == tg[0].dataset.map) {
					$(element).show();
					$(element).siblings("ul").hide();
				}
			})
		}
	}
}

function cssControl2(e) {
	var tg;
	if($(e.target).hasClass("follow-item")) {
		tg = $(e.target);
	} else if($(e.target).parent(".follow-item").length) {
		tg = $(e.target).parent(".follow-item");
	}
	if(!tg.hasClass("current")) {
		tg.addClass("current");
		tg.siblings().removeClass("current");
	}
}


/**
 * 计算模块
 */

$(FContent.window).click(function (e){
	var tg=$(e.target);
	if(tg.hasClass('calcbtn')){
		$('#calcModal').modal('show');
		var calcobj=new calcModuleConstrutObj();
		calcobj.init();
	}
});

function calcModuleConstrutObj(){
	var datafield={};
	var calcexpr='';
}
calcModuleConstrutObj.prototype={
	datafieldconstrut:function(){
	},
	interface:function(){
		var calcmodal=$('#calcModal');
		var binddiv=calcmodal.find('.binddiv');//取值区
		//增加取值序列 界面处理
		binddiv.find('.fa-plus-circle').on('click',function(e) {
			let itemp=new el_Create('', 'item', 'p');
			var binditemcount=binddiv.find('p.item').length;
			var index=String.fromCharCode(97+binditemcount);//递增字母
			$(itemp.dom).html(`<label>${index}:</label>
        				<input type="text" class="rightControlSet tb" placeholder="选取表名"></input><input type="text" class="rightControlSet" placeholder="选取字段名"></input><input type="text" class="rightControlSet" placeholder="字段截取条件"></input>
        				<span></span>`);
			binddiv.children('.bindvalue').append(itemp.dom);
		});
		//计算参数 界面处理
		var exprdiv=calcmodal.find('.exprdiv');//计算类型区
		var autofilldiv=calcmodal.find('.autofilldiv');//自行填充区
		exprdiv.children('.exprtype').one('click', function(e) { //--事件委托 不妥改
			let tg=$(e.target);
			if(tg.text()=='字段统计'){
				let p=new el_Create('', '', 'p');
				$(p.dom).html(`<label>参数*:</label><input type="text" class="rightControlSet" placeholder="输入所需统计的字段"></input>`)
				autofilldiv.children('.autofill').prepend(p.dom);
			}
		});
	},
	init:function(){
		this.interface();//ui
	}
}

//----------------CSS实现---------------------

$(".li_5").click(function() {
	$("#table_nav").html("界面定义管理");
});

console.log("js加载成功~");
});