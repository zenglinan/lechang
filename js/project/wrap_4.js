// JavaScript Document
$(document).ready(function(){
    function createMid(){

    }
    createMid.prototype={
        tableList:[],
        natureField:[],
        computeField:[],
        condition:'',
        createMidAjax:function (obj) {
            var result={};
            $.ajax({
                url:'http://119.23.253.225:8080/lechang-bpm/viewController/createView',
                type:'POST',
                data:JSON.stringify(obj,null,4),
                contentType: 'application/json',
                async:false,
                success:function(recieve){
                    if(recieve.success&&recieve.msg.indexOf("成功")){
                        result=recieve.obj;
                    }else{
                        alert("删除失败!");
                    }
                }
            });
            return result;
        },
        showNature:function(obj,selector){
            $(selector).empty();
            for(var i in obj){
                $(selector).append('<tr>\n' +
                    '                                                <td class="fieldnameNode_crtMid1">'+obj[i].fieldName+'</td>\n' +
                    '                                                <td>'+obj[i].fromTable+'</td>\n' +
                    '                                                <td>'+obj[i].fromField+'</td>\n' +
                    '                                                <td>'+obj[i].desc+'</td>\n' +
                    '                                            </tr>')
            }
        },
        showCompute:function (obj,selector) {
            $(selector).empty();
            for(var i in obj){
                $(selector).append('<tr>\n' +
                    '                                                <td class="fieldnameNode_crtMid2">'+obj[i].fieldName+'</td>\n' +
                    '                                                <td>'+obj[i].desc+'</td>\n' +
                    '                                                <td>'+obj[i].expr+'</td>\n' +
                    '                                            </tr>')
            }
        },
        setNatureOnce:function (obj) {      //设置viewNatureField对外接口
            this.__proto__.natureField.push(obj);
            this.showNature(this.natureField,'.nature-fieldlist tbody');
        },
        setCompute:function (Arr) {
            this.__proto__.computeField=Arr;
            this.showCompute(this.computeField,'.compute-fieldlist tbody');
        },
        setCondition:function(con){
            this.__proto__.condition=con;
        },
        addCondition:function(con){
            if(typeof con!='string'){
                con=$(con.target).val();
            }
            var creMid= new createMid();
            creMid.appendCondition(con)
        },
        appendCondition:function(con){
            this.__proto__.condition+=con;
        },
        addTable:function(str){
            if($.inArray(str,this.__proto__.tableList)<0){
                this.__proto__.tableList.push(str);
            }
        },
        setComputeJson:function (str) {     //设置viewComputeField对外接口
            var obj=typeof str=='string'?JSON.parse(str):str;
            this.setCompute(obj.viewComputeFieldList);
            this.setCondition(obj.condition);
        },
        setMidTable:function () {
            var creMid=new createMid();
            creMid.sendMidTable();
        },
        sendMidTable:function () {
            var midName=$('#midName').val();
            var midDesc=$('#midDesc').val();
            var setting={
                viewName:midName,
                desc:midDesc,
                tableList:this.tableList,
                viewNatureFieldList:this.natureField,
                viewComputeFieldList:this.computeField,
                condition:this.condition
            }
            this.createMidAjax(setting);
        }
    }
	function tableManager(showFieldInput){
		showFieldInput=showFieldInput||'.leftInput .responstable tbody';
		var result=this.showTableAjax();
		this.showTableInHtml($('#tableSelect'));
		this.htmlTbody=$(showFieldInput);
	}
	tableManager.prototype={
		tableNow:'',
		tableList:{},
		htmlTbody:null,
		setTableNow:function(tName){
			this.__proto__.tableNow=tName;
		},
		changeShow:function(){
			if($('#dlg_1').css('display')==='none'){
                $('#dlg_1').show();
                $('#dlg_2').hide();
                $('.table-btn').off();
                $('.table-btn').on('click',function () {
                    var num=$('#tableSelect').val();
                	var tname=$('#tableSelect').find("option:selected").text();
                    var tbShow= new tableManager();
                	tbShow.setTableNow(tname);
					var obj=tbShow.showTableFieldAjax(num);
					tbShow.showTableFieldInHtml(obj,'.leftInput .responstable tbody');
                })
			}else {
                $('#dlg_2').show();
                $('#dlg_1').hide();
                $('.table-btn').off();
                $('.table-btn').on('click',function () {
                    var fieldOld=$('#fieldSelect').val();
                    var fieldNew=$('#fieldInput1').val();
                    var desc=$('#fieldInput2').val();
                    var tbShow=new tableManager();
                    var setting={
                    	fieldName:fieldNew,
						fromTable:tbShow.tableNow,
						fromField:fieldOld,
						desc:desc
					};
                    var creMid=new createMid();
                    creMid.addTable(tbShow.tableNow);
                    creMid.setNatureOnce(setting);
                    alert(JSON.stringify(setting));
                })
			}
		},
		setTable:function (selector) {
            var tbShow=new tableManager();
            if($('#dlg_2').css('display')==='none'){
            }else {
                tbShow.changeShow();
            }
        },
		setField:function(selector){
			selector=$('#fieldSelect');
			var tbShow=new tableManager();
            var arr=tbShow.getSelect();
			if($('#dlg_1').css('display')==='none'){
			}else {
				tbShow.changeShow();
			}
			tbShow.select_add(selector,arr);
		},
		getSelect:function(){		//获取选取表格的选取项
			var t=this.htmlTbody.children();
			t=t.filter(function(index,node){
				node=$(node).find('input')[0];
				if(node){
					return node.checked
				}
			});
			var afterFilt=[];
			for(var i=0;i<t.length;i++){
				afterFilt[i]=$(t[i]).find('.fieldnameNode').html();
			}
			return afterFilt;
		},
        select_add:function(select,select_array,key1,key2){                 //到时修改select_array
			if(!key1&&!key2){
				for(var i in select_array){
					select.append(new Option(select_array[i],select_array[i]));
				}
			}else{
				for(var i in select_array){
					select.append(new Option(select_array[i][key2],select_array[i][key1]));
				}
			}
    	},
		showTableAjax:function(){
            var result=[];
            var that=this;
            $.ajax({
                url:'http://119.23.253.225:8080/lechang-bpm/cgFormHeadController?showTables',
                type:'GET',
                data:null,
                contentType: 'application/json',
                async:false,
                success:function(recieve){
                    if(recieve.success&&recieve.msg.indexOf("成功")){
                        that.tableList=result=recieve.obj;
                    }else{
                        alert("删除失败!");
                    }
                }
            });
            return result;
		},
		showTableInHtml:function(selector){
			$(selector).empty();
			this.select_add(selector,this.tableList,'id','tableName');
		},
		showTableFieldAjax:function(id){
			var result={};
            $.ajax({
                url:'http://119.23.253.225:8080/lechang-bpm/cgFormHeadController?showTableField',
                type:'GET',
                data:{
                	tableId:id
				},
                contentType: 'application/json',
                async:false,
                success:function(recieve){
                    if(recieve.success&&recieve.msg.indexOf("成功")){
                        result=recieve.obj;
                    }else{
                        alert("删除失败!");
                    }
                }
            });
            return result;
		},
		showTableFieldInHtml:function(obj,selector){
			$(selector).empty();
			$(selector).append('<tr>\n' +
                '                                                <th>选择</th>\n' +
                '                                                <th data-th="Driver details"><span>字段名</span></th>\n' +
                '                                                <th>长度</th>\n' +
                '                                                <th>类型</th>\n' +
                '                                                <th>识别名</th>\n' +
                '                                                <th>可否为空</th>\n' +
                '                                            </tr>');
			for(var i in obj){
                $(selector).append('<tr>\n' +
                    '                                                <td><input type="radio"></td>\n' +
                    '                                                <td class="fieldnameNode">'+obj[i].fieldName+'</td>\n' +
                    '                                                <td>'+obj[i].length+'</td>\n' +
                    '                                                <td>'+obj[i].type+'</td>\n' +
                    '                                                <td>'+obj[i].content+'</td>\n' +
                    '                                                <td>'+obj[i].isNull+'</td>\n' +
                    '                                            </tr>')
			}
		}
	};

    function calcModuleConstrutObj(){
        this.datafield={};
        this.calcexpr={};
        this.currentcondition='';
        this.tasklist=[];
        //this.computefieldjson='';
    }
    calcModuleConstrutObj.prototype={
		preProcess:function (computefieldjson) {
        let setting={
            viewName:"中间表的名称",
            tableList:["构成中间表的基本表表名1","构成中间表的基本表表名2","构成中间表的基本表表名3"],
            desc:"用于阐述该中间表的作用",
            viewNatureFieldList:[  //中间表的自然字段汇总
				{
					fieldName:"字段名",
					fromTable:"该字段所来自的基本表名",
					fromField:"该字段所对应基本表的字段的字段名",
					desc:"该字段的描述"
				}
			],
            viewComputeFieldList:computefieldjson.viewComputeFieldList,
            condition:computefieldjson.condition
        }
    },
	midTableSet:function (data) {
        var result=[];
        $.ajax({
            url:'http://119.23.253.225:8080//lechang-bpm/viewController/createView',
            type:'POST',
            data:null,
            contentType: 'application/json',
            async:false,
            success:function(recieve){
                if(recieve.success&&recieve.msg.indexOf("成功")){
                    result=recieve.obj;
                }else{
                    alert("删除失败!");
                }
            }
        });
        return result;
    },
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
            var taskspan=cachebody.find('.outputtask #task_num');
            taskspan.text('0');
            //缓存模块
            cachebody.find('.calctask').on('click','.fa-close',function(e){
                var tr=$(e.target).parent().parent();
                that.tasklist.splice(tr.index(),1);
                tr.remove();
                taskspan.text(parseInt(taskspan.text())-1);
            });
            //增加取值序列 界面处理
            var binddiv=calcmodal.find('.binddiv');
            binddiv.find('.fa-plus-circle').on('click',function(e) {
                let itemp=document.createElement('p');
                $(itemp).addClass('item');
                var binditemcount=binddiv.find('p.item').length;
                var index=String.fromCharCode(97+binditemcount);//递增字母
                $(itemp).html(`<label>${index}:</label>
        				<input type="text" class="rightControlSet tb" placeholder="选取表名"></input><input type="text" class="rightControlSet field" placeholder="选取字段名"></input><input type="text" class="rightControlSet" placeholder="字段截取条件"></input>
        				<span></span>`);
                binddiv.children('.bindvalue').append(itemp);
            });
        },
        init:function(){
            var that=this;
            var calcmodal=$('#calcModal');
            var exprdiv=calcmodal.find('.exprdiv');
            var autofilldiv=calcmodal.find('.autofilldiv');
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
            var taskspan=cachebody.find('.outputtask #task_num');
            resultdiv.find('#cachebtn').on('click', function(e) {
                var fieldobj={};
                var fieldname=$(e.target).siblings('#field_name').val();
                var fielddesc=$(e.target).siblings('#field_desc').val();
                fieldobj['fieldName']=fieldname;
                fieldobj['desc']=fielddesc;
                fieldobj['expr']=that.calcexpr.backexpr;
                that.tasklist.push(fieldobj);
                let tr=document.createElement('tr');
                $(tr).html(`<td>${fieldobj['expr']}</td><td>${fieldname}</td><td>${fielddesc}</td><td><i class="fa fa-close"></i></td>`)
                cachebody.find('.calctask').children('tbody').append(tr);//显示
                taskspan.text(parseInt(taskspan.text())+1);
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
                    computefieldjson=that.GetComputeFieldData(that);//赋值json
                    alert('导出成功');
                    var creMid=new createMid();                 //createMid生成计算字段的行为
                    creMid.setComputeJson(computefieldjson);
                    alert(computefieldjson);
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
    function getComputeFieldJson(){
        var calcobj=new calcModuleConstrutObj();
        calcobj.init()
		var tbShow=new tableManager();
        var creMid=new createMid();
        $('.fa-arrows-h').click(tbShow.changeShow);
        $('#setFieldNode').click(tbShow.setField);
        $('#setTableNode').click(tbShow.setTable);
        $('#createMidBtn').click(creMid.setMidTable);
        $('#addCondition').change(creMid.addCondition)
    }
    $('#calcModal .calc-start').on('click',function(){
        var calcobj=new calcModuleConstrutObj();
        calcobj.empty();
        calcobj.init();
    });
    getComputeFieldJson();
//----------------CSS实现---------------------

$(".li_4").click(function(){
	$("#table_nav").html("数据项关系管理");
	$("#wrap_1").attr("style","display:none");
	$("#wrap_2").attr("style","display:none");
	$("#wrap_3").attr("style","display:none");
	$("#wrap_4").attr("style","display:block");
	$("#wrap_5").attr("style","display:none");
	$("#wrap_6").attr("style","display:none");
});

});