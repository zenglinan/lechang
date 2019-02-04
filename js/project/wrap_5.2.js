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

function calcModuleConstrutObj(){
	this.datafield={};
	this.calcexpr={};
	this.currentcondition='';
	this.tasklist=[];
	this.computefieldjson='';
}
calcModuleConstrutObj.prototype={
	datafieldconstrut:function(that,calcmodal){
		var binddiv=calcmodal.find('.binddiv');//取值区
		var df=that.datafield;
		var error=0;
		binddiv.find('p.item').each(function(index, el) {
			var index=$(el).children('label').text().charAt(0);
			var tbget=$(el).children('input.tb').val();
			var fieldget=$(el).children('input.field').val();
			if(tbget=="" || fieldget=="")
				error='error';
			df[index]={};
			df[index]['fromtb']=tbget;
			df[index]['fromfield']=fieldget;
			df[index]['equal']=`${tbget}.${fieldget}`;
		});
		if(!error){
			return df;
		}else{
			return error;
		}
	},
	calcexprconstrut:function(that,tgtext,calckeys,backkeys,currentexpr){
		switch (tgtext) {
			case '计算平均值':
				that['calcexpr']['calcexpr']=`(${calckeys.join('+')})/2`;
				that['calcexpr']['backexpr']=`(${backkeys.join('+')})/2`;
				break;
			case '计算和':
				that['calcexpr']['calcexpr']=calckeys.join('+');
				that['calcexpr']['backexpr']=backkeys.join('+');
				break;
			case '计算乘积':
				that['calcexpr']['calcexpr']=calckeys.join('*');
				that['calcexpr']['backexpr']=backkeys.join('*');
				break;
			case '计算差值':
				that['calcexpr']['calcexpr']=calckeys.join('-');
				that['calcexpr']['backexpr']=backkeys.join('-');
				break;
			case '计算商':
				that['calcexpr']['calcexpr']=calckeys.join('/');
				that['calcexpr']['backexpr']=backkeys.join('/');
				break;
			case '自行绑定':
				var calcexpr=currentexpr;
				calckeys.forEach(function(currentValue, index, arr) {
					if(currentexpr.indexOf(currentValue)!=-1){
						currentexpr=currentexpr.replace(currentValue,that['datafield'][currentValue]['equal'].toUpperCase());
					}
				});
				that['calcexpr']['calcexpr']=calcexpr;
				that['calcexpr']['backexpr']=currentexpr.toLowerCase();
			default:
				console.log('计算类型不在范围内');
				break;
			}
		return that.calcexpr;
	},
	GetComputeFieldData:function(that){ //返回计算字段
		var ComputeFieldData={
			viewComputeFieldList:[],
			condition:""
		};
		ComputeFieldData['viewComputeFieldList']=that.tasklist;
		ComputeFieldData['condition']=that.currentcondition;
		//return ComputeFieldData
		//如果返回json
		var ComputeFieldJson=JSON.stringify(ComputeFieldData);
		return ComputeFieldJson;
	},
	interface:function(that,calcmodal){   //界面相关
		//界面切换
		var calcbody=calcmodal.find('.calc-body');
		var cachebody=calcmodal.find('.cache-body');
		var title=calcmodal.find('.modal-header');
		var taskspan=cachebody.find('.outputtask #task_num');
		title.find('span').on('click',function(e){
			$(e.target).addClass('current');
			$(e.target).siblings().removeClass('current');
			if($(e.target).text()=='计算'){
				calcbody.show();
				cachebody.hide();
			}else{
				calcbody.hide();
				cachebody.show();
				taskspan.text(that.tasklist.length);
			}
		});
		//缓存模块
		cachebody.find('.calctask').on('click','.fa-close',function(e){
			var tr=$(e.target).parent().parent();
			that.tasklist.splice(tr.index(),1);
			tr.remove();
			//taskspan.text(parseInt(taskspan.text())-1);
			taskspan.text(that.tasklist.length);
		});
		//增加取值序列 界面处理
		var binddiv=calcmodal.find('.binddiv');
		binddiv.find('.fa-plus-circle').on('click',function(e) {
			let itemp=new el_Create('', 'item', 'p');
			var binditemcount=binddiv.find('p.item').length;
			var index=String.fromCharCode(97+binditemcount);//递增字母
			$(itemp.dom).html(`<label>${index}:</label>
        				<input type="text" class="rightControlSet tb" placeholder="选取表名"></input><input type="text" class="rightControlSet field" placeholder="选取字段名"></input><input type="text" class="rightControlSet" placeholder="字段截取条件"></input>
        				<span></span>`);
			binddiv.children('.bindvalue').append(itemp.dom);
		});
	},
	init:function(){
		var that=this;
		var calcmodal=$('#calcModal');
		var exprdiv=calcmodal.find('.exprdiv');
		var autofilldiv=calcmodal.find('.autofilldiv');
		calcmodal.find('.calc-body').show();//界面初始化
		calcmodal.find('.cache-body').hide();
		calcmodal.find('.modal-header >h5 span:first').addClass('current');
		calcmodal.find('.modal-header >h5 span').eq(1).removeClass('current');
		exprdiv.children('.exprtype').on('click', function(e) { //计算类型启动计算模块开始构建
			var tg=$(e.target);
			tg.addClass('current');
			tg.siblings().removeClass('current');
			var result=that.datafieldconstrut(that,calcmodal);//构建计算参数
			if(result=='error'){
				$(calcmodal).find('.binddiv>h5>span').text('*请完善字段信息');
			}else{
				$(calcmodal).find('.binddiv>h5>span').text('');
				var df=result;
				var calckeys=Object.keys(df);
				var backkeys=calckeys.map(key=>df[key]['equal']);
				var autobind=autofilldiv.find('#calc_expr');
				if(tg.text()=='自行绑定'){
					autobind.attr("disabled",false);
					autobind.on('blur',function(){
						var exprs=that.calcexprconstrut(that,tg.text(),calckeys,backkeys,autobind.val());
						autobind.next().text('='+exprs.backexpr);
					});
				}else{
					var exprs=that.calcexprconstrut(that,tg.text(),calckeys,backkeys);//构建计算类型
					autobind.val(exprs.calcexpr);
					autobind.next().text('='+exprs.backexpr);
					autobind.attr("disabled",true);//禁用
				}
			}
		});
		var resultdiv=calcmodal.find('.resultdiv');//启动缓存
		var cachebody=calcmodal.find('.cache-body');
		resultdiv.find('#cachebtn').on('click', function(e) {
			var fieldobj={};
			var fieldname=$(e.target).siblings('#field_name').val();
			var fielddesc=$(e.target).siblings('#field_desc').val();
			fieldobj['fieldName']=fieldname;
			fieldobj['desc']=fielddesc;
			fieldobj['expr']=that.calcexpr.backexpr;
			that.tasklist.push(fieldobj);
			let tr=new el_Create('', '', 'tr');
			$(tr.dom).html(`<td>${fieldobj['expr']}</td><td>${fieldname}</td><td>${fielddesc}</td><td><i class="fa fa-close"></i></td>`)
			cachebody.find('.calctask').children('tbody').append(tr.dom);//显示
			alert('缓存成功')
		});
		var outtask=cachebody.find('.outputtask');
		outtask.find('#outputbtn').on('click',function(e){ //导出计算字段
			var condition=outtask.find('#calc_condition').val();//联立条件处理
			var p=/\w+.\w+(\w+.\w+)*/;
			if(condition && !p.test(condition)){
				outtask.find('#calc_condition').next().text('*输入格式不正确！');
			}else{
				outtask.find('#calc_condition').next().text('*注意为所有计算任务共享');
				if(condition.indexOf(',')!=-1)
					condition=condition.replace(',',' and ');
				that.currentcondition=condition;
				that.computefieldjson=that.GetComputeFieldData(that);//赋值json
				alert('导出成功');
			}
		});
		that.interface(that,calcmodal);//ui	
	},
	empty:function(){
		var calcmodal=$('#calcModal');
		//清值
		calcmodal.find('input.rightControlSet').val("");
		calcmodal.find('.cache-body .calctask tbody').html("");
		calcmodal.find('.cache-body .outputtask #task_num').text("0");
		calcmodal.find('.calc-body #calc_expr').next().text("");
		//解除绑定
		calcmodal.find('.calc-body #cachebtn').off("click");
		calcmodal.find('.calc-body .exprtype').off("click");
		calcmodal.find('.cache-body #outputbtn').off("click");
		calcmodal.find('.modal-footer #tocalc').off("click");
	}
}

//启用计算模块
var computefieldjson='';//外部存放json变量字符串

$(FContent.window).click(function (e){
	var tg=$(e.target);
	if(tg.hasClass('calcbtn')){ //启动计算
		$('#calcModal').modal('show');
		var calcobj=new calcModuleConstrutObj();
		calcobj.init();
		$('#calcModal #tocalc').click(function(e) {
			computefieldjson=calcobj.computefieldjson;//json变量赋值
			calcobj.empty();
			$('#calcModal').modal('hide');
			alert(computefieldjson); //检验用
		});
	}
});

//----------------CSS实现---------------------

$(".li_5").click(function() {
	$("#table_nav").html("界面定义管理");
});

console.log("js加载成功~");
});