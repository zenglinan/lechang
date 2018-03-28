$(document).ready(function(){

function create_input(name,type,classname,idname,width,div_width){
	var input1=document.createElement("input");
	var span1=document.createElement("label");
	var div_o=document.createElement("div");
	span1.innerHTML=name;
	input1.setAttribute("type",type);
	input1.setAttribute("class",classname);
	input1.setAttribute("id",idname);
	input1.setAttribute("style","width:100%");
	//div_o.setAttribute("style","width:"+(width+25)+"px");
	div_o.setAttribute("class","col-md-"+div_width+" col-xs-"+div_width+" col-sm-"+div_width);
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
	select.setAttribute("style","width:100%");
	for(var i in select_array){
		select.add(new Option(select_array[i],select_array[i]),null);
	}
	//div_o.setAttribute("style","width:"+(width+25)+"px");
	div_o.setAttribute("class","col-md-"+div_width+" col-xs-"+div_width+" col-sm-"+div_width);
	div_o.appendChild(span1);
	div_o.appendChild(select);
	return div_o;
}

function select_add(select,select_array){
	for(var i in select_array){
		select.append(new Option(select_array[i],select_array[i]));
	}
}

	var select1=new Array();
	var select2=new Array();
	var select3=new Array();
	//var select_item4=new Array();
	//var select_item5=new Array();
	
	select1=["1","2"];
	select2=["NATIVE","。。。"];
	select3=["single","。。。"];
	select_add($("#jformType"),select1);
	select_add($("#jformPkType"),select2);
	select_add($("#querymode"),select3);
	

function num_set(num){
	//alert(numset.toString());
	//clean_numset(num_before);
	//numset=document.getElementById("num").value;
	//alert(numset.toString());
	var select_item=new Array();
	var select_item2=new Array();
	var select_item3=new Array();
	var select_item4=new Array();
	var select_item5=new Array();
	select_item=["string","int"];
	select_item2=["1","2"];
	select_item3=["1","2"];
	select_item4=["1","2"];
	select_item5=["Y","N"];
	//alert(select_item.toLocaleString());
	//var input0=document.createElement("input");
	//input0.setAttribute("type","text");
	//input0.setAttribute("id","table_name");
	//document.getElementById("form").appendChild(input0);
	if(num>0){
		for(var j=0;j<num;j++){
		if(j==0){
		var input1=create_input("字段名(主键)","text","form-control","input1_"+j,100,2);
		}else{
		var input1=create_input("字段名","text","form-control","input1_"+j,100,2);
		
		}
		
		var input2=create_select("类型",select_item,"form-control","input2_"+j,100,1);
		var input3=create_input("长度","number","form-control","input3_"+j,100,1);
		//var input4=create_select("瀛楃闆�,select_item2,"form-control","input4_"+j,100,2);
		var input4=create_input("主表","text","form-control","input4_"+j,100,6);
		//var input6=create_select("绱㈠紩",select_item4,"form-control","input6_"+j,100,2);
		var input5=create_input("主字段","text","form-control","input5_"+j,100,6);
		var input6=create_select("为空",select_item5,"form-control","input6_"+j,100,1);
		var input7=create_input("注释","text","form-control","input7_"+j,200,2);
		var input8=create_input("字段默认值","text","form-control","input8_"+j,200,2);
		/*var span1=document.createElement("label");
		var span2=document.createElement("label");
		var span3=document.createElement("label");
		var span4=document.createElement("label");
		
		input1.setAttribute("type","text");
		input1.setAttribute("class","form-control");
		input2.setAttribute("class","form-control");
		input3.setAttribute("type","number");
		input3.setAttribute("class","form-control");
		input4.setAttribute("class","form-control");
		
		input1.setAttribute("id","input1_"+j);
		input2.setAttribute("id","input2_"+j);
		input3.setAttribute("id","input3_"+j);
		input4.setAttribute("id","input4_"+j);
		
		input1.setAttribute("style","width:100px");
		input2.setAttribute("style","width:100px");
		input3.setAttribute("style","width:70px");
		input4.setAttribute("style","width:100px");*/
		
		/*for(var i in select_item){
			input2.add(new Option(select_item[i],select_item[i]),null);
		}
		for(var i in select_item2){
			input4.add(new Option(select_item2[i]+select_item2[i]),null);
		}*/
		var div_o=document.createElement("div");
		div_o.setAttribute("class","form-horizontal");
		var div_oo=document.createElement("div");
		div_oo.setAttribute("class","col-md-3 col-xs-3 col-sm-3");
		div_oo.setAttribute("style","padding-left:0px;padding-right:0px;");
		div_o.appendChild(input1);
		div_o.appendChild(input2);
		div_o.appendChild(input3);
		div_oo.appendChild(input4);
		div_oo.appendChild(input5);
		div_o.appendChild(div_oo);
		div_o.appendChild(input6);
		div_o.appendChild(input7);
		div_o.appendChild(input8);
		//div_o.appendChild(input8);
		$("#set_field").append(div_o);
		div_o.setAttribute("id","div_"+j);
		div_o.setAttribute("style","height:50px");
		div_o.setAttribute("style","width:100%");
		alert(div_o.id);
		var br=document.createElement("br");
		$("#set_field").append(br);
		}
		var input0=document.createElement("input");
		input0.setAttribute("type","button");
		input0.setAttribute("id","input0");
		input0.setAttribute("value","accept");
		input0.setAttribute("class","btn btn-primary");
		input0.setAttribute("style","margin:10px 15px");
		$("#set_field").append(input0);
		$("#input1_0").attr("value","id").attr("readonly",true);
		$("#input2_0 > option[value='int']").attr("selected",true);
		$("#input2_0").attr("disabled","disabled");
		$("#input0").click(function(){
			alert( 
					datas(num)
					//$("#table_name").val()
					);
			if ($("#table_name").val()!="" && $("#table_name").val()!=null){
	    		setCookie("table_name",$("#table_name").val(),1);
	    	if ($("#field_num").val()!="" && $("#field_num").val()!=null && parseInt($("#field_num").val())>0){
	    		alert(parseInt($("#field_num").val()));
	    		setCookie("field_num",$("#field_num").val(),1);
	    		}
	    	}
	    	//top.location='http://localhost:8080/project_2/show_table.html#';
            var data_json={
                cgFormHead:{
                    tableName:$("#table_name").val(),
                    jformType:$("#jformType").val(),
                    jformPkType:$("#jformPkType").val(),
                    content:$("#tablecontent").val(),
                    querymode:$("#querymode").val(),
                    columns:datas(num)
                }
            };
			$.ajax({
				   type:"POST",
				   url: "http://localhost:8080/lechang-bpm/cgFormHeadController?doDbSynch&synMethod=normal",
				   data: JSON.stringify(data_json,null,4),
				   dataType: "application/json",
				   success: function(recieve){
				   	if(recieve.success){
				   	alert(recieve.msg);
				     top.location='http://localhost:8080/project_2/show_table.html#';/* 成功即跳转     */
				   	}
				   }
				});
			
		});
	}
}

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

function datas(num){
	var data_array=new Array();
	
	for(j=0;j<num;j++){
		//alert($("#input2_"+j).val());
		setCookie("input1_"+j,$("#input1_"+j).val(),1);
		setCookie("input2_"+j,$("#input2_"+j).val(),1);
		setCookie("input3_"+j,$("#input3_"+j).val(),1);
		//setCookie("input8_"+j,$("#input8_"+j).val(),1);
		var data_element={
				id:(j+1),
				fieldName:$("#input1_"+j).val(),
				type:$("#input2_"+j).val(),
				length:$("#input3_"+j).val(),
				mainTable:$("#input4_"+j).val(),
				mainField:$("#input5_"+j).val(),
				isNull:$("#input6_"+j).val(),
				content:$("#input7_"+j).val(),
				fieldDefault:$("input8_"+j).val()
		}
		data_array[j]=data_element;
		//alert(data_array[j].input1+" "+data_array[j].input2+" "+data_array[j].input3);
	}
	//var data_json=JSON.stringify(data_array,null,4);
	//setCookie("fluid_json",data_json,1);
	//alert(data_json);
	return data_array;
}
		
	$("#num_set").click(function(){
		var num = $("#field_num").val();
		$("#set_field").empty();
		num_set(num);
	});
	
	$("#check_table").click(function(){
		var name = $("#table_name").val();
		$.ajax({
			   type:"POST",
			   url: "http://localhost:8080/lechang-bpm/cgFormHeadController?judge",
			   data: {
				   tableName:name
				   //key:1
				   },
			   dataType:"application/json",
			   success: function(recieve){
			     if(recieve.success){
			     	alert(recieve.msg);
			     }
			   }
			});
	})
			
	$("#cancel_table").click(function(){
		var name = $("#table_name").val();
		$.ajax({
			   type:"POST",
			   url: "http://localhost:8080/lechang-bpm/cgFormHeadController?rem",
			   data: {
				   tableName:name
				   //key:1
				   },
			   dataType: "application/json",
			   success: function(recieve){
			     if(recieve.success){
			     	alert(recieve.msg);
			     }
			   }
			   
			});
		
		
		
	});
	
})
