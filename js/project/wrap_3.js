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
      */ // var data_j=[{id:1,tableName:"like",content:"表一"},{id:2,tableName:"CC",content:"表二",came:"look"},{id:3,tableName:"jj",content:"表三",tenn:"tenn"}];   //主键/表名
    //console.log(replace_sort(data_j));
        /*//alert(Object.values(data_j[1]));

        var data_x=[{length:1,content:"嘻嘻",type:"string",isNull:"Y",fieldName:"tt"},{length:3,content:"dans",type:"int",isNull:"N",fieldName:"ui"},{length:4,content:"安装",type:"string",isNull:"Y",fieldName:"kd"}]
        insert_table_div(data_j);     //回掉函数所获json数据的处理,验证用
        var field_num=getCookie("field_num");
        insert_table_data(data_x);
    */
    /*var data_field_recieve=[
        {
            fieldName:"id",
            length:36,
            type:"int",
            isNull:"Y",
            content:""
        },
        {
            fieldName:"org1",
            length:36,
            type:"string",
            isNull:"Y",
            content:"名字"
        },
        {
            fieldName:"org2",
            length:36,
            type:"int",
            isNull:"Y",
            content:"年龄"
        },
        {
            fieldName:"delstatus",
            length:36,
            type:"int",
            isNull:"Y",
            content:"删除状态"
        }
        ];
        */
//----------------全局------------------------
    var replace_id=null;
    var data_index=new Array();
    var data_cancel=new Array();
    var data_field_recieve=new Array();
    var data_table_recieve=new Array();
    var data_replace=new Array();
    var cookieField=new Array();
    $('#fileList').click(function () {
        var fileObj= new fileCtrl();
        fileObj.fileListClick();
    });

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
        document.cookie = cname+"="+escape(cvalue)+"; "+expires;
        //alert("?");
    }

    function getCookie(cname){
        var name = escape(cname) + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
            var c = ca[i].trim();
            if (c.indexOf(name)==0) { return unescape(c.substring(name.length,c.length)); }
        }
        return "";
    }

    function el_new(domname,classname,idname,name) {         //el 新建元素类
        this.dom=document.createElement(domname);
        this.attrClass=classname;
        this.attrId=idname;
        this.attrName=name;
        this.dom.setAttribute("class",this.attrClass);
        this.dom.setAttribute("id",this.attrId);
        this.dom.setAttribute("name",this.attrName);
    }
    el_new.prototype={
        constructor:el_new,
        dom:document.createElement("div"),
        attrId:"#",
        attrName:"#",
        attrClass:"col-sm-12",
        type:"text",
        style:"padding:1px 12px;",
        append_input:function (type) {
            this.type=type;
            this.dom.setAttribute("type",this.type);
        },
        append_style:function (style) {
            this.dom.setAttribute("style",this.style+style);
        }
    };

    function el_addEvent(domname,classname,idname) {      //继承：el，新增事件监听函数
        el_new.call(this,domname,classname,idname);
    }
    el_addEvent.prototype=new el_new();
    //el_addEvent.prototype.constructor=el_new;
    el_addEvent.prototype.addKeypress=function () {
        this.dom.addEventListener("keypress",key_press);
    };

    function key_press(event) {
        //alert($(event.target).prop("tagName"));
        var num=parseInt($(event.target).attr("name"));
        //alert(event.keyCode);
        if(event.keyCode==13&&$(event.target).prop("tagName")=="INPUT") {
            var maxNum=parseInt($(event.target).val());
            if(maxNum>parseInt($(event.target).attr("max")||maxNum<0)){
                alert("超出限制！正数且最大数为："+parseInt($(event.target).attr("max")));
                return 0;
            }
            $(event.target).parent().next().children().select();
            if($(event.target).parent().next().children().prop("tagName")=="BUTTON"){
                $(event.target).parent().next().children().focus();
            }
            //alert(event.keyCode);
        }else if(event.keyCode==13&&$(event.target).prop("tagName")=="BUTTON"){
            if(num==$(".insertTbody").children("tr").length){
                create_insert(num+1);
                for(var j=1;j<getCookie("field_num");j++){
                    var valueUp=$(".insertTbody").children("tr:eq("+(num-1)+")").children("td:eq("+j+")").children("input").val();
                    $(".insertTbody").children("tr:eq("+num+")").children("td:eq("+j+")").children("input").attr("value",valueUp);
                }
                $(".insertTbody").children("tr:eq("+num+")").children("td:eq(1)").children("input").select();
                $("#dlg").css({"height":(num+1)*38+120+"px","padding-top":"0px"});       //样式注意
            }else {
                $(".insertTbody").children("tr:eq("+num+")").children("td:eq(1)").children("input").select();
            }
            $("#dlg").animate({scrollLeft:0},500);
        }else if(event.keyCode==8&&$(event.target).prop("tagName")=="BUTTON"){
            $(".insertTbody").children("tr:eq("+(num-1)+")").children("td:eq(1)").children("input").select();
            $("#dlg").animate({scrollLeft:0},500);
            event.preventDefault();
        }
    }

    function create_insert(row) {
        var tr=new el_new("tr","","");
        var td_num=new el_new("td","","");
        //var input=new el_new("input","form-control","insert_0",data_field_recieve[j].fieldName);
        td_num.dom.innerHTML=row;
        //td_num.dom.append();
        tr.dom.append(td_num.dom);
        var n=getCookie("field_num");
        for(var j=1;j<n;j++){
            var td=new el_new("td","","");
            var input=new el_new("input","form-control","insert_"+j,data_field_recieve[j].fieldName);
            if(data_field_recieve[j].type=="int") {
                input.append_input("number");
                input.dom.setAttribute("max",data_field_recieve[j].length);
            }
            else {
                input.append_input("text");
                input.dom.setAttribute("maxlength",data_field_recieve[j].length);
            }
            input.append_style("height:21px;");
            td.dom.append(input.dom);
            tr.dom.append(td.dom);
        }
        var td_bt=new el_new("td","","");
        var button=new el_new("button","btn btn-primary","insert_"+n,row);
        //button.dom.addEventListener('click',insert_btn);
        button.dom.innerHTML="Enter/ Backspace";
        button.append_style("height:21px;font-size:12px;");
        td_bt.dom.append(button.dom);
        tr.dom.append(td_bt.dom);
        $("#insertTbody").append(tr.dom);
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
function fileCtrl(selectorTable){
    this.__proto__.selectorTable=selectorTable||'#table_div1';
}
fileCtrl.prototype= {
    selectJson:{
        pageNumber:1,
        pageSize:10
    },
    selectorTable:null,
    fileUploadAjax: function (fileJson,func) {
        var forms = new FormData();
        console.log($('#fileUploading'));
        if ('file' in fileJson && fileJson['file']) {
            forms.append("file", $(fileJson['file'])[0].files[0]);
        }
        if ('topic' in fileJson && fileJson['topic']) {
            forms.append("topic", fileJson.topic);
        }
        if ('category' in fileJson && fileJson['category']) {
            forms.append("category", fileJson.category);
        }

        var options = {
            url: 'http://119.23.253.225:8080/lechang-bpm/FMInfoController/upload',
            type: 'POST',
            data: forms,
            processData: false,
            contentType: false,
            encType: "multipart/form-data",
            success: func||function () {
                console.log('what');
            }
        };
        $.ajax(options);
    },
    selectFile: function (arg,selectorTable,func) {
        var that=this;
        var arg=arg?arg:{};
        var selector=selectorTable||this.selectorTable;
        $("#table_new").attr("style", "display:none;");
        $("#table_data").attr("style", "display:block;");
        var result = [],pageInfo={};
        if ('keyword' in arg) {
            this.selectJson['keyword'] = arg['keyword'];
        }
        if ('topic' in arg) {
            this.selectJson['topic'] = arg['topic'];
        }
        if ('category' in arg) {
            this.selectJson['category'] = arg['category'];
        }
        $.ajax({
            type: "GET",
            url: "http://119.23.253.225:8080/lechang-bpm/FMInfoController/get",
            data: this.selectJson,
            success: typeof func=='function'?func:function (recieve) {
                if (recieve.success) {
                    result = recieve.obj;
                    pageInfo = recieve.attributes.pageInfo;
                    $("#table_div1").css({"overflow-x": "scroll"});
                    that.tableField(selector);
                    that.tableData(result,selector);
                    that.page_set(pageInfo.pageNumber,pageInfo.totalPage,pageInfo.pageSize);
                }
            }
        });
        return result;
    },
    deleteFile:function(num){
        $.ajax({
            type: "POST",
            url: "http://119.23.253.225:8080/lechang-bpm/FMInfoController/delete",
            contentType:"application/json",
            data: JSON.stringify({
                fmId:parseInt(num)
            }),
            success: typeof func=='function'?func:function (recieve) {
                if (recieve.success) {
                    alert('删除成功！');
                }
            }
        });
    },
    setPage:function(current){
        this.selectJson.pageNumber=current;
        this.selectFile();
    },
    tableField: function (field) {
        var obj = [
            {fieldName: 'ID'},
            {fieldName: '文件名'},
            {fieldName: '操作时间'},
            {fieldName: '主题'},
            {fieldName: '分类'},
            {fieldName: '文件类型'}
        ];
        var tr = document.createElement("tr");
        for (var j = 0; j < obj.length; j++) {
            //alert(obj[j].content);
            var input9 = obj[j].fieldName;         //到时改为obj【j】.content
            var th = document.createElement("th");
            if (j == 0) {
                th.setAttribute("style", "width:50px;");
                input9 = "序号";
            }
            th.innerHTML = input9;
            tr.appendChild(th);
        }
        var th = document.createElement("th");
        th.innerHTML = "操作";
        tr.appendChild(th);
        $(field).find('thead').empty().append(tr);
        //page_set(1,5,10);
    },
    tableData(obj, field) {
        var number = obj.length;
        $(field).find('tbody').empty();
        for (var j = 0; j < number; j++) {
            var t= new Date()
            t.setTime(obj[j].operateTime);
            var tr='<tr>' +
                '<td>'+obj[j].fmId+'</td>'+
                '<td>'+obj[j].fileName+'</td>'+
                '<td>'+t.toLocaleString()+'</td>'+
                '<td>'+obj[j].topic+'</td>'+
                '<td>'+obj[j].category+'</td>'+
                '<td>'+obj[j].type+'</td>'+
                '<td><button class="table_cancel_bt btn btn-danger" style="font-size:12px;padding:1px 12px;" id="'+obj[j].fmId+'">删除</button>  <button class="table_download_bt btn btn-warning" style="font-size:12px;padding:1px 12px;"path="'+obj[j].path+'">下载</button></td>'+
                '</tr>';
            $(field).find('tbody').append(tr);
        }

        $(".table_cancel_bt").click(function () {
            var num = $(this).attr("id");
            var fileObj=new fileCtrl();
            fileObj.deleteFile(num);

        });
        $(".table_download_bt").on('click', function () {
            var path =$(this).attr('path');
            window.open(path);
        });
    },
    page_set:function(current_page,total_page,page_size) {
        $("#pagination").pagination({
            currentPage: parseInt(current_page),// 当前页数
            totalPage: parseInt(total_page),// 总页数
            isShow: true,// 是否显示首尾页
            count: parseInt(page_size),// 显示个数
            homePageText: "首页",// 首页文本
            endPageText: "尾页",// 尾页文本
            prevPageText: "上一页",// 上一页文本
            nextPageText: "下一页",// 下一页文本
            callback:function (current) {
                var set=new fileCtrl();
                set.setPage(current);
            }
        })
    },
    fileListClick:function(){
        $('.fileGroup').show();
        $('.dataGroup').hide();
        this.selectFile();
        $('#dlg').append('<div class="col-md-12"><label>上传</label><input type="file" class="form-control" id="fileInput" style="width:100%"></div>' +
            '<div class="col-md-12"><label>主题</label><input type="text" class="form-control" id="fileTopic" style="width:100%"></div>' +
            '<div class="col-md-12"><label>分类</label><input type="text" class="form-control" id="fileCategory" style="width:100%"></div>');
        $('.table-btn').off().on('click',function(){
            var tab=new fileCtrl();
                tab.fileUploadAjax({
                    file:$('#fileInput'),
                    topic:$('#fileTopic').val(),
                    category:$('#fileCategory').val()
                },
                function (recieve) {
                    alert(recieve.msg);
                })
        })
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
                    colum:'',
                    order:'',
                    pageSize:10,
                    data:[]
                }
                $.ajax({
                    type:"POST",
                    url: "http://119.23.253.225:8080/lechang-bpm/tableCRUDController/select",
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

    $("#insert").click(function() {
        $(".table-btn").unbind('click');
        var n = getCookie("field_num");
        var dlg = $('#dlg');
        dlg.empty();
        $(".table-btn").removeAttr("id");
        $("#insert-btn").unbind('click');
        dlg.css({"height":38+120+"px","padding-top":"0px","overflow-x":"scroll"});       //样式注意
        $("#myModalLabel").html("插入");
        $(".modal-dialog").attr("style", "width:1200px;");
        $(".modal-content").removeClass("modal-sm").addClass("modal-lg").removeAttr("style");
        $(".modal-content").css({"width":"1200px"});

        $(".table-btn").attr("id", "insert-btn");
        $("#insert-btn").bind('click', insert_btn);
        var div= new el_new("div","insertDlg","insertDlg");
        var table = new el_new("table", "table", "insertTable");
        var thead = new el_new("thead", "insertThead", "insertThead");
        var tbody = new el_addEvent("tbody", "insertTbody", "insertTbody");
        tbody.addKeypress();
        table.dom.append(thead.dom);
        div.dom.append(table.dom);
        $("#dlg").append(div.dom);
        $("#insertTable").append(tbody.dom);
        if(data_field_recieve.length>10){
            $(".insertDlg").css({"width":data_field_recieve.length*90+150+"px"});
        }
        insert_tableField(data_field_recieve, "#insertThead");
        create_insert(1);
    });
    $("#cancel-accept").click(function() {
        $(".table-btn").unbind('click');
        var dlg = $('#dlg');
        dlg.empty();
        $(".table-btn").removeAttr("id");
        dlg.css({"height": 2 * 50 + 30 + "px","overflow-x":"hidden"});
        $("#myModalLabel").html("删除缓存区");
        $(".modal-dialog").attr("style","width:900px;");
        $(".modal-content").removeClass("modal-sm").addClass("modal-lg").removeAttr("style");
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
        dlg.css({"height":2*50+30+"px","overflow-x":"hidden"});
        $("#myModalLabel").html("查找");
        $(".modal-dialog").attr("style","width:300px;");
        $(".modal-content").removeClass("modal-lg").addClass("modal-sm").removeAttr("style");
        $(".table-btn").attr("id","check-btn");
        $("#check-btn").on('click',check_btn);
        var select_item=new Array();
        var select_item2=new Array();
        for(var j=1;j<getCookie("field_num");j++){                    //field_num注意
            select_item[j]=cookieField[j-1].input9;
            select_item2[j]=cookieField[j-1].input1;
        }
        var input=create_select("字段名",select_item,select_item2,"form-control","check_input0",100,12);
        var input2=create_input("值","text","form-control","check_input1","check21",100,12);
        $('#dlg').append(input);
        $('#dlg').append(input2);
    });

    $("#export").click(function () {
        $(".table-btn").unbind('click');
        var dlg=$('#dlg');
        dlg.empty();
        $(".table-btn").removeAttr("id");
        dlg.css({"height":2*50+30+"px","overflow-x":"hidden"});
        $("#myModalLabel").html("导出");
        $(".modal-dialog").attr("style","width:300px;");
        $(".modal-content").removeClass("modal-lg").addClass("modal-sm").removeAttr("style");
        $(".table-btn").attr("id","export-btn").html("确认导出");
        $("#export-btn").on('click',export_btn);
        var select_item=["Excel"];
        var input=create_select("导出格式",select_item,select_item,"form-control","export_input0",100,12);
        //var input2=create_input("导出路径","text","form-control","export_input1","export21",100,12);
        $('#dlg').append(input);
        //$('#dlg').append(input2);
    });

    $("#replace-accept").click(function () {
        data_replace=data_replace_slim();
        $(".table-btn").unbind('click');
        var dlg = $('#dlg');
        dlg.empty();
        $(".table-btn").removeAttr("id");
        dlg.css({"height":2*50+30+"px","overflow-x":"hidden"});
        //dlg.css("width",700+"px");
        $("#myModalLabel").html("修改缓存区");
        $(".modal-dialog").attr("style","width:900px;");
        $(".modal-content").removeClass("modal-sm").addClass("modal-lg").removeAttr("style");
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
            for (var i=1;i<getCookie("field_num");i++) {
                if (typeof (data_replace[j][data_field_recieve[i].fieldName]) != "undefined") {
                    var str= data_replace[j].id.toString();
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
        $(".modal-content").removeClass("modal-lg").addClass("modal-sm").removeAttr("style");
        $(".table-btn").attr("id","replace-btn");
        $("#replace-btn").on('click',replace_btn);
        var select_item=new Array();
        var select_item2=new Array();
        for(var j=1;j<getCookie("field_num");j++){                    //field_num注意
            select_item[j]=cookieField[j-1].input9;
            select_item2[j]=cookieField[j-1].input1;
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
        p_index.append(p_sym);
        p_index.append(p_set);
        $("#set_index").click(function () {
            flash_table();
        })
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
            setCookie("tbID",obj[j].id,1);
            div_col.setAttribute("id",obj[j].id);
            div_col.setAttribute("name",obj[j].tableName);
            div_col.append(i_col);
            div_col.append(span_col);
            $("#div_set").append(div_col);

        }
    }

    function insert_tableField(obj,field) {       //回掉函数所获json数据的处理
        //alert(JSON.stringify())
        console.log(obj);
        var number=obj.length-1;
        setCookie("field_num",number,1);
        cookieField=[];
        for(var j=1;j<number;j++){
            var cookie={
                input1:obj[j].fieldName,
                input2:obj[j].type,
                input9:obj[j].content
            }
            cookieField.push(cookie);
        }
        var tr=document.createElement("tr");
        for(var j=0;j<number;j++){
            //alert(obj[j].content);
            var input9 = obj[j].content+"/"+obj[j].fieldName;         //到时改为obj【j】.content
            var th=document.createElement("th");
            if(j==0){
                th.setAttribute("style","width:50px;");
                input9="序号";
            }
            th.innerHTML=input9;
            tr.appendChild(th);
        }
        var th=document.createElement("th");
        th.innerHTML="操作";
        tr.appendChild(th);
        $(field).append(tr);
        //page_set(1,5,10);

    }

    function insert_table_data(obj) {
        var number=obj.length;
        for(var j=0;j<number;j++) {
            if (obj[j].delstatus == 0) {
                var tr = document.createElement("tr");
                for (var i = 0; i <= getCookie("field_num"); i++) {
                    if ( data_field_recieve[i].fieldName != "delstatus") {  //data_field_recieve[i].fieldName != "id" &&
                        //var fieldName=obj_keys[j];
                        var el = obj[j][data_field_recieve[i].fieldName.trim()];         //到时改为obj【j】.content
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
            alert("提交到删除缓存");
            data_cancel.push(data);
        })
        $(".table_replace_bt").bind('click',replace_click);
    }

    function insert_btn() {
        //alert($(this).attr("name"));
        var trs=$(".insertTbody").children("tr");
        for(var i=0;i<trs.length;i++) {
            var data = new Object();
            for (var j = 1; j < getCookie("field_num"); j++) {
                var field_name_insert = trs.eq(i).children("td").children("#insert_"+j).attr("name");
                //alert(JSON.stringify(trs.eq(i).children("td").children("#insert_"+j).prop("tagName")));
                //alert(field_name_insert);
                var dt = trs.eq(i).children("td").children("#insert_"+j).val();
                if (data_field_recieve[j].type == "string") {
                    data[field_name_insert] = "'" + dt + "'";
                } else if (data_field_recieve[j].type == "int") {
                    data[field_name_insert] = parseInt(dt);
                }
            }
            data_index.push(data);
        }
        //alert(JSON.stringify(data_index));
        insert_accept_btn();
    }

    function check_btn() {
        var field_check=$("#check_input0").val();
        var data_check=$("#check_input1").val();
        var data=new Object();
        data[field_check]=data_type(field_check,data_check);
        var data_json={
            currentPage:1,
            pageSize:10,
            colum:'',
            order:'',
            tableName:getCookie("table_name"),
            data:[data]
        }
        $.ajax({
            type:"POST",
            url:"http://119.23.253.225:8080/lechang-bpm/tableCRUDController/select",
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

    function export_btn() {
        //var type_export=$("#export_input0").val();
        var data_json={
            tableID:getCookie("tbID"),
            //type:type_export
        }
        $.ajax({
            type:"POST",
            url:"http://119.23.253.225:8080/lechang-bpm/tableCRUDController/export",
            data:JSON.stringify(data_json,null,4),
            contentType:"application/json",
            success:function (recieve) {
                if(recieve.success) {
                    top.location=recieve.obj.path;
                        alert(recieve.msg);
                        $(".table-btn").html("提交更改");
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
        alert("提交到修改缓存");
    }

    function insert_accept_btn() {
        var data_json = {
            tableName: getCookie("table_name"),
            data: data_index
        }
        $.ajax({
            type: "POST",
            url: "http://119.23.253.225:8080/lechang-bpm/tableCRUDController/insert",
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
            url:"http://119.23.253.225:8080/lechang-bpm/tableCRUDController/delete",
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
        var replaceNewSlim=replace_sort(data_replace_slim());
        for(var i in replaceNewSlim) {
            var data_json = {
                tableName: getCookie("table_name"),
                data: replaceNewSlim[i]
            };
            $.ajax({
                type: "POST",
                url: "http://119.23.253.225:8080/lechang-bpm/tableCRUDController/update",
                data: JSON.stringify(data_json, null, 4),
                contentType: "application/json;charset=utf-8",
                success: function (recieve) {
                    if (recieve.success) {
                        if(i==replaceNewSlim.length-1) {
                            alert(recieve.msg);
                        }
                    }
                }
            })
        }
        flash_table();
    }

    function table_data_show() {
        var data_json={
            tableName:getCookie('table_name'),
            currentPage:1,
            colum:'',
            order:'',
            pageSize:10,
            data:[]
        }
        $.ajax({
            type:"POST",
            url: "http://119.23.253.225:8080/lechang-bpm/tableCRUDController/select",
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

    function data_replace_slim(){
        var data=new Array();
        for(var i=0;i<data_replace.length;i++){
            var arr=new Array();
            arr=Object.keys(data_replace[i]);
            if(arr.length>1){
                data.push(data_replace[i]);
            }
        }
        return data;
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

    function replace_sort(arr){
        console.log(arr);
        var keyArr=[];
        var newArr=[];
        for(var i=0;i<arr.length;i++){
            var elKeyArr=Object.keys(arr[i]);
            for(var el in elKeyArr){
                //console.log(elKeyArr[el]);
                if(elKeyArr[el]!="id"&&$.inArray(elKeyArr[el],keyArr)== -1){//&&!$.inArray(elKeyArr[el],keyArr
                 keyArr.push(elKeyArr[el]);
                }
            }

        }console.log(keyArr);
        for(var key in keyArr){
            var sameKey=[];
            for(var el in arr){
                if(arr[el][keyArr[key]]){
                 var elObj ={};
                 elObj['id']=arr[el]['id'];
                 elObj[keyArr[key]]=arr[el][keyArr[key]];
                 sameKey.push(elObj);
                }
            }newArr.push(sameKey);
        }
        return newArr;
    }
//----------------页面刷新ajax-------------------

    $.ajax({
        type:"GET",
        url: "http://119.23.253.225:8080/lechang-bpm/cgFormHeadController?showTables",
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
    });


    function div_col_click() {
        setCookie("table_name", $(this).attr('name'), 1);
        setCookie("tbID", $(this).attr('id'), 1);
        change_p_index();
        $("#table_new").attr("style", "display:none;");
        $("#table_data").attr("style", "display:block;");
        $.ajax({
            type: "GET",
            url: "http://119.23.253.225:8080/lechang-bpm/cgFormHeadController?showTableField",
            data: {tableId: $(this).attr('id')},
            success: function (recieve) {
                if (recieve.success) {
                    data_field_recieve=recieve.obj;
                    if((data_field_recieve.length*90+150)>parseInt($("#table_div1").width())){
                        $("#table_div2").css({"width":data_field_recieve.length*120+150+"px"});
                        $("#table_div1").css({"overflow-x":"scroll"});
                    }
                    insert_tableField(data_field_recieve,"thead.data_show");
                    table_data_show();
                }
            }
        })

    }

    function flash_table() {
        var data_json={
            tableName:getCookie('table_name'),
            currentPage:1,
            colum:'',
            order:'',
            pageSize:10,
            data:[]
        };
        $.ajax({
            type:"POST",
            url: "http://119.23.253.225:8080/lechang-bpm/tableCRUDController/select",
            data: JSON.stringify(data_json,null,4),
            contentType:"application/json;charset=UTF-8",
            success:function (recieve) {
                if (recieve.success) {
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


