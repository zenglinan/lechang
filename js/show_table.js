$(document).ready(function(){
	//$('#dlg').dialog('close');
	
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
		//alert(document.cookie);
		for(var i=0; i<ca.length; i++) {
			var c = ca[i].trim();
			if (c.indexOf(name)==0) { return c.substring(name.length,c.length); }
		}
		return "";
	};
	
	function create_input(name,type,classname,idname,width,div_width){
	var input1=document.createElement("input");
	var span1=document.createElement("label");
	var div_o=document.createElement("div");
	span1.innerHTML=name;
	input1.setAttribute("type",type);
	input1.setAttribute("class",classname);
	input1.setAttribute("id",idname);
	input1.setAttribute("style","width:100%;padding:6px 6px;height: 25px;");
	//div_o.setAttribute("style","width:"+(width+25)+"px");
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
		//select.setAttribute("type",type);
		select.setAttribute("class",classname);
		select.setAttribute("id",idname);
		select.setAttribute("style","width:100%;padding:0px 0px;height: 25px;");
		for(var i in select_array){
			select.add(new Option(select_array[i],select_array[i]),null);
		}
		//div_o.setAttribute("style","width:"+(width+25)+"px");
		div_o.setAttribute("class","col-md-"+div_width);
		div_o.appendChild(span1);
		div_o.appendChild(select);
		return div_o;
	}
	
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
	$("thead").append(tr);
	
	$("#insert").click(function(){
		var dlg=$('#dlg');
		dlg.empty();
		dlg.css("height",field_num*50+30+"px");
		$("#myModalLabel").html("insert");
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
		$("#myModalLabel").html("cancel");
		//dlg.html("Hello <b>world</b>!");
		//var input=create_input("yes","text","form-control","insert_input",100,12);
		//dlg.append(input);
		var select_item=new Array();
		for(var j=0;j<field_num;j++){
			select_item[j]=getCookie("input1_"+j);
		}
		var name="�ֶ���";
		var input=create_select(name,select_item,"form-control","cancel_input1",100,12);
		//var input2=getCookie
			//if(input2=="int"){
				//var input2=create_input("����","number","form-control","insert_input"+(j+1),100,12);
			//}else if(input2=="varchar"){
				var input2=create_input("����","text","form-control","cancel_input2",100,12);
			//}
			$('#dlg').append(input);
			$('#dlg').append(input2);
		
		//$('#dlg').dialog('open');
	});
	
	$("#check").click(function(){
		var dlg=$('#dlg');
		dlg.empty();
		dlg.css("height",2*50+30+"px");
		$("#myModalLabel").html("check");
		//dlg.html("Hello <b>world</b>!");
		//var input=create_input("yes","text","form-control","insert_input",100,12);
		//dlg.append(input);
		var select_item=new Array();
		for(var j=0;j<field_num;j++){
			select_item[j]=getCookie("input1_"+j);
		}
		var name="�ֶ���";
		var input=create_select("�ֶ���",select_item,"form-control","cancel_input1",100,12);
		//var input2=getCookie
			//if(input2=="int"){
				//var input2=create_input("����","number","form-control","insert_input"+(j+1),100,12);
			//}else if(input2=="varchar"){
				var input2=create_input("����","text","form-control","cancel_input2",100,12);
			//}
			$('#dlg').append(input);
			$('#dlg').append(input2);
		
		//$('#dlg').dialog('open');
	});
	
	$("#replace").click(function(){
		var dlg=$('#dlg');
		dlg.empty();
		dlg.css("height",4*50+30+"px");
		$("#myModalLabel").html("replace");
		//dlg.html("Hello <b>world</b>!");
		//var input=create_input("yes","text","form-control","insert_input",100,12);
		//dlg.append(input);
		var select_item=new Array();
		for(var j=0;j<field_num;j++){
			select_item[j]=getCookie("input1_"+j);
		}
		var input=create_select("����",select_item,"form-control","cancel_input1",100,12);
		var input2=create_input("����","text","form-control","cancel_input2",100,12);
		var input3=create_select("�޸�",select_item,"form-control","cancel_input1",100,12);
		var input4=create_input("����","text","form-control","cancel_input2",100,12);
			$('#dlg').append(input);
			$('#dlg').append(input2);
			$('#dlg').append(input3);
			$('#dlg').append(input4);
		
		//$('#dlg').dialog('open');
	});
	$("#dlg")
	//var recieve="{'success':true,'msg':'ͬ���ɹ�','obj':null,'attributes':null,'jsonStr':''}";
	
	
	
});