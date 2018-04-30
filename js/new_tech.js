$(document).ready(function () {
    function el_new(domname,classname,idname) {         //el 新建元素类
        this.dom=document.createElement(domname);
        this.attrClass=classname;
        this.attrId=idname;
        this.dom.setAttribute("class",this.attrClass);
        this.dom.setAttribute("id",this.attrId);
    }
    el_new.prototype={
        constructor:el_new,
        dom:document.createElement("div"),
        attrId:"#",
        attrClass:"btn",
        type:"text",
        append_input:function () {
            this.dom.setAttribute("type",this.type);
            return this.dom;
        },
        append_button:function () {
            return this.dom;
        },
        append_div:function () {
            return this.dom;
        }
    }

    function el_addEvent(domname,classname,idname) {      //继承：el，新增事件监听函数
        el_new.call(this,domname,classname,idname);
    }
    el_addEvent.prototype=new el_new();
    //el_addEvent.prototype.constructor=el_new;
    el_addEvent.prototype.addKeypress=function () {
        this.dom.addEventListener("keypress",key_press);
    }
    
    function key_press(event) {
        alert(event.keyCode);
    }
    //var input1=new el_new("input","btn","input1");
    //var button2=new el_new("button","btn","button2");
    var table=new el_new("table","table","table");
    var div1=new el_new("div","form-control","div1");
    var tbody=new el_addEvent("tbody","","div2");
    tbody.addKeypress();
    //div1.append_class();
    //var div=div1.append_div();
    var thead=new el_new("thead","insertThead","insertThead");
    var tr1=new el_addEvent("tr","insertTr","insertTr_"+j);
    var tr2=new el_addEvent("tr","insertTr","insertTr_"+j);
    for (var j=0;j<5;j++){
        var th=new el_new("th","insertTh","insertTh_"+j);
        var el=new el_new("input","insert","input_"+j);
        var td=new el_new("td","insertTd","insertTd_"+j);
        th.dom.innerHTML="th"+j;
        tr1.dom.append(th.dom);
        thead.dom.append(tr1.dom);
        td.dom.append(el.dom);
        tr2.dom.append(td.dom);
    }
    tbody.dom.append(tr2.dom);


    //div.append(input1.append_input());
    //div.append(button2.append_button());
    table.dom.append(thead.dom);
    table.dom.append(tbody.dom);
    $(".text-div").append(table.dom);
    //$("input .btn").hide();  //选择器实验用操作
    alert(JSON.stringify(div1.classname));
    alert(JSON.stringify(div2.classname));

})