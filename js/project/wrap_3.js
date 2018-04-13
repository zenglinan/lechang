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
    var field_num=getCookie("field_num");
    var data_index=new Array();
    var data_cancel=new Array();
    //alert(field_num);
    var table_name=getCookie("table_name");
    //alert(getCookie("field_json"));


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
                    pageSize:10
                }
                $.ajax({
                    type:"POST",
                    url: "http://47.106.76.115:8080/lechang-bpm/tableCRUDController/select",
                    data: JSON.stringify(data_json,null,4),
                    //dataType: "json",
                    success: function(recieve_json) {
                        var recieve = JSON.parse(recieve_json);
                        if (recieve.success) {
                            alert(recieve.msg);
                            insert_table_data(recieve.obj);
                            var map=recieve.attributes;
                            setCookie("totalNum",map['page']['totalNum']-map['page']['startNum'],1);
                            page_set(map['page']['currentPage'],map['page']['totalPage'],map['page']['pageSize']);
                        }
                    }
                })
            }
        });
    }


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
        $(".table-btn").removeAttr("id");
        dlg.css("height",field_num*50+30+"px");       //样式注意
        $("#myModalLabel").html("插入");
        $(".table-btn").attr("id","insert-btn");
        $("#insert-btn").on('click',insert_btn);
        //dlg.html("Hello <b>world</b>!");
        //var input=create_input("yes","text","form-control","insert_input",100,12);
        //dlg.append(input);
        for(var j=0;j<field_num;j++){
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
        //$('#dlg').dialog('open');
    });

    $("#insert-accept").click(function(){
        var dlg=$('#dlg');
        dlg.empty();
        $(".table-btn").removeAttr("id");
        dlg.css("height",2*50+30+"px");
        //dlg.css("width",700+"px");
        $("#myModalLabel").html("缓存");
        $(".table-btn").attr("id","insert_accept-btn");
        $("#insert_accept-btn").on('click',insert_accept_btn);
        var number=data_index.length;
        //var fields=Object.keys(data_index[0]);
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
                //div_col.setAttribute("name",obj[j].fieldName);
                div_col.append(i_col);
                div_col.append(span_col);
                div_col.append(span_col2);
                //div_col.addEventListener('click',field_show);
                $("#dlg").append(div_col);
            }
            var div_br=document.createElement("div");
            div_br.setAttribute("class","col-xs-12 div_col");
            var span_br=document.createElement("span");
            span_br.innerHTML=" ";
            div_br.append(span_br);
            $("#dlg").append(div_br);
            //$("#field_div").append("<br/>");

        }

        //$('#dlg').dialog('open');
    });

    $("#cancel").click(function(){
        var dlg=$('#dlg');
        dlg.empty();
        $(".table-btn").removeAttr("id");
        dlg.css("height",2*50+30+"px");
        $("#myModalLabel").html("删除");
        $(".table-btn").attr("id","cancel-btn");
        $("#cancel-btn").on('click',cancel_btn);
        //dlg.html("Hello <b>world</b>!");
        //var input=create_input("yes","text","form-control","insert_input",100,12);
        //dlg.append(input);
        /*var select_item=new Array();
        var select_item2=new Array();
        for(var j=0;j<field_num;j++){                    //field_num注意
            select_item[j]=getCookie("input9_"+j);
            select_item2[j]=getCookie("input1_"+j);
        }
        */
        //var name="字段名";
        //var input=create_select(name,select_item,select_item2,"form-control","cancel_input0",100,12);
        //var input2=getCookie
        //if(input2=="int"){
        var input=create_input("id","number","form-control","cancel_input0","cancel0",100,12);
        //}else if(input2=="varchar"){
        //var input2=create_input("值","text","form-control","cancel_input1","cancel1",100,12);
        //}
        $('#dlg').append(input);
        //$('#dlg').append(input2);

        //$('#dlg').dialog('open');
    });

    $("#cancel-accept").click(function() {
        var dlg = $('#dlg');
        dlg.empty();
        $(".table-btn").removeAttr("id");
        dlg.css("height", 2 * 50 + 30 + "px");
        //dlg.css("width",700+"px");
        $("#myModalLabel").html("缓存");
        $(".table-btn").attr("id", "cancel_accept-btn");
        $("#cancel_accept-btn").on('click', cancel_accept_btn);
        var number = data_cancel.length;
        //var fields=Object.keys(data_index[0]);
        for (var j = 0; j < number; j++) {
            var data_s = data_cancel[j];
                var div_col = document.createElement("div");
                var i_col = document.createElement("i");
                var span_col = document.createElement("span");
                div_col.setAttribute("class", "col-xs-12 div_col");
                i_col.setAttribute("class", "fa fa-list-alt col-sm-1");
                span_col.setAttribute("class", "col-sm-10");
                span_col.innerHTML = data_s.id;
                div_col.setAttribute("id", data_s[j]);
                //div_col.setAttribute("name",obj[j].fieldName);
                div_col.append(i_col);
                div_col.append(span_col);
                //div_col.addEventListener('click',field_show);
                $("#dlg").append(div_col);
            //$("#field_div").append("<br/>");
        }
    })

    $("#check").click(function(){
        var dlg=$('#dlg');
        dlg.empty();
        $(".table-btn").removeAttr("id");
        dlg.css("height",2*50+30+"px");
        $("#myModalLabel").html("查找");
        $(".table-btn").attr("id","check-btn");
        $("#check-btn").on('click',check_btn);
        //dlg.html("Hello <b>world</b>!");
        //var input=create_input("yes","text","form-control","insert_input",100,12);
        //dlg.append(input);
        var select_item=new Array();
        var select_item2=new Array();
        for(var j=0;j<field_num;j++){                    //field_num注意
            select_item[j]=getCookie("input9_"+j);
            select_item2[j]=getCookie("input1_"+j);
        }
        var name="字段名";
        var input=create_select("字段名",select_item,select_item2,"form-control","check_input0",100,12);
        //var input2=getCookie
        //if(input2=="int"){
        //var input2=create_input("����","number","form-control","insert_input"+(j+1),100,12);
        //}else if(input2=="varchar"){
        var input2=create_input("值","text","form-control","check_input1","check21",100,12);
        //}
        $('#dlg').append(input);
        $('#dlg').append(input2);

        //$('#dlg').dialog('open');
    });

    $("#replace").click(function(){
        var dlg=$('#dlg');
        dlg.empty();
        $(".table-btn").removeAttr("id");
        dlg.css("height",4*50+30+"px");
        $("#myModalLabel").html("更改");
        $(".table-btn").attr("id","replace-btn");
        $("#replace-btn").on('click',replace_btn);
        //dlg.html("Hello <b>world</b>!");
        //var input=create_input("yes","text","form-control","insert_input",100,12);
        //dlg.append(input);
        var select_item=new Array();
        var select_item2=new Array();
        for(var j=0;j<field_num;j++){                    //field_num注意
            select_item[j]=getCookie("input9_"+j);
            select_item2[j]=getCookie("input1_"+j);
        }
        var input=create_select("查字段名",select_item,select_item2,"form-control","cancel_input0",100,12);
        var input2=create_input("值","text","form-control","cancel_input1","replace1",100,12);
        var input3=create_select("改字段名",select_item,select_item2,"form-control","cancel_input2",100,12);
        var input4=create_input("值","text","form-control","cancel_input3","replace3",100,12);
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

    function insert_table_div(obj) {       //回掉函数所获json数据的处理
        var number=obj.length;
        for(var j=0;j<number;j++){
            var div_col=document.createElement("div");
            var i_col=document.createElement("i");
            var span_col=document.createElement("span");
            div_col.setAttribute("class","col-xs-12 div_col");
            //div_col.setAttribute("data-toggle","modal");
            //div_col.setAttribute("data-target","#myModal");
            i_col.setAttribute("class","fa fa-list-alt");
            i_col.setAttribute("style","margin-right:20px;");
            span_col.innerHTML=obj[j].content;
            div_col.setAttribute("id",obj[j].id);
            div_col.setAttribute("name",obj[j].tableName);
            div_col.append(i_col);
            div_col.append(span_col);
            //div_col.addEventListener('click',field_show);
            $("#div_set").append(div_col);

        }
    }

    function insert_tableField(obj) {       //回掉函数所获json数据的处理
        var number=obj.length;
        setCookie("field_num",number,1);
        for(var j=0;j<number;j++){
            setCookie("input1_"+j,obj[j].fieldName,1);
            setCookie("input2_"+j,obj[j].type,1);
            setCookie("input9_"+j,obj[j].content,1);
        }
        var tr=document.createElement("tr");
        var th=document.createElement("th");
        th.innerHTML="id";
        tr.appendChild(th);
        for(var j=0;j<number;j++){
            var input9=obj[j].content;         //到时改为obj【j】.content
            var th=document.createElement("th");
            th.innerHTML=input9;
            tr.appendChild(th);
        }
        $("thead").append(tr);
        page_set(1,5,10);
        var data_json={
            tableName:getCookie('table_name'),
            currentPage:1,
            pageSize:10
        }
        $.ajax({
            type:"POST",
            url: "http://47.106.76.115:8080/lechang-bpm/tableCRUDController/select",
            data: JSON.stringify(data_json,null,4),
            //dataType: "json",
            success: function(recieve_json) {
                var recieve = JSON.parse(recieve_json);
                if (recieve.success) {
                    alert(recieve.msg);
                    insert_table_data(recieve.obj);
                    var map=recieve.attributes;
                    setCookie("totalNum",map['page']['totalNum']-map['page']['startNum'],1);
                    page_set(map['page']['currentPage'],map['page']['totalPage'],map['page']['pageSize']);
                }
            }
        })
    }

    function insert_table_data(obj) {
        var number=obj.length;
        for(var j=0;j<number;j++){
            var obj_values=Object.values(obj[j]);
            var tr=document.createElement("tr");
            alert(field_num);
            for(var i=0;i<=field_num;i++){
                //var fieldName=obj_keys[j];
                var el=obj_values[i];         //到时改为obj【j】.content
                var td=document.createElement("td");
                td.innerHTML=el;
                tr.appendChild(td);
            }
            $("tbody").append(tr);
        }
    }
    
    function insert_btn() {
        var data=new Object();
        var num=parseInt(getCookie("totalNum"))+data_index.length+1;
        data["id"]=num;
        for(j=0;j<field_num;j++){
            var field_name_insert=$("#insert_input"+j).attr("name");
            var dt=$("#insert_input"+j).val();
            data[field_name_insert]=dt;
        }
        data_index.push(data);
        alert(JSON.stringify(data_index,null,4));

    }

    function cancel_btn() {
        var data=new Object();
        var num=$("#cancel_input0").val();
        alert(num);
        data["id"]=num;
        data_cancel.push(data);
        alert(JSON.stringify(data_cancel,null,4));
    }

    function check_btn() {

    }

    function replace_btn() {

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
            success: function (recieve_json) {
                recieve = JSON.parse(recieve_json);
                if (recieve.success) {
                    //insert_tableField(recieve.obj);
                    location.reload();
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
                success:function (recieve_json) {
                    recieve=JSON.parse(recieve_json);
                    if(recieve.success) {
                        //insert_tableField(recieve.obj);
                        alert(recieve.msg);
                        location.reload();
                    }
                }
            })
    }
//----------------页面刷新ajax-------------------


    $(".div_col").click(function () {
        change_p_index();
        $("#table_new").attr("style","display:none;");
        $("#table_data").attr("style","display:block;");
        //alert($(this).attr('name'));
        //insert_tableField(data_x);             //验证用---------------------------------------
        setCookie("table_name",$(this).attr('name'),1);
        var data_json={
            tableId:$(this).attr('id')
        }
        $.ajax({
            type:"GET",
            url:"http://47.106.76.115:8080/lechang-bpm/cgFormHeadController?showTableField",
            data:JSON.stringify(data_json,null,4),
            success:function (recieve_json) {
                recieve=JSON.parse(recieve_json);
                if(recieve.success) {
                    insert_tableField(recieve.obj);

                }
            }
        })
    })

    $.ajax({
        type:"GET",
        url: "http://47.106.76.115:8080/lechang-bpm/cgFormHeadController?showTables",
        data: "",
        //dataType: "json",
        success: function(recieve_json) {
            var recieve = JSON.parse(recieve_json);
            if (recieve.success) {
                alert(recieve.msg);
                insert_table_div(recieve.obj);
            }
        }
    })
});

function flash_table() {
    
}