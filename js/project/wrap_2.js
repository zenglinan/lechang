// JavaScript Document
$(document).ready(function(){
	
//-----------------------实验用--------------------------------
	function add_input() {
    }
    add_input.prototype={
		
	}
	
	function add_div() {

    }
//------------------------全局---------------------------------
	var field_data=new Array(); //字段对象数组

//-----------------------CSS实现-------------------------------

$(".li_2").click(function(){
	$("#table_nav").html("数据表定义管理");
	$("#wrap_2").attr("style","display:block");
	$("#wrap_1").attr("style","display:none");
	$("#wrap_3").attr("style","display:none");
	$("#wrap_4").attr("style","display:none");
	$("#wrap_5").attr("style","display:none");
	$("#wrap_6").attr("style","display:none");
});
//
$("#new_index").click(function(){
	$("#table_new").attr("style","display:block");
	$("#table_set").attr("style","display:none");
	if(typeof ($("#set_index")).attr("id")!="undefined"){
        $("#num_set").attr("disabled","true");
    }
	//轮换
$("#set_index").click(function(){
	$("#table_new").attr("style","display:none");
	$("#table_set").attr("style","display:block");
});
});

//------------------------函数实现----------------------------------

function create_input(name,type,classname,idname,width,div_width){
	var input1=document.createElement("input");
	var span1=document.createElement("label");
	var div_o=document.createElement("div");
	span1.innerHTML=name;
	input1.setAttribute("type",type);
	input1.setAttribute("class",classname);
	input1.setAttribute("id",idname)
	input1.setAttribute("style","width:100%");
	div_o.setAttribute("class","col-md-"+div_width);
	div_o.appendChild(span1);
	div_o.appendChild(input1);
	return div_o;
}

function create_select(name,select_array,classname,idname,width,div_width){
	var select=document.createElement("select");
	var span1=document.createElement("label");
	var div_o=document.createElement("div");
	span1.innerHTML=name;
	select.setAttribute("class",classname);
	select.setAttribute("id",idname);
	select.setAttribute("style","width:100%");
	for(var i in select_array){
		select.add(new Option(select_array[i],select_array[i]),null);
	}
	div_o.setAttribute("class","col-md-"+div_width);
	div_o.appendChild(span1);
	div_o.appendChild(select);
	return div_o;
}

function select_add(select,select_array){
	for(var i in select_array){
		select.append(new Option(select_array[i],select_array[i]));
	}
}
	
	var select1=["1","2"];
	var select2=["NATIVE","。。。"];
	var select3=["single","。。。"];
	select_add($("#jformType"),select1);
	select_add($("#jformPkType"),select2);
	select_add($("#querymode"),select3);
	
function num_set(num){
	
	//索引变化
	var p_sym=document.createTextNode(">>");
	var p_index=$("#p_index");
	var p_set=document.createElement("label");
	p_set.innerHTML="数据表设置";
	p_set.setAttribute("id","set_index");
    p_index.append(p_sym);
    p_index.append(p_set);
	alert("正在加载..");

	var select_item=new Array();
	var select_item5=new Array();
	select_item=["string","int"];
	select_item5=["Y","N"];
	
	
	//替换内容
	var table_new=$("#table_new");
	table_new.attr("style","display:none");
	var table_set=document.createElement("div");
	table_set.setAttribute("id","table_set");
	table_set.setAttribute("style","display:block");
		
	//表名及添加
	var table_head=document.createElement("div");
	table_head.setAttribute("class","form-inline");
	table_head.setAttribute("style","padding:12px");
	var label_name=document.createElement("label");
	label_name.innerHTML="数据表名：";
	var input_name=document.createElement("input");
	input_name.setAttribute("type","text");
	input_name.setAttribute("class","form-control input_name");
	input_name.setAttribute("value",$("#table_name").val());
	table_head.appendChild(label_name);
	table_head.appendChild(input_name);
	table_set.appendChild(table_head);
	//
	var label_col=document.createElement("label");
	label_col.innerHTML="添加：";
	label_col.setAttribute("style","margin-left:10px");
	var group_col=document.createElement("div");
	group_col.setAttribute("class","input-group group_col");
	var span_col=document.createElement("span");
	span_col.innerHTML="columns";
	span_col.setAttribute("class","input-group-addon");
	var input_col=document.createElement("input");
	input_col.setAttribute("type","text");
	input_col.setAttribute("class","form-control input_col");
	table_head.appendChild(label_col);
	table_head.appendChild(group_col);
	group_col.appendChild(input_col);
	group_col.appendChild(span_col);
	var btn_set=document.createElement("input");
	btn_set.setAttribute("type","button");
	btn_set.setAttribute("value","执行");
	btn_set.setAttribute("style","margin-left:3px");
	btn_set.setAttribute("class","btn btn-sm");
	btn_set.setAttribute("id","btn_set");
	table_head.appendChild(btn_set);
	//
	var set_title=document.createElement("div");
	set_title.setAttribute("class","panel-heading bg-primary");
	var set_field=document.createElement("div");
	set_field.setAttribute("id","set_field");
	set_field.setAttribute("class","panel-body");
	$("#wrap_2").append(table_set);
	$("#table_set").append(set_title);
	$("#table_set").append(set_field);

    if (num <= 0) {
    } else {
        for (var j = 0; j < num; j++) {
            var m = parseInt(j);
            if (j == 0) {
                var input1 = create_input("字段名(主键)", "text", "form-control form_input", "input1_" + m, 100, 2);
            } else {
                var input1 = create_input("字段名", "text", "form-control form_input", "input1_" + m, 100, 2);
            }
            var input2 = create_select("类型", select_item, "form-control form_select", "input2_" + m, 100, 1);
            var input3 = create_input("长度", "number", "form-control form_input", "input3_" + m, 100, 1);
            var input4 = create_input("主表", "text", "form-control form_input", "input4_" + m, 100, 6);
            var input5 = create_input("主字段", "text", "form-control form_input", "input5_" + m, 100, 6);
            var input6 = create_select("为空", select_item5, "form-control form_select", "input6_" + m, 100, 1);
            var input7 = create_input("注释", "text", "form-control form_input", "input7_" + m, 200, 4);
            var input8 = create_input("字段默认值", "text", "form-control form_input", "input8_" + m, 200, 4);
            var input9=create_input("识别名","text","form-control form_input","input9_"+m,200,4);
            //
            var div_o = document.createElement("div");
            div_o.setAttribute("class", "form-horizontal  read_only");
            var div_oo = document.createElement("div");
            div_oo.setAttribute("class", "col-md-3");
            div_oo.setAttribute("style", "padding-left:0px;padding-right:0px;");
            var div_oo2=document.createElement("div");
            div_oo2.setAttribute("class","col-md-4");
            div_oo2.setAttribute("style","padding-left:0px;padding-right:0px;");
            div_o.appendChild(input1);
            div_o.appendChild(input2);
            div_o.appendChild(input3);
            div_oo.appendChild(input4);
            div_oo.appendChild(input5);
            div_o.appendChild(div_oo);
            div_o.appendChild(input6);
            div_oo2.appendChild(input7);
            div_oo2.appendChild(input8);
            div_oo2.appendChild(input9);
            div_o.appendChild(div_oo2);
            //
            $("#set_field").append(div_o);
            div_o.setAttribute("id", "div_" + m);
            div_o.setAttribute("style", "height:50px");
            div_o.setAttribute("style", "width:100%");
            alert(div_o.id);
            var br = document.createElement("br");
            $("#set_field").append(br);
        }
        var input0 = document.createElement("input");
        input0.setAttribute("type", "button");
        input0.setAttribute("id", "input0");
        input0.setAttribute("value", "accept");
        input0.setAttribute("class", "btn btn-primary");
        var input_out = document.createElement("input");
        input_out.setAttribute("type", "button");
        input_out.setAttribute("id", "input_out");
        input_out.setAttribute("value", "退出");
        input_out.setAttribute("class", "btn");
        $("#set_field").append(input_out);
        $("#set_field").append(input0);
        $("#input1_0").attr("value", "id").attr("readonly", true);
        $("#input2_0 > option[value='int']").attr("selected", true);
        $("#input2_0").attr("disabled", "disabled");
        $("#input3_0").attr("value", "36").attr("readonly", true);
        $("#input4_0").attr("value", " ").attr("readonly", true);
        $("#input5_0").attr("value", " ").attr("readonly", true);
        $("#input7_0").attr("value", " ").attr("readonly", true);
        $("#input8_0").attr("value", " ").attr("readonly", true);
        $("#input9_0").attr("value", " ").attr("readonly", true);
        $("#input0").click(function () {
            if ($("#table_name").val() != "" && $("#table_name").val() != null) {
                setCookie("table_name", $("#table_name").val(), 1);
                if (num != 0  && num > 0) {
                    alert(parseInt($("#field_num").val()));
                    setCookie("field_num", num, 1);
                }
            }
            //ajax_0(num);   //ajax发送
        });

        $("#input_out").click(function () {    //退出按钮
            var p_index=$("#p_index");
            p_index.empty();
            var p_set=document.createElement("label");
            p_set.innerHTML="新建数据表";
            p_set.setAttribute("id","new_index");
            p_index.append(p_set);
            $("#table_set").remove();
            $("#table_new").attr("style","display:block");
            $("#num_set").removeAttr("disabled");
        });
    }

    //添加行 重复创建
	$("#btn_set").click(function(){
	var num_add=$(".input_col").val();
	alert("添加"+num_add+"行");
    if(num_add>0){
		for(var i=0;i<num_add;i++){
	    var n=parseInt(num)+parseInt(i);
		if(num==0){
		var input1=create_input("字段名(主键）","text","form-control form_input","input1_"+n,100,2);
		}else{
		var input1=create_input("字段名","text","form-control form_input","input1_"+n,100,2);
		}
		var input2=create_select("类型",select_item,"form-control form_select","input2_"+n,100,1);
		var input3=create_input("长度","number","form-control form_input","input3_"+n,100,1);
		var input4=create_input("主表","text","form-control form_input","input4_"+n,100,6);
		var input5=create_input("主字段","text","form-control form_input","input5_"+n,100,6);
		var input6=create_select("为空",select_item5,"form-control form_select","input6_"+n,100,1);
		var input7=create_input("注释","text","form-control form_input","input7_"+n,200,4);
		var input8=create_input("字段默认值","text","form-control form_input","input8_"+n,200,4);
		var input9=create_input("识别名","text","form-control form_input","input9_"+n,200,4);
		var div_o=document.createElement("div");
		div_o.setAttribute("class","form-horizontal  read_only");
		div_o.setAttribute("id","div_o");
		var div_oo=document.createElement("div");
		div_oo.setAttribute("class","col-md-3");
		div_oo.setAttribute("style","padding-left:0px;padding-right:0px;");
		var div_oo2=document.createElement("div");
		div_oo2.setAttribute("class","col-md-4");
		div_oo2.setAttribute("style","padding-left:0px;padding-right:0px;");
		div_o.appendChild(input1);
		div_o.appendChild(input2);
		div_o.appendChild(input3);
		div_oo.appendChild(input4);
		div_oo.appendChild(input5);
		div_o.appendChild(div_oo);
		div_o.appendChild(input6);
		div_oo2.appendChild(input7);
		div_oo2.appendChild(input8);
		div_oo2.appendChild(input9);
		div_o.appendChild(div_oo2);
		$("#input0").remove();
		$("#input_out").remove();
		$("#set_field").append(div_o);
		div_o.setAttribute("id","div_"+n);
		div_o.setAttribute("style","height:50px");
		div_o.setAttribute("style","width:100%");
		alert(div_o.id);
		var br=document.createElement("br");
		$("#set_field").append(br);
		var input0=document.createElement("input");
		input0.setAttribute("type","button");
		input0.setAttribute("id","input0");
		input0.setAttribute("value","accept");
		input0.setAttribute("class","btn btn-primary");
		var input_out = document.createElement("input");
		input_out.setAttribute("type", "button");
		input_out.setAttribute("id", "input_out");
		input_out.setAttribute("value", "退出");
		input_out.setAttribute("class", "btn");
		$("#set_field").append(input_out);
		$("#set_field").append(input0);
		$("#input1_0").attr("value","id").attr("readonly",true);
		$("#input2_0 > option[value='int']").attr("selected",true);
		$("#input2_0").attr("disabled","disabled");
        $("#input3_0").attr("value", "36").attr("readonly", true);
        $("#input4_0").attr("value", " ").attr("readonly", true);
        $("#input5_0").attr("value", " ").attr("readonly", true);
        $("#input7_0").attr("value", " ").attr("readonly", true);
        $("#input8_0").attr("value", " ").attr("readonly", true);
        $("#input9_0").attr("value", " ").attr("readonly", true)
		if ($("#table_name").val() != "" && $("#table_name").val() != null) {
			setCookie("table_name", $(".input_name").val(), 1);
			if (num > 0) {
				alert(n);
				setCookie("field_num", n + 1, 1);
			}
		}
		if($("#input1_1").attr("readonly")=="readonly"){
			$("#input0").bind('click',ajax_1);
		}else{
            $("#input0").bind('click',ajax_0);

        }
            //ajax_0(n + 1);   //ajax发送

            $("#input_out").click(function () {
                var p_index = $("#p_index");
                p_index.empty();
                var p_set = document.createElement("label");
                p_set.innerHTML = "新建数据表";
                p_set.setAttribute("id", "new_index");
                p_index.append(p_set);
                $("#table_set").remove();
                $("#table_new").attr("style", "display:block");
                $("#num_set").removeAttr("disabled");
            });

	   num=parseInt(num)+parseInt(num_add);//更新
	   };
       }
    });

}

function ajax_0() {
	var num=getCookie("field_num");
    var data_json={
        cgFormHead:{
            tableName:$(".input_name").val(),
            jformType:parseInt($("#jformType").val()),
            jformPkType:$("#jformPkType").val(),
            content:$("#tablecontent").val(),
            querymode:$("#querymode").val(),
			jformCategory:" ",
			formTemplate:" ",
			formTemplateMobile:" ",
			jformVersion:"1",
			description:$("#description").val(),
            columns:datas(num)
        }
    };
    //数据传输
    $.ajax({
        type:"POST",
        url: "http://47.106.76.115:8080/lechang-bpm/cgFormHeadController?doDbSynch&synMethod=normal",
        data: JSON.stringify(data_json,null,4),
		contentType:"application/json;charset=UTF-8",
        success:function (recieve) {
            if(recieve.success){
                alert(recieve.msg);
            }
        }
    });
}

    function ajax_1() {
        var num=getCookie("field_num");
        var data_json={
            cgFormHead:{
                tableName:getCookie("table_name"),
                jformType:parseInt($("#jformType").val()),
                jformPkType:$("#jformPkType").val(),
                content:getCookie("table_content"),
                querymode:$("#querymode").val(),
                jformCategory:" ",
                formTemplate:" ",
                formTemplateMobile:" ",
                jformVersion:"1",
                description:$("#description").val(),
                columns:datas(num)
            }
        };
        //数据传输
        $.ajax({
            type:"POST",
            url: "http://47.106.76.115:8080/lechang-bpm/cgFormHeadController?doAlter&synMethod=normal",
            data: JSON.stringify(data_json,null,4),
            contentType:"application/json;charset=UTF-8",
            success:function (recieve) {
                if(recieve.success){
                    alert(recieve.msg);
                }
            }
        });
    }

function setCookie(cname,cvalue,exdays){
	var d = new Date();
	d.setTime(d.getTime()+(exdays*24*60*60*1000));
	var expires = "expires="+d.toGMTString();
	document.cookie = cname+"="+cvalue+"; "+expires;
}

function getCookie(cname){
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for(var i=0; i<ca.length; i++) {
		var c = ca[i].trim();
		if (c.indexOf(name)==0) { return c.substring(name.length,c.length); }
	}
	return "";
}

function datas(num){
	var data_array=new Array();
	for(var j=0;j<num;j++){
		setCookie("input9_"+j,$("#input9_"+j).val(),1);
        setCookie("input1_"+j,$("#input1_"+j).val(),1);
		setCookie("input2_"+j,$("#input2_"+j).val(),1);
		setCookie("input3_"+j,$("#input3_"+j).val(),1);
		var data_element={
				id:(j+1).toString(),
				fieldName:$("#input1_"+j).val(),
				type:$("#input2_"+j).val(),
				length:parseInt($("#input3_"+j).val()),
				mainTable:$("#input4_"+j).val(),
				mainField:$("#input5_"+j).val(),
				isNull:$("#input6_"+j).val(),
				description:$("#input7_"+j).val(),
				fieldDefault:$("#input8_"+j).val(),
				content:$("#input9_"+j).val()
		}
		data_array[j]=data_element;
	}
    var delstatus ={
	    id:(parseInt(num)+1).toString(),
	    fieldName:"delstatus",
        type:"int",
        length:36,
        mainTable:" ",
        mainField:" ",
        isNull:"Y",
        description:" ",
        fieldDefault:"0",
        content:"删除状态",
    };
    data_array[parseInt(num)]=delstatus;
	return data_array;
}
		
	$("#num_set").click(function(){
		var num = $("#field_num").val();
		$("#set_field").empty();
		num_set(num);
		$("#input0").unbind('click');
		$("#input0").bind('click',ajax_0);
	});

	$("#table_add").click(function () {
        $("#set_field").empty();
        num_set(field_data.length-1);
        $(".input_name").attr("value",getCookie("table_name"));
        for (var i=1;i<field_data.length-1;i++){
        	$("#input1_"+i).attr("value",field_data[i].fieldName);
            $("#input2_"+i+" > option[value='"+field_data[i].type+"']").attr("selected",true);
        	$("#input3_"+i).attr("value",field_data[i].length);
        	$("#input6_"+i).attr("value",field_data[i].isNull);
        	$("#input9_"+i).attr("value",field_data[i].content);
        	$("#div_"+i+" > div > input").attr('readonly',true);
        	$("#div_"+i+" > div > select").attr('disabled',true);
            $("#div_"+i+" > div > div > input").attr('readonly',true);
		}
        $("#input0").unbind('click');
        $("#input0").bind('click',ajax_1);
	})
	
	$("#check_table").click(function(){
		var name = $("#table_name").val();
		$.ajax({
			   type:"POST",
			   url: "http://47.106.76.115:8080/lechang-bpm/cgFormHeadController?judge",
			   data: {tableName:name},
            success:function (recieve) {
			     if(recieve.success){
			     	alert(recieve.msg);
			     }
			   }
		});
	})
			
	$("#cancel_table").click(function(){
		var name = $("#table_name").val();
		var data_json={
			tableName:name
		}
		$.ajax({
			   type:"POST",
			   url: "http://47.106.76.115:8080/lechang-bpm/cgFormHeadController?rem",
			   data: JSON.stringify(data_json,null,4),
				contentType:"application/json",
            success:function (recieve) {
			     if(recieve.success){
			     	alert(recieve.msg);
			     }
			   }
	   });
	});

    $("#table-new-2").attr("style","display:none");

	$("#chevron").click(function () {
		if($(this).children("i").attr("class")=="fa fa-chevron-left")
			{
				$(this).children("i").attr("class","fa fa-chevron-down");
				$("#table-new-2").attr("style","display:block");
			}
		else
			{
				$(this).children("i").attr("class","fa fa-chevron-left");
                $("#table-new-2").attr("style","display:none");
			};
    });

    $("#pagination3").pagination({
        currentPage: 1,// 当前页数
        totalPage: 2,// 总页数
        isShow: true,// 是否显示首尾页
        count: 2,// 显示个数
        homePageText: "首页",// 首页文本
        endPageText: "尾页",// 尾页文本
        prevPageText: "上一页",// 上一页文本
        nextPageText: "下一页",// 下一页文本
        callback: function(current) {
            // 回调,current(当前页数)
        }
    });

    //var data_j=[{id:1,content:"嘻嘻",tableName:"xixi"},{id:2,content:"CC",tableName:"xixi"},{id:3,content:"jj",tableName:"xixi"}];
    function insert_table_div(obj) {       //回掉函数所获json数据的处理
    	var number=obj.length;
    	for(var j=0;j<number;j++){
    		var div_col=document.createElement("div");
    		var i_col=document.createElement("i");
    		var span_col=document.createElement("span");
    		$(".modal-dialog").removeClass("modal-sm").addClass("modal-lg");
    		div_col.setAttribute("class","col-xs-12 div_col");
            div_col.setAttribute("data-toggle","modal");
            div_col.setAttribute("data-target","#myModal");
    		i_col.setAttribute("class","fa fa-list-alt");
            i_col.setAttribute("style","margin-right:20px;");
    		span_col.innerHTML=obj[j].content+"  /  "+obj[j].tableName;
    		span_col.setAttribute("name",obj[j].content);
    		div_col.setAttribute("id",obj[j].id);
    		div_col.setAttribute("name",obj[j].tableName);
    		div_col.append(i_col);
    		div_col.append(span_col);
    		div_col.addEventListener('click',field_show);
    		$("#div_set").append(div_col);

		}
    }

    function fill_field(obj) {

    }

    function insert_tableField_div(obj) {       //回掉函数所获json数据的处理
        var number=obj.length;
        for(var j=1;j<number-1;j++){
            var div_col=document.createElement("div");
            var i_col=document.createElement("i");
            var span_col=document.createElement("span");
            var span_col2=document.createElement("span");
            var span_col3=document.createElement("span");
            var span_col4=document.createElement("span");
            div_col.setAttribute("class","col-xs-12 div_col");
            i_col.setAttribute("class","fa fa-list-alt col-sm-1");
            span_col.setAttribute("class","col-sm-3");
            span_col2.setAttribute("class","col-sm-2");
            span_col3.setAttribute("class","col-sm-3");
            span_col4.setAttribute("class","col-sm-3");
            span_col.innerHTML="字段名:"+obj[j].content+"/"+obj[j].fieldName;
            span_col2.innerHTML="长度:"+obj[j].length;
            span_col3.innerHTML="类型:"+obj[j].type;
            span_col4.innerHTML="是否为空:"+obj[j].isNull;
            div_col.setAttribute("id",obj[j].fieldName);
            div_col.setAttribute("name",obj[j].fieldName);
            div_col.append(i_col);
            div_col.append(span_col);
            div_col.append(span_col2);
            div_col.append(span_col3);
            div_col.append(span_col4);
            $("#field_div").append(div_col);
            $("#field_div").append("<br/>");

        }
    }
    function field_show() {
		$("#field_div").empty();
		//alert(this.attr('name'));
        setCookie("table_name", $(this).attr('name'), 1);
        setCookie("table_content", $(this).find("span").attr('name'), 1);
		$(".modal-header").html("字段信息");
		$.ajax({
			type:"GET",
			url:"http://47.106.76.115:8080/lechang-bpm/cgFormHeadController?showTableField",
			data:{tableId:$(this).attr("id")},
            success:function (recieve) {
                if(recieve.success) {
                	field_data=recieve.obj;
                    insert_tableField_div(recieve.obj);
                }
            }
		})
    }



    $.ajax({
        type:"GET",
        url: "http://47.106.76.115:8080/lechang-bpm/cgFormHeadController?showTables",
        data: "",
        success:function (recieve) {
            if(recieve.success){
                insert_table_div(recieve.obj);
            }
        }
    });
})





