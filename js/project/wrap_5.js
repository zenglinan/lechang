// JavaScript Document
$(document).ready(function(){
//-------------实验用-----------------
    //alert(JSON.stringify(data));
    // var dataFieldRecieve=Mock.mock({
    //     'list|1-39': [{
    //         'fieldName|+3':2000,
    //         'content|1-5':"IU",
    //         'type':"string"
    //     }]
    // });
//-------------全局变量---------------
    var FContent=document.getElementById("iframe").contentWindow;
    var showTablesData=new Array();
    var secondTreeRow=[];
    //var dataFieldRecieve=new Array();
    var testing={
        target:null,
        menuClick:null
    };
    var submitIndex=null;
    var jsStr=sessionStorage.getItem('jsStr')?JSON.parse(sessionStorage.getItem('jsStr')):'';                      //极其重要

    //--------------------------数据结构解析--------------------------------
    var globalStorage=sessionStorage.getItem('globalStorage')?JSON.parse(sessionStorage.getItem('globalStorage')):{
        binaryChoice:[
            {id:'true',text:'是'},
            {id:'false',text:'否'}
        ],
        showType:[
            {id:'table',text:'表格类'}
        ],
        controlType:[
            {id:'btn',text:'按钮类'},
            {id:'formInput',text:'表单按钮'}
        ],
        showTypeObj:{
            table:{html:'<div class="row-fluid col-md-12" id="table_div1">\n' +
            '                        <div class="col-md-12" id="table_div2">\n' +
            '                            <table class="table">\n' +
            '                                <thead class="data_show">\n' +
            '                                </thead>\n' +
            '                                <tbody class="data_show">\n' +
            '                                </tbody>\n' +
            '                            </table>\n' +
            '                            <div id="pagination" class="page fl col-sm-12"></div> <!-- 翻页控件-->\n' +
            '                        </div>\n' +
            '                    </div>'}
        },
        htmlArr:[],
        htmlShow:{
            selectRole:'',
            selectHtmlArr:'',
            iframeSrc:'',
            iframeVal:''
        },
        controlInform:{
        },
        styleStorage:{},
        relationStorage:{},
        showCopyRowStorage:{},
        draggabillyObj:{},
    };
    var inputType=[
        {id:'text',text:'文本类'},
        {id:'number',text:'数字类'},
        {id:'date',text:'日期类'},
        {id:'file',text:'上传类'}
    ];
    var actionType={
        base:[
            {id:'insert',text:'插入'},
            {id:'update',text:'更新'},
            {id:'cancel',text:'删除'},
            {id:'select',text:'查询'},
            {id:'fileUpload',text:'上传文件'},
            {id:'fileSelect',text:'查询文件'},
            {id:'fileUpdate',text:'更新文件'},
            {id:'fileDeleted',text:'删除文件'},
            {id:'showTable',text:'表格'},
            {id:'showSelect',text:'显示'},
            {id:'messageSet',text:'信息定义'},
            {id:'showView',text:'显示隐藏'},
            {id:'printAct',text:'打印'}
    ], row:[
            {id:'rowCopy',text:'行区复制'},
            // {id:'showCopy',text:'显示自动'}
        ]
    };
    var controlColumnType=[
        // {id:1,type:"新建行",domType:'div'},
        // {id:2,type:"新建框",domType:'div'},
        {id:3,type:"静态框",domType:'label'},
        {id:4,type:"显示框",domType:'div'},
        {id:5,type:"操作框",domType:'button'},
        {id:6,type:"输入框",domType:'input'},
        {id:7,type:"计算框",domType:null}
        ];
//-------------类和对象---------------
    function mouseAction() {
    }
    mouseAction.prototype={
        backgroundColor:'#FFFFFF',
        btnOver:false,
        mouseOnBackgroundAnimate:function (obj,color) {
            console.log(this.btnOver);
            if(this.btnOver){
                $(obj).css({'background-color':this.backgroundColor});
                this.btnOver=false;
            }else {
                this.backgroundColor=$(obj).css('background-color');
                $(obj).css({'background-color':color});
                this.btnOver=true;
            }
        },
        preventFunc:function(that,type){
            var clickObj = that;
            var func = type||$._data(clickObj,'preventStatus')||{stat:true};
            $(clickObj).prop('disabled', func.stat);
            if(func.stat){
                window.timeOt = setTimeout(function () {
                    $(clickObj).prop('disabled', !func.stat);
                    $._data(clickObj,'preventStatus',{stat: func.stat })
                    Reflect.deleteProperty(window,'timeOt')
                },3000)
            }
        }
    };
    var htmlVersionClass=function() {
        this.roles=new rolesRelative();
        this.__proto__.roleVal=globalStorage.htmlShow.selectRole?globalStorage.htmlShow.selectRole:'default';
    };
    htmlVersionClass.prototype={
        roleVal:'default',
        val:[],
        roleArr:{},
        htmlArr:{root:[{id:4,fieldName:'bird1',path:'www.baidu.com',description:'jr',delstatus:0}]},
        selectHtmlArr:[],
        multiL:function(children){
            let list=[];
            for(var i=0;i<children.length;i++){
                list.push(children[i]);
                if('children' in children[i]){
                    let childList=arguments.callee(children[i].children);
                    list=list.concat(childList);
                }
            }
            return list;
        },
        getHtmlArr:function(){
            var arr=[{nodeName:'默认',nodeCode:'default'}];
            arr=arr.concat(this.multiL(this.roles.allRoles));
            this.__proto__.roleArr=arr;
        },
        setRoleSelect:function(selectObj){
            let role=globalStorage.htmlShow.selectRole;
            this.getHtmlArr();
            select_add($(selectObj),this.roleArr,'nodeCode','nodeName');
            if(role){
                $(selectObj).selected(role);
            }
        },
        getHtml:function (obj) {
            this.__proto__.htmlArr=obj;
            this.setSelect(this.roleVal);
        },
        showHtml:function (selectObj,nodeCode) {
            var arr=this.htmlArr[nodeCode],storageArr=[];
            if(!nodeCode&&!this.htmlArr instanceof Array){//若htmlArr是个索引表 {code1:[{页面1},code2:[{页面2}{页面3}]]}
                for(var i in this.htmlArr){
                    storageArr=storageArr.concat(this.htmlArr[i]);
                }
                arr=storageArr;
            }else if(!nodeCode){//若htmlArr是给数组 [{页面1}{页面2}{页面3}]
                arr=this.selectHtmlArr;
            }
            selectObj.empty();
            console.log(selectObj,nodeCode);
            select_add(selectObj,arr,'fileName','description');
            selectTitle(selectObj,arr,'fileName','path');
        },
        flashHtml:function (selectName,nodeCode) {
            this.showHtml(selectName,nodeCode);
            var iframeVal=globalStorage.htmlShow.iframeVal;
            if(iframeVal){
                var iframeSrc=globalStorage.htmlShow.iframeSrc;
                $(selectName).val(iframeVal);
                $('.page-path').html(iframeSrc);
            }
        },
        setSelect:function(val){
            this.__proto__.roleVal=globalStorage.htmlShow.selectRole=val;
            this.__proto__.selectHtmlArr=globalStorage.htmlShow.selectHtmlArr=this.htmlArr[val];
            this.flashHtml($(".htmlShow"));
        },
        select:function (attr,val) {
            for(var i=0 ;i< this.selectHtmlArr.length;i++){
                if(this.selectHtmlArr[i][attr]==val){
                     return this.selectHtmlArr[i].path;
                }
            }
        }
    };
    function doit() {
    }
    doit.prototype={
        informIndex:'',
        getControlInform:function () {
            var inform=''
            if(jsStr.indexOf('controlInform')>-1) {
                inform=jsStr.match(RegExp('//controlInform=.*?//controlInformEnd'))[0] || '';
            }
            this.informIndex=inform;
            return inform;
        },
        getControlInformObj:function () {
            var obj=this.informIndex;
            if(jsStr.indexOf('controlInform')>-1) {
                obj=jsStr.match(RegExp('//controlInform=.*?//controlInformEnd'))[0];
                obj=obj.replace('//controlInform=','').replace('//controlInformEnd','');
                globalStorage.controlInform=JSON.parse(obj);
                for(var key in globalStorage.controlInform){
                    var dataValue=globalStorage.controlInform[key].data?globalStorage.controlInform[key].data:[];
                    sessionStorage.setItem(key,JSON.stringify({id:key,data:dataValue}));
                }
                return globalStorage.controlInform;
            }
        },
        removeControlInform:function () {
            var inform=jsStr.replace(RegExp('//controlInform=.*?//controlInformEnd'),'');
            return jsStr=inform;
        },
        queryForMine:function (inputStr) {
            if(inputStr.search(/\'|\"/g)==0){
                return {
                    str:inputStr.replace(/\'|\"/g,''),
                    type:'string'
                };
            }else{
                return {
                    str:inputStr.search(/\./g)==0?(inputStr+'-rowClass'):("#"+inputStr),
                    type:'selector'
                };
            }
        },
        queryForMineStr:function (inputStr) {
            var obj=this.queryForMine(inputStr);
            if(obj.type=='string'){
                return {
                    str:obj.str,
                    type:'string'
                }
            }else if(obj.type=='selector'){
                return {
                    str:'&addPoint(document.querySelector("'+obj.str+'").value)&',
                    type:'selector'
                };
            }
        }
    };
    function indexOfFunc() {               //函数映射执行
    }
    indexOfFunc.prototype={
      functionArr:{                 //新增输入框函数
          instanceSet:controlInstance,
          formDivSet:controlFormDiv,
          typeSet:controlColumn,
          widthTall:controlWidthTall,
          colorSet:controlColor,
          shapeSet:controlShape,
          showControl:controlShowControl,
          deleteSet:controlDelete,
          changeConstant:controlChangeConstant,
          actionSet:controlAction,
          relationSet:controlRelation,
          showFieldSet:controlShowField,
          copyStyle:controlCopyStyle,
          pasteStyle:controlPasteStyle,
          copyRelation:controlCopyRelation,
          pasteRelation:controlPasteRelation
      },
      acceptArr:{                   //绑定输入行为函数
          typeSet:controlColumnAccept,
          widthTall:controlWidthTallAccept,
          colorSet:controlColorAccept,
          shapeSet:controlShapeAccept,
          showControl:controlShowControlAccept,
          changeConstant:controlChangeConstantAccept,
          actionSet:controlActionAccept,
          relationSet:controlRelationAccept,
          showFieldSet:controlShowFieldAccept
      },
      dataStruct:{
          typeSet:{
              1:function (tg,data,domDiv) {
                  // tg=$(tg).hasClass('right-control')?tg:$(tg).parents('.right-control');
                  // console.log(tg,domDiv);
                  // domDiv.dom.setAttribute('class','col-xs-12 rightControlRow');
                  // // domDiv.dom.innerHTML="[control-new]";
                  // alert('区域生成!');
                  // $(tg).append(domDiv.dom);
                  return false;
              },
              2:function (tg,data,domDiv) {
                  console.log(tg);
                  var domDiv2=new el_new("rightControlSet","","",'div');
                  domDiv2.dom.setAttribute('class','td');
                  domDiv2.dom.innerHTML="<--  占位  -->";
                  if($(tg).hasClass('rightControlRow')){
                      domDiv=domDiv2;
                  }else{
                      domDiv.dom.setAttribute('class','col-xs-12 rightControlRow');
                      $(domDiv.dom).append(domDiv2.dom);
                      alert('区域生成!');
                  }
                  $(tg).append(domDiv.dom);

              },
              3:function(tg,data,domDiv){
                  if(!($(tg).hasClass('td')||$(tg).parents('.td').hasClass('formTd'))){
                      alert('请在control-new中操作');
                      return;
                  }
                  console.log(tg,data[0]);
                  domDiv.dom.id=data[0];
                  $(domDiv.dom).addClass(data[1]+'-rowClass');
                  domDiv.dom.innerHTML=data[2];
                  domDiv.dom.setAttribute('value',data[3]);
                  if(tg.parents('.td').length!=0){
                      // if($(tg.parents('.td')).hasClass('formTd')){
                      //     $(tg.parents('.td')).append(domDiv.dom);
                      // }else{
                      $(tg.parents('.td')).empty().append(domDiv.dom);
                      // }
                  }else {
                      if($(tg).hasClass('formTd')&&$(tg).children().length){
                          $(tg).append(domDiv.dom);
                      }else{
                          $(tg).empty().append(domDiv.dom);
                      }
                  }console.log(tg.parents('div'));
              },
              4:function (tg,data,domDiv) {
                  if(!($(tg).hasClass('td')||$(tg).parents('.td').hasClass('formTd'))){
                      alert('请在control-new中操作');
                      return;
                  }
                  console.log(tg,data,domDiv,globalStorage.showTypeObj[data[1]]);
                  domDiv.dom.id=data[0];
                  $(domDiv.dom).addClass(data[1]+'-rowClass');
                  domDiv.dom.innerHTML=globalStorage.showTypeObj[data[2]]['html'];
                  // $('#'+data[0]).find('#pagination').addClass('page_'+data[0]);
                  $(domDiv.dom).find('.page').addClass('page_'+data[0])
                  console.log($(domDiv.dom).find('.page'));
                  if(tg.parents('.td').length!=0){
                      $(tg.parents('.td')).empty().append(domDiv.dom);
                  }else {
                      if($(tg).hasClass('formTd')&&$(tg).children().length){
                          $(tg).append(domDiv.dom);
                      }else{
                          $(tg).empty().append(domDiv.dom);
                      }
                  }console.log(tg.parents('div'));
              },
              5:function (tg,data,domDiv) {
                  if(!($(tg).hasClass('td')||$(tg).parents('.td').hasClass('formTd'))){
                      alert('请在control-new中操作');
                      return;
                  }
                  domDiv.dom.id=data[0];
                  if(data[2]=='formInput'){
                      domDiv.dom.type='submit';
                      domDiv.dom.formAction='javascript:void(0)';
                      domDiv.dom.value=data[3];
                  }
                  $(domDiv.dom).addClass(data[1]+'-rowClass');
                  domDiv.dom.innerHTML=data[3];
                  if(tg.parents('.td').length!=0){
                      $(tg.parents('.td')).empty().append(domDiv.dom);
                  }else {
                      if($(tg).hasClass('formTd')&&$(tg).children().length){
                          $(tg).append(domDiv.dom);
                      }else{
                          $(tg).empty().append(domDiv.dom);
                      }
                  }console.log(tg.parents('div'));
              },
              6:function (tg,data,domDiv) {
                  if(!($(tg).hasClass('td')||$(tg).parents('.td').hasClass('formTd'))){
                      alert('请在control-new中操作');
                      return;
                  }
                  domDiv.dom.id=data[0];
                  $(domDiv.dom).addClass(data[1]+'-rowClass');
                  domDiv.inputType(data[2]);
                  domDiv.dom.setAttribute('max',data[3]);
                  domDiv.dom.setAttribute('placeholder',data[4]);
                  if(data[5]==1){
                      domDiv.dom.setAttribute('readonly',data[5]);
                  }
                  if(tg.parents('.td').length!=0){
                      $(tg.parents('.td')).empty().append(domDiv.dom);
                  }else {
                      if($(tg).hasClass('formTd')&&$(tg).children().length){
                          $(tg).append(domDiv.dom);
                      }else{
                          $(tg).empty().append(domDiv.dom);
                      }
                  }console.log(tg.parents('div'));
              }
          },
      },
      doFunctionArr:function (funcName) {
          this.functionArr[funcName] ();
          $("#rightControlBtn").off('click').on('click',this.acceptArr[funcName]);
      },
      setControlType:function (funcName,tg,data) {
          var controlColumnT=controlColumnType[data[0]-3].domType;
          if(data[1][2]=='formInput'){
              controlColumnT='input';
          }
          var domDiv=new el_new("rightControlSet","","",controlColumnT);
          this.dataStruct[funcName][data[0]](tg,data[1],domDiv);
      },
      setControlWidthTall:function (funcName,tg,data) {
          console.log($(tg).parents('.td'),$(tg).parents('.td').children(),tg);
          // var tgAccept=$(tg).parents('.td').length?$(tg).parents('.td'):tg;
          var tgAccept=tg;
          var tgParent=$(tg).parents('.td');
          if(data[0]){
              if(!tgAccept.hasClass('td')&&$(tgParent).attr('style').match('width')){
                  $(tgParent).css({'width':'auto'});
              }
              $(tgAccept).css({'width':data[0]+(tgAccept.hasClass('td')?'%':'px')});
          }
          if(data[1]){$(tgAccept).css({'height':data[1]+'px'});}
      },
      setColor:function (funcName,tg,data) {
          console.log($(tg).parents('.td'),$(tg).parents('.td').children(),tg);
          // var tgAccept=$(tg).parents('.td').length?$(tg).parents('.td'):tg;
          var tgAccept=tg;
          if(!tgAccept.hasClass('td')){
              if(data[0]!=='#000000'){
                  $(tgAccept).css({'background-color':data[0]});
              }
              if(data[1]!=='#000000'){
                  $(tgAccept).css({'border-color':data[1]});
              }
              if(data[2]!=='#000000'){
                  $(tgAccept).attr('mouseoncolor',data[2]);
                  $(tgAccept).hover(function () {
                      if(this.btnOverObj){
                      }else {
                          var obj=new mouseAction();
                          this.btnOverObj=obj;
                      }
                      this.btnOverObj.mouseOnBackgroundAnimate(this,data[2]);
                  });
              }
          }else {alert('control-new不可上色!')}

      },
      setShape:function (funcName,tg,data) {
          console.log($(tg).parents('.td'),$(tg).parents('.td').children(),tg);
          // var tgAccept=$(tg).parents('.td').length?$(tg).parents('.td'):tg;
          var tgAccept=tg;
          if(!tgAccept.hasClass('td')){
              if(data[0]){
                  $(tgAccept).removeClass('textLeft').removeClass('textCenter').removeClass('textRight').addClass(data[0]);
              }
              if(data[1]){
                  $(tgAccept).css({'border-width':data[1]+'px','border-style':'solid'});
              }
              if(data[2]){
                  $(tgAccept).css({'border-radius':data[2]+'px','border-style':'solid'});
              }
              if(data[3]){
                  $(tgAccept).css({'box-shadow':(0.2*parseInt(data[3]))+'px '+(0.3*parseInt(data[3]))+'px '+(0.1*parseInt(data[3]))+'px #888888'});
              }
              if(data[4]){
                  $(tgAccept).css({'font-size':data[4]+'px'});
              }
              if(data[5]){
                  $(tgAccept).removeClass('default').removeClass('gray').removeClass('primary').removeClass('blue').addClass(data[5]);
              }
          }else {alert('control-new不可变型!')}
      },
      setRelation:function (funcName,tg,data) {
          var tgAccept=$(tg).parentsUntil('.rightControlSet').parent().length==1?$(tg).parentsUntil('.rightControlSet').parent():tg;
        console.log(tgAccept,data);
        var storageJson={
            id:$(tgAccept).attr('id'),
            data:[]
        };
        for(var i=0;i<data.length;i++){
            var keyValue={};
            keyValue['tableName']=data[i][0];
            keyValue['fieldName']=data[i][1];
            storageJson.data.push(keyValue);
        }
        sessionStorage.setItem($(tgAccept).attr('id'),JSON.stringify(storageJson));
          if(!globalStorage.controlInform[$(tgAccept).attr('id')]){
              globalStorage.controlInform[$(tgAccept).attr('id')]={};
          }globalStorage.controlInform[$(tgAccept).attr('id')]['data']=storageJson.data;

          if($(tgAccept).attr('class').search(/-rowClass\b/g)>=0){
              var strMatch=$(tgAccept).attr('class').match(/\S+-rowClass\b/)[0];       // /\S+[@]$/
              strMatch='.'+strMatch.replace(/-rowClass/g,'');
              storageJson.id=strMatch;
              sessionStorage.setItem(strMatch,JSON.stringify(storageJson));
          }
          if(strMatch&&!globalStorage.controlInform[strMatch]){
              globalStorage.controlInform[strMatch]={};
          }
          if(strMatch){
              globalStorage.controlInform[strMatch]['data']=storageJson.data;
          }
          if(tgAccept.parent().localName=='form'){
              tgAccept.attr('name',storageJson.data[0]['fieldName']);
          }

      },
      setChangeConstant:function (funcName,tg,data) {
          if(data[0]){
              $(testing.target).attr('id',data[0]);
          }else if(data[0]==='0'){
              $(testing.target).attr('id','');
          }
          var targetClass=$(testing.target).attr('class');
          var objClass=function (str,Regx) {
              var feedback='';
              try {
                  feedback=str.match(Regx)[0];
                  return feedback;
              }catch (ex){
                  return '';
              }
          };
          if(data[1]){      //targetClass.match(/@/g).length?targetClass.match(/^@$/g):'@';
              // var aCount=objClass(targetClass,/@/g)?targetClass.match(/^@$/g):'@';
              $(testing.target).removeClass(objClass(targetClass,/\S+-rowClass\b/g)).addClass(data[1]+'-rowClass');
          }else if(data[1]==='0'){
              $(testing.target).removeClass(objClass(targetClass,/\S+-rowClass\b/g));
          }
          if(data[2]==='1'){

          }else if(data[2]==='0'){

          }
          if(data[3]&&$(testing.target).prop('tagName')=='LABEL'){
              $(testing.target).attr('value',data[3]);
          }else if(data[3]==='0'){
              $(testing.target).attr('value','');
          }

      },
      setRowCopyAction:function (funcName,tg,data) {
          var tgCopy=$(tg).clone();
          var objClass=function (str,Regx) {
              var feedback='';
              try {
                  feedback=str.indexOf(Regx);
                  return feedback;
              }catch (ex){
                  return '';
              }
          };
          var addition=function (objList,attr,reg) {
              var returnInfo=false;
              for(var obj=0 ; obj<objList.length;obj++){
                  $(objList[obj]).attr('id','');
                  $(objList[obj]).val('');
                  console.log($(objList[obj]).attr(attr));
                  if((!$(objList[obj]).attr(attr))||!objClass($(objList[obj]).attr(attr),reg)){
                      returnInfo=$(objList[obj]).attr('id')+'-';
                  }
              }return returnInfo;
          };
          if(addition($(tgCopy).find('.rightControlSet'),'class','-rowClass')){
              alert('请先给 ID:'+addition($(tgCopy).find('.rightControlSet'),'class','-rowClass')+' 绑定类名');
              throw SyntaxError();
          }else {
              if(data[0][0]==1){
                  var i=0;
                  if(confirm('选\"是\"往前复制，选\"否\"往后复制')==true){
                      for(i=0;i<parseInt(data[0][1]);i++){
                          tgCopy=$(tg).clone();
                          $(tg).before(tgCopy);
                          tgCopy=null;
                      }
                  }else {
                      for(i=0;i<parseInt(data[0][1]);i++) {
                          tgCopy=$(tg).clone();
                          $(tg).after(tgCopy);
                          tgCopy=null;
                      }
                  }
              }else if(data[0][0]==2){
                  var idName=tgCopy.attr('id');
                  if(!sessionStorage.getItem(data[0][1])){
                      alert('请先给 ID/类 :'+data[0][1]+' 绑定关系');
                      throw SyntaxError();
                  }else{
                      var showCopy={
                          tableFirst:data[0][2],
                          index:JSON.parse(sessionStorage.getItem(data[0][1])),
                          copyRow:idName,
                      };
                      globalStorage.showCopyRowStorage[idName]['showCopy']=showCopy;
                      var arrDataStr=JSON.stringify(globalStorage.showCopyRowStorage[idName]);
                      arrDataStr=arrDataStr.replace(/\"&|\\|&\"/g,'');       //正则表达式替换
                      arrDataStr=arrDataStr.replace(/\{\"/g,'{').replace(/,\"/g,',').replace(/\"\:/g,':');
                      var eventStr= 'bindOf({str:'+arrDataStr+',next:{}});\n';
                      jsStr =   jsStr+" "+eventStr+'\n\n'; //+'//'+subEventStr
                      console.log(jsStr,'//controlInform='+JSON.stringify(globalStorage.controlInform) +'//controlInformEnd\n');
                  }
              }
          }tgCopy=null,tg=null;
      },
      setConstructAction:function (funcName,tg,data,tgName) {
          console.log(data,tgName);
          var tgAccept=$(tg).parentsUntil('.rightControlSet').parent().length==1?$(tg).parentsUntil('.rightControlSet').parent():tg;
          var jsonConstructObj=new jsonConstruct();
          var doitFile=new doit();
          //定义新的事件监听！！！修正修正！！！
          var eventStr= '$(document.querySelector("'+ tgName+'")).on("click",function(){ \n';
          var strArray=[];
          if(!globalStorage.controlInform[$(tgAccept).attr('id')]){
              globalStorage.controlInform[$(tgAccept).attr('id')]={};
          }
          if(!globalStorage.controlInform[$(tgAccept).attr('id')]['action']){
              globalStorage.controlInform[$(tgAccept).attr('id')]['action']=[];
          }
          for(var j=0;j<data.length;j++){
              var child=jsonConstructObj.constructFunc(data[j]);
              strArray.push(child);
              if(data[j].actionType=='showTable'){
                  if(!globalStorage.controlInform[data[j][0]]){
                      globalStorage.controlInform[data[j][0]]={};
                  }
                  if(!globalStorage.controlInform[data[j][0]]['action']){
                      globalStorage.controlInform[data[j][0]]['action']=[];
                  }
                  globalStorage.controlInform[data[j][0]]['action'].push(data[j]);
              }else if(data[j].actionType=='showSelect'){
                  if(!globalStorage.controlInform[data[j][1][0]]){
                      globalStorage.controlInform[data[j][1][0]]={};
                  }
                  if(!globalStorage.controlInform[data[j][1][0]]['action']){
                      globalStorage.controlInform[data[j][1][0]]['action']=[];
                  }
                  globalStorage.controlInform[data[j][1][0]]['action'].push(data[j]);
              }else {
                  globalStorage.controlInform[$(tgAccept).attr('id')]['action'].push(data[j]);
              }
          }
          var subEventStr='{}';
          for(var i=data.length-1;i>=0;i--) {
              subEventStr= '{str:'+strArray[i]+',next:'+subEventStr+'}';
                  // (data[i+1]?'bindOf(data,func_'+$(tg).attr('id')+'_'+(i+1)+');\n': 'bindOf(data);\n')
          }var subEventStrTotal='var data='+subEventStr+';\n';
          if(data[0][0][0]==''||data[0].actionType=='showTable'||data[0].actionType=='showSelect'){
              eventStr='bindOf('+subEventStr+');\n';
              jsStr =   jsStr+" "+eventStr+'\n\n'; //+'//'+subEventStr
          }else {
              jsStr = jsStr + " " + eventStr + subEventStrTotal + 'bindOf(data);\n})'+'\n\n';       //+'//'+subEventStr
          }
          console.log(jsStr,'//controlInform='+JSON.stringify(globalStorage.controlInform) +'//controlInformEnd\n');
      },
        setShowField:function (funcName,tg,data) {
            var tgAccept = $(tg).parentsUntil('.rightControlSet').parent().length == 1 ? $(tg).parentsUntil('.rightControlSet').parent() : tg;
            var tableStorage={};
            console.log(tgAccept, data);
            var storageJson = {
                id: $(tgAccept).attr('id'),
                data: []
            };
            for (var i = 0; i < data.length; i++) {
                if(tableStorage[data[i][0]]){
                    tableStorage[data[i][0]]['fieldName'].push(data[i][1]);
                    if(data[i][2]){
                        var obj={};
                        obj[data[i][2]]=data[i][3];
                        tableStorage[data[i][0]].netField=data[i][1];
                        tableStorage[data[i][0]]['foreign']=obj;
                    }
                }else {
                    var keyValue = {tableName: null, fieldName: [], foreign: 1};
                    keyValue['tableName'] = data[i][0];
                    keyValue['fieldName'].push(data[i][1]);
                    if(data[i][2]){
                        var obj={};
                        obj[data[i][2]]=data[i][3];
                        keyValue['netField']=data[i][1];
                        keyValue['foreign']=obj;
                    }
                    tableStorage[data[i][0]] = keyValue;
                }
            }
            for(var j in tableStorage){
                storageJson.data.push(tableStorage[j]);
            }
            sessionStorage.setItem($(tgAccept).attr('id'), JSON.stringify(storageJson));
            globalStorage.controlInform[$(tgAccept).attr('id')]={};
            globalStorage.controlInform[$(tgAccept).attr('id')]['data']=storageJson.data;
        }
    };
    function jsonConstruct(){
    }
    jsonConstruct.prototype={
        constructSolute:{
            idSessionArr:function (array) {
                var sessionArr=[];
                for(var i=0;i<array.length;i++){
                    if(array['actionType']=='update'){
                        for (var j = 0; j < array[i].length; j++) {
                            sessionArr.push(JSON.parse(sessionStorage[array[i][j]]||'{}'));
                        }
                    }else if(array['actionType']=='select'||array['actionType']=='showSelect') {
                        for (var j = 0; j < array[i].length; j = j + 2) {
                            if (array[i][j] !== '') {
                                 var session=Object.keys(JSON.parse(sessionStorage[array[i][j]]||'{}')).length?JSON.parse(sessionStorage[array[i][j]]):{data:[]};
                                for (var key=0 ;key < session.data.length;key++) {
                                    if (session.data[key].foreign) {
                                        var showField = session.data[key].fieldName;
                                        for (var field = 0; field < showField.length; field++) {
                                            var obj = {
                                                name: showField[field]
                                            };
                                            showField[field] = obj;
                                        }// }sessionStorage[array[i][j]].data[key].showField=showField;
                                    }
                                }sessionArr.push(session);
                            }else {
                                sessionArr.push('undefined');
                            }
                        }
                    }else if(array['actionType']=='deleted'||array['actionType']=='fileUpload'||array['actionType']=='fileUpdate'||array['actionType']=='fileDeleted'){
                        if(array['actionType']=='deleted'){
                            sessionArr.push(JSON.parse(sessionStorage[array[i]]||'{}'));
                        }else {
                            //判断值是否( .className/ idName)，是则获取缓存资料，不是( "经济" )则直接放进数组
                            if(!array[i].search(/\'|\"/g)){
                                sessionArr.push(array[i]);
                            }else {
                                //判断该值是否绑定表关联
                                try{
                                    sessionArr.push(JSON.parse(sessionStorage[array[i]]));
                                }catch(ex) {
                                    //后方需读取{id:...,data:[{tableName:...,fieldName:...}]},找不到关联自己创造关联
                                    //上传功能的(上传/主题/分类)
                                    var fieldList=['path','topic','category'];
                                    sessionArr.push({
                                        id:array[i],
                                        data:[{tableName:'$file',fieldName:fieldList[i]}]
                                    });
                                }
                            }
                        }
                    }else if(array['actionType']=='showTable'){
                        var session=Object.keys(JSON.parse(sessionStorage[array[i]]||'{}')).length?JSON.parse(sessionStorage[array[i]]):{data:[]};
                        for (var key=0 ;key < session.data.length;key++) {
                            if (session.data[key].foreign) {
                                var showField = session.data[key].fieldName;
                                for (var field = 0; field < showField.length; field++) {
                                    var obj = {
                                        name: showField[field]
                                    };
                                    showField[field] = obj;
                                }// }sessionStorage[array[i][j]].data[key].showField=showField;
                            }
                        }sessionArr.push(session);
                    }
                }return sessionArr;
            },
            getTableArr:function (sessionArr) {
                var table=[];
                for(var i=0;i<sessionArr.length;i++){
                    if(typeof sessionArr[i]=='object') {
                        for (var j = 0; j < sessionArr[i]['data'].length; j++) {
                            if ($.inArray(sessionArr[i]['data'][j]['tableName'], table) < 0) {
                                table.push(sessionArr[i]['data'][j]['tableName']);
                            }
                        }
                    }
                }return table;
            },
            objFormat:function (sessionArr,table,array) {
                var obj = {
                    actionType:'select',
                    json: [],
                    tableIndex:{outputIndex:{}, inputIndex:{}},
                    showField:{},
                    tableNet:{},
                    iterator:0
                };     //构造处！！！insert
                var tableIndex=[];
                for(var i=array.length-1;i>=0;i--){
                    if (array[i]['actionType'] != 'out') {
                        for (var j = 0; j < sessionArr[i]['data'].length; j++) {
                            if(sessionArr[i]['data'][j]['foreign']){
                                var tableName=Object.keys(sessionArr[i]['data'][j]['foreign'])[0];
                                tableIndex.push(sessionArr[i].data[j].tableName);
                                if(sessionArr[i]['data'][j]['foreign']!=1){
                                    obj.tableIndex['outputIndex'][sessionArr[i].data[j].tableName]=sessionArr[i].data[j].netField;
                                    obj.tableNet[sessionArr[i].data[j].tableName]=tableName;
                                    obj.tableIndex['inputIndex'][tableName]=sessionArr[i]['data'][j]['foreign'][tableName];
                                }
                                obj.iterator=1;
                            }else {
                                obj.tableIndex.inputIndex[sessionArr[i]['data'][j]['tableName']] = array[i][1];
                            }
                        }
                    } else {
                        var keyArr = Object.keys(obj.tableIndex.inputIndex);
                        if(typeof sessionArr[i]=='object') {
                            for (var j = 0; j < sessionArr[i]['data'].length; j++) {
                                if ($.inArray(sessionArr[i]['data'][j]['tableName'], keyArr) < 0) {
                                    obj.tableIndex.outputIndex[sessionArr[i]['data'][j]['tableName']] = array[i][1];
                                }
                            }
                        }
                    }
                }return obj;
            },
            changeFormal:function (array) {
                var newArr={};
                var t=0;
                newArr['actionType']=array['actionType'];
                for(var i=0;i<array.length;i++){
                    if(array['actionType']=='update'){
                        for (var j = 0; j < array[i].length; j ++) {
                            var obj = {};
                            obj[0] = array[i][j];
                            if (i == 0) {
                                obj['actionType'] = 'out';
                            }
                            else {
                                obj['actionType'] = 'in';
                            }
                            newArr[t++] = obj;
                            newArr['length'] = t;
                        }
                    }else if(array['actionType']=='select'||array['actionType']=='showSelect') {
                        for (var j = 0; j < array[i].length; j = j + 2) {
                            if(!sessionStorage.getItem(array[i][j])){
                                alert('请先给 ID:'+array[i][j]+' 绑定关系');
                                throw SyntaxError();
                            }
                            var obj = {};
                            obj[0] = array[i][j];
                            obj[1] = array[i][j + 1];
                            obj['length']=2;
                            if (i == 0) {
                                obj['actionType'] = 'out';
                            }
                            else {
                                obj['actionType'] = 'in';
                            }
                            newArr[t++] = obj;
                            newArr['length'] = t;
                        }
                    }else if(array['actionType']=='showTable'){
                        var obj={0:array[i],actionType:'in'};
                        newArr[t++]=obj;
                        newArr['length']=t;
                    }
                }return newArr;
            },
            objFormatUpdate:function (sessionArr,table,array) {
                var obj = {
                    actionType: 'update',
                    json: [],
                    updateField:{},
                    iterator:0
                };     //构造处！！！update
                return obj;
            },
            objFormatDeleted:function (sessionArr,table,array) {
                var obj = {
                    actionType: 'deleted',
                    json: [],
                    iterator:0
                };     //构造处！！！update
                return obj;
            }
        },
        constructTool:{
            insert:function (array) {
                var table=[],arrData={};
                for(var i=0;i<array.length;i++){
                    var sessionArr=JSON.parse(sessionStorage[array[i]]);
                    //console.log($.inArray(sessionArr['data'][0]['tableName'], table));
                    for(var j=0;j<sessionArr['data'].length;j++) {
                        if ($.inArray(sessionArr['data'][j]['tableName'], table)<0) {
                            var obj = {
                                actionType: 'insert',
                                json: {tableName: sessionArr['data'][j]['tableName'], data: []}
                            };     //构造处！！！insert
                            var dataChild = {};
                            dataChild[sessionArr['data'][j]['fieldName']] = '&addPoint($("#' + array[i] + '").val())&';
                            obj['json']['data'].push(dataChild);
                            arrData[sessionArr['data'][j]['tableName']] = obj;
                            table.push(sessionArr['data'][j]['tableName']);
                        } else {
                            dataChild=arrData[sessionArr['data'][j]['tableName']]['json']['data'][0];
                            dataChild[sessionArr['data'][j]['fieldName']] = '&addPoint($("#' + array[i] + '").val())&';
                        }
                    }
                }
                var arrDataArr=[];
                for(var arrDataChild in arrData) {
                    arrDataArr.push(arrData[arrDataChild]);
                }
                //console.log(arrDataStr);
                return arrDataArr;
            },
            select:function (array) {
                var sessionArr=jsonConstruct.prototype.constructSolute.idSessionArr(array),
                    arrData={},
                    table=jsonConstruct.prototype.constructSolute.getTableArr(sessionArr),
                    tableStorage=[];
                console.log(array);
                array=jsonConstruct.prototype.constructSolute.changeFormal(array);
                console.log(sessionArr,array);
                var obj=jsonConstruct.prototype.constructSolute.objFormat(sessionArr,table,array);      //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                //console.log(obj);
                var outputField = {};
                for(var j=0;j<sessionArr.length;j++) {
                    if(typeof sessionArr[j]=='object') {
                        if($(FContent.document.getElementById(array[j][0])).attr('value')){
                            var valueStorage = '&addPoint($("#' + array[j][0] + '").attr("value"))&';
                        }
                        for (var t = 0; t < sessionArr[j]['data'].length; t++) {
                            var dataChild = {};
                            if ($.inArray(sessionArr[j]['data'][t]['tableName'], tableStorage) < 0) {
                                var json = {
                                    currentPage: 1,
                                    pageSize: 10,
                                    colum:'',
                                    order:'',
                                    tableName: sessionArr[j]['data'][t]['tableName'],
                                    data: []
                                };     //构造处！！！insert;
                                if(sessionArr[j].data[t].tableName.indexOf('$')==0){      //可改用try catch来初始化
                                    var actionTypeBase={
                                        '$file':{
                                            data:{
                                                pageNumber: 1,
                                                pageSize: 10
                                            },
                                            tableName:sessionArr[j]['data'][t]['tableName']
                                        }
                                    };
                                    json = actionTypeBase[table];
                                }else {
                                }
                                if (array[j]['actionType'] == 'in') {
                                    var objStorage = {
                                        fieldName: sessionArr[j]['data'][t]['fieldName'],
                                        id: sessionArr[j]['id']
                                    };
                                    console.log(obj);
                                    obj['showField'][sessionArr[j]['data'][t]['tableName']] = objStorage;
                                    if(array.actionType=='showSelect'&&array[j][0].indexOf('.')!=0){
                                        dataChild[outputField[sessionArr[j]['data'][t].tableName]] = valueStorage;
                                        json['data'].push(dataChild);
                                    }
                                }else {
                                        dataChild[sessionArr[j]['data'][t]['fieldName']] = '&addPoint($("#' + array[j][0] + '").val())&';
                                    if($(FContent.document.getElementById(array[j][0])).attr('value')||$(FContent.document.getElementById(array[0][0])).attr('value')){
                                        dataChild[sessionArr[j]['data'][t]['fieldName']] = valueStorage;
                                        outputField[sessionArr[j]['data'][t].tableName]=sessionArr[j]['data'][t].fieldName;
                                    }
                                    if(array[j][0].indexOf('.')!=0){
                                        json['data'].push(dataChild);
                                    }
                                }
                                obj['json'].push(json);
                                arrData = obj;
                                tableStorage.push(sessionArr[j]['data'][t]['tableName']);
                            } else {
                                if (array[j]['actionType'] == 'in') {
                                    var objStorage = {
                                        fieldName: sessionArr[j]['data'][t]['fieldName'],
                                        id: sessionArr[j]['id']
                                    };
                                    if(!(array.actionType == 'showSelect')){
                                        obj['showField'][sessionArr[j]['data'][t]['tableName']] = objStorage;
                                    }else {
                                        if(!obj['showField'][sessionArr[j]['data'][t]['tableName']]){
                                            obj['showField'][sessionArr[j]['data'][t]['tableName']]=[];
                                        }
                                        obj['showField'][sessionArr[j]['data'][t]['tableName']].push(objStorage);
                                    }
                                    for (var i = 0; i < arrData['json'].length; i++) {
                                        if (arrData['json'][i]['tableName'] == sessionArr[j]['data'][t]['tableName']) {
                                            dataChild = arrData['json'][i]['data'][0];
                                        }
                                    }
                                    if($(FContent.document.getElementById(array[j][0])).attr('value')||$(FContent.document.getElementById(array[0][0])).attr('value')){
                                        dataChild[outputField[sessionArr[j]['data'][t].tableName]] = valueStorage;
                                    }
                                } else {
                                    for (var i = 0; i < arrData['json'].length; i++) {
                                        if (arrData['json'][i]['tableName'] == sessionArr[j]['data'][t]['tableName']) {
                                            dataChild = arrData['json'][i]['data'][0];
                                        }
                                    }
                                    dataChild[sessionArr[j]['data'][t]['fieldName']] = '&addPoint($("#' + array[j][0] + '").val())&';
                                    if($(FContent.document.getElementById(array[j][0])).attr('value')||$(FContent.document.getElementById(array[0][0])).attr('value')){
                                        dataChild[sessionArr[j]['data'][t]['fieldName']] = valueStorage;
                                        outputField[sessionArr[j]['data'][t].tableName]=sessionArr[j]['data'][t]['fieldName'];
                                    }
                                }
                            }
                        }
                    }
                }
                if(array[0][0].indexOf('.')==0){
                    var parent=$(testing.target).hasClass('rightControlRow')?$(testing.target):$(testing.target).parents('.rightControlRow');
                    arrData.iterator=2;
                    globalStorage.showCopyRowStorage[parent.attr('id')]=arrData;
                    alert("可绑定‘行复制行为’！");
                    console.log(globalStorage.showCopyRowStorage);
                    throw SyntaxError();
                }
                //console.log(arrDataStr);
                return arrData;
            },
            update:function (array) {
                var sessionArr=jsonConstruct.prototype.constructSolute.idSessionArr(array),
                    arrData={},
                    table=jsonConstruct.prototype.constructSolute.getTableArr(sessionArr),
                    tableStorage=[];
                array=jsonConstruct.prototype.constructSolute.changeFormal(array);
                console.log(sessionArr,array,table);
                var obj=jsonConstruct.prototype.constructSolute.objFormatUpdate(sessionArr,table,array);      //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                for(var j=0;j<sessionArr.length;j++) {          //(O)=2(n^2)
                    for(var t=0;t<sessionArr[j]['data'].length;t++){
                        var check={tableName:sessionArr[j]['data'][t]['tableName'],type:array[j]['actionType']};
                        console.log(check);
                        if (!objInArray(check,tableStorage)) {
                            if(array[j]['actionType']=='in'){
                                var json = {actionType:'update',tableName: sessionArr[j]['data'][t]['tableName'], data: []};     //构造处！！！insert
                                var objStorage={fieldName:sessionArr[j]['data'][t]['fieldName'],id:sessionArr[j]['id']};
                                if(obj['updateField'][sessionArr[j]['data'][t]['tableName']]){
                                    obj['updateField'][sessionArr[j]['data'][t]['tableName']].push(objStorage);
                                }else{
                                    obj['updateField'][sessionArr[j]['data'][t]['tableName']]=[];
                                    obj['updateField'][sessionArr[j]['data'][t]['tableName']].push(objStorage);
                                }
                                var dataChild = {};
                                dataChild[sessionArr[j]['data'][t]['fieldName']] = '&addPoint($("#' + array[j][0] + '").val())&';
                                json['data'].push(dataChild);
                                tableStorage.push(check);
                            }else {
                                var json = {actionType:'select',currentPage:1,pageSize:5,tableName: sessionArr[j]['data'][t]['tableName'], data: []};     //构造处！！！insert
                                var dataChild = {};
                                dataChild[sessionArr[j]['data'][t]['fieldName']] = '&addPoint($("#' + array[j][0] + '").val())&';
                                json['data'].push(dataChild);
                                tableStorage.push(check);
                            }
                            obj['json'].push(json);
                            arrData = obj;
                        } else {
                            if(array[j]['actionType']=='in'){
                                var objStorage={fieldName:sessionArr[j]['data'][t]['fieldName'],id:sessionArr[j]['id']};
                                if(obj['updateField'][sessionArr[j]['data'][t]['tableName']]){
                                    obj['updateField'][sessionArr[j]['data'][t]['tableName']].push(objStorage);
                                }else{
                                    obj['updateField'][sessionArr[j]['data'][t]['tableName']]=[];
                                    obj['updateField'][sessionArr[j]['data'][t]['tableName']].push(objStorage);
                                }
                            }
                            for(var i=0;i<arrData['json'].length;i++){
                                if(arrData['json'][i]['tableName']==sessionArr[j]['data'][t]['tableName']){
                                    dataChild=arrData['json'][i]['data'][0];
                                }
                            }
                            dataChild[sessionArr[j]['data'][t]['fieldName']] = '&addPoint($("#' + array[j][0] + '").val())&';
                        }
                    }
                }
                //console.log(arrDataStr);
                return arrData;
            },
            deleted:function (array) {
                var sessionArr=jsonConstruct.prototype.constructSolute.idSessionArr(array),
                    arrData={},
                    table=jsonConstruct.prototype.constructSolute.getTableArr(sessionArr),
                    tableStorage=[];
                console.log(sessionArr,array,table);
                var obj=jsonConstruct.prototype.constructSolute.objFormatDeleted(sessionArr,table,array);      //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                for(var j=0;j<sessionArr.length;j++) {          //(O)=2(n^2)
                    for (var t = 0; t < sessionArr[j]['data'].length; t++) {
                        if ($.inArray(sessionArr[j]['data'][t]['tableName'], tableStorage)<0) {
                            var json = {
                                actionType: 'deleted',
                                tableName: sessionArr[j]['data'][t]['tableName'],
                                data: []
                            };
                            var dataChild = {};
                            dataChild[sessionArr[j]['data'][t]['fieldName']] = '&addPoint($("#' + array[j] + '").val())&';
                            json['data'].push(dataChild);
                            tableStorage.push(sessionArr[j]['data'][t]['tableName']);
                            obj['json'].push(json);
                            arrData = obj;
                        } else {
                            for (var i = 0; i < arrData['json'].length; i++) {
                                if (arrData['json'][i]['tableName'] == sessionArr[j]['data'][t]['tableName']) {
                                    dataChild = arrData['json'][i]['data'][0];
                                }
                            }
                            dataChild[sessionArr[j]['data'][t]['fieldName']] = '&addPoint($("#' + array[j] + '").val())&';
                        }
                    }
                }
                //console.log(arrDataStr);
                return arrData;
            },
            fileUpload:function(array){
                var sessionArr=jsonConstruct.prototype.constructSolute.idSessionArr(array),
                    table=jsonConstruct.prototype.constructSolute.getTableArr(sessionArr);
                console.log(sessionArr,array,table);
                var fieldUpload=['file','topic','category'];
                for(var j=0;j<sessionArr.length;j++) {          //(O)=2(n^2)
                    // selectObject获取真实id(#id)和class(.class-rowClass)||常量("经济");
                    var selectorObj=doit.prototype.queryForMine(sessionArr[j].id||sessionArr[j]),selector=null;
                    try{
                        //selector获取对应的Dom对象
                        selector=FContent.document.querySelector(selectorObj.str);
                        //判断是否selector，如('经济')不是，而(id,class)是的
                        if(selectorObj.type=='string'&&selectorObj.str){
                            //赋值name用作上传时表单的标识
                            selector.setAttribute('name',doit.prototype.queryForMine(sessionArr[j].data[0].fieldName));
                        }else if(selectorObj.type=='selector'&&selectorObj.str){
                            selector.setAttribute("name",fieldUpload[j]);
                        }
                    }catch (ex){
                    }
                }
                var arrData = {
                    actionType: 'fileUpload',
                    tableName: table,
                    clickObj:'&this&'
                };
                //console.log(arrDataStr);
                return arrData;
            },
            fileSelect:function(array){
                var parent=$(testing.target).hasClass('rightControlRow')?$(testing.target):$(testing.target).parents('.rightControlRow'),
                    targetId=parent.attr('id');
                var doitSelect=new doit();
                var queryObj={};
                if(array[4]&&globalStorage.showCopyRowStorage[array[4]]){
                    targetId=array[4];
                }
                try {
                    for (var i = 0; i < globalStorage.showCopyRowStorage[targetId].json.length; i++) {
                        if (globalStorage.showCopyRowStorage[targetId].json[i].tableName == '$file') {
                            array[0] ? globalStorage.showCopyRowStorage[targetId].json[i].data['keyword'] = queryObj['keyword'] = doitSelect.queryForMineStr(array[0]).str : false;
                            array[1] ? globalStorage.showCopyRowStorage[targetId].json[i].data['topic'] = queryObj['topic'] = doitSelect.queryForMineStr(array[1]).str : false;
                            array[2] ? globalStorage.showCopyRowStorage[targetId].json[i].data['category'] = queryObj['category'] = doitSelect.queryForMineStr(array[2]).str : false;
                            // array[3] ? globalStorage.showCopyRowStorage[targetId].json[i]['queryStyle'] = queryObj['queryStyle'] = array[3] : false;
                            // array[3] ? globalStorage.showCopyRowStorage[targetId].json[i]['queryImplement'] = queryObj['queryImplement'] = (function (target) {
                            //     try {
                            //         return '.' + $(target).attr('class').match(/\S+[@]$/)[0];
                            //     } catch (ex) {
                            //         return $(target).attr('id');
                            //     }
                            // })(testing.target) : false;
                            if(array[3]==0&&!array[4]){
                                alert('本行文件默认查询关键字：'+array[0]+'/主题：'+array[1]+'/分类：'+array[2]+'，可设置行复制行为!');
                            }else if(array[3]==0&&array[4]){
                                queryObj=$.extend({},globalStorage.showCopyRowStorage[targetId]);
                                queryObj.json=[];
                                queryObj.json.push(globalStorage.showCopyRowStorage[targetId].json[i].data);
                            }else{
                                queryObj={
                                    queryStyle:array[3],
                                    queryImplement:(function (target) {
                                        try {
                                            return '.' + $(target).attr('class').match(/\S+-rowClass\b/)[0];
                                        } catch (ex) {
                                            return $(target).attr('id');
                                        }
                                    })(testing.target)
                                }
                            }
                        }
                    }
                }catch(ex){
                    // array[0] ? queryObj['keyword'] = doitSelect.queryForMineStr(array[0]).str : false;
                    // array[1] ? queryObj['topic'] = doitSelect.queryForMineStr(array[1]).str : false;
                    // array[2] ? queryObj['category'] = doitSelect.queryForMineStr(array[2]).str : false;
                    // array[3] ? queryObj['queryStyle'] = array[3] : false;
                    // array[3] ? queryObj['queryImplement'] = (function (target) {
                    //     try {
                    //         return '.' + $(target).attr('class').match(/\S+[@]$/)[0];
                    //     } catch (ex) {
                    //         return $(target).attr('id');
                    //     }
                    // })(testing.target):false;
                    queryObj={
                        queryStyle:array[3],
                        queryTarget:targetId,
                        queryImplement:(function (target) {
                            try {
                                return '.' + $(target).attr('class').match(/\S+-rowClass\b/)[0];
                            } catch (ex) {
                                return $(target).attr('id');
                            }
                        })(testing.target)
                    };
                    if(!parseInt(array[3])){
                        queryObj['replaceData']={
                            pageNumber:1,
                            pageSize:10
                        };
                        array[0]?queryObj['replaceData']['keyword']=doitSelect.queryForMineStr(array[0]).str:false;
                        array[1]?queryObj['replaceData']['topic']=doitSelect.queryForMineStr(array[1]).str:false;
                        array[2]?queryObj['replaceData']['category']=doitSelect.queryForMineStr(array[2]).str:false;
                    }
                }
                alert("查询文件细节已设定！");
                console.log(globalStorage.showCopyRowStorage);
                return (function (target){
                    if($(target).prop('tagName').toLowerCase()=='button'&&!(array[3]==0&&!array[4])){
                        //判断是按钮，关联行号为空（点击行为，查询，看文件）
                        return {data:queryObj,actionType:array[3]==0?'fileSelect':'fileOpen'};
                    }else{
                        //关联了行号的就是作为增添默认文件查询条件了（添加显示默认参数，自动列出关键字或主题的结果）
                        throw SyntaxError();
                    }
                })(testing.target);
                // return globalStorage.showCopyRowStorage[parent.attr('id')];
            },
            showTable:function (array) {
               return this.select(array);
            },
            showSelect:function (array) {
                if(!sessionStorage[array[1][0]]){
                    alert('请先绑定控件 ID:'+array[1][0]);
                    // return;      //保留返回
                }
                return this.select(array);
            },
            messageSet:function(array){
                array=array[2];     //获取第三层对应资料
                var set={
                    user:array[0].replace(/\"/g,"'")||'*',
                    title:array[1]||'*',
                    net:array[2]||'*',
                    actionType:'messageSet'
                };
                return set;
            },
            showView:function(array){
                var set={
                    type:array[0]||'',
                    modal:array[2]||'',
                    actionType:'showView'
                };
                return set;
            },
            printAct:function(array){
                var set={
                    type:array[0]||'',
                    modal:array[2]||'',
                    actionType:'printAct'
                };
                return set;
            }
        },
        constructFunc:function (dataArr) {
            console.log(dataArr['actionType']);
            var jsonObj=this.constructTool[dataArr['actionType']](dataArr);
            var arrDataStr=JSON.stringify(jsonObj).replace(/\"&|\\|&\"/g,'').replace(/\{\"/g,'{').replace(/,\"/g,',').replace(/\"\:/g,':');
            return arrDataStr;
        }
    };
    function modalValueFunc() {             //获取目录树下的值
    }
    modalValueFunc.prototype={
        dataArr:null,
        getDataArr:function (domTree) {
            var data={length:0,actionType:null};
            if($(domTree).attr('name')){data.actionType=$(domTree).attr('name');}
            console.log(domTree.children());
            console.log($(domTree).attr('name'));
            if(domTree.children().length!=0){
                for(var i=0;i<domTree.children().length;i++) {
                    var name = domTree.children()[i].tagName;
                    if (!(name == 'INPUT' || name == 'SELECT'||name=='BR'||$(domTree.children()[i]).hasClass("btn-group")||$(domTree.children()[i]).hasClass("btn"))) {
                        data[data['length']] = this.getDataArr($(domTree.children()[i]));
                        data['length']++;
                    } else if(!(name=='BR'||$(domTree.children()[i]).hasClass("btn-group")||$(domTree.children()[i]).hasClass("btn"))){
                        data=$(domTree.children()[i]).val();
                    }
                }return data;
            }else{
                return null;
            }
        }
    };
    function el_new(classname,idname,name,domname) {         //el 新建元素类
        this.dom=document.createElement(domname);                   //各种元素
        this.dom.setAttribute("id",idname);
        this.dom.setAttribute("class",this.attrClass+" "+classname);
        this.dom.setAttribute("name",name);
    }
    el_new.prototype={
        dom:document.createElement("div"),
        attrId:"#",
        attrName:"#",
        attrClass:"",
        type:"text",
        style:"padding:1px 12px;",
        inputType:function (type) {
            this.type=type;
            this.dom.setAttribute("type",this.type);
        },
        appendStyle:function (style) {
            this.dom.setAttribute("style",this.style+";"+style);
        }
    };
    
    function labelAndInput(classname,idname,name,domname,labelname) {
    	el_new.call(this,classname,idname,name,domname);
    	this.labelEl=document.createElement("label");              //label组合元素！！！
        this.labelEl.setAttribute("class",this.labelClass);
        this.labelEl.textContent=labelname;
    	this.labelEl.appendChild(this.dom);
    }
    labelAndInput.prototype=new el_new();
    labelAndInput.prototype.constructor=labelAndInput;
    labelAndInput.prototype.labelEl=document.createElement("label");
    labelAndInput.prototype.setLabel=function (content) {
		this.labelEl.innerText=content;
    };
    labelAndInput.prototype.labelClass="form-inline";
    labelAndInput.prototype.setLabelClass=function (classname) {
		this.labelEl.setAttribute("class",this.labelClass+" "+classname);
    };
    
    function contextMenuDiv(event,menuDiv,menuArr) {            //右键菜单类
        var menuUl=menuDiv.children("ul");
        this.menuDiv=menuDiv;
        this.menuArray=menuArr;
        menuUl.empty().off('click');
        for(var index in menuArr){
            var li=new el_new('backGroundAndText menuDivLi','','','li');
            var a=new el_new('backGroundAndText menuDivA',menuArr[index].id,'','a');
            $(a.dom).html(menuArr[index].name);
            $(a.dom).bind('mouseover',menuArr[index].childArr,this.hoverFunc);
            li.dom.append(a.dom);
            menuUl.append(li.dom);
        }
        $(menuUl).on('click','.menuDivA',clickFunc);
        var offsetY=$('.panel-body').offset();
        var scrollY=$('.dt-container').scrollTop();
        var screenX=parseInt(event.screenX)+5;
        var screenY=parseInt(event.screenY)-parseInt(offsetY.top)-parseInt(scrollY);
        console.log(screenX,screenY,offsetY);
        menuDiv.css({'top':screenY,'left':screenX});
        if(screenX + parseInt(menuDiv.css('width')) > window.outerWidth){
            menuDiv.css({'top':screenY,'left':screenX- parseInt(menuDiv.css('width')) });
        }
        if(screenY + parseInt(menuDiv.css('height')) > window.outerHeight) {
            menuDiv.css({'top':screenY - parseInt(menuDiv.css('height')),'left':screenX});
        }
        var data={
            menuDiv:menuDiv,
            event:event
        };
        return data;
    }
    contextMenuDiv.prototype={                      //菜单 原型
        menuDiv:null,
        outOfFrameTop: document.getElementById("frame_set").offsetTop+50,        //对应框架的position
        outOfFrameLeft:document.getElementById("frame_set").offsetLeft,
        parentLi:null,
        menuArray:null,
        hoverFunc:function (event) {
            var tg=event.target;
            var data2=contextMenuDiv(event,$("#contextmenu2"),event.data);
             data2.menuDiv.css({'top':tg.getBoundingClientRect().top ,
                 'left':tg.getBoundingClientRect().left + parseInt($(this).parents("li").css('width'))});
            if(tg.getBoundingClientRect().left + parseInt($(this).parents("div").css('width')) + parseInt(data2.menuDiv.css('width')) > window.outerWidth){
                data2.menuDiv.css({'left':tg.getBoundingClientRect().left - parseInt(data2.menuDiv.css('width')) });
            }
            if(tg.getBoundingClientRect().top + parseInt($(this).parents("div").css('height'))+parseInt(menuDiv.css('height')) > window.outerHeight) {
                data2.menuDiv.css({'top':tg.getBoundingClientRect().top-(parseInt(data2.menuDiv.css('height'))-parseInt($(this).parents("div").css('height')))});
            }
            data2.menuDiv.show();
        }
    };

    function actionKey(funcName,controlNum) {
        return this[funcName](controlNum);
    }
    actionKey.prototype={
      insert:function (controlNum) {
          var elDiv = new el_new("form-control controlColumnBlock2", "", "", "div");       //actionType
          var elDiv2 = new el_new("form-control insert-child", "", "insert", "div");
          for (var i = 0; i < controlNum; i++) {
              var labelDiv = new labelAndInput("form-control", "", "", "input", "关联ID:");
              elDiv2.dom.append(labelDiv.labelEl);
              elDiv.dom.append(elDiv2.dom);
          }return elDiv.dom;
      },
      select:function (controlNum) {
          var elDiv = new el_new("form-control controlColumnBlock2", "", "", "div");      //actionType
          var elDivButton=new el_new("form-control btn-group", "", "", "div");
          var elButton=new el_new("btn btn-primary", "b1", "", "button");
          var elButton2=new el_new("btn btn-primary", "b2", "", "button");
          $(elButton.dom).on('click',this.newSelectBlock);
          $(elButton2.dom).on('click',this.newSelectBlock);
          elButton.dom.innerHTML='新索引';
          elButton2.dom.innerHTML='新显示';
          elDivButton.dom.append(elButton.dom);
          elDivButton.dom.append(elButton2.dom);
          for (var i = 0; i < controlNum; i++) {
              var elDiv2 = new el_new("form-control ", "", "select", "div");
              var elDiv2_1=new el_new("form-control select-child", "", "", "div");
              var elDiv2_2=new el_new("form-control select-child", "", "", "div");
              var labelDiv = new labelAndInput("form-control", "", "", "input", "索引ID:");
              var labelDiv_1=new labelAndInput("form-control", "", "", "input", "索引项:");
              var labelDiv2 = new labelAndInput("form-control", "", "", "input", "显示ID:");
              var labelDiv2_1=new labelAndInput("form-control", "", "", "input", "索引项:");
              elDiv2_1.dom.append(labelDiv.labelEl);
              elDiv2_1.dom.append(labelDiv_1.labelEl);
              elDiv2_2.dom.append(labelDiv2.labelEl);
              elDiv2_2.dom.append(labelDiv2_1.labelEl);
              //var br =new el_new("", "", "", "br");
              //elDiv2.dom.append(br.dom);
              elDiv2.dom.append(elDiv2_1.dom);
              elDiv2.dom.append(elDiv2_2.dom);
              elDiv.dom.append(elDiv2.dom);
          }elDiv.dom.append(elDivButton.dom);
          return elDiv.dom;
      },
      update:function (controlNum) {
          var elDiv = new el_new("form-control controlColumnBlock2", "", "", "div");       //actionType
          var elDivButton=new el_new("form-control btn-group", "", "", "div");
          var elButton=new el_new("btn btn-primary", "b1", "", "button");
          var elButton2=new el_new("btn btn-primary", "b2", "", "button");
          $(elButton.dom).on('click',this.newUpdateBlock);
          $(elButton2.dom).on('click',this.newUpdateBlock);
          elButton.dom.innerHTML='新索引';
          elButton2.dom.innerHTML='新录入';
          elDivButton.dom.append(elButton.dom);
          elDivButton.dom.append(elButton2.dom);
          for (var i = 0; i < controlNum; i++) {
              var elDiv2 = new el_new("form-control", "", "update", "div");
              var elDiv2_1=new el_new("form-control update-child", "", "", "div");
              var elDiv2_2=new el_new("form-control update-child", "", "", "div");
              var labelDiv = new labelAndInput("form-control", "", "", "input", "索引ID:");
              var labelDiv2 = new labelAndInput("form-control", "", "", "input", "录入ID:");
              elDiv2_1.dom.append(labelDiv.labelEl);
              elDiv2_2.dom.append(labelDiv2.labelEl);
              // var br =new el_new("", "", "", "br");
              // elDiv2.dom.append(br.dom);
              elDiv2.dom.append(elDiv2_1.dom);
              elDiv2.dom.append(elDiv2_2.dom);
              elDiv.dom.append(elDiv2.dom);
          }elDiv.dom.append(elDivButton.dom);
          return elDiv.dom;
      },
      cancel:function (controlNum) {
          var elDiv = new el_new("form-control controlColumnBlock2", "","", "div");      //actionType
          var elButton=new el_new("btn btn-primary", "b1", "", "button");
          $(elButton.dom).on('click',this.newCancelBlock);
          elButton.dom.innerHTML='新索引';
          for (var i = 0; i < controlNum; i++) {
              var elDiv2 = new el_new("form-control deleted-child", "", "deleted", "div");
              var labelDiv = new labelAndInput("form-control", "", "", "input", "索引ID:");
              elDiv2.dom.append(labelDiv.labelEl);
              elDiv.dom.append(elDiv2.dom);
          }elDiv.dom.append(elButton.dom);
          return elDiv.dom;
      },
      fileUpload:function(controlNum){
        var elDiv = new el_new("form-control controlColumnBlock2", "", "", "div");       //actionType
        for (var i = 0; i < controlNum; i++) {
            var elDiv2 = new el_new("form-control fileUpload-child", "", "fileUpload", "div");
            var labelDiv = new labelAndInput("form-control", "", "", "input", "上传:");
            labelDiv.dom.title='输入ID（如：id）或者类名（如：.class）来对应';
            var labelDiv2 = new labelAndInput("form-control", "", "", "input", "主题:");
            labelDiv2.dom.title='输入ID（如：id）或者类名（如：.class）又或者默认字符串（如："经济"）来对应';
            var labelDiv3 = new labelAndInput("form-control", "", "", "input", "分类:");
            labelDiv3.dom.title='输入ID（如：id）或者类名（如：.class）又或者默认字符串（如："经济"）来对应';
            elDiv2.dom.append(labelDiv.labelEl);
            elDiv2.dom.append(labelDiv2.labelEl);
            elDiv2.dom.append(labelDiv3.labelEl);
            elDiv.dom.append(elDiv2.dom);
        }return elDiv.dom;
      },
      fileSelect:function (controlNum) {
          var elDiv = new el_new("form-control controlColumnBlock2", "", "", "div");       //actionType
          var elDiv2 = new el_new("form-control fileSelect-child", "", "fileSelect", "div");
          for (var i = 0; i < controlNum; i++) {
              var labelDiv = new labelAndInput("form-control", "", "", "input", "关键词:");
              labelDiv.dom.title='输入ID（如：id）或者类名（如：.class）来对应';
              var labelDiv2 = new labelAndInput("form-control", "", "", "input", "主题:");
              labelDiv2.dom.title='输入ID（如：id）或者类名（如：.class）又或者默认字符串（如："经济"）来对应';
              var labelDiv3 = new labelAndInput("form-control", "", "", "input", "分类:");
              labelDiv3.dom.title='输入ID（如：id）或者类名（如：.class）又或者默认字符串（如："经济"）来对应';
              var labelDiv4 = new labelAndInput("form-control", "", "", "select", "点击行为:");
              labelDiv4.dom.title='直接下载文件/打开pdf浏览框';
              select_add(labelDiv4.dom,[{id:1,value:'点击下载'},{id:2,value:'点击打开'},{id:0,value:'点击列出'}],'id','value');
              $(labelDiv4.dom).on('change',{elDiv2:elDiv2},function (e) {
                  var value=$(this).val();
                  var labelDiv,elDiv2=e.data.elDiv2;
                  $(elDiv2.dom).find('.getTheCopyID').parent().remove();
                  if(value==0){
                      labelDiv = new labelAndInput("form-control getTheCopyID", "", "", "input", "显示行ID:");
                      labelDiv.inputType('number');
                      elDiv2.dom.append(labelDiv.labelEl);
                  }else{
                  }
                  elDiv2=null;
              });
              elDiv2.dom.append(labelDiv.labelEl);
              elDiv2.dom.append(labelDiv2.labelEl);
              elDiv2.dom.append(labelDiv3.labelEl);
              elDiv2.dom.append(labelDiv4.labelEl);
              elDiv.dom.append(elDiv2.dom);
          }return elDiv.dom;
      },
      fileUpdate:function (controlNum) {
            var elDiv = new el_new("form-control controlColumnBlock2", "", "", "div");       //actionType
            var elDiv2 = new el_new("form-control fileUpdate-child", "", "fileUpdate", "div");
            for (var i = 0; i < controlNum; i++) {
                var labelDiv = new labelAndInput("form-control", "", "", "input", "关键词:");
                labelDiv.dom.title='输入ID（如：id）或者类名（如：.class）来对应';
                var labelDiv2 = new labelAndInput("form-control", "", "", "input", "文件名:");
                labelDiv2.dom.title='输入ID（如：id）或者类名（如：.class）又或者默认字符串（如："经济"）来对应';
                var labelDiv3 = new labelAndInput("form-control", "", "", "input", "主题:");
                labelDiv3.dom.title='输入ID（如：id）或者类名（如：.class）又或者默认字符串（如："经济"）来对应';
                var labelDiv4 = new labelAndInput("form-control", "", "", "input", "分类:");
                labelDiv3.dom.title='输入ID（如：id）或者类名（如：.class）又或者默认字符串（如："经济"）来对应';
                elDiv2.dom.append(labelDiv.labelEl);
                elDiv2.dom.append(labelDiv2.labelEl);
                elDiv2.dom.append(labelDiv3.labelEl);
                elDiv2.dom.append(labelDiv4.labelEl);
                elDiv.dom.append(elDiv2.dom);
            }return elDiv.dom;
      },
      fileDeleted:function (controlNum) {
            var elDiv = new el_new("form-control controlColumnBlock2", "", "", "div");       //actionType
            var elDiv2 = new el_new("form-control fileDeleted-child", "", "fileDeleted", "div");
            for (var i = 0; i < controlNum; i++) {
                var labelDiv = new labelAndInput("form-control", "", "", "input", "删除索引:");
                labelDiv.dom.title='输入ID（如：id）或者类名（如：.class）来对应';
                elDiv2.dom.append(labelDiv.labelEl);
                elDiv.dom.append(elDiv2.dom);
            }return elDiv.dom;
      },
      showTable:function(controlNum){
          var elDiv = new el_new("form-control controlColumnBlock2", "", "", "div");       //actionType
          var elDiv2 = new el_new("form-control showTable-child", "", "showTable", "div");
          for (var i = 0; i < controlNum; i++) {
              var labelDiv = new labelAndInput("form-control", "", "", "input", "关联ID:");
              elDiv2.dom.append(labelDiv.labelEl);
              elDiv.dom.append(elDiv2.dom);
          }return elDiv.dom;
      },
      showSelect:function (controlNum) {
        var elDiv = new el_new("form-control controlColumnBlock2", "", "", "div");      //actionType
        var elDivButton=new el_new("form-control btn-group", "", "", "div");
        var elButton=new el_new("btn btn-primary", "b1", "", "button");
        var elButton2=new el_new("btn btn-primary", "b2", "", "button");
        $(elButton.dom).on('click',this.newSelectBlock);
        $(elButton2.dom).on('click',this.newSelectBlock);
        elButton.dom.innerHTML='新索引';
        elButton2.dom.innerHTML='新显示';
        elDivButton.dom.append(elButton.dom);
        elDivButton.dom.append(elButton2.dom);
        for (var i = 0; i < controlNum; i++) {
            var elDiv2 = new el_new("form-control ", "", "showSelect", "div");
            var elDiv2_1=new el_new("form-control select-child", "", "", "div");
            var elDiv2_2=new el_new("form-control select-child", "", "", "div");
            var labelDiv = new labelAndInput("form-control", "", "", "input", "索引ID:");
            var labelDiv_1=new labelAndInput("form-control", "", "", "input", "索引项:");
            var labelDiv2 = new labelAndInput("form-control", "", "", "input", "显示ID:");
            var labelDiv2_1=new labelAndInput("form-control", "", "", "input", "索引项:");
            elDiv2_1.dom.append(labelDiv.labelEl);
            elDiv2_1.dom.append(labelDiv_1.labelEl);
            elDiv2_2.dom.append(labelDiv2.labelEl);
            elDiv2_2.dom.append(labelDiv2_1.labelEl);
            //var br =new el_new("", "", "", "br");
            //elDiv2.dom.append(br.dom);
            elDiv2.dom.append(elDiv2_1.dom);
            elDiv2.dom.append(elDiv2_2.dom);
            elDiv.dom.append(elDiv2.dom);
        }elDiv.dom.append(elDivButton.dom);
        return elDiv.dom;
      },
      messageSet:function(controlNum){
          var elDiv0 = new el_new("form-control controlColumnBlock2", "", "", "div");      //actionType
          var elDiv = new el_new("form-control ", "", "messageSet", "div");      //actionType
          var elDiv1 = new el_new("form-control messageCheck", "", "messageCheck", "div");
          var labelDiv_=new labelAndInput("form-control", "", "", "select", "类型:");
          var labelDiv_2=new labelAndInput("form-control", "messageCheckInput","", "select", "输入:");
          var labelDiv_3=new el_new("btn btn-primary", "messageCheckGroup", "", "button");
          var labelDiv_4=new el_new("btn btn-primary", "messageCheckAccept", "", "button");
          labelDiv_3.dom.innerHTML='创建组';
          labelDiv_4.dom.innerHTML='导入组';
          $(labelDiv_2.dom).css({'max-width':'75%'});
          $(labelDiv_2.dom).css({'width':'75%'});
          $(labelDiv_2.dom).attr('multiple','');
          $(labelDiv_2.dom).attr('size','1');
          select_add(labelDiv_.dom,[{name:'系统角色树',value:1},{name:'用户群组',value:2}],'value','name');
          $(labelDiv_.dom).change(function(e){          //更换select
              $('#treePickerUl').hide();
              $('#messageCheckGroup').hide();
              $('#messageCheckAccept').hide();
              $('#messageCheckInput').empty();
              if($(e.target).val()==1) {
                  var treepicker_ = new treepicker('#treePickerUl');
                  $('#treePickerUl').show();
                  $('#messageCheckGroup').show();
                  treepicker_.roles.makeCallback({
                      onCheck:function(){
                          $('#messageCheckInput').empty();
                          var t=treepicker_.getInstance().getCheckedNodes();
                          var mCheckGroup=new groupRelative(treepicker_);
                          var userList=[];
                          for(var i in t){
                              t[i]=t[i]['nodeCode'];
                              userList=userList.concat(mCheckGroup.getTargetUser(t[i]));
                          };
                          select_add($('#messageCheckInput'),userList);
                      }
                  })
              }else{
                  var treepicker_ = new treepicker('#treePickerUl');
                  var mCheckGroup = new groupRelative(treepicker_);
                  var grouplist = mCheckGroup.getGroupAjax();
                  select_add($('#messageCheckInput'),grouplist,'id','groupname');
                  $('#messageCheckAccept').show();
              }
              console.log(treepicker_);
          });
          $(labelDiv_3.dom).click(function(e){
              var mCheckGroup=new groupRelative();
              var result=mCheckGroup.getSelected($('#messageCheckInput'));
              var str= prompt('请输入组名');
              mCheckGroup.setGroup(str,result);
          });
          $(labelDiv_4.dom).click(function(e){
              var mCheckGroup=new groupRelative();
              var result=mCheckGroup.getSelected($('#messageCheckInput'));
              var userList=mCheckGroup.getUserAjax(result);
              $('#messageUserList').val(JSON.stringify(userList));
          });
          var elDiv2 = new el_new("form-control messageSet", "", "messageSet", "div");
          var labelDiv = new labelAndInput("form-control", "messageUserList", "", "input", "接收人:");
          labelDiv.dom.title='接收人限制 -> 所有人：[空] ; 按用户类型群发：用户类型码; 限制某用户类型下可选：@用户类型码; 限制只可发送某用户：用户编码 ';
          var labelDiv2 = new labelAndInput("form-control", "", "", "input", "题目:");
          labelDiv2.dom.title='默认的信息题目 -> 空则为可填';
          var labelDiv3 = new labelAndInput("form-control", "", "", "input", "网址:");
          labelDiv3.dom.title='默认的发送网址 -> 空则为可填';
          elDiv1.dom.append(labelDiv_.labelEl);
          elDiv1.dom.append(labelDiv_2.labelEl);
          elDiv1.dom.append(labelDiv_3.dom);
          elDiv1.dom.append(labelDiv_4.dom);
          $(labelDiv_4.dom).hide();
          elDiv2.dom.append(labelDiv.labelEl);
          elDiv2.dom.append(labelDiv2.labelEl);
          elDiv2.dom.append(labelDiv3.labelEl);
          $(elDiv.dom).html('<div id="treePicker" class="floatClearBoth fitContent"> <ul id="treePickerUl" class="ztree"> </ul> </div>');
          elDiv.dom.append(elDiv1.dom);
          elDiv.dom.append(elDiv2.dom);
          elDiv0.dom.append(elDiv.dom);
          $(elDiv2.dom).find('label').css({'width':'100%'});
          $(elDiv2.dom).find('input').css({'max-width': '29em','width': '30em'});
          return elDiv0.dom;
      },
      showView:function(controlNum){
          var elDiv = new el_new("form-control controlColumnBlock2", "", "", "div");
          var elDiv2 = new el_new("form-control showView-child", "", "showView", "div");
          for (var i = 0; i < controlNum; i++) {
              var labelDiv = new labelAndInput("form-control ", "", "", "input", "触发行数:");
              labelDiv.inputType('number');
              var labelDiv2 = new labelAndInput("form-control", "", "", "select",'触发模式:');
              select_add(labelDiv2.dom,[{name:'显示隐藏',value:0},{name:'隐转显',value:1},{name:'显转隐',value:2}],'value','name');
              $(labelDiv.dom).on('keypress',function(e){
                  if(e.keyCode!=13){
                      return false;
                  }else{
                      var val=$(e.target).val();
                      var parent=$('.showView-child');
                      parent.find('.showView').remove();
                      var elDivV = new el_new("form-control showView ", "", "", "div");
                      for(var i=0;i<parseInt(val);i++){
                          let labelDivV = new labelAndInput("form-control ", "", "", "input", "行ID输入:");
                          $(labelDivV.labelEl).css({'width':'100%'});
                          elDivV.dom.append(labelDivV.labelEl);
                      }
                      parent.append(elDivV.dom);
                      console.log(e);
                  }
              });
              elDiv2.dom.append(labelDiv2.labelEl);
              elDiv2.dom.append(labelDiv.labelEl);
              elDiv.dom.append(elDiv2.dom);
          }return elDiv.dom;
      },
      printAct:function(controlNum){
          var elDiv = new el_new("form-control controlColumnBlock2", "", "", "div");
          var elDiv2 = new el_new("form-control printAct-child", "", "printAct", "div");
          for (var i = 0; i < controlNum; i++) {
              var labelDiv = new labelAndInput("form-control ", "", "", "input", "触发行数:");
              labelDiv.inputType('number');
              var labelDiv2 = new labelAndInput("form-control", "", "", "select",'触发模式:');
              select_add(labelDiv2.dom,[{name:'打印HTML',value:0},{name:'打印表格',value:1}],'value','name');
              $(labelDiv.dom).on('keypress',function(e){
                  if(e.keyCode!=13){
                      return false;
                  }else{
                      var val=$(e.target).val();
                      var parent=$('.printAct-child');
                      parent.find('.printAct').remove();
                      var elDivV = new el_new("form-control printAct", "", "", "div");
                      for(var i=0;i<parseInt(val);i++){
                          let labelDivV = new labelAndInput("form-control ", "", "", "input", "行ID输入:");
                          $(labelDivV.labelEl).css({'width':'100%'});
                          elDivV.dom.append(labelDivV.labelEl);
                      }
                      parent.append(elDivV.dom);
                      console.log(e);
                  }
              });
              elDiv2.dom.append(labelDiv2.labelEl);
              elDiv2.dom.append(labelDiv.labelEl);
              elDiv.dom.append(elDiv2.dom);
          }return elDiv.dom;
      },
      rowCopy:function (controlNum) {
          var elDiv = new el_new("form-control controlColumnBlock2", "", "", "div");
          var elDiv2 = new el_new("form-control rowCopy-child", "", "rowCopy", "div");
          for (var i = 0; i < controlNum; i++) {
              var labelDiv = new labelAndInput("form-control changeRowCopy", "", "", "input", "复制个数:");
              labelDiv.inputType('number');
              var labelDiv2 = new labelAndInput("form-control", "", "", "select",'复制模式:');
              select_add(labelDiv2.dom,[{name:'次数复制',value:1},{name:'关联复制',value:2}],'value','name');
              $(labelDiv2.dom).on('change',{elDiv2:elDiv2},this.changeRowCopy);
              elDiv2.dom.append(labelDiv2.labelEl);
              elDiv2.dom.append(labelDiv.labelEl);
              elDiv.dom.append(elDiv2.dom);
          }return elDiv.dom;
      },
      showCopy:function () {

      },
      changeRowCopy:function(e){
          $('.rowCopy-child .changeRowCopy').parents('label').remove();
          var value=$(this).val();
          var labelDiv2,labelDiv,elDiv2=e.data.elDiv2;
          if(value==1){
              labelDiv = new labelAndInput("form-control changeRowCopy", "", "", "input", "复制个数:");
              labelDiv.inputType('number');
          }else if(value==2){
              labelDiv2 = new labelAndInput("form-control changeRowCopy", "", "", "input", "索引ID:");
              elDiv2.dom.append(labelDiv2.labelEl);
              $(labelDiv2.dom).on('blur',function () {
                  $('.tableRowCopy').empty();
                  var arr=[],storage;
                  try {
                      storage= JSON.parse(sessionStorage.getItem($(this).val()));
                  }catch (ex){
                      storage= null;
                      console.log(ex);
                  }
                  for(var i=0;i<=storage.data.length;i++){
                      arr[i]=(i==storage.data.length)?{
                          name:'table×table',
                          value:'all'
                      }:{
                          name:storage.data[i].tableName+'('+storage.data[i].fieldName+')',
                          value:storage.data[i].tableName
                      }
                  }
                  select_add($('.tableRowCopy'),arr,'value','name');
              });
              labelDiv = new labelAndInput("form-control changeRowCopy tableRowCopy", "", "", "select", "索引表:");

          }
          elDiv2.dom.append(labelDiv.labelEl);
          elDiv2=null;
      },
      newSelectBlock:function () {
          var container=$('.select-child');
          if($(this).attr("id")=='b1'){
              var labelDiv = new labelAndInput("form-control", "", "", "input", "索引ID:");
              var labelDiv_1=new labelAndInput("form-control", "", "", "input", "索引项:");
              container[0].append(labelDiv.labelEl);
              container[0].append(labelDiv_1.labelEl);
          }else{
              var labelDiv2 = new labelAndInput("form-control", "", "", "input", "显示ID:");
              var labelDiv2_1=new labelAndInput("form-control", "", "", "input", "索引项:");
              container[1].append(labelDiv2.labelEl);
              container[1].append(labelDiv2_1.labelEl);
          }
      },
      newUpdateBlock:function () {
        var container=$('.update-child');
        if($(this).attr("id")=='b1'){
            var labelDiv = new labelAndInput("form-control", "", "", "input", "索引ID:");
            container[0].append(labelDiv.labelEl);
        }else{
            var labelDiv2 = new labelAndInput("form-control", "", "", "input", "录入ID:");
            container[1].append(labelDiv2.labelEl);
        }
      },
      newCancelBlock:function () {
          var container=$('.deleted-child');
          var labelDiv = new labelAndInput("form-control", "", "", "input", "索引ID:");
          container[0].append(labelDiv.labelEl);
      }
    };

    function showControl() {
    }
    showControl.prototype={
        funcPack:{
            htmlData:function (obj) {
                console.log(obj.style.width);
              var str='ID:'+$(obj).attr('id')+'\n';
              console.log($(obj).attr('class'));
              var objClass=(function (obj,Regx) {
                    var feedback='';
                    if($(obj).find('.rightControlSet')&&$(obj).hasClass('td')){
                        obj=$(obj).find('.rightControlSet');
                    }
                    try {
                        feedback=$(obj).attr('class').match(Regx)[0];
                        return feedback.replace(/-rowClass/,'');
                    }catch (ex){
                        return '未定义';
                    }
                })(obj,/\S+-rowClass\b/);
              str=str+'类名:'+objClass+'\n\n外观信息:\n';
              str=str+'宽:'+(obj.style.width||obj.clientWidth+'px')+', 高:'+(obj.style.width||obj.clientHeight+'px')+';\n';
              str=str+'标签类型:'+obj.tagName+', 类型:'+obj.type+', 内容长度:'+(obj.max||obj.maxlength)+';\n';
              str=str+'内部数值:'+$(obj).attr('value')+';\n';
              str=str+'是否可写:'+(obj.readOnly?'是':'否')+';\n';
              return str;
            },
            data:function (obj) {
                var str='控件关联:\n';
                for(var i=0;i<obj.length;i++){
                    if(obj[i].foreign){
                        str=str+'表格:'+obj[i].tableName+'; 字段:';
                        for(var j=0;j<obj[i].fieldName.length;j++){
                            str=str+obj[i].fieldName[j]+',';
                        }
                        str=str+'\n';
                    }else {
                        str=str+'表格:'+obj[i].tableName+'; 字段:'+obj[i].fieldName+';\n';
                    }
                }return str;
            },
            action:function (arr) {
                var str='绑定控件:\n';
                for(var i=0;i<arr.length;i++){
                    switch (arr[i].actionType){
                        case 'insert':{
                            str=str+' 插入=>\n';
                            for(var j=0;j<arr[i].length;j++){
                                str=str+'  控件关联:'+arr[i][j]+'\n';
                            }
                        }break;
                        case 'select':{
                            arr[i]=jsonConstruct.prototype.constructSolute.changeFormal(arr[i]);
                            str=str+' 查询=>\n';
                            for(var j=0;j<arr[i].length;j++){
                                if(arr[i][j].actionType=='out'){
                                    str=str+'  索引表:'+arr[i][j][0]+', 索引字段:'+arr[i][j][1]+'\n';
                                }else {
                                    str=str+'  显示表:'+arr[i][j][0]+', 显示字段:'+arr[i][j][1]+'\n';
                                }
                            }
                        }break;
                        case 'update':{
                            arr[i]=jsonConstruct.prototype.constructSolute.changeFormal(arr[i]);
                            str=str+' 更新=>\n';
                            for(var j=0;j<arr[i].length;j++){
                                if(arr[i][j].actionType=='out'){
                                    str=str+'  索引字段控件:'+arr[i][j][0]+'\n';
                                }else {
                                    str=str+'  修改字段控件:'+arr[i][j][0]+'\n';
                                }
                            }
                        }break;
                        case 'deleted':{
                            str=str+' 删除=>\n';
                            for(var j=0;j<arr[i].length;j++){
                                str=str+'  控件关联:'+arr[i][j]+'\n';
                            }
                        }break;
                        case 'showTable':{
                            str=str+' 表格=>\n';
                            for(var j=0;j<arr[i].length;j++){
                                str=str+'  控件关联:'+arr[i][j]+'\n';
                            }
                        }break;
                        case 'showSelect':{
                            str=str+' 显示=>\n';
                            // for(var j=0;j<arr[i].length;j++){
                            //     str=str+'控件关联:'+arr[i][j]+'\n';
                            // }
                            str=str+'  索引关联:'+arr[i][0][0]+'\n';
                            str=str+'  显示关联:'+arr[i][1][0]+'\n';
                        }break;
                        default:{}
                    }
                }return str;
            }
        },
        funcRun:function (tg,tgObj) {
            console.log(tgObj);
            var String='';
            String=String+showControl.prototype.funcPack.htmlData(tgObj[0]);
            String=String+'\n';
            var obj=globalStorage.controlInform[tg];
            if(obj&&obj.data){
                String=String+showControl.prototype.funcPack.data(obj.data);
            }
            String=String+'\n';
            if(obj&&obj.action){
                String=String+showControl.prototype.funcPack.action(obj.action);
            }return String+'\n';
        }
    }
    function groupRelative(tree){

    }
    groupRelative.prototype={
        instantUserList:[],
        instantGroupUserList:[],
        getTargetUser:function(nodeCode){
            var result=[];
            $.ajax({
                url:'http://119.23.253.225:8080/hzl-iomp/messageController/getTargetUser',
                type:'POST',
                data:JSON.stringify({
                    roleCode:nodeCode
                },null,4),
                contentType: 'application/json',
                async:false,
                success:function(recieve){
                    if(recieve.success&&recieve.msg.indexOf("成功")){
                        // alert(recieve.msg);
                        result=recieve.obj;
                    }else{
                        alert("获取失败!");
                    }
                }
            });
            return result;
        },
        setGroupAjax:function(groupName,userList){
            $.ajax({
                url:'http://119.23.253.225:8080/hzl-iomp/messageController/setGroup',
                type:'POST',
                data:JSON.stringify({
                    groupName:groupName,
                    userList:userList
                },null,4),
                contentType: 'application/json',
                async:false,
                success:function(recieve){
                    if(recieve.success&&recieve.msg.indexOf("成功")){
                        alert(recieve.msg);
                    }else{
                        alert("设定失败!");
                    }
                }
            });
        },
        getGroupAjax:function(){
            var result=[];
            $.ajax({
                url:'http://119.23.253.225:8080/hzl-iomp/messageController/getAllGroup',
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
        getUserAjax:function(idList){
            var results=[];
            for(var i in idList) {
                $.ajax({
                    url: 'http://119.23.253.225:8080/hzl-iomp/messageController/getGroupUser',
                    type: 'POST',
                    data: JSON.stringify({
                        groupId: parseInt(idList[i])
                    }),
                    contentType: 'application/json',
                    async: false,
                    success: function (recieve) {
                        if (recieve.success && recieve.msg.indexOf("成功")) {
                            // alert(recieve.msg);
                            results=results.concat(recieve.obj);
                        } else {
                            alert("获取失败!");
                        }
                    }
                });
            }return this.instantGroupUserList=results;
        },
        testGroupAjax:function(groupName){
            var type=null;     //结果返回
            $.ajax({
                url:'http://119.23.253.225:8080/hzl-iomp/messageController/testGroup',
                type:'POST',
                data:JSON.stringify({
                    groupName:groupName
                }),
                contentType: 'application/json',
                async:false,
                success:function(recieve){
                    type=recieve.obj;
                },
                error:function(ex){
                    alert('查询失败！');
                }
            });
            return type;
        },
        getSelected:function(selector){
            selector=$(selector);
            var selectorArr=selector.find('option');
            var c=[];
            for(var i in selectorArr){
                if(selectorArr[i].selected){
                    c.push($(selectorArr[i]).val());
                }
            }
            return c;
        },
        getCheckedNodes:function(tree){
            var tree = new treepicker();
            this.instantUserList=tree.getCheckedEndNodes();
            var realUserList=[];
            for(var i in this.instantUserList){
                realUserList[i]=this.instantUserList[i]['nodeCode']
            }
        },
        setGroup:function(groupName,userList){
            if(!this.testGroupAjax(groupName)){
                this.setGroupAjax(groupName,userList);
            }else{
                return false;
            }
        }
    };
    function treepicker(inputDom,nodes,setting) {
        this.roles = new rolesRelative(inputDom, setting || {
            view: {
                showLine: false,
                showIcon: false,
                selectedMulti: false,
                dblClickExpand: false,
                addDiyDom:function(treeId, treeNode) {
                    var spaceWidth = 10;
                    var switchObj = $("#" + treeNode.tId + "_switch");
                    if (treeNode.level >= 1) {
                        var spaceStr = "<span style='display: inline-block;width:" + (spaceWidth * treeNode.level)+ "px'></span>";
                        switchObj.before(spaceStr);
                    }
                }
            },
            data: {
                key: {
                    name: "nodeName",
                    children:"children",
                    isParent: "parent"
                },
                simpleData: {
                    enable: false,
                }
            },
            check: {
                enable: true,
                chkStyle: "checkbox",
                chkboxType: { "Y": "", "N": "" }
            },
            callback: {
            }
        }, nodes);
        this.html.show();
    }
    treepicker.prototype={
        html:$('#treePicker'),
        getInstance:function(){     //获得ztree树类实例
            return this.roles.getInstance();
        },
        getCheckedEndNodes:function(){     //获取该树的子节点
            return this.roles.getInstance().getCheckedNodes().filter(function(nodes){
                return !nodes.children||!nodes.parent;
            })
        }
    };
//-------------事件函数---------------
document.oncontextmenu=function () {
    if($("#myModal").css("display")!="none"||$("body").hasClass("modal-open")){
        return false;
    }else {
        return true;
    }
};
$(".menu_heading").on("click",menuHeadClick);
$('.htmlShowDestination').on('change',stringSelectAll)
$(".span12 li[data-target='#myModal']").on('click',menuTableClick);
//$(".table-btn").on("click",menuSubmit);
$("#submitWebsiteBtn .localUpload").on("click",websiteSubmitBtn);
$("#submitWebsiteBtn .timeStampUpload").on("click",function(e){
    var tg=$(e.target);
    $("#dlg > div").empty();
    var modalDiv=$("#dlg > div");
    var labeldiv=new labelAndInput("form-control","websiteUploadDescription","","input","页面标识:");
    $(labeldiv.dom).css({'width':'80%','max-width':'80%'});
    $(labeldiv.labelEl).css({'width':'80%'});
    var labeldiv0=new el_new("form-control","websiteUploadDestination","","select");
    select_add(labeldiv0.dom,[{id:'MSM',value:'营销管理平台MSM'},{id:'TPM',value:'目标与计划管理系统TPM'},{id:'HRM',value:'人力资源管理系统'}],'id','value');
    $(labeldiv0.dom).css({'width':'20%','float':'right'});
    var labeldiv1=new labelAndInput("form-control","websiteUploadUserCode","","input","用户编码:");
    $(labeldiv1.dom).css({'width':'70%','max-width':'100%'});
    $(labeldiv1.dom).val('default');
    $(labeldiv1.labelEl).css({'width':'50%'});
    // var labeldiv2=new el_new('form-control','websiteUploadUserCodePush','','button');
    // labeldiv2.dom.innerHTML="删除";
    // $(labeldiv2.dom).css({'width':'20%','float':'right'});
    var labeldiv3=new labelAndInput('form-control','websiteUploadUserCodeSelect','','select',"解锁网页:");
    // labeldiv3.dom.innerHTML="新增";
    $(labeldiv3.dom).on('click','option',function () {
            var o=new htmlVersionClass();
            globalStorage.iframeVal=$(this).val();
            var path=o.select('fileName',$(this).val());
            $(document.getElementById("iframe")).attr('src',path);
            globalStorage.htmlShow.iframeSrc=path;
            sessionStorage.setItem('globalStorage',JSON.stringify(globalStorage));
            sessionStorage.setItem('jsStr',JSON.stringify(getJsAjax(globalStorage.iframeVal)));
            location.reload();
    });
    $(labeldiv3.dom).css({'width':'70%','max-width':'100%'});
    $(labeldiv3.labelEl).css({'width':'50%','float':'right'});
    modalDiv[0].append(labeldiv.labelEl);
    modalDiv[0].append(labeldiv0.dom);
    modalDiv[1].append(labeldiv1.labelEl);
    // modalDiv[1].append(labeldiv2.dom);
    modalDiv[1].append(labeldiv3.labelEl);
    $(modalDiv[2]).html('<ul id="tree" class="ztree" style="width:100%; overflow:auto;"></ul>');
    var tree=new rolesRelative('#tree');
    tree.makeCallback({
       onClick:function(event, treeId, treeNode){
           $('#websiteUploadUserCode').val(treeNode.nodeCode);
           console.log(treeNode.nodeCode);
           var pageObj=new htmlVersionClass();
           pageObj.flashHtml($('#websiteUploadUserCodeSelect'),treeNode.nodeCode);
       }
    });
    $(".modal-footer>#rightControlBtn").off("click").on("click",websiteSubmitTimeStamp);
    $("#dlg2").hide();
    $('#dlg').show();
});
$('#submitWebsiteBtn .deleteUpload').on('click',function (e) {
    var val=$('.htmlShow').val();
    var obj={
        deletelist:[val]
    };
    if(val.indexOf('client')>=0||confirm('删除选中页面')!=true){
        alert('请勿删除重要页面！');
    }else {
        deleteUploadAjax(obj);
    }
});
$(".back").on("click",function () {
    $(".modal-body").hide();
    $("#dlg").show();
});
// FContent.window.oncontextmenu = contextMenuRightControl;
$(FContent.window).on('mousedown',function (event) {
    console.log($(event.target).parents(".menuDiv"));
    if($(event.target).parents(".menuDiv").length){
        return;
    }else {$(".menuDiv").hide();}
});
$('.htmlShow').on('click','option',function () {
    var o=new htmlVersionClass();
    globalStorage.htmlShow.iframeVal=$(this).val();
    var path=o.select('fileName',$(this).val());
    $(document.getElementById("iframe")).attr('src',path);
    globalStorage.htmlShow.iframeSrc=path;
    // sessionStorage.setItem('iframeVal',JSON.stringify($(this).val()));
    // sessionStorage.setItem('iframeSrc',JSON.stringify(path));
    sessionStorage.setItem('globalStorage',JSON.stringify(globalStorage));
    sessionStorage.setItem('jsStr',JSON.stringify(getJsAjax(globalStorage.htmlShow.iframeVal)));
    location.reload();
});

$('.htmlShowRole').on('click','option',function(){
   var o = new htmlVersionClass();
   o.setSelect($(this).val());
});

$(FContent.window).mouseover(function (e) {
    var tg=$(e.target);
    if(tg.hasClass('rightControlRow')||tg.parents('.rightControlRow').length){
        tg=tg.hasClass('rightControlRow') ? tg : tg.parents('.rightControlRow');
        tg.css({'background-color':'#e5e5e5'});
        tg = $(e.target);
        tg=tg.hasClass('td') ? tg : tg.parents('.td');
        if(tg.hasClass('formTd')){
            tg.css({'background-color':'#a2c29b'});
        }else{
            tg.css({'background-color':'#cccccc'});
        }
    }
}).mouseout(function (e) {
    var tg = $(e.target);
    if(tg.hasClass('rightControlRow')||tg.parents('.rightControlRow').length) {
        tg = tg.hasClass('rightControlRow') ? tg : tg.parents('.rightControlRow');
        tg.css({'background-color': '#ffffff'});
        tg = $(e.target);
        tg=tg.hasClass('td') ? tg : tg.parents('.td');
        tg.css({'background-color': 'inherit'});
    }
});
var doitAll=new doit();
doitAll.getControlInform();
doitAll.getControlInformObj();
stringSelectAll();

//-------------非ajax函数-------------
var clickFunc = function (e) {                     //菜单事件函数
    var tg=$(e.target);
    testing.menuClick=tg.attr("id");
    var funcPack=new indexOfFunc();
    funcPack.doFunctionArr(testing.menuClick);
    var list=['deleteSet','copyRelation','pasteRelation','copyStyle','pasteStyle','instanceSet','formDivSet'];
    if($.inArray(tg.attr('id'),list)>=0){

    }else {
        $("#myModal").modal('show');
        $(".modal-header>strong").html($(testing.target).attr('id'));
    }
    $("#dlg").hide();
    $("#dlg2").show();
    $(".menuDiv").hide();
};
function objInArray(obj,array) {
    for(var i=0 ;i<array.length;i++){
        if(isEqual(obj,array[i])){
            return true;
        }
    }return false;
}
function isEqual(a,b){
    //如果a和b本来就全等
    if(a===b){
        //判断是否为0和-0
        return a !== 0 || 1/a ===1/b;
    }
    //判断是否为null和undefined
    if(a==null||b==null){
        return a===b;
    }
    //接下来判断a和b的数据类型
    var classNameA=toString.call(a),
        classNameB=toString.call(b);
    //如果数据类型不相等，则返回false
    if(classNameA !== classNameB){
        return false;
    }
    //如果数据类型相等，再根据不同数据类型分别判断
    switch(classNameA){
        case '[object RegExp]':
        case '[object String]':
            //进行字符串转换比较
            return '' + a ==='' + b;
        case '[object Number]':
            //进行数字转换比较,判断是否为NaN
            if(+a !== +a){
                return +b !== +b;
            }
            //判断是否为0或-0
            return +a === 0?1/ +a === 1/b : +a === +b;
        case '[object Date]':
        case '[object Boolean]':
            return +a === +b;
    }
    //如果是对象类型
    if(classNameA == '[object Object]'){
        //获取a和b的属性长度
        var propsA = Object.getOwnPropertyNames(a),
            propsB = Object.getOwnPropertyNames(b);
        if(propsA.length != propsB.length){
            return false;
        }
        for(var i=0;i<propsA.length;i++){
            var propName=propsA[i];
            //如果对应属性对应值不相等，则返回false
            if(a[propName] !== b[propName]){
                return false;
            }
        }
        return true;
    }
    //如果是数组类型
    if(classNameA == '[object Array]'){
        if(a.toString() == b.toString()){
            return true;
        }
        return false;
    }
}

function select_add(select,select_array,key1,key2){                 //到时修改select_array
    if(!key1&&!key2){
        for(var i in select_array){
            select.append(new Option(select_array[i],select_array[i]));
        }
    }else{
        for(var i in select_array){
            select.append(new Option(select_array[i][key2],select_array[i][key1]));
        }
    }
}
function selectTitle(select,select_array,key1,title) {
    var arr=$(select).find('option'),selectArr={};
    for(var j in select_array){
        selectArr[select_array[j][key1]]=select_array[j];
    }
    for(var i=0 ;i<arr.length;i++){
        $(arr[i]).attr('title',selectArr[$(arr[i]).val()][title]);
    }
}
function websiteSubmitBtn(e) {
    var tg=$(e.target);
    $("#dlg > div").empty();
    var modalDiv=$("#dlg > div");
    var labeldiv=new labelAndInput("form-control","websiteUploadNum","","input","上传个数:");
    labeldiv.inputType("number");
    labeldiv.dom.addEventListener("keypress",showSubmitForm);
    modalDiv[0].append(labeldiv.labelEl);
    $(".modal-footer> #rightControlBtn").off("click",menuSubmit);
}
function websiteSubmitTimeStamp(e) {
    $(this).attr('disabled',true);
    doitAll.removeControlInform();
    var date=new Date();
    var valueName=(globalStorage.htmlShow.iframeSrc.indexOf('client_index') != -1)?'client_index':JSON.stringify(date.getTime());
    var htmlStr=$(FContent.window.document.getElementsByTagName('html')).prop('outerHTML').replace(/(\.\.\/)+\w+(\.js)/g,'lechangbpm666');
    data={
        html: {
            name:valueName,
            content: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">'
            +htmlStr,
            description:$("#websiteUploadDescription").val(),
            role:$('#websiteUploadUserCode').val(),
            destination:$('#websiteUploadDestination').val()
        },
        js:{
            name:valueName+'js',
            content:'$(document).ready(function(){ //[removeRow]\n' +
            ''+jsStr + '\n' +
            '});//[removeRow]\n' +
            '//controlInform='+JSON.stringify(globalStorage.controlInform) +'//controlInformEnd\n'
        }
    };
    console.log(data);
    fileStringUpload(data);
}
function showSubmitForm(e) {
    var tg=$(e.target);
    var num = tg.val();
    var modalDiv=$("#dlg>div");
    $("#rightControlBtn").off("click");
    if(e.keyCode==13&&num>0) {
        var formDiv=new el_new("form-control","formDiv","","form");
        for(;num;num--){
            var el=new el_new("btn-primary inputUpload","","file","input");
            el.inputType("file");
            formDiv.dom.append(el.dom);
            console.log(el.dom);
        }
        modalDiv[1].append(formDiv.dom);
        $("#rightControlBtn").on("click",fileUploadAjax);
    }
    $("#dlg").show();
}
function menuHeadClick(e) {
	var tg=$(e.target);
	if(tg.prop("tagName")!="I"&&tg.parentsUntil(".menu_heading")){
	}else if(tg.parentsUntil(".menu_heading")){
		var active=$("#menu_table div:visible");
		console.log(active.next());                                                      //对象验证，可删
		if(tg.hasClass("fa-chevron-circle-right")&&active.next().length!=0){
            active.next().css({"display":"block"});
            active.css({"display":"none"});
		}else if(tg.hasClass("fa-chevron-circle-left")&&active.prev().length!=0){
            active.prev().css({"display":"block"});
            active.css({"display":"none"});
		}
	}
}
function menuTableClick(e) {
	var tg=$(e.target);
	var index=$(".span12 li[data-target]").index(tg.parent());
	console.log(tg);
	if(tg.prop("tagName")!="A"&&tg.parentsUntil(".span12")){
	}else if(tg.parentsUntil(".span12")){
        $("#dlg > div").empty();
        showTablesAjax();
        switch (index){
            case 0:modalAction_0(tg);
                submitIndex=0;
                break;
            case 1:modalAction_1(tg);
                submitIndex=1;
                break;
            case 2:modalAction_2(tg);
                submitIndex=2;
                break;
            case 3:modalAction_3(tg);
                submitIndex=3;
                break;
            case 4:modalAction_4(tg);
                submitIndex=4;
                break;
        }
	}
}
function modalAction_0(e) {
	var tg=e;
}
function modalAction_1(e) {
	var tg=e;
}
function modalAction_2(e) {
	var tg=e||$(window.event.target);
	var modalDiv=$("#dlg > div");
	var labeldiv=new labelAndInput("form-control","label","label","input","层级数量:");
	labeldiv.inputType("number");
	labeldiv.dom.addEventListener("keypress",leftTreeNodeSet);
	//select_add(labeldiv.dom,data.list,'id','tableName');
	modalDiv[0].append(labeldiv.labelEl);
	/*
	var labeldiv2=new labelAndInput("form-control","","","select","节点索引:");
    select_add(labeldiv2.dom,dataFieldRecieve.list,'fieldName','content');

	var labeldiv3=new labelAndInput("form-control","","","select","节点名称:");
    select_add(labeldiv3.dom,dataFieldRecieve.list,'fieldName','content');

	modalDiv[1].append(labeldiv2.labelEl);
	modalDiv[1].append(labeldiv3.labelEl);
    */
	var labeldiv4=new labelAndInput("form-control","","","input","分行数量:");
	labeldiv4.inputType("number");
	console.log();
    console.log(labelAndInput.prototype.isPrototypeOf(labeldiv4));
    labeldiv4.labelEl.addEventListener("keypress",secondTreeBlur);
	modalDiv[2].append(labeldiv4.labelEl);

	/*var height=0;
    modalDiv=$("#dlg > div");
	for(var i=0;i<modalDiv.length;i++){
		height+=39;
		console.log(modalDiv[i]);//+" "+modalDiv[i].clientHeight
	}
	$("#dlg").css({"height":height+"px"});*/
}
function modalAction_3(e) {
	var tg=e;
}
function modalAction_4(e) {
	var tg=e;
}
function leftTreeNodeSet(e) {
    var tg=$(e.target);
    var modalDiv=$("#dlg>div");
    $(modalDiv[1]).empty();
    var num=tg.val();
    if(e.keyCode==13&&num>0){
        for(;num>0;num--){
            var divBlock=new el_new("leftTreeNodeSet","","","div");
            var labelDiv=new labelAndInput("form-control leftTreeTable","","","select","关联表例");
            select_add(labelDiv.dom,data.list,"id","tableName");                                        //把data.list改了去！！！！！！！！！！！！！！
            var labelDiv2=new labelAndInput("form-control leftTreeField","","","select","关联字段");
            //select_add(labelDiv2.dom,dataFieldRecieve,"fieldName","content");
            labelDiv.dom.addEventListener("change",showTablesSelect);
            divBlock.dom.append(labelDiv.labelEl);
            divBlock.dom.append(labelDiv2.labelEl);
            modalDiv[1].append(divBlock.dom);
        }
    }
}
function secondTreeBlur(e) {
	var tg=$(e.target);
	if(e.keyCode==13) {
        console.log("high");
        var modalDiv=$("#dlg > div");
        $(modalDiv[3]).empty();
        for(var i=0;i<tg.val();i++){
        	var labeldiv1=new labelAndInput("form-control","controlRowNum","","input","对齐分区:");
            labeldiv1.inputType("number");
        	var labeldiv2=new labelAndInput("btn","","","button","详细设置:");
            labeldiv2.dom.innerHTML="转到>>";
            labeldiv2.dom.addEventListener("click",controlRowDiv);
            var div1=new el_new("col-sm-12 controlRowSet","","","div");
            div1.appendStyle("padding:0px");
            div1.dom.append(labeldiv1.labelEl);
            div1.dom.append(labeldiv2.labelEl);
            modalDiv[3].append(div1.dom);
		}
    }
}
function menuSubmit(e) {
    var tg=$(e.target);
    //console.log(submitIndex);
    switch (submitIndex){
        case 0:menuSubmitAction0(tg);
        break;
        case 1:menuSubmitAction1(tg);
        break;
        case 2:menuSubmitAction2(tg);
        break;
        case 3:menuSubmitAction3(tg);
        break;
        case 4:menuSubmitAction4(tg);
        break;
    }
}
function menuSubmitAction0(tg) {

}
function menuSubmitAction1(tg) {

}
function menuSubmitAction2(tg) {
    /*var modalDiv=$('#dlg > div ');
    console.log($(modalDiv[3]).children().length);
    var designSubmit={
        tableId:$(modalDiv[0]).find("select").val(),
        sortField:$(modalDiv[1]).find("select:eq(0)").val(),
        nameField:$(modalDiv[1]).find("select:eq(1)").val(),
        secondMenu:secondMenuArray($(modalDiv[3]).children())
    }*/
    var modalDiv=$('#dlg2>div:eq(1)>div');
    if(modalDiv.length){
       for(var i in modalDiv){
         showBlock(modalDiv[i]);
       }
    }
}
function showBlock() {
    //var divBlock=$(arguments[0]);
    //var frameDoc=frames[0].window.document.getElementsByClassName("right-control");
    /*switch (divBlock.children("#controlColumnType").val()){
        case '1':{
            /*var div=frameDoc.createElement("button");
            var div2=frameDoc.getElementsByClassName("right-control");
            div2.append(div);
        }
    }*/
}
    function secondMenuArray(arg) {
        var arr=[];
        for(var i=0;i<arg.length;i++) {
            var obj = {
                id:arg[i].find("input:eq(0)").val(),
                name:arg[i].find("input:eq(1)").val(),
                type:arg[i].find("select").val()
            };
            arr.push(obj);
        }
        
    }
function menuSubmitAction3(tg) {

}
function menuSubmitAction4(tg) {

}
function showTablesSelect(e) {
    console.log("yes");
    var tableId=$(this).val();
    if(!showTableField(tableId)){                //把非给删去！！！！！！！！！！！！！
        var select=$(this).parents(".leftTreeNodeSet").find(".leftTreeField");
        console.log(select);
        select_add(select,dataFieldRecieve.list,"fieldName","content");             //把list给删去！！！！！！！！！！
    }else {
    }
}
function controlRowDiv(e){
    var tg=$(e.target);
    var modalDiv=$("#dlg2 > div");
    $(modalDiv).empty();
    if(tg.parents(".controlRowSet").find("#controlRowNum").val()>0){
        $("#dlg").hide();
        $("#dlg2").show();
        var labelDiv=new labelAndInput("form-control","controlColumnNum","","input","控件个数:");
        labelDiv.inputType("number");
        //labelDiv.dom.addEventListener("keypress",controlColumn);
        modalDiv[0].append(labelDiv.labelEl);
    }else{
        alert("请输入分区!");
    }
}
contextMenuRightControl=function(e) {
    var tg=$(e.target);
    console.log(e);
    if(!(tg.parents(".right-control").length||tg.hasClass('right-control'))){
        e.preventDefault();
        return false;
    }
    testing.target=tg;
    var menuArr={ buttonSet:{ name:'按键定义', id:'buttonSet', childArr:{
        typeSet:{
            name:'控件类型',
            id:'typeSet',
            childArr:null
        }, widthTall:{
            name:'宽高设置',
            id:'widthTall',
            childArr:null
        },colorSet:{
            name:'颜色设置',
            id:'colorSet',
            childArr:null
        },shapeSet:{
            name:'形状设置',
            id:'shapeSet',
            childArr:null
        },showControl:{
            name:'控件资料',
            id:'showControl',
            childArr:null
        },changeConstant:{
            name:'修改常量',
            id:'changeConstant',
            childArr:null
        },copyStyle:{
            name:'样式复制',
            id:'copyStyle',
            childArr:null
        },pasteStyle:{
            name:'样式粘贴',
            id:'pasteStyle',
            childArr:null
        },deleteSet:{
            name:'删除该框',
            id:'deleteSet',
            childArr:null
        }}
    },FunctionSet:{name:'操作定义', id:'FunctionSet', childArr:{
        actionSet:{
            name:'行为绑定',
            id:'actionSet',
            childArr:null
        },relationSet:{
            name:'控件关系',
            id:'relationSet',
            childArr:null
        },showFieldSet:{
            name:'表格关联',
            id:'showFieldSet',
            childArr:null
        },copyRelation:{
            name:'关系复制',
            id:'copyRelation',
            childArr:null
        },pasteRelation:{
            name:'关系粘贴',
            id:'pasteRelation',
            childArr:null
        }}

    }};
    if(!($(tg).parents('.instanceTd').length||$(tg).parents('.formTd').length||$(tg).hasClass('instanceTd')||$(tg).hasClass('formTd')||$(tg).hasClass('rightControlSet'))){
        menuArr={ buttonSet:{ name:'布局定义', id:'buttonSet', childArr:{
            typeSet:{
                name:'新建占位',
                id:'instanceSet',
                childArr:null
            },
            formDiv:{
                name:'新建表单',
                id:'formDivSet',
                childArr:null
            }, widthTall:{
                name:'宽高设置',
                id:'widthTall',
                childArr:null
            },colorSet:{
                name:'颜色设置',
                id:'colorSet',
                childArr:null
            },showControl:{
                name:'控件资料',
                id:'showControl',
                childArr:null
            },copyStyle: {
                name: '样式复制',
                id: 'copyStyle',
                childArr: null
            }, pasteStyle: {
                name: '样式粘贴',
                id: 'pasteStyle',
                childArr: null
            },deleteSet:{
                name:'删除该框',
                id:'deleteSet',
                childArr:null
            }}
        },FunctionSet: {
            name: '操作定义', id: 'FunctionSet', childArr: {
                actionSet: {
                    name: '按行自动行为',
                    id: 'actionSet',
                    childArr: null
                }, relationSet: {
                    name: '控件关系',
                    id: 'relationSet',
                    childArr: null
                }, showFieldSet: {
                    name: '表格关联',
                    id: 'showFieldSet',
                    childArr: null
                }, copyRelation: {
                    name: '关系复制',
                    id: 'copyRelation',
                    childArr: null
                }, pasteRelation: {
                    name: '关系粘贴',
                    id: 'pasteRelation',
                    childArr: null
                }
            }
        }
    }}
    var data=new contextMenuDiv(e,$("#contextmenu"),menuArr);
    $(data.menuDiv).show();
    e.preventDefault();
    return false;
};
function controlInstance() {
    var tg=testing.target;
    var domDiv=new el_new("rightControlSet","","",'div');
    var domDiv2=new el_new("rightControlSet","","",'div');
    domDiv2.dom.setAttribute('class','td instanceTd');
    domDiv2.dom.innerHTML="<--  占位  -->";
    if($(tg).hasClass('rightControlRow')){
        domDiv=domDiv2;
    }else{
        domDiv.dom.setAttribute('class','col-xs-12 rightControlRow');
        domDiv.dom.setAttribute('id',Date.now().toString());
        $(domDiv.dom).append(domDiv2.dom);
        alert('新区域生成!');
    }
    $(tg).append(domDiv.dom);
    tg=null;
}
function controlFormDiv() {
    var tg=testing.target;
    var domDiv=new el_new("rightControlSet","","",'div');
    var domDiv2=new el_new("rightControlSet","","",'form');
    domDiv2.dom.setAttribute('class','td formTd');
    domDiv2.dom.setAttribute('enctype','multipart/form-data');
    domDiv2.dom.setAttribute('method','POST');
    domDiv2.dom.innerHTML="<--  上传占位  -->";
    if($(tg).hasClass('rightControlRow')){
        domDiv=domDiv2;
    }else{
        domDiv.dom.setAttribute('class','col-xs-12 rightControlRow');
        domDiv.dom.setAttribute('id',Date.now().toString());
        $(domDiv.dom).append(domDiv2.dom);
        alert('新区域生成!');
    }
    $(tg).append(domDiv.dom);
    tg=null;
}
function controlColumn() {
    //var tg=$(e.target);
    var modalDiv=$("#dlg2>div");
    $(modalDiv).empty();
    //if (tg.val()>0&&e.keyCode==13){
    //for (var num=1;num>0;num--) {
    var elDiv = new el_new("form-control controlColumnBlock", "", "", "div");
    var labelDiv = new labelAndInput("form-control", "controlColumnType", "", "select", "控件类型:");
    select_add(labelDiv.dom, controlColumnType, "id", "type");
    labelDiv.dom.addEventListener("change", controlColumnTypeChoose);
    elDiv.dom.append(labelDiv.labelEl);
    modalDiv[0].append(elDiv.dom);
    //}
    //}
}
function controlColumnTypeChoose(e) {
    var tg=$(e.target);
    if(tg.val()&&tg.val()!="空"){
        var pDiv=tg.parents(".controlColumnBlock");
        pDiv.children("div").remove();
        var setDiv=new el_new("form-control","","","div");
        var labelDiv=new labelAndInput("form-control","","","input","英文ID:");
        var labelDiv_1=new labelAndInput("form-control","","","input","英文类名:");
        setDiv.dom.append(labelDiv.labelEl);
        setDiv.dom.append(labelDiv_1.labelEl);
        console.log(typeof tg.val());
        switch (tg.val()){
            case '3':{
                var labelDiv2=new labelAndInput("form-control","","","input","静态名称:");
                var labelDiv3=new labelAndInput("form-control","","","input","内部数值:");
                setDiv.dom.append(labelDiv2.labelEl);
                setDiv.dom.append(labelDiv3.labelEl);
            }break;
            case '4':{
                var labelDiv2=new labelAndInput("form-control","","","select","显示形式:");
                select_add(labelDiv2.dom,globalStorage.showType,'id','text');
                var labelDiv3=new labelAndInput("form-control","","","select","是否全显:");
                select_add(labelDiv3.dom,globalStorage.binaryChoice,'id','text');
                setDiv.dom.append(labelDiv2.labelEl);
                setDiv.dom.append(labelDiv3.labelEl);
            }break;
            case '5':{
                var labelDiv2=new labelAndInput("form-control","","","select","弹出形式:");
                select_add(labelDiv2.dom,globalStorage.controlType,'id','text');
                var labelDiv3=new labelAndInput("form-control","","","input","静态名称:");
                setDiv.dom.append(labelDiv2.labelEl);
                setDiv.dom.append(labelDiv3.labelEl);
            }break;
            case '6':{
                var labelDiv2=new labelAndInput("form-control","","","select","输入类型:");
                select_add(labelDiv2.dom,inputType,'id','text');
                var labelDiv3=new labelAndInput("form-control","","","input","最大长度:");
                labelDiv3.inputType("number");
                var labelDiv4=new labelAndInput("form-control","","","input","默认显示:");
                var labelDiv5=new labelAndInput("form-control","","","select","用户只读:");
                select_add(labelDiv5.dom,[{id:0,text:'否'},{id:1,text:'是'}],'id','text');
                setDiv.dom.append(labelDiv2.labelEl);
                setDiv.dom.append(labelDiv3.labelEl);
                setDiv.dom.append(labelDiv4.labelEl);
                setDiv.dom.append(labelDiv5.labelEl);
            }break;
            case '7':{
                var labelDiv2=new labelAndInput("form-control","","","select","弹出形式:");
                setDiv.dom.append(labelDiv2.labelEl);
            }break;
            default:{
                setDiv.dom=null;
            }
        }pDiv.append(setDiv.dom);
    }
}
function controlColumnAccept() {
    var tg=testing.target;
    var modalValue=new modalValueFunc();
    var data=modalValue.getDataArr($(".controlColumnBlock"));
    console.log(data);
    var indexFunc=new indexOfFunc();
    indexFunc.setControlType(testing.menuClick,tg,data);
}
function controlWidthTall() {
    var modalDiv=$("#dlg2>div");
    $(modalDiv).empty();
    var elDiv = new el_new("form-control controlColumnBlock", "", "", "div");
    var labelDiv = new labelAndInput("form-control", "controlColumnType", "", "input", "宽度:");
    var labelDiv2 = new labelAndInput("form-control", "controlColumnType", "", "input", "高度:");
    labelDiv.inputType('number');
    labelDiv2.inputType('number');
    elDiv.dom.append(labelDiv.labelEl);
    elDiv.dom.append(labelDiv2.labelEl);
    modalDiv[0].append(elDiv.dom);
}
function controlWidthTallAccept() {
    var tg=testing.target;
    var modalValue=new modalValueFunc();
    var data=modalValue.getDataArr($(".controlColumnBlock"));
    console.log(data);
    var indexFunc=new indexOfFunc();
    indexFunc.setControlWidthTall(testing.menuClick,tg,data);
}
function controlColor() {
    var modalDiv=$("#dlg2>div");
    $(modalDiv).empty();
    var elDiv = new el_new("form-control controlColumnBlock", "", "", "div");
    var labelDiv = new labelAndInput("form-control", "controlColumnType", "", "input", "背景颜色:");
    var labelDiv2 = new labelAndInput("form-control", "controlColumnType", "", "input", "边框颜色:");
    var labelDiv3 = new labelAndInput("form-control", "controlColumnType", "", "input", "悬浮变色:");
    labelDiv.inputType('text');
    labelDiv2.inputType('text');
    labelDiv3.inputType('text');
    $(labelDiv.dom).colorpicker();
    $(labelDiv2.dom).colorpicker();
    $(labelDiv3.dom).colorpicker();
    elDiv.dom.append(labelDiv.labelEl);
    elDiv.dom.append(labelDiv2.labelEl);
    elDiv.dom.append(labelDiv3.labelEl);
    modalDiv[0].append(elDiv.dom);
}
function controlColorAccept() {
    var tg=testing.target;
    var modalValue=new modalValueFunc();
    var data=modalValue.getDataArr($(".controlColumnBlock"));
    console.log(data);
    var indexFunc=new indexOfFunc();
    indexFunc.setColor(testing.menuClick,tg,data);
}
function controlShape() {
    var modalDiv=$("#dlg2>div");
    $(modalDiv).empty();
    var elDiv = new el_new("form-control controlColumnBlock", "", "", "div");
    var labelDiv = new labelAndInput("form-control", "controlColumnType", "", "select", "左右对齐:");
    var labelDiv2 = new labelAndInput("form-control", "controlColumnType", "", "input", "边框厚度:");
    var labelDiv3 = new labelAndInput("form-control", "controlColumnType", "", "input", "圆弧弧度:");
    var labelDiv4 = new labelAndInput("form-control", "controlColumnType", "", "input", "阴影深度:");
    var labelDiv5 = new labelAndInput("form-control", "controlColumnType", "", "input", "字体大小:");
    var labelDiv6 = new labelAndInput("form-control", "controlColumnType", "", "select", "基本选择:");
    // labelDiv.inputType('text');
    select_add(labelDiv.dom,[{name:'左对齐',value:'textLeft'},{name:'中间对齐',value:'textCenter'},{name:'右对齐',value:'textRight'}],'value','name');
    select_add(labelDiv6.dom,[{name:'无类型',value:''},{name:'默认型',value:'btnstyle default'},{name:'渐变型',value:'btnstyle gray'},{name:'边框型',value:'btnstyle primary'},{name:'实心型',value:'btnstyle blue'}],'value','name');
    labelDiv2.inputType('number');
    labelDiv3.inputType('number');
    labelDiv4.inputType('number');
    labelDiv5.inputType('number');
    elDiv.dom.append(labelDiv.labelEl);
    elDiv.dom.append(labelDiv2.labelEl);
    elDiv.dom.append(labelDiv3.labelEl);
    elDiv.dom.append(labelDiv4.labelEl);
    elDiv.dom.append(labelDiv5.labelEl);
    elDiv.dom.append(labelDiv6.labelEl);
    modalDiv[0].append(elDiv.dom);
}
function controlShapeAccept() {
    var tg=testing.target;
    var modalValue=new modalValueFunc();
    var data=modalValue.getDataArr($(".controlColumnBlock"));
    console.log(data);
    var indexFunc=new indexOfFunc();
    indexFunc.setShape(testing.menuClick,tg,data);
}
function controlAction() {
    var tg=testing.target;
    var modalDiv=$("#dlg2>div");
    $(modalDiv).empty();
    var elDiv = new el_new("form-control controlColumnBlock", "", "", "div");
    var labelDiv = new labelAndInput("form-control", "controlColumnType", "", "select", "行为选择:");
    if(!($(tg).parents('.instanceTd').length||$(tg).hasClass('instanceTd')||$(tg).hasClass('rightControlSet'))){
        select_add(labelDiv.dom,actionType.row,'id','text');
    }else {
        select_add(labelDiv.dom,actionType.base,'id','text');
    }
    var labelDiv2 = new labelAndInput("form-control", "controlColumnType", "", "input", "关联控件:");
    labelDiv2.inputType('number');
    $(labelDiv2.dom).on('keydown',{modalDiv:modalDiv[1]},controlActionKeypress);
    var labelDiv3 = new labelAndInput("form-control", "controlColumnType", "", "select", "触发类型:");
    var tgName=function (target) {
        try {
            return [{id:'#'+$(target).attr('id'),text:'id：'+$(target).attr('id')},{id:'.' + $(target).attr('class').match(/\S+-rowClass\b/g)[0],text:'类名：'+'.' + $(target).attr('class').match(/\S+-rowClass\b/g)[0].replace(/-rowClass/g, '')}];
        } catch (ex) {
            return [{id:$(target).attr('id'),text:'id：'+$(target).attr('id')}];
        }
    };
    // if(!($(tg).parents('.instanceTd').length||$(tg).hasClass('instanceTd')||$(tg).hasClass('rightControlSet'))){
    //     select_add(labelDiv3.dom,{},'id','text');
    // }else {
        select_add(labelDiv3.dom,tgName(tg),'id','text');
    // }
    elDiv.dom.append(labelDiv.labelEl);
    elDiv.dom.append(labelDiv2.labelEl);
    elDiv.dom.append(labelDiv3.labelEl);
    modalDiv[0].append(elDiv.dom);
}
function controlActionKeypress(e) {
    var modalValue=new modalValueFunc();
    var data=modalValue.getDataArr($(".controlColumnBlock"));
    if(e.keyCode==13&&data[1]>0) {
        var obj = new actionKey(data[0], data[1]);
        var mouseAct = new mouseAction();
        mouseAct.preventFunc($('#rightControlBtn'),{stat:false});
        console.log(obj);
        $(e.data.modalDiv).append(obj);
    }
}
function controlActionAccept() {
    console.log("准备好构造啦！！！！",testing.target);
    var tg=testing.target;
    var modalValue=new modalValueFunc();
    var data=modalValue.getDataArr($(".controlColumnBlock2"));
    var mouseAct = new mouseAction();
    mouseAct.preventFunc(this);
    var indexFunc=new indexOfFunc();
    if(!($(tg).parents('.instanceTd').length||$(tg).hasClass('instanceTd')||$(tg).hasClass('rightControlSet'))){
        indexFunc.setRowCopyAction(testing.menuClick,tg,data);
    }else {
        indexFunc.setConstructAction(testing.menuClick,tg,data,modalValue.getDataArr($(".controlColumnBlock"))[2]);
    }

}
function controlRelation() {
    var modalDiv=$("#dlg2>div");
    $(modalDiv).empty();
    var elDiv = new el_new("form-control", "", "", "div");
    var labelDiv2 = new labelAndInput("form-control", "controlColumnType", "", "input", "关联表数:");
    labelDiv2.inputType('number');
    $(labelDiv2.dom).on('keydown',{modalDiv:modalDiv},listenOfRelation);
    elDiv.dom.append(labelDiv2.labelEl);
    modalDiv[0].append(elDiv.dom);
}
function listenOfRelation(e) {                     //关联设置的keypress监听
    var keyCode=e.keyCode;
    var tableNum=$(this).val();
    console.log(tableNum);
    if(keyCode==13){
        $(e.data.modalDiv[1]).empty();
        var elDiv = new el_new("form-control controlColumnBlock", "", "", "div");
        for(var i=0;i<tableNum;i++){
            var labeldiv1=new labelAndInput("form-control","","","input","数据表名:");
            labeldiv1.dom.title='正常自定表的显示（输入如：tableName）,特别序列的显示（输入如：$file，为文件池序列）';
            var labeldiv2=new labelAndInput("form-control","","","input","关联字段:");
            var div1=new el_new("col-sm-12","","","div");
            div1.appendStyle("padding:0px");
            div1.dom.append(labeldiv1.labelEl);
            div1.dom.append(labeldiv2.labelEl);
            elDiv.dom.append(div1.dom);
            e.data.modalDiv[1].append(elDiv.dom);
        }
    }
}
function controlRelationAccept() {
    var tg=testing.target;
    var modalValue=new modalValueFunc();
    var data=modalValue.getDataArr($(".controlColumnBlock"));
    var indexFunc=new indexOfFunc();
    indexFunc.setRelation(testing.menuClick,tg,data);
}
var newCancelBlock=function () {
    var container=$('.deleted-child');
    var labelDiv = new labelAndInput("form-control", "", "", "input", "索引ID:");
    container[0].append(labelDiv.labelEl);
};
var listenOfShowField=function(e) {                     //关联设置的keypress监听
    var keyCode=e.keyCode;
    var tableNum=$(this).val();
    console.log(tableNum);
    if(keyCode==13){
        $(e.data.modalDiv[1]).empty();
        var elDiv = new el_new("form-control controlColumnBlock", "", "", "div");
        for(var i=0;i<tableNum;i++){
            var labeldiv1=new labelAndInput("form-control","","","input","数据表名:");
            var labeldiv2=new labelAndInput("form-control","","","input","关联字段:");
            var br=new el_new("form-control","","","br");
            var labeldiv3=new labelAndInput("form-control","","","input","关联它表:");
            var labeldiv4=new labelAndInput("form-control","","","input","他表字段:");
            var div1=new el_new("col-sm-12","","","div");
            div1.appendStyle("padding:0px");
            div1.dom.append(labeldiv1.labelEl);
            div1.dom.append(labeldiv2.labelEl);
            div1.dom.append(br.dom);
            div1.dom.append(labeldiv3.labelEl);
            div1.dom.append(labeldiv4.labelEl);
            elDiv.dom.append(div1.dom);
            e.data.modalDiv[1].append(elDiv.dom);
        }
    }
};
function controlShowField() {                   //写到这啦~~~！
    var modalDiv = $("#dlg2>div");
    $(modalDiv).empty();
    var elDiv = new el_new("form-control", "", "", "div");
    var labelDiv2 = new labelAndInput("form-control", "controlColumnType", "", "input", "显示字段:");
    labelDiv2.inputType('number');
    $(labelDiv2.dom).on('keydown', {modalDiv: modalDiv}, listenOfShowField);
    elDiv.dom.append(labelDiv2.labelEl);
    modalDiv[0].append(elDiv.dom);
}
function controlShowFieldAccept() {
    var tg=testing.target;
    var modalValue=new modalValueFunc();
    var data=modalValue.getDataArr($(".controlColumnBlock"));
    var indexFunc=new indexOfFunc();
    indexFunc.setShowField(testing.menuClick,tg,data);
}
function controlCopyStyle(){
    var tg=testing.target;
    var msg=$(tg).hasClass('rightControlSet')?$(tg):$(tg).parents('.rightControlSet')||$(tg).find('.rightControlSet');
    if(msg.hasClass('rightControlSet')){
        var classTag=$(msg).attr('class').match(/text\S+|default|blue|gray|primary|btnstyle/g);
        var styleTag=$(msg).attr('style');
        globalStorage.styleStorage={
            classTag:classTag||[],
            styleTag:styleTag||''
        }
    }else {
        alert('请选择可绑定关系控件！');
    }
}
function controlCopyRelation() {
    var tg=testing.target;
    var msg=$(tg).hasClass('rightControlSet')?$(tg):$(tg).parents('.rightControlSet')||$(tg).find('.rightControlSet');
    if(msg.hasClass('rightControlSet')){
        var id=msg.attr('id');
        if(id&&sessionStorage.getItem(id)){
            var obj=JSON.parse(sessionStorage.getItem(id));
            globalStorage.relationStorage=obj.data;
        }else {
            alert('该控件未绑定关系！');
        }
    }else {
        alert('请选择可绑定关系控件！');
    }
}
function controlPasteStyle() {
    var tg=testing.target;
    var msg=$(tg).hasClass('rightControlSet')?$(tg):$(tg).parents('.rightControlSet')||$(tg).find('.rightControlSet');
    if(msg.hasClass('rightControlSet')){
        if(Object.keys(globalStorage.styleStorage).length){
            globalStorage.styleStorage.classTag.map(function (node) {
                $(msg).addClass(node);
            });
            globalStorage.styleStorage.styleTag?$(msg).attr('style',globalStorage.styleStorage.styleTag):false;
        }else{
            alert('请先复制相关的样式！');
        }
    }else {
        alert('请选择可绑定关系控件！');
    }
}
function controlPasteRelation() {
    var tg=testing.target;
    var msg=$(tg).hasClass('rightControlSet')?$(tg):$(tg).parents('.rightControlSet')||$(tg).find('.rightControlSet');
    if(msg.hasClass('rightControlSet')){
        var id=msg.attr('id');
        if(id && Object.keys(globalStorage.relationStorage).length){
            var obj={
                id:id,
                data:globalStorage.relationStorage
            };
            sessionStorage.setItem(id,JSON.stringify(obj));
            if(!globalStorage.controlInform[id]){
                globalStorage.controlInform[id]={};
            }
            globalStorage.controlInform[id]['data']=obj.data;
        }else {
            alert('请先复制相关的关系！');
        }
    }else {
        alert('请选择可绑定关系控件！');
    }
}
function controlShowControl() {
    var tg=testing.target;
    var modalDiv=$("#dlg2>div");
    $(modalDiv).empty();
    var elDiv = new el_new("form-control", "", "", "textarea");
    var showControlFunc=new showControl();
    if(!$(tg).hasClass('rightControlSet')){
        console.log($(tg).parents('.rightControlSet'));
        var setOrTd=($(tg).hasClass('td')&&!$(tg).parents('table').length)?$(tg):$(tg).parents('.rightControlSet')||($(tg).hasClass('rightControlRow'))?$(tg):false;
        $(elDiv.dom).val(showControlFunc.funcRun(setOrTd.attr('id'),setOrTd));
    }else {
        // console.log($(tg));
        $(elDiv.dom).val(showControlFunc.funcRun($(tg).attr('id'),$(tg)));
    }
    modalDiv[0].append(elDiv.dom);
}
function controlChangeConstant() {
    var modalDiv=$("#dlg2>div");
    $(modalDiv).empty();
    var elDiv = new el_new("form-control controlColumnBlock", "", "", "div");
    var labelDiv = new labelAndInput("form-control", "controlColumnType", "", "input", "ID修改:");
    labelDiv.inputType('text');
    var labelDiv2 = new labelAndInput("form-control", "controlColumnType", "", "input", "类名修改:");
    labelDiv2.inputType('text');
    var labelDiv4 = new labelAndInput("form-control", "controlColumnType", "", "input", "是否移动:");
    labelDiv4.inputType('text');
    elDiv.dom.append(labelDiv.labelEl);
    elDiv.dom.append(labelDiv2.labelEl);
    elDiv.dom.append(labelDiv4.labelEl);
    if($(testing.target).prop('tagName')=='LABEL'){
        var labelDiv3 = new labelAndInput("form-control", "controlColumnType", "", "input", "常量修改:");
        labelDiv3.inputType('text');
        elDiv.dom.append(labelDiv3.labelEl);
    }
    // var labelDiv2 = new labelAndInput("form-control", "controlColumnType", "", "input", "高度:");
    modalDiv[0].append(elDiv.dom);
}
function controlChangeConstantAccept() {
    var tg=testing.target;
    var modalValue=new modalValueFunc();
    var data=modalValue.getDataArr($(".controlColumnBlock"));
    console.log(data);
    var indexFunc=new indexOfFunc();
    indexFunc.setChangeConstant(testing.menuClick,tg,data);
}
function controlShowControlAccept() {

}
function controlDelete() {
    var tg=testing.target;
    var msg=$(tg).hasClass('rightControlSet')?$(tg).attr('id'):$(tg).parents('.rightControlSet').attr('id')||$(tg).find('.rightcontrolset').attr('id');
    if($(tg).hasClass('rightControlRow')&&confirm('是否删除该'+(msg?msg:'新建')+'行(及其内容)')==true){
        $(tg).remove();
        return;
    }else if(($(tg).hasClass('td')||$(tg).parents('.td').length)&&confirm('是否删除该'+(msg?msg:'新建')+'框(及其内容)')==true){
        var target=$(tg).parents('.td').length?$(tg).parents('.td'):$(tg);
        target.remove();
        return;
    }
}
//-------------ajax函数---------------
function showTablesAjax() {
    $.ajax({
        type:"GET",
        url: "http://119.23.253.225:8080/hzl-iomp/cgFormHeadController?showTables",
        data: "",
        success:function (recieve) {
            if (recieve.success) {
                showTablesData=recieve.obj;
                console.log(showTablesData);
            }
        }
    })
}
function showTableField(tableIdArg) {
    $.ajax({
        type: "GET",
        url: "http://119.23.253.225:8080/hzl-iomp/cgFormHeadController?showTableField",
        data: {tableId:tableIdArg},
        success: function (recieve) {
            if (recieve.success) {
                dataFieldRecieve=recieve.obj;
                return 1;
            }
        }
    })
}
function fileStringUpload(data) {
    console.log(data);
    $.ajax({
        type:"POST",
        url:"http://119.23.253.225:8080/hzl-iomp/fileController/stringUpload",
        data:JSON.stringify(data,null,4),
        contentType: 'application/json',
        success:function (recieve) {
            $('#rightControlBtn').attr('disabled',false);
            if(recieve.success&&recieve.msg.indexOf("成功")){
                alert(recieve.msg);
                stringSelectAll();
            }else{
                alert("上传失败!");
            }
        },
        error: function(unrecieve) {
            $('#rightControlBtn').attr('disabled',false);
            console.log("上传失败!");
        }
    })
}
function stringSelectAll(e) {
    $.ajax({
        type:"POST",
        url:"http://119.23.253.225:8080/hzl-iomp/fileController/stringSelectAll",
        data:JSON.stringify({
            destination:$('.htmlShowDestination').val()
        }),
        contentType: 'application/json',
        success:function (recieve) {
            if(recieve.success&&recieve.msg.indexOf("成功")){
                var o=new htmlVersionClass();
                o.getHtml(recieve.obj);
                o.setRoleSelect($('.htmlShowRole'));
                o.flashHtml($(".htmlShow"));
            }else{
                alert("上传失败!");
            }
        },
        error: function(unrecieve) {
            $('#rightControlBtn').attr('disabled',false);
            console.log("上传失败!");
        }
    })
}
function fileUploadAjax(e) {
        var tg=$(e.target);
        var formDiv=document.getElementById("formDiv");
        var formData=new FormData(formDiv);
        tg.attr({"disabled":"true"});
        console.log(formData);
        $.ajax({
            type:"POST",
            url:"http://119.23.253.225:8080/hzl-iomp/fileController/upload",
            data:formData,
            processData: false,
            contentType: false,
            encType:"multipart/form-data",
            success:function (recieve) {
                if(recieve.success&&recieve.msg.indexOf("成功")){
                    //alert(recieve.msg);
                }else{
                    alert("上传失败!");
                }
            },
            error: function(unrecieve) {
                console.log("上传失败!");
                tg.removeAttr("disabled");
            }
        })
}
function deleteUploadAjax(obj) {
    $.ajax({
        type:"POST",
        url:"http://119.23.253.225:8080/hzl-iomp/fileController/stringDelete",
        data:JSON.stringify(obj,null,4),
        contentType: 'application/json',
        success:function (recieve) {
            if(recieve.success&&recieve.msg.indexOf("成功")){
                alert(recieve.msg);
                stringSelectAll();
            }else{
                alert("删除失败!");
            }
        },
        error: function(unrecieve) {
            console.log("删除失败!");
        }
    })
}
function getJsAjax(jsName){
    var returnTip='';
    $.ajax({
        url:'http://119.23.253.225:8080/hzl-iomp/js/upload/'+jsName+'js.js',
        type:'GET',
        data:null,
        async:false,
        success:function(data){
            var removeStr=['$(document).ready(function(){ //[removeRow]','});//[removeRow]'];
            returnTip=data.replace(removeStr[0],'').replace(removeStr[1],'');
        }
    });
    return returnTip;
}
function rolesRelative(selector,setting,nodes){       //  http://www.treejs.cn/v3/api.php (ztree的相关api文档)
    this.instanceNodes=null;
    this.treeInstance=null;
    this.getRolesAjax();
    if(typeof arguments[0] == 'string'){
        this.relateObj(arguments[0]);
        this.initTree(selector,nodes||this.allRoles[0],arguments[1]);//(treeNodes,setting)
    }
}
rolesRelative.prototype={
    allRoles:{nodeCode:'root',nodeName:"文件夹",children:[
        { nodeCode:11, parentCode:'root', nodeName:"收件箱",children:[
            { nodeCode:111, parentCode:11, nodeName:"收件箱1",children:[
                { nodeCode:112, parentCode:111, nodeName:"收件箱2",children:[
                    { nodeCode:113, parentCode:112, nodeName:"收件箱3",children:[
                        { nodeCode:114, parentCode:113, nodeName:"收件箱4"}
                    ]}
                ]}
            ]}
        ]}
    ]},
    prototypeNodes:null,
    getRolesAjax:function(){
        $.ajax({
            url:'http://119.23.253.225:8080/hzl-iomp/fileController/getAllRoles',
            type:'POST',
            data:null,
            contentType: 'application/json',
            async:false,
            success:function(recieve){
                if(recieve.success&&recieve.msg.indexOf("成功")){
                    // alert(recieve.msg);
                    rolesRelative.prototype.allRoles=recieve.obj;
                }else{
                    alert("获取失败!");
                }
            }
        });
    },
    relateObj:function (selector) {
        if(selector){
            this.instanceNodes=$(selector);
        }else {
            this.instanceNodes=$(this.prototypeNodes);
        }
    },
    getTree:function (idName) {
        return $.fn.zTree.getZTreeObj(idName);
    },
    getInstance:function(){
        return this.treeInstance;
    },
    makeCallback:function (json) {
        if(typeof json =='object'){
            this.treeInstance.setting.callback=json;
        }else if(typeof json=='function'){
            this.treeInstance.setting.callback.onClick=json;
        }
    },
    initTree:function(selector,treeNodes,setting){
        var defaultSetting={
            view: {
                showLine: false,
                showIcon: false,
                selectedMulti: false,
                dblClickExpand: false,
                addDiyDom:function(treeId, treeNode) {
                    var spaceWidth = 10;
                    var switchObj = $("#" + treeNode.tId + "_switch");
                    if (treeNode.level >= 1) {
                        var spaceStr = "<span style='display: inline-block;width:" + (spaceWidth * treeNode.level)+ "px'></span>";
                        switchObj.before(spaceStr);
                    }
                }
            },
            data: {
                key: {
                    name: "nodeName",
                    children:"children",
                    isParent: "parent"
                },
                simpleData: {
                    enable: false,
                }
            },
            callback: {
            }
        };
        if(typeof selector=='string'){
            this.instanceNodes=$(selector);
            setting=setting?setting:defaultSetting;    //(selector,treeNodes,setting)或(selector,treeNodes,null)情况
            this.treeInstance=$.fn.zTree.init(this.instanceNodes, setting, treeNodes);
        }else if(typeof selector=='object'&&treeNodes){
            this.treeInstance=$.fn.zTree.init(this.instanceNodes||this.prototypeNodes, treeNodes, selector);
        }else {
            this.treeInstance=$.fn.zTree.init(this.instanceNodes||this.prototypeNodes,defaultSetting , selector);
        }
        //鼠标悬浮事件hover(进入事件,离开事件)
        // $(this.instanceNodes).hover(function () {
        //     if (!$(this.instanceNodes).hasClass("showIcon")) {
        //         $(this.instanceNodes).addClass("showIcon");
        //     }
        // }, function() {
        //     $(this.instanceNodes).removeClass("showIcon");
        // });
    }
};
//----------------CSS实现---------------------

$(".li_5").click(function(){
	$("#table_nav").html("界面定义管理");
	$("#wrap_1").attr("style","display:none");
	$("#wrap_2").attr("style","display:none");
	$("#wrap_3").attr("style","display:none");
	$("#wrap_4").attr("style","display:none");
	$("#wrap_5").attr("style","display:block");
	$("#wrap_6").attr("style","display:none");
});

});
/*
[object Object]
*/
/*
[object Object]
*/