// JavaScript Document
$(document).ready(function(){
//----------------全局------------------------
    var field_num=getCookie("field_num");
    var table_name=getCookie("table_name");
    //alert(getCookie("field_json"));
    var tr=document.createElement("tr");
    for(var j=0;j<field_num;j++){
        var input1=getCookie("input1_"+j);
        var th=document.createElement("th");
        th.innerHTML=input1;
        tr.appendChild(th);
    }

//----------------CSS实现---------------------

$(".li_3").click(function(){
	$("#table_nav").html("数据信息管理");
	$("#wrap_1").attr("style","display:none");
	$("#wrap_2").attr("style","display:none");
	$("#wrap_3").attr("style","display:block");
	$("#wrap_4").attr("style","display:none");
	$("#wrap_5").attr("style","display:none");
	$("#wrap_6").attr("style","display:none");
});
//-----------------js实现------------------------
    function setCookie(cname,cvalue,exdays){
        var d = new Date();
        d.setTime(d.getTime()+(exdays*24*60*60*1000));
        var expires = "expires="+d.toGMTString();
        document.cookie = cname+"="+cvalue+"; "+expires;
        //alert("?");
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

    $("#new_index").click(function() {
            $("#table_new").attr("style", "display:block");
            $("#table_data").attr("style", "display:none");
            //$("#num_set").attr("disabled", "true");
            //轮换
            $("#set_index").click(function() {
                $("#table_new").attr("style", "display:none");
                $("#table_data").attr("style", "display:block");
            });
    })

    $("#insert").click(function(){
        var dlg=$('#dlg');
        dlg.empty();
        dlg.css("height",field_num*50+30+"px");       //样式注意
        $("#myModalLabel").html("插入");
        //dlg.html("Hello <b>world</b>!");
        //var input=create_input("yes","text","form-control","insert_input",100,12);
        //dlg.append(input);
        for(var j=0;j<field_num;j++){
            //alert(j);
            var input1=getCookie("input1_"+j);
            var input2=getCookie("input2_"+j);
            var input3=getCookie("input3_"+j);
            if(input2=="int"){
                var input=create_input(input1,"number","form-control","insert_input"+(j+1),100,12);
            }else if(input2=="string"){
                var input=create_input(input1,"text","form-control","insert_input"+(j+1),100,12);
            }
            $('#dlg').append(input);
        }
        //$('#dlg').dialog('open');
    });

    $("#cancel").click(function(){
        var dlg=$('#dlg');
        dlg.empty();
        dlg.css("height",2*50+30+"px");
        $("#myModalLabel").html("删除");
        //dlg.html("Hello <b>world</b>!");
        //var input=create_input("yes","text","form-control","insert_input",100,12);
        //dlg.append(input);
        var select_item=new Array();
        for(var j=0;j<field_num;j++){                    //field_num注意
            select_item[j]=getCookie("input1_"+j);
        }
        var name="字段名";
        var input=create_select(name,select_item,"form-control","cancel_input1",100,12);
        //var input2=getCookie
        //if(input2=="int"){
        //var input2=create_input("����","number","form-control","insert_input"+(j+1),100,12);
        //}else if(input2=="varchar"){
        var input2=create_input("值","text","form-control","cancel_input2",100,12);
        //}
        $('#dlg').append(input);
        $('#dlg').append(input2);

        //$('#dlg').dialog('open');
    });

    $("#check").click(function(){
        var dlg=$('#dlg');
        dlg.empty();
        dlg.css("height",2*50+30+"px");
        $("#myModalLabel").html("查找");
        //dlg.html("Hello <b>world</b>!");
        //var input=create_input("yes","text","form-control","insert_input",100,12);
        //dlg.append(input);
        var select_item=new Array();
        for(var j=0;j<field_num;j++){
            select_item[j]=getCookie("input1_"+j);
        }
        var name="字段名";
        var input=create_select("字段名",select_item,"form-control","cancel_input1",100,12);
        //var input2=getCookie
        //if(input2=="int"){
        //var input2=create_input("����","number","form-control","insert_input"+(j+1),100,12);
        //}else if(input2=="varchar"){
        var input2=create_input("值","text","form-control","cancel_input2",100,12);
        //}
        $('#dlg').append(input);
        $('#dlg').append(input2);

        //$('#dlg').dialog('open');
    });

    $("#replace").click(function(){
        var dlg=$('#dlg');
        dlg.empty();
        dlg.css("height",4*50+30+"px");
        $("#myModalLabel").html("更改");
        //dlg.html("Hello <b>world</b>!");
        //var input=create_input("yes","text","form-control","insert_input",100,12);
        //dlg.append(input);
        var select_item=new Array();
        for(var j=0;j<field_num;j++){
            select_item[j]=getCookie("input1_"+j);
        }
        var input=create_select("查字段名",select_item,"form-control","cancel_input1",100,12);
        var input2=create_input("值","text","form-control","cancel_input2",100,12);
        var input3=create_select("改字段名",select_item,"form-control","cancel_input1",100,12);
        var input4=create_input("值","text","form-control","cancel_input2",100,12);
        $('#dlg').append(input);
        $('#dlg').append(input2);
        $('#dlg').append(input3);
        $('#dlg').append(input4);

        //$('#dlg').dialog('open');
    });

    function change_p_index() {
        var p_sym=document.createTextNode(">>");
        var p_index=$("#p_index");
        var p_set=document.createElement("label");
        p_set.innerHTML="数据信息操作";
        p_set.setAttribute("id","set_index");
        p_index.append(p_sym);
        p_index.append(p_set);
    }

    function insert_table_div(recieve) {
        var number=recieve.length;
        for(var j=0;j<number;j++){
            var div_col=document.createElement("div");
            var i_col=document.createElement("i");
            var span_col=document.createElement("span");
            div_col.setAttribute("class","col-xs-12 div_col");
            i_col.setAttribute("style","margin-right:15px;");
            span_col.setAttribute("style","");
            i_col.setAttribute("class","fa fa-list-alt");
            span_col.innerHTML=recieve[j].tableName;
            div_col.append(i_col);
            div_col.append(span_col);
            $("#div_set").append(div_col);
        }
    }

    function insert_table_data(recieve) {
        var number=recieve.length;
        for(var j=0;j<number;j++){

        }
    }
//----------------页面刷新ajax-------------------
    var data_j=[{id:1,tableName:"like"},{id:2,tableName:"CC"},{id:3,tableName:"jj"}];   //主键/表名
    insert_table_div(data_j);     //回掉函数所获json数据的处理,验证用
    window.onload=function(){

        $.ajax({
            type:"post",
            url:"#",
            data:"#",
            success:function (recieve_data) {
                recieve=JSON.parse(recieve_data);
                insert_table_div(data_j);
            }
        })
    }

    $(".div_col").click(function () {
        change_p_index();
        $("#table_new").attr("style","display:none;");
        $("#table_data").attr("style","display:block;");
        $.ajax({
            type:"post",
            url:"#",
            data:"#",
            success:function (recieve_data) {
                recieve=JSON.parse(recieve_data);

            }
    })
    })
});