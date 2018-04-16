// JavaScript Document
$(document).ready(function(){
//----------------实验用----------------------
/*
    setCookie("field_num",5,1);
    setCookie("totalNum",15,1);
    for(var j=0;j<5;j++){
        setCookie("input1_"+j,"f-"+j,1);
        setCookie("input2_"+j,"string",1);
        setCookie("input9_"+j,"t-"+j,1);
    }
    var data_j=[{id:1,tableName:"like",content:"表一"},{id:2,tableName:"CC",content:"表二"},{id:3,tableName:"jj",content:"表三"}];   //主键/表名
    //alert(Object.values(data_j[1]));

    var data_x=[{length:1,content:"嘻嘻",type:"string",isNull:"Y",fieldName:"tt"},{length:3,content:"dans",type:"int",isNull:"N",fieldName:"ui"},{length:4,content:"安装",type:"string",isNull:"Y",fieldName:"kd"}]
    insert_table_div(data_j);     //回掉函数所获json数据的处理,验证用
    var field_num=getCookie("field_num");
    insert_table_data(data_x);
*/
//----------------全局------------------------
    var replace_id=null;
    var data_index=new Array();
    var data_cancel=new Array();
    var data_field_recieve=new Array();
    var data_table_recieve=new Array();
    var data_replace=new Array();


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

    function create_input(name,type,classname,idname,subName,width,div_width){
        var input1=document.createElement("input");
        var span1=document.createElement("label");
        var div_o=document.createElement("div");
        span1.innerHTML=name;
        input1.setAttribute("type",type);
        input1.setAttribute("class",classname);
        input1.setAttribute("id",idname);
        input1.setAttribute("name",subName);
        input1.setAttribute("style","width:100%");
        div_o.setAttribute("class","col-md-"+div_width);
        div_o.appendChild(span1);
        div_o.appendChild(input1);
        return div_o;
    }

    function create_select(name,select_array,select_content,classname,idname,width,div_width){
        var select=document.createElement("select");
        var span1=document.createElement("label");
        var div_o=document.createElement("div");
        span1.innerHTML=name;
        select.setAttribute("class",classname);
        select.setAttribute("id",idname);
        select.setAttribute("style","width:100%");
        for(var i in select_array){
            select.add(new Option(select_array[i],select_content[i]),null);
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

    /*$("#pagination3").pagination({
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
    });*/
    function page_set(current_page,total_page,page_size) {
        $("#pagination").pagination({
            currentPage: parseInt(current_page),// 当前页数
            totalPage: parseInt(total_page),// 总页数
            isShow: true,// 是否显示首尾页
            count: parseInt(page_size),// 显示个数
            homePageText: "首页",// 首页文本
            endPageText: "尾页",// 尾页文本
            prevPageText: "上一页",// 上一页文本
            nextPageText: "下一页",// 下一页文本
            callback: function(current) {
                var data_json={
                    tableName:getCookie('table_name'),
                    currentPage:current,
                    pageSize:10,
                    data:[]
                }
                $.ajax({
                    type:"POST",
                    url: "http://47.106.76.115:8080/lechang-bpm/tableCRUDController/select",
                    data: JSON.stringify(data_json,null,4),
                    contentType:"application/json",
                    success:function (recieve) {
                        if (recieve.success) {
                            //alert(recieve.msg);
                            $("tbody").empty();
                            data_table_recieve=recieve.obj;
                            insert_table_data(recieve.obj);
                            var map=recieve.attributes;
                            setCookie("totalNum",map.page.totalNum,1);
                            page_set(map.page.currentPage,map.page.totalPage,map.page.pageSize);
                        }
                    }
                })
            }
        });
    }


    $("#new_index").click(function() {
            location.reload();
    })

    $("#insert").click(function(){
        $(".table-btn").unbind('click');
        var n=getCookie("field_num");
        var dlg=$('#dlg');
        dlg.empty();
        $(".table-btn").removeAttr("id");
        $("#insert-btn").unbind('click');
        dlg.css("height",n*50+30+"px");       //样式注意
        $("#myModalLabel").html("插入");
        $(".modal-dialog").attr("style","width:300px;");
        $(".modal-content").removeClass("modal-lg").addClass("modal-sm");
        $(".table-btn").attr("id","insert-btn");
        $("#insert-btn").bind('click',insert_btn);
        for(var j=1;j<n;j++){
            var input1=getCookie("input1_"+j);
            var input2=getCookie("input2_"+j);
            var input9=getCookie("input9_"+j);
            //alert(input1);
            if(input2=="int"){
                var input=create_input(input9,"number","form-control","insert_input"+j,input1,100,12);
            }else if(input2=="string"){
                var input=create_input(input9,"text","form-control","insert_input"+j,input1,100,12);
            }
            $('#dlg').append(input);
        }
    });

    $("#insert-accept").click(function(){
        $(".table-btn").unbind('click');
        var dlg=$('#dlg');
        dlg.empty();
        $(".table-btn").removeAttr("id");
        dlg.css("height",2*50+30+"px");
        $("#myModalLabel").html("新增缓存区");
        $(".modal-dialog").attr("style","width:300px;");
        $(".modal-content").removeClass("modal-lg").addClass("modal-sm");
        $(".table-btn").attr("id","insert_accept-btn");
        $("#insert_accept-btn").on('click',insert_accept_btn);
        var number=data_index.length;
        for(var j=0;j<number;j++){
            var field_s=Object.keys(data_index[j]);
            var data_s=Object.values(data_index[j]);
            for (var i=0;i<field_s.length;i++){
                var div_col=document.createElement("div");
                var i_col=document.createElement("i");
                var span_col=document.createElement("span");
                var span_col2=document.createElement("span");
                div_col.setAttribute("class","col-xs-12 div_col");
                i_col.setAttribute("class","fa fa-list-alt col-sm-1");
                span_col.setAttribute("class","col-sm-5");
                span_col2.setAttribute("class","col-sm-5");
                span_col.innerHTML=field_s[i];
                span_col2.innerHTML=data_s[i];
                div_col.setAttribute("id",field_s[i]);
                div_col.append(i_col);
                div_col.append(span_col);
                div_col.append(span_col2);
                $("#dlg").append(div_col);
            }
            var div_br=document.createElement("div");
            div_br.setAttribute("class","col-xs-12 div_col");
            var span_br=document.createElement("span");
            span_br.innerHTML=" ";
            div_br.append(span_br);
            $("#dlg").append(div_br);
        }
    });
    $("#cancel-accept").click(function() {
        $(".table-btn").unbind('click');
        var dlg = $('#dlg');
        dlg.empty();
        $(".table-btn").removeAttr("id");
        dlg.css("height", 2 * 50 + 30 + "px");
        $("#myModalLabel").html("删除缓存区");
        $(".modal-dialog").attr("style","width:900px;");
        $(".modal-content").removeClass("modal-sm").addClass("modal-lg");
        $(".table-btn").attr("id", "cancel_accept-btn");
        $("#cancel_accept-btn").on('click', cancel_accept_btn);
        var number = data_cancel.length;
        for (var j = 0; j < number; j++) {
            var data_s = data_cancel[j];
                var div_col = document.createElement("div");
                var i_col = document.createElement("i");
                var span_col = document.createElement("span");
                div_col.setAttribute("class", "col-xs-12 div_col");
                i_col.setAttribute("class", "fa fa-list-alt col-sm-1");
                span_col.setAttribute("class", "col-sm-10");
                var str=(j+1).toString();
                for (var i=1;i<getCookie("field_num");i++){
                    str=str+"  /  "+data_field_recieve[i].content+":"+data_cancel[j][data_field_recieve[i].fieldName];
                }
                span_col.innerHTML = str;
                div_col.setAttribute("id", data_s[j]);
                div_col.append(i_col);
                div_col.append(span_col);
                $("#dlg").append(div_col);
        }
    })

    $("#check").click(function(){
        $(".table-btn").unbind('click');
        var dlg=$('#dlg');
        dlg.empty();
        $(".table-btn").removeAttr("id");
        dlg.css("height",2*50+30+"px");
        $("#myModalLabel").html("查找");
        $(".modal-dialog").attr("style","width:300px;");
        $(".modal-content").removeClass("modal-lg").addClass("modal-sm");
        $(".table-btn").attr("id","check-btn");
        $("#check-btn").on('click',check_btn);
        var select_item=new Array();
        var select_item2=new Array();
        for(var j=1;j<getCookie("field_num");j++){                    //field_num注意
            select_item[j]=getCookie("input9_"+j);
            select_item2[j]=getCookie("input1_"+j);
        }
        var input=create_select("字段名",select_item,select_item2,"form-control","check_input0",100,12);
        var input2=create_input("值","text","form-control","check_input1","check21",100,12);
        $('#dlg').append(input);
        $('#dlg').append(input2);
    });

    $("#replace-accept").click(function () {
        $(".table-btn").unbind('click');
        var dlg = $('#dlg');
        dlg.empty();
        $(".table-btn").removeAttr("id");
        dlg.css("height", 2 * 50 + 30 + "px");
        //dlg.css("width",700+"px");
        $("#myModalLabel").html("修改缓存区");
        $(".modal-dialog").attr("style","width:900px;");
        $(".modal-content").removeClass("modal-sm").addClass("modal-lg");
        $(".table-btn").attr("id", "replace_accept-btn");
        $("#replace_accept-btn").on('click', replace_accept_btn);

        var number = data_replace.length;
        for (var j = 0; j < number; j++) {
            var data_s = data_replace[j];
            var div_col = document.createElement("div");
            var i_col = document.createElement("i");
            var span_col = document.createElement("span");
            div_col.setAttribute("class", "col-xs-12 div_col");
            i_col.setAttribute("class", "fa fa-list-alt col-sm-1");
            span_col.setAttribute("class", "col-sm-10");
            var str=(j+1).toString();
            for (var i=1;i<getCookie("field_num");i++) {
                if (typeof (data_replace[j][data_field_recieve[i].fieldName]) != "undefined") {
                    alert(data_replace[j][data_field_recieve[i].fieldName]);
                    str = str + "  /  " + data_field_recieve[i].content + ":" + data_replace[j][data_field_recieve[i].fieldName];
                }
            }
            span_col.innerHTML = str;
            div_col.setAttribute("id", data_s[j]);
            div_col.append(i_col);
            div_col.append(span_col);
            $("#dlg").append(div_col);
        }
    });

    function replace_click(){
        $(".table-btn").unbind('click');
        var dlg=$('#dlg');
        dlg.empty();
        $(".table-btn").removeAttr("id");
        dlg.css("height",2*50+30+"px");
        $("#myModalLabel").html("更改");
        $(".modal-dialog").attr("style","width:300px;");
        $(".modal-content").removeClass("modal-lg").addClass("modal-sm");
        $(".table-btn").attr("id","replace-btn");
        $("#replace-btn").on('click',replace_btn);
        var select_item=new Array();
        var select_item2=new Array();
        for(var j=1;j<getCookie("field_num");j++){                    //field_num注意
            select_item[j]=getCookie("input9_"+j);
            select_item2[j]=getCookie("input1_"+j);
        }
        var input1=create_select("改字段名",select_item,select_item2,"form-control","replace_input0",100,12);
        var input2=create_input("值","text","form-control","replace_input1","replace1",100,12);
        $('#dlg').append(input1);
        $('#dlg').append(input2);
        var data=new Object();
        var num=$(this).attr("id");
        data["id"]=parseInt(num);
        replace_id=data.id;
        for(var i=0;i<data_replace.length;i++){
            if(data_replace[i].id==parseInt(num)){
                return 0;
            }
        }
        data_replace.push(data);
    }

    function change_p_index() {
        var p_sym=document.createTextNode(">>");
        var p_index=$("#p_index");
        var p_set=document.createElement("label");
        p_set.innerHTML="数据信息操作("+getCookie("table_name")+")";
        p_set.setAttribute("id","set_index");
        p_set.click(function () {
            flash_table();
        })
        p_index.append(p_sym);
        p_index.append(p_set);
    }

    function insert_table_div(obj) {       //回掉函数所获json数据的处理
        var number=obj.length;
        for(var j=0;j<number;j++){
            var div_col=document.createElement("div");
            var i_col=document.createElement("i");
            var span_col=document.createElement("span");
            div_col.setAttribute("class","col-xs-12 div_col");
            i_col.setAttribute("class","fa fa-list-alt");
            i_col.setAttribute("style","margin-right:20px;");
            span_col.innerHTML=obj[j].content+"  /  "+obj[j].tableName;
            div_col.setAttribute("id",obj[j].id);
            div_col.setAttribute("name",obj[j].tableName);
            div_col.append(i_col);
            div_col.append(span_col);
            $("#div_set").append(div_col);

        }
    }

    function insert_tableField(obj) {       //回掉函数所获json数据的处理
        var number=obj.length-1;
        setCookie("field_num",number,1);
        for(var j=1;j<number;j++){
            setCookie("input1_"+j,obj[j].fieldName,1);
            setCookie("input2_"+j,obj[j].type,1);
            setCookie("input9_"+j,obj[j].content,1);
        }
        var tr=document.createElement("tr");
        for(var j=1;j<number;j++){
            //alert(obj[j].content);
            var input9 = obj[j].content+"/"+obj[j].fieldName;         //到时改为obj【j】.content
            var th=document.createElement("th");
            th.innerHTML=input9;
            tr.appendChild(th);
        }
        var th=document.createElement("th");
        th.innerHTML="操作";
        tr.appendChild(th);
        $("thead").append(tr);
        //page_set(1,5,10);
        var data_json={
            tableName:getCookie('table_name'),
            currentPage:1,
            pageSize:10,
            data:[]
        }
        $.ajax({
            type:"POST",
            url: "http://47.106.76.115:8080/lechang-bpm/tableCRUDController/select",
            data: JSON.stringify(data_json,null,4),
            contentType:"application/json;charset=UTF-8",
            success:function (recieve) {
                if (recieve.success) {
                    data_table_recieve=recieve.obj;
                    insert_table_data(recieve.obj);
                    var map=recieve.attributes;
                    setCookie("totalNum",map.page.totalNum,1);
                    page_set(map.page.currentPage,map.page.totalPage,map.page.pageSize);
                }
            }
        })
    }

    function insert_table_data(obj) {
        var number=obj.length;
        for(var j=0;j<number;j++) {
            if (obj[j].delstatus == 0) {
                var tr = document.createElement("tr");
                for (var i = 0; i <= getCookie("field_num"); i++) {
                    if (data_field_recieve[i].fieldName != "id" && data_field_recieve[i].fieldName != "delstatus") {
                        //var fieldName=obj_keys[j];
                        var el = obj[j][data_field_recieve[i].fieldName];         //到时改为obj【j】.content
                        var td = document.createElement("td");
                        td.innerHTML = el;
                        tr.appendChild(td);
                    }
                }
                var td = document.createElement("td");
                var bt_1 = document.createElement("button");
                var bt_2 = document.createElement("button");
                bt_1.setAttribute("class", "table_cancel_bt btn btn-danger");
                bt_2.setAttribute("class", "table_replace_bt btn btn-warning");
                bt_1.setAttribute("style", "font-size:12px;padding:1px 12px;");
                bt_2.setAttribute("style", "font-size:12px;padding:1px 12px;");
                bt_2.setAttribute("data-toggle", "modal");
                bt_2.setAttribute("data-target", "#myModal");
                bt_1.setAttribute("id", data_table_recieve[j].id);
                bt_2.setAttribute("id", data_table_recieve[j].id);
                bt_1.innerHTML = "删除";
                bt_2.innerHTML = "修改";
                //td.innerHTML="id";
                td.append(bt_1);
                td.append("  ");
                td.append(bt_2);
                tr.appendChild(td);
                $("tbody").append(tr);
            }
        }
        $(".table_cancel_bt").click(function () {
            var data=new Object();
            var num=$(this).attr("id");
            data["id"]=parseInt(num);
            for (var i=0;i<data_table_recieve.length;i++){
                if (data_table_recieve[i].id==parseInt(num)){
                    for (var j=1;j<getCookie("field_num");j++){
                        var index=data_type(data_field_recieve[j].fieldName,data_table_recieve[i][data_field_recieve[j].fieldName]);
                        data[data_field_recieve[j].fieldName]=index;
                    }
                }
            }
            data_cancel.push(data);
        })
        $(".table_replace_bt").bind('click',replace_click);
    }
    
    function insert_btn() {
        var data=new Object();
        for(var j=1;j<getCookie("field_num");j++){
            var field_name_insert=$("#insert_input"+j).attr("name");
            var dt=$("#insert_input"+j).val();
            if(data_field_recieve[j].type=="string") {
                data[field_name_insert] = "'" + dt + "'";
            }else if(data_field_recieve[j].type=="int"){
                data[field_name_insert]=parseInt(dt);
            }
        }
        data_index.push(data);
    }

    function check_btn() {
        var field_check=$("#check_input0").val();
        var data_check=$("#check_input1").val();
        var data=new Object();
        data[field_check]=data_type(field_check,data_check);
        var data_json={
            currentPage:1,
            pageSize:10,
            tableName:getCookie("table_name"),
            data:[data]
        }
        $.ajax({
            type:"POST",
            url:"http://47.106.76.115:8080/lechang-bpm/tableCRUDController/select",
            data:JSON.stringify(data_json,null,4),
            contentType:"application/json",
            success:function (recieve) {
                if(recieve.success) {
                    if (recieve.obj.length != 0) {
                        data_table_recieve = recieve.obj;
                        $("tbody").empty();
                        insert_table_data(recieve.obj);
                        var map = recieve.attributes;
                        setCookie("totalNum", map.page.totalNum, 1);
                        page_set(map.page.currentPage, map.page.totalPage, map.page.pageSize);
                    }else {
                        alert("匹配项不存在");
                    }
                }
            }
        })
    }

    function replace_btn() {
        for(var i=0;i<data_replace.length;i++){
            if(data_replace[i].id==replace_id){
                data_replace[i][$("#replace_input0").val()]=data_type($("#replace_input0").val(),$("#replace_input1").val());
            }
        }
    }

    function insert_accept_btn() {
        var data_json = {
            tableName: getCookie("table_name"),
            data: data_index
        }
        $.ajax({
            type: "POST",
            url: "http://47.106.76.115:8080/lechang-bpm/tableCRUDController/insert",
            data: JSON.stringify(data_json, null, 4),
            contentType:"application/json",
            success:function (recieve) {
                if (recieve.success) {
                    alert(recieve.msg);
                    data_index=[];
                    $("#dlg").empty();
                    flash_table();
                }
            }
        })
    }

    function cancel_accept_btn() {
            var data_json={
                tableName:getCookie("table_name"),
                data:data_cancel
            }
            $.ajax({
                type:"POST",
                url:"http://47.106.76.115:8080/lechang-bpm/tableCRUDController/delete",
                data:JSON.stringify(data_json,null,4),
                contentType:"application/json;charset=utf-8",
                success:function (recieve) {
                    if(recieve.success) {
                        alert(recieve.msg);
                        flash_table();
                    }
                }
            })
    }

    function replace_accept_btn() {
        var data_json={
            tableName:getCookie("table_name"),
            data:data_replace
        }
        $.ajax({
            type:"POST",
            url:"http://47.106.76.115:8080/lechang-bpm/tableCRUDController/update",
            data:JSON.stringify(data_json,null,4),
            contentType:"application/json;charset=utf-8",
            success:function (recieve) {
                if(recieve.success) {
                    alert(recieve.msg);
                    flash_table();
                }
            }
        })
    }

    function data_type(field,value) {
        for(var i=1;i<getCookie("field_num");i++){
            if(field==data_field_recieve[i].fieldName&&data_field_recieve[i].type=="string"){
                return "'"+value+"'";
            }else if(field==data_field_recieve[i].fieldName&&data_field_recieve[i].type=="int"){
                return parseInt(value);
            }
        }
    }
//----------------页面刷新ajax-------------------

    $.ajax({
        type:"GET",
        url: "http://47.106.76.115:8080/lechang-bpm/cgFormHeadController?showTables",
        data: "",
        success:function (recieve) {
            //recieve=JSON.parse(recieve_json);
            if (recieve.success) {
                //alert(recieve.msg);
                insert_table_div(recieve.obj);
                $(".div_col").on('click',div_col_click);
                //alert(recieve.obj);
            }
        }
    })


    function div_col_click() {
        change_p_index();
        $("#table_new").attr("style", "display:none;");
        $("#table_data").attr("style", "display:block;");
        setCookie("table_name", $(this).attr('name'), 1);
        $.ajax({
            type: "GET",
            url: "http://47.106.76.115:8080/lechang-bpm/cgFormHeadController?showTableField",
            data: {tableId: $(this).attr('id')},
            success: function (recieve) {
                if (recieve.success) {
                    data_field_recieve=recieve.obj;
                    insert_tableField(recieve.obj);
                }
            }
        })

    }

    function flash_table() {
        $("tbody").empty();
        var data_json={
            tableName:getCookie('table_name'),
            currentPage:1,
            pageSize:10,
            data:[]
        }
        $.ajax({
            type:"POST",
            url: "http://47.106.76.115:8080/lechang-bpm/tableCRUDController/select",
            data: JSON.stringify(data_json,null,4),
            contentType:"application/json;charset=UTF-8",
            success:function (recieve) {
                if (recieve.success) {
                    data_table_recieve=recieve.obj;
                    insert_table_data(recieve.obj);
                    var map=recieve.attributes;
                    setCookie("totalNum",map.page.totalNum,1);
                    page_set(map.page.currentPage,map.page.totalPage,map.page.pageSize);
                }
            }
        })
    }
});


