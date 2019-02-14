$(document).ready(function (){
//-------------实验用-----------------

//-------------全局变量---------------
var globalStorage={
    tablesId:{},
    tableField:{},
    showField:{},
    tableData:{},
    lastSelectStr:{},
    lastSelectData:{},
    pageInformation:{
        pageSize:10,
        pageNumStorage:{},
        pageRecieve:{},
        offset:{}
    },
    sortInformation:{
        preOrder:'up'
    },
    showCopyRowStorage:{}
};
//-------------类和对象---------------
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

function mouseAction() {
}
mouseAction.prototype={
    backgroundColor:'#FFFFFF',
    btnOver:false,
    mouseOnBackgroundAnimate:function (obj,color) {
        if(this.btnOver){
            $(obj).css({'background-color':this.backgroundColor});
            this.btnOver=true;
        }else {
            this.backgroundColor=$(obj).css('background-color');
            $(obj).css({'background-color':color});
            this.btnOver=false;
        }
    }
};
function ajaxTemplate() {
}
ajaxTemplate.prototype={
  package:{
      fileUpload:function(selectObj,next) {
          var tg = $(selectObj.clickObj).parents('.rightControlRow');
          var formDiv = tg.find('.formTd').length ? tg.find('.formTd') : alert('页面设计错误');
          // var formData = new FormData(formDiv);
          console.log(formDiv);
          var fileUploadObj={
              type: "POST",
              url: "http://119.23.253.225:8080/lechang-bpm/FMInfoController/upload",
              // processData: false,
              // contentType: false,
              encType: "multipart/form-data",
              success: function (recieve) {
                  if (recieve.success && recieve.msg.indexOf("成功")) {
                      alert(recieve.msg);
                  } else {
                      alert("上传失败!");
                  }
                  $(selectObj.clickObj).removeAttr("disabled");
              },
              error: function (unrecieve) {
                  console.log("传参失败!");
                  $(selectObj.clickObj).removeAttr("disabled");
              }
          };
          $(formDiv[0]).ajaxSubmit(fileUploadObj);
          $(selectObj.clickObj).attr({"disabled": "true"});
          return false;
      },
      fileOpen:function (htmlRefer,next) {
          window.open(htmlRefer);
      },
      insert:function (selectObj,next) {
          $.ajax({
              type: "POST",
              url: "http://119.23.253.225:8080/lechang-bpm/tableCRUDController/insert",
              data: JSON.stringify(selectObj['json'], null, 4),
              contentType:"application/json",
              success:function (recieve) {
                  if (recieve.success&&recieve.msg.indexOf("成功")) {
                      alert('录入成功！');
                      if(Object.keys(next).length){bindOf(next);}
                  }else {alert('录入失败！');}
              },error: function(unrecieve) {
                  console.log(selectObj['json']);
              }
          })
      },
      select:function (selectObj,next) {
          //console.log(selectObj);
          var key=selectObj.showCopy?[selectObj.showCopy.tableFirst]:Object.keys(selectObj['tableIndex']['inputIndex']);
          var actionTypeBase={
              '$file':'fileSelect'
          };
          for(var i=0;i<selectObj['json'].length;i++) {
              console.log($.inArray(selectObj['json'][i]['tableName'],key));
              if($.inArray(selectObj['json'][i]['tableName'],key)>=0&&selectObj.iterator==0){
                  ajaxTemplate.prototype.package.selectInputIndex(selectObj,selectObj['json'][i],next);
              }else if($.inArray(selectObj['json'][i]['tableName'],key)<0&&selectObj.iterator==2){

              }else{
                  if(selectObj.showCopy && selectObj.showCopy.tableFirst.indexOf('$')==0){
                      ajaxTemplate.prototype.ajaxPackage[actionTypeBase[selectObj.showCopy.tableFirst]](selectObj.json[i],function(recieve,objectBase,next){
                          if (objectBase.selectObj.iterator==2){
                              globalStorage.showCopyRowStorage[objectBase.selectObj.showCopy.copyRow]['pNum']=recieve.obj.length;
                              if(!globalStorage.lastSelectData[objectBase.selectObj.showCopy.copyRow].length){
                                  globalStorage.lastSelectData[objectBase.selectObj.showCopy.copyRow][0]={};
                              }
                              globalStorage.lastSelectData[objectBase.selectObj.showCopy.copyRow][0][objectBase.selectObj.showCopy.tableFirst]=$.extend({},objectBase.selectObj.json[objectBase.i].data);
                              var pack={selectObj:objectBase.selectObj,key:objectBase.key,i:objectBase.i};
                              ajaxTemplate.prototype.package.selectType2(recieve, pack, next);
                          }
                      },{
                          selectObj:selectObj,
                          key:key,
                          i:i
                      },next);
                  }else{
                      $.ajax({
                          // type:'GET',
                          // url: "http://localhost:63342/WebRoot/test/select.txt",
                          // data:null,
                          type: "POST",
                          url: "http://119.23.253.225:8080/lechang-bpm/tableCRUDController/select",
                          data: JSON.stringify(selectObj['json'][i], null, 4),
                          async:false,
                          contentType: "application/json;charset=UTF-8",
                          success: function (recieve) {
                              // recieve=JSON.parse(recieve);      //解析，序列化
                              // recieve.msg='录入成功';
                              if (recieve.success && recieve.msg.indexOf("成功")) {
                                  if (recieve.obj.length != 0) {
                                      if(selectObj.iterator==0) {
                                          ajaxTemplate.prototype.package.selectType0(selectObj, recieve, next, key, i);
                                      }else if (selectObj.iterator==2){
                                          globalStorage.showCopyRowStorage[selectObj.showCopy.copyRow]['pNum']=recieve.obj.length;
                                          if(!globalStorage.lastSelectData[selectObj.showCopy.copyRow].length){
                                              globalStorage.lastSelectData[selectObj.showCopy.copyRow][0]={};
                                          }
                                          globalStorage.lastSelectData[selectObj.showCopy.copyRow][0][selectObj.json[i].tableName]=$.extend({},selectObj.json[i]);
                                          var pack={selectObj:selectObj,key:key,i:i};
                                          ajaxTemplate.prototype.package.selectType2(recieve, pack, next);
                                      } else {
                                          var pack={selectObj:selectObj,key:key,i:i};
                                          ajaxTemplate.prototype.package.selectType1(recieve, pack, next);
                                      }
                                  } else {
                                      alert("匹配项不存在");
                                  }
                              } else {
                                  alert('录入失败！');
                              }
                          }, error: function (unrecieve) {
                              // var recieve={"success":true,"msg":"请求成功!","obj":[{"id":1,"rat":null,"dog":"福福","delstatus":0,"cat":"咪咪","pig":"吱吱"},{"id":2,"rat":null,"dog":"美美","delstatus":0,"cat":"可可","pig":"图图"},{"id":3,"rat":null,"dog":"噢噢","delstatus":0,"cat":"三三","pig":"天天"},{"id":4,"rat":null,"dog":"咳咳","delstatus":0,"cat":"排排","pig":"威威"},{"id":15,"rat":null,"dog":"78","delstatus":0,"cat":null,"pig":"45"},{"id":16,"rat":null,"dog":"78","delstatus":0,"cat":null,"pig":"45"},{"id":18,"rat":null,"dog":"22","delstatus":0,"cat":null,"pig":"33"},{"id":20,"rat":null,"dog":"22","delstatus":0,"cat":null,"pig":"33"},{"id":22,"rat":null,"dog":"22","delstatus":0,"cat":null,"pig":"33"},{"id":24,"rat":null,"dog":"67","delstatus":0,"cat":null,"pig":"90"}],"attributes":{"page":{"currentPage":1,"pageSize":10,"startNum":0,"totalNum":29,"totalPage":3}},"jsonStr":"{\"msg\":\"请求成功!\",\"success\":true,\"obj\":[{\"id\":1,\"dog\":\"福福\",\"delstatus\":0,\"cat\":\"咪咪\",\"pig\":\"吱吱\"},{\"id\":2,\"dog\":\"美美\",\"delstatus\":0,\"cat\":\"可可\",\"pig\":\"图图\"},{\"id\":3,\"dog\":\"噢噢\",\"delstatus\":0,\"cat\":\"三三\",\"pig\":\"天天\"},{\"id\":4,\"dog\":\"咳咳\",\"delstatus\":0,\"cat\":\"排排\",\"pig\":\"威威\"},{\"id\":15,\"dog\":\"78\",\"delstatus\":0,\"pig\":\"45\"},{\"id\":16,\"dog\":\"78\",\"delstatus\":0,\"pig\":\"45\"},{\"id\":18,\"dog\":\"22\",\"delstatus\":0,\"pig\":\"33\"},{\"id\":20,\"dog\":\"22\",\"delstatus\":0,\"pig\":\"33\"},{\"id\":22,\"dog\":\"22\",\"delstatus\":0,\"pig\":\"33\"},{\"id\":24,\"dog\":\"67\",\"delstatus\":0,\"pig\":\"90\"}],\"attributes\":{\"page\":{\"currentPage\":1,\"pageSize\":10,\"startNum\":0,\"totalNum\":29,\"totalPage\":3}}}"};
                              var recieve={"success":true,"msg":"请求成功!","obj":[{"lc_0201_01_03":"陈宏宇","lc_0201_01_02":"A0001","lc_0201_01_05":"市委书记","lc_0201_01_04":"H0001","lc_0201_01_01":"领导小组组长","id":1,"delstatus":0},{"lc_0201_01_03":"王一","lc_0201_01_02":"A0002","lc_0201_01_05":"市委副书记、市长","lc_0201_01_04":"H0002","lc_0201_01_01":"领导小组副组长","id":2,"delstatus":0},{"lc_0201_01_03":"王二","lc_0201_01_02":"A0003","lc_0201_01_05":"市委常委、副市长","lc_0201_01_04":"H0003","lc_0201_01_01":"领导小组副组长","id":3,"delstatus":0},{"lc_0201_01_03":"王三","lc_0201_01_02":"A0004","lc_0201_01_05":null,"lc_0201_01_04":"H0004","lc_0201_01_01":"领导小组副组长","id":4,"delstatus":0},{"lc_0201_01_03":"王四","lc_0201_01_02":"A0005","lc_0201_01_05":null,"lc_0201_01_04":"H0005","lc_0201_01_01":"领导小组副组长","id":5,"delstatus":0}],"attributes":{"page":{"currentPage":1,"pageSize":10,"startNum":0,"totalNum":5,"totalPage":1}},"jsonStr":"{\"msg\":\"请求成功!\",\"success\":true,\"obj\":[{\"lc_0201_01_03\":\"陈宏宇\",\"lc_0201_01_02\":\"A0001\",\"lc_0201_01_05\":\"市委书记\",\"lc_0201_01_04\":\"H0001\",\"lc_0201_01_01\":\"领导小组组长\",\"id\":1,\"delstatus\":0},{\"lc_0201_01_03\":\"王一\",\"lc_0201_01_02\":\"A0002\",\"lc_0201_01_05\":\"市委副书记、市长\",\"lc_0201_01_04\":\"H0002\",\"lc_0201_01_01\":\"领导小组副组长\",\"id\":2,\"delstatus\":0},{\"lc_0201_01_03\":\"王二\",\"lc_0201_01_02\":\"A0003\",\"lc_0201_01_05\":\"市委常委、副市长\",\"lc_0201_01_04\":\"H0003\",\"lc_0201_01_01\":\"领导小组副组长\",\"id\":3,\"delstatus\":0},{\"lc_0201_01_03\":\"王三\",\"lc_0201_01_02\":\"A0004\",\"lc_0201_01_04\":\"H0004\",\"lc_0201_01_01\":\"领导小组副组长\",\"id\":4,\"delstatus\":0},{\"lc_0201_01_03\":\"王四\",\"lc_0201_01_02\":\"A0005\",\"lc_0201_01_04\":\"H0005\",\"lc_0201_01_01\":\"领导小组副组长\",\"id\":5,\"delstatus\":0}],\"attributes\":{\"page\":{\"currentPage\":1,\"pageSize\":10,\"startNum\":0,\"totalNum\":5,\"totalPage\":1}}}"}
                              if (recieve.obj.length != 0) {
                                  if(selectObj.iterator==0) {
                                      ajaxTemplate.prototype.package.selectType0(selectObj, recieve, next, key, i);
                                  }else if (selectObj.iterator==2){
                                      globalStorage.showCopyRowStorage[selectObj.showCopy.copyRow]['pNum']=recieve.obj.length;
                                      if(!globalStorage.lastSelectData[selectObj.showCopy.copyRow].length){
                                          globalStorage.lastSelectData[selectObj.showCopy.copyRow][0]={};
                                      }
                                      globalStorage.lastSelectData[selectObj.showCopy.copyRow][0][selectObj.json[i].tableName]=$.extend({},selectObj.json[i]);
                                      var pack={selectObj:selectObj,key:key,i:i};
                                      ajaxTemplate.prototype.package.selectType2(recieve, pack, next);
                                  } else {
                                      var pack={selectObj:selectObj,key:key,i:i};
                                      ajaxTemplate.prototype.package.selectType1(recieve, pack, next);
                                  }
                              } else {
                                  alert("匹配项不存在");
                              }
                              console.log("上传失败!" + unrecieve);
                          }
                      })
                }
              }
          }
      },
      selectInputIndex:function(selectObj,selectJson,next,pack){
          $.ajax({
              // type:'GET',
              // url: "http://localhost:63342/WebRoot/test/select.txt",
              // data:null,
              type: "POST",
              url: "http://119.23.253.225:8080/lechang-bpm/tableCRUDController/select",
              data: JSON.stringify(selectJson, null, 4),
              contentType: "application/json",
              success: function (recieve) {
                  // recieve=JSON.parse(recieve);      //解析，序列化
                  // recieve.msg='录入成功';
                  if (recieve.success&&recieve.msg.indexOf("成功")) {
                      if (recieve.obj.length != 0) {
                          if(!(selectObj['showField'][selectJson['tableName']] instanceof Array)){
                              if(!(selectObj['showField'][selectJson['tableName']]['fieldName'] instanceof Array)) {
                                  showOf(selectObj['showField'][selectJson['tableName']]['id'], recieve.obj[0][selectObj['showField'][selectJson['tableName']]['fieldName']]);
                              // }else if(selectObj['showField'][selectJson['tableName']]['fieldName'] instanceof Array){
                              //     tableShow(recieve,{selectObj:selectObj,selectJson:selectJson},next);
                              // }else if(selectObj['showField'][selectJson['tableName']]['fieldName']===''||selectObj['showField'][selectJson['tableName']]['fieldName']==='undefined'){
                              //     showOf(selectObj['showField'][selectJson['tableName']]['id'], recieve,selectJson['tableName']);
                              }
                          }else if(selectObj.iterator==2){
                              var showFields=selectObj['showField'][selectJson.tableName];
                              var cloneRow=$('.'+selectObj.showCopy.copyRow+'child:eq('+pack.i+')');
                              ajaxTemplate.prototype.package.afterCreate(cloneRow,{
                                  showFields:showFields,
                                  obj:recieve.obj,
                                  selectObj:selectObj
                              });
                          } else{
                              for(var i=0;i<selectObj['showField'][selectJson['tableName']].length;i++){
                                  showOf(selectObj['showField'][selectJson['tableName']][i]['id'], recieve.obj[0][selectObj['showField'][selectJson['tableName']][i]['fieldName']]);
                              }
                          }
                          if(Object.keys(next).length){bindOf(next);}
                      } else {
                          alert("匹配项不存在");
                      }
                  }else {alert('录入失败！');}
              },error: function(unrecieve) {
                  console.log("上传失败!"+unrecieve);
              }
          })
      },
      selectType0:function (selectObj,recieve,next,key,i) {
          for (var t = 0; t < recieve.obj.length; t++) {
              for (var j = 0; j < selectObj['json'].length; j++) {
                  if ($.inArray(selectObj['json'][j]['tableName'], key) >= 0) {
                      if(selectObj.iterator==0){
                          selectObj['json'][j]['data'][0][selectObj['tableIndex']['inputIndex'][selectObj['json'][j]['tableName']]]
                              = "'" + recieve.obj[t][selectObj['tableIndex']['outputIndex'][selectObj['json'][i]['tableName']]] + "'";
                      }
                      ajaxTemplate.prototype.package.selectInputIndex(selectObj, selectObj['json'][j],next);
                  }
              }
          }
      },
      selectType1:function (recieve,pack,next){
          globalStorage.pageInformation.pageRecieve[pack.selectObj.json[pack.i].tableName]=recieve.obj;
          var o={},o_id=pack.selectObj['showField'][pack.selectObj['json'][pack.i]['tableName']]['id'];
          o[pack.selectObj.json[pack.i].tableName]=pack.selectObj.json[pack.i];
          if(!globalStorage.lastSelectData[o_id]){
              globalStorage.lastSelectData[o_id]=[];
          }
          globalStorage.lastSelectData[o_id][0]=$.extend(true,{},o);
          for (var t = 0; t < recieve.obj.length; t++) {
              for (var j = 0; j < pack.selectObj['json'].length; j++) {
                  if ($.inArray(pack.selectObj['json'][j]['tableName'], pack.key) >= 0) {
                      pack.selectObj['json'][j]['data'][0][pack.selectObj['tableIndex']['inputIndex'][pack.selectObj.tableNet[pack.selectObj['json'][pack.i]['tableName']]]]
                          = "'" + recieve.obj[t][pack.selectObj['tableIndex']['outputIndex'][pack.selectObj['json'][pack.i]['tableName']]] + "'";
                      ajaxTemplate.prototype.ajaxPackage.selectNotAsync(pack.selectObj['json'][j],ajaxTemplate.prototype.package.selectCount,pack,next);
                  }
              }
          }
          showOf(o_id, recieve,pack.selectObj['json'][pack.i]['tableName']);
          if(Object.keys(next).length){bindOf(next);}
      },
      selectType2:function (recieve, pack, next) {
          var selectObj=pack.selectObj,
              key=pack.key[0];
          var indexObj=function (array,objHas) {
              var Rack;
              for(var i=0;i<array.length;i++){
                  Rack=JSON.stringify(array[i]);
                  if(Rack.indexOf(objHas)>0){
                      return array[i];
                  }
              }return false;
          };
          ajaxTemplate.prototype.package.preCreate(pack,recieve.obj.length);
          page_set(recieve.attributes.page.currentPage,recieve['attributes']['page']['totalPage'],globalStorage.lastSelectData[selectObj.showCopy.copyRow][0][key].pageSize,selectObj.showCopy.copyRow,pack,function(current,id,pack){
              globalStorage.lastSelectData[id][0][$(".page_"+id).attr('name')].currentPage=current;
              var data=globalStorage.lastSelectData[id][0][$(".page_"+id).attr('name')];
              if($(".page_"+id).attr('name')=='$file'){
                  ajaxTemplate.prototype.ajaxPackage.fileSelect(data,ajaxTemplate.prototype.package.selectType2,pack,null);
              }else{
                  ajaxTemplate.prototype.ajaxPackage.select(data,ajaxTemplate.prototype.package.selectType2,pack,null);
              }
          });          //开始构造前端表格！！
          for (var j = 0; j < selectObj['json'].length; j++) {
              for (var t = 0; t < recieve.obj.length; t++) {
                  var objCreate={
                      rowNum:t
                  };
                  if ($.inArray(selectObj['json'][j]['tableName'], pack.key) >= 0) {
                      var showFields=selectObj['showField'][selectObj.json[j].tableName||selectObj.showCopy.tableFirst];
                      for(var i=0;i<showFields.length;i++){
                          showOf(showFields[i].id,recieve.obj[t][showFields[i].fieldName],selectObj.json[j].tableName||selectObj.showCopy.tableFirst,objCreate);
                      }
                  }else{
                      if(selectObj.iterator==2&&$.inArray(selectObj.json[j].tableName||selectObj.showCopy.tableFirst,Object.keys(selectObj.showField))>=0){
                          selectObj['json'][j]['data'][0]={};
                          selectObj['json'][j]['data'][0][indexObj(selectObj.showCopy.index.data,selectObj['json'][j]['tableName']).fieldName]
                              = "'" + recieve.obj[t][indexObj(selectObj.showCopy.index.data,selectObj.showCopy.tableFirst).fieldName] + "'";
                          ajaxTemplate.prototype.package.selectInputIndex(selectObj, selectObj['json'][j],next,objCreate);
                          //fileSelect查询文件情况尚未考虑~！
                      }
                  }
              }
          }
      },
      preCreate:function (pack,showNum) {
          if(!$('.'+pack.selectObj.showCopy.copyRow+'child').length){
              for(var t=0;t<10;t++){
                  //第一行赋值before duplicate为否
                  var beforeDuplicate=rowDuplicate?rowDuplicate:false;
                  var rowDuplicate=t==0?$('#'+pack.selectObj.showCopy.copyRow):$('#'+pack.selectObj.showCopy.copyRow).clone();
                  rowDuplicate.addClass(pack.selectObj.showCopy.copyRow+'child');
                  //第一行的before duplicate为未定义，不做处理
                  if(beforeDuplicate){
                      rowDuplicate.attr('id','');
                      rowDuplicate.data('beforeDuplicate',beforeDuplicate);
                      //在第二行开始往before duplicate的后方添加row duplicate
                      $(beforeDuplicate).after(rowDuplicate);
                      //第十一行自动显示为翻页按钮
                      if((t+1)==10){
                          var domDiv=new el_new("col-xs-12 rightControlRow","","",'div');
                          domDiv.dom.innerHTML='<div id="pagination" class="page fl col-sm-12"></div>';
                          $(domDiv.dom).find('.page').addClass('page_'+pack.selectObj.showCopy.copyRow);
                          $(domDiv.dom).find('.page').attr('name',pack.key[0]);
                          $(rowDuplicate).after(domDiv.dom);
                      }
                  }
              }
          }var showlist=$('.'+pack.selectObj.showCopy.copyRow+'child');
          showlist.hide();
          $('.rmRow').remove();
          for(t=0;t<showNum;t++){
              $(showlist[t]).show();
          }
      },
      afterCreate:function(rowClone,bigPack){
          var showFields=bigPack.showFields;
          var data=null;
          var before=rowClone;
          for(var j=0;j<bigPack.obj.length;j++){
          data=bigPack.obj[j];
          if(j>0){
              var cloneRow=$(rowClone).clone();
              cloneRow.removeClass(bigPack.selectObj.showCopy.copyRow+'child').addClass('rmRow').attr('id','');
              $(before).after(cloneRow);
              cloneRow.show();
              before=cloneRow;
          }
              for(var i=0;i<showFields.length;i++){
                  var classObj=$(before).find('.'+showFields[i].id.replace(/\./,'')+'-rowClass')[0];
                  console.log();
                  if(classObj.localName=='input'||classObj.localName=='button'){
                      $(classObj).val(data[showFields[i].fieldName]);
                  }else{
                      $(classObj).html(data[showFields[i].fieldName]);
                  }
              }
          }
      },
      selectCount:function (recieve,pack,next) {
          
      },
      update:function (selectObj,next) {
          var tableStorage=[],expressObj={};
          for(var i=0;i<selectObj['json'].length;i++){          //(O)=2(n*n) => (O)=2n
              if($.inArray(selectObj['json'][i]['tableName'],tableStorage)<0&&selectObj['json'][i]['actionType']=='select'){
                  var updateJson={select:selectObj['json'][i],update:null};
                  expressObj[selectObj['json'][i]['tableName']]=updateJson;
                  tableStorage.push(selectObj['json'][i]['tableName']);
              }else if($.inArray(selectObj['json'][i]['tableName'],tableStorage)>=0){
                  expressObj[selectObj['json'][i]['tableName']]['update']=selectObj['json'][i];
                  console.log(expressObj);
                  ajaxTemplate.prototype.ajaxPackage.select(expressObj[selectObj['json'][i]['tableName']]['select'],ajaxTemplate.prototype.package.updateCallbackSelect,expressObj[selectObj['json'][i]['tableName']]['update'],next);
              }
          }
      },
      updateCallbackSelect:function (recieve,object,next) {
          for(var i=0;i<recieve.obj.length;i++){
              var child={};
              $.extend(child,object['data'][0]);
              child['id']=recieve.obj[i]['id'];
              object['data'][i]=child;
          }ajaxTemplate.prototype.ajaxPackage.update(object,null,null,next);
      },
      deleted:function (selectObj,next) {
          console.log(selectObj);
          for(var i=0;i<selectObj['json'].length;i++){          //(O)=2(n*n) => (O)=n
              var object={tableName:selectObj['json'][i]['tableName'],data:[]};
              ajaxTemplate.prototype.ajaxPackage.select(selectObj['json'][i],ajaxTemplate.prototype.package.deletedCallbackSelect,object,next);
          }
      },
      deletedCallbackSelect:function (recieve,object,next) {
          for (var i = 0; i < recieve.obj.length; i++) {
              var child = {id: recieve.obj[i]['id']};
              object['data'].push(child);
          }
          ajaxTemplate.prototype.ajaxPackage.deleted(object, null, null, next);
      },
      messageSet:function(recieve,object,next){
          var setting={
              "mMessage": "",
              "mStatus": "1",
              "mUser": recieve.user.replace(/\'/g,'"'),
              "mType": "allMessage",
              "mTitle":recieve.title,
              "mTime": "20180927",
              "mLink": recieve.net||''
          };
          msShowWin.showMessageRecieve(setting);
      }
  },
  ajaxPackage:{
      showTables:function (data,func,object) {
          $.ajax({
              type:"GET",
              url: "http://119.23.253.225:8080/lechang-bpm/cgFormHeadController?showTables",
              data: "",
              async:false,
              success:function (recieve) {
                  if (recieve.success&&recieve.msg.indexOf("成功")) {
                      console.log('录入成功！');
                      if(func){func(recieve,object);}
                  }else {console.log('录入失败！');
                    // recieve=JSON.parse(recieve);
                    if(func){func(recieve,object);}
                  }
              },error: function(unrecieve) {
                  console.log(unrecieve);
              }
          })
      },
      showTableField:function (data,func,object,id) {
          $.ajax({
              type: "GET",
              url: "http://119.23.253.225:8080/lechang-bpm/cgFormHeadController?showTableField",
              // url: "http://localhost:63342/WebRoot/test/showTableField.txt",
              data: {tableId: data},
              async:false,
              success:function (recieve) {
                  if (recieve.success&&recieve.msg.indexOf("成功")) {
                      if(func){func(recieve,object,id);return true;}
                  }else {console.log('失败！');}
              },error: function(unrecieve) {
                  console.log(unrecieve);
                  return false;
              }
          })
      },
      insert:function (data,func,object,next) {
          object=object||{};
          $.ajax({
              type: "POST",
              url: "http://119.23.253.225:8080/lechang-bpm/tableCRUDController/insert",
              data: JSON.stringify(data, null, 4),
              contentType:"application/json",
              success:function (recieve) {
                  if (recieve.success&&recieve.msg.indexOf("成功")) {
                      alert('录入成功！');
                      if(func){func(recieve,object,next);}
                      if(Object.keys(next).length){bindOf(next);}
                  }else {alert('录入失败！');}
              },error: function(unrecieve) {
                  console.log(data);
              }
          })
      },
      select:function (data,func,object,next) {
          object=object||{};
          next=next||{};
          $.ajax({
              type: "POST",
              url: "http://119.23.253.225:8080/lechang-bpm/tableCRUDController/select",
              data: JSON.stringify(data, null, 4),
              contentType: "application/json",
              success: function (recieve) {
                  if (recieve.success&&recieve.msg.indexOf("成功")) {
                      if(object.actionType!='update'&&object.actionType!='deleted'){
                          globalStorage.lastSelectData[object.id||object.selectObj.showCopy.copyRow][0][data.tableName]=$.extend({},data);
                      }
                      if (recieve.obj.length != 0) {
                          if(func){func(recieve,object,next);}
                          if(Object.keys(next).length){bindOf(next);}
                      } else {
                          alert("匹配项不存在");
                      }
                  }else {
                      alert('查询失败！');
                  }
              },error: function(unrecieve) {
                  var recieve={"success":true,"msg":"请求成功!","obj":[{"id":1,"rat":null,"dog":"嘻嘻","delstatus":0,"cat":"可可","pig":"哈哈"},{"id":2,"rat":null,"dog":"美美","delstatus":0,"cat":"可可","pig":"图图"},{"id":3,"rat":null,"dog":"噢噢","delstatus":0,"cat":"三三","pig":"天天"},{"id":4,"rat":null,"dog":"咳咳","delstatus":0,"cat":"排排","pig":"威威"},{"id":15,"rat":null,"dog":"78","delstatus":0,"cat":null,"pig":"45"},{"id":16,"rat":null,"dog":"78","delstatus":0,"cat":null,"pig":"45"},{"id":18,"rat":null,"dog":"22","delstatus":0,"cat":null,"pig":"33"},{"id":20,"rat":null,"dog":"22","delstatus":0,"cat":null,"pig":"33"},{"id":22,"rat":null,"dog":"22","delstatus":0,"cat":null,"pig":"33"},{"id":24,"rat":null,"dog":"67","delstatus":0,"cat":null,"pig":"90"}],"attributes":{"page":{"currentPage":2,"pageSize":10,"startNum":0,"totalNum":29,"totalPage":3}},"jsonStr":"{\"msg\":\"请求成功!\",\"success\":true,\"obj\":[{\"id\":1,\"dog\":\"福福\",\"delstatus\":0,\"cat\":\"咪咪\",\"pig\":\"吱吱\"},{\"id\":2,\"dog\":\"美美\",\"delstatus\":0,\"cat\":\"可可\",\"pig\":\"图图\"},{\"id\":3,\"dog\":\"噢噢\",\"delstatus\":0,\"cat\":\"三三\",\"pig\":\"天天\"},{\"id\":4,\"dog\":\"咳咳\",\"delstatus\":0,\"cat\":\"排排\",\"pig\":\"威威\"},{\"id\":15,\"dog\":\"78\",\"delstatus\":0,\"pig\":\"45\"},{\"id\":16,\"dog\":\"78\",\"delstatus\":0,\"pig\":\"45\"},{\"id\":18,\"dog\":\"22\",\"delstatus\":0,\"pig\":\"33\"},{\"id\":20,\"dog\":\"22\",\"delstatus\":0,\"pig\":\"33\"},{\"id\":22,\"dog\":\"22\",\"delstatus\":0,\"pig\":\"33\"},{\"id\":24,\"dog\":\"67\",\"delstatus\":0,\"pig\":\"90\"}],\"attributes\":{\"page\":{\"currentPage\":1,\"pageSize\":10,\"startNum\":0,\"totalNum\":29,\"totalPage\":3}}}"};
                  if(object.actionType!='update'&&object.actionType!='deleted'){
                      globalStorage.lastSelectData[object.id||object.selectObj.showCopy.copyRow][0][data.tableName]=$.extend({},data);
                  }
                  if (recieve.obj.length != 0) {
                      if(func){func(recieve,object,next);}
                      if(Object.keys(next).length){bindOf(next);}
                  } else {
                      alert("匹配项不存在");
                  }
                  console.log("上传失败!"+unrecieve);
              }
          })
      },
      selectNotAsync:function (data,func,object,next) {
          object=object||{};
          $.ajax({
              type: "POST",
              url: "http://119.23.253.225:8080/lechang-bpm/tableCRUDController/select",
              data: JSON.stringify(data, null, 4),
              async:false,
              contentType: "application/json",
              success: function (recieve) {
                  if (recieve.success&&recieve.msg.indexOf("成功")) {
                      if(object.actionType!='update'&&object.actionType!='deleted') {
                          globalStorage.lastSelectData[object.selectObj.showField[data.tableName].id][0][data.tableName] = $.extend({}, data);
                      }
                      if (recieve.obj.length != 0) {
                          if(func){
                              return func(recieve,object,next);
                          }
                      } else {
                          alert("匹配项不存在");
                      }
                  }else {alert('查询失败！');}
              },error: function(unrecieve) {
                  console.log("上传失败!"+unrecieve);
              }
          })
      },
      update:function (data,func,object,next) {
          object=object||{};
          $.ajax({
              type: "POST",
              url: "http://119.23.253.225:8080/lechang-bpm/tableCRUDController/update",
              data: JSON.stringify(data, null, 4),
              contentType: "application/json;charset=utf-8",
              success: function (recieve) {
                  if (recieve.success&&recieve.msg.indexOf("成功")) {
                      if (recieve.obj.length != 0) {
                          if(func){func(recieve,object,next);}
                          if(Object.keys(next).length){bindOf(next);}
                      } else {
                          alert("匹配项不存在");
                      }
                  }else {alert('更新失败！');}
              },error: function(unrecieve) {
                  console.log("上传失败!"+unrecieve);
              }
          })
      },
      deleted:function (data,func,object,next) {
          object=object||{};
          $.ajax({
              type:"POST",
              url:"http://119.23.253.225:8080/lechang-bpm/tableCRUDController/delete",
              data:JSON.stringify(data,null,4),
              contentType:"application/json;charset=utf-8",
              success: function (recieve) {
                  if (recieve.success&&recieve.msg.indexOf("成功")) {
                      if (recieve.obj.length != 0) {
                          if(func){func(recieve,object,next);}
                          if(Object.keys(next).length){bindOf(next);}
                      } else {
                          alert("匹配项不存在");
                      }
                  }else {alert('删除失败！');}
              },error: function(unrecieve) {
                  console.log("上传失败!"+unrecieve);
              }
          })
      },
      fileSelect:function (data,func,object,next) {
          if(typeof func!='Function'&&typeof object!='Object'){
              func=ajaxTemplate.prototype.package.selectType2;
              object={}
          };
          object=object||{};
          $.ajax({
              type:"GET",
              url:"http://119.23.253.225:8080/lechang-bpm/FMInfoController/get",
              data:data.data,
              contentType:"application/json;charset=utf-8",
              success: function (recieve) {
                  if (recieve.success&&recieve.msg.indexOf("成功")) {
                      if (recieve.obj.length != 0) {
                          if(func){func(recieve,object,next);}
                          if(Object.keys(next).length){bindOf(next);}
                      } else {
                          alert("匹配项不存在");
                      }
                  }else {alert('获取失败！');}
              },error: function(unrecieve) {
                  console.log("传参失败!"+unrecieve);
              }
          })
      },
      fileUpdate:function (data,func,object,next) {
          object=object||{};
          $.ajax({
              type:"POST",
              url:"http://119.23.253.225:8080/lechang-bpm/FMInfoController/update",
              data:JSON.stringify(data,null,4),
              contentType:"application/json;charset=utf-8",
              success: function (recieve) {
                  if (recieve.success&&recieve.msg.indexOf("成功")) {
                      if (recieve.obj.length != 0) {
                          if(func){func(recieve,object,next);}
                          if(Object.keys(next).length){bindOf(next);}
                      } else {
                          alert("匹配项不存在");
                      }
                  }else {alert('更新失败！');}
              },error: function(unrecieve) {
                  console.log("传参失败!"+unrecieve);
              }
          })
      },
      filedeleted:function (data,func,object,next) {
          object=object||{};
          $.ajax({
              type:"POST",
              url:"http://119.23.253.225:8080/lechang-bpm/FMInfoController/delete",
              data:JSON.stringify(data,null,4),
              contentType:"application/json;charset=utf-8",
              success: function (recieve) {
                  if (recieve.success&&recieve.msg.indexOf("成功")) {
                      if (recieve.obj.length != 0) {
                          if(func){func(recieve,object,next);}
                          if(Object.keys(next).length){bindOf(next);}
                      } else {
                          alert("匹配项不存在");
                      }
                  }else {alert('删除失败！');}
              },error: function(unrecieve) {
                  console.log("传参失败!"+unrecieve);
              }
          })
      }
  },
  ajaxFunc:function (selectObj,next) {
      this.package[selectObj['actionType']](selectObj,next);
  }
};
function resolueData() {
}
resolueData.prototype={
    tableResole:{
        tableNetParent:function (obj) {
            var parentArr=[],keys=Object.keys(obj),children=[];
            for(var key in obj){
                children.push(obj[key]);
            }
        },
        showField:function (tableFieldObj,showFieldObj,id) {
            var storage={};
            for(var table in showFieldObj){
                if(showFieldObj[table].id==id){
                    globalStorage.showField[globalStorage.tablesId[table]]=storage[globalStorage.tablesId[table]]=this.objReturn(tableFieldObj,showFieldObj[table].fieldName,'fieldName','name');
                }
            }return storage;
        },
        objReturn:function (arr1,arr2,name1,name2) {
            var nameStorage={},showField=[];
            for(var i=0;i<arr1.length;i++){
                nameStorage[arr1[i][name1]]=arr1[i];
            }
            for(i=0;i<arr2.length;i++){
                showField.push(nameStorage[arr2[i][name2]]);
            }return showField;
        }
    },
    fileResole:{
        openFile:function () {
            
        }
    }
};

function communicating(){
    if('WebSocket' in window){
        this.wsObj=new WebSocket('ws://119.23.253.225:8080/lechang-bpm/websocket/socketServer');
    }else if('MozWebSocket' in window){
        this.wsObj=new MozWebSocket('ws://119.23.253.225:8080/lechang-bpm/websocket/socketServer');
    }else {
        this.wsObj=new SockJS('http://119.23.253.225:8080/lechang-bpm/socketjs/socketServer');
    }
    this.wsObj.onopen=this.onOpen;
    this.wsObj.onmessage=this.onMessage;
    this.wsObj.onclose=this.onClose;
    this.wsObj.onerror=this.onError;
}
communicating.prototype={
    wsObj:null,
    msControl:null,
    keyEnter:function(event){       //enter键输入信息->输入信息处理
        var evt=evt?evt:(window.event?window.event:null);
        if (evt.keyCode==13){
            this.doSend();
        }
    },
    dataParse:function(thing){
        try {
            return JSON.parse(thing).join('@');
        }catch (ex){
            return thing;
        }
    },
    doSend:function(){      //输入信息与处理->ws发送信息  //信息初始化
        const dom=$('.send-msg');
        let mUser=wsCommunicating.dataParse(dom.find('input.userList').val()),selected=dom.find('select.userList').val();
        if(selected){
            mUser=selected;
        }
        if (typeof this.wsObj==="undefined"){
            alert("websocket还没有连接，或者连接失败，请检测");
            return false;
        }
        if (this.wsObj.readyState==3) {
            alert("websocket已经关闭，请重新连接");
            return false;
        }
        var func=function (mUser,filePath) {
            let message = {
                mStatus: $('button.btn.classify').val(),
                mUser: mUser,
                mTime: dataFormat(),
                mLink: $('input.webSend:eq(0)').val() ? $('input.webSend:eq(0)').val() : '',
                mTitle: $('input.titleSend:eq(0)').val() ? $('input.titleSend:eq(0)').val() : '',
                mMessage: $('textarea.contentSend:eq(0)').val() ? $('textarea.contentSend:eq(0)').val() : alert('无填充内容。'),
                mFile:filePath
            };
            let str=message.mStatus+'@lechang@'+message.mUser+'@lechang@'+message.mTime+'@'+message.mLink+'@'+message.mFile+'@'+message.mTitle+'@'+message.mMessage;
            wsCommunicating.wsObj.send(str);
        }
        if($('#fileUploading')[0].files.length && $('span.file')[0].textContent){
            var fileObj=new fileCtrl();
            var filePath='';
            fileObj.fileUploadAjax({
                file:$('#fileUploading')
            },function(){       //上传文件后
                var fileO=new fileCtrl();
                fileO.selectFile({
                    keyword:$('#fileUploading')[0].files[0].name
                    // keyword:'会成为新一代宫斗剧吗'
                },undefined,function(recieve){      //查询到文件后
                    filePath=recieve.obj[0].path;
                    func(mUser,filePath);
                })
            });
        }else{
            func(mUser);
        }

        // console.log(websocket);
        // $("#message").val('');
        // this.writeToScreen('<span style="color:green">你发送的信息&nbsp;'+formatDate(new Date())+'</span><br/>'+ message);

        return true;
    },
    writeToScreen:function(message) {       //ws接收信息->显示信息与处理
        var div = "<div class='newmessage'>"+message+"</div>";
        var d = $("#output");
        var d=d[0];
        var doScroll = d.scrollTop == d.scrollHeight - d.clientHeight;
        $("#output").append(div);
        if (doScroll) {
            d.scrollTop = d.scrollHeight - d.clientHeight;
        }
    },
    onOpen:function(event){     //链接完成->反应函数
        var msControl=new messageControl();
        var msShow=new messageShow($('.msg-tb.receive > tbody'));
        msControl.getUnreadMessage();       //获取未读信息
        msControl.getAllMessage();
        msShow.unReadNum=Object.keys(msControl.unReadMessage).length;
    },
    onMessage:function(event){      //服务器发送信息->反应函数
        var msControl=new messageControl();
        var msShow=new messageShow($('.msg-tb.receive > tbody'));
        var receiveObj=typeof event.data == 'object'?event.data:JSON.parse(event.data);
        if(true){       //如果未打开某用户发送窗口
            var obj=msControl.parseWsMessageRaw(receiveObj,'userToUnRead',{});
            msShow.unReadNum=parseInt(msShow.unReadNum)+Object.keys(obj).length;
            msShow.appendArr(obj,obj.type);
            msControl.parseWsMessage(receiveObj,'userToUnRead',{});
        }else{          //如果打开了某用户发送窗口
            msControl.parseWsMessage(receiveObj,'userToMessage',{});
        }
        //[保留位置]用于刷新UI控件的显示,重新挂载未读信息的资料
    },
    onClose:function(event){        //关闭链接->反应函数
        if(confirm('是否关闭客户端:')){

        }else{

        }
    },
    onError:function(event){        //发送错误->反应函数
        alert('在线通信中断，请刷新重连');
    }
};

function messageControl(){
    return dataBindFunc(this);
}
messageControl.prototype={
    allMessage:{
        3:{
            "mId": "3",
            "mMessage": "有很多人@你啊",
            "mStatus": "1",
            "mUser": "sony",
            "mType": "allMessage",
            "mTitle":"工作表制定",
            "mTime": "20180927",
            "mLink": ""
        },
        4:{
            "mId": "4",
            "mMessage": "有人@你啊",
            "mStatus": "0",
            "mUser": "sun",
            "mType": "allMessage",
            "mTime": "20180708",
            "mTitle":"任务表制定",
            "mLink": "www.baidu.com"
        }
    },      //信息编码——>所有信息
    unReadMessage:{
        4:{
            "mId": "4",
            "mMessage": "有人@你啊",
            "mStatus": "0",
            "mUser": "sun",
            "mType": "unReadMessage",
            "mTitle":"任务表制定",
            "mTime": "20180708",
            "mLink": "www.baidu.com"
        }
    },   //信息编码——>未读信息
    targetUser:['sun','sakurai','ramen','pendo'],      //用户列表
    sendMessage:[],
    userToMessage:{},   //用户编码——>>所有信息(含信息编码)
    userToUnRead:{},    //用户编码——>>未读信息(含信息编码)
    getAllMessage:function(){
        $.ajax({
            type:"POST",
            url:"http://119.23.253.225:8080/lechang-bpm/messageController/getAllMessage",
            data:null,
            contentType:"application/json;charset=utf-8",
            success: function (recieve) {
                if (recieve.success&&recieve.msg.indexOf("成功")) {
                    if (Object.keys(recieve.obj).length != 0) {
                        // if(func){func(recieve.obj,object);}     //处理缓存信息函数({缓存信息},{附加信息})
                        msCtrlWin.__proto__.allMessage=msCtrlWin.parseWsMessageRaw(recieve.obj,'allMessage',{});
                        msCtrlWin.__proto__.userToMessage=msCtrlWin.parseWsMessage(recieve.obj,'userToMessage',{});
                        msShowWin.onShowStatus='allMessage';
                    } else {
                        //缓存信息为空
                        recieve.obj={
                            3:'0@sun@2013@baidu.com@http://localhost:63342/lechang1923/bootstrap-3.3.7-dist/css/bootstrap.min.css@题目@xixiyo',
                            4:'1@misubishi@2017@netease.com@@title@iwillgetit'
                        };
                        msCtrlWin.__proto__.allMessage=msCtrlWin.parseWsMessageRaw(recieve.obj,'allMessage',{});
                        msCtrlWin.__proto__.userToMessage=msCtrlWin.parseWsMessage(recieve.obj,'userToMessage',{});
                        msShowWin.onShowStatus='allMessage';
                    }
                }else {alert('获取失败');}
            },error: function(unrecieve) {
                messageControl.prototype.allMessage=msCtrlWin.parseWsMessageRaw({
                    3:'3@0@sun@2013@baidu.com@http://localhost:63342/lechang1923/bootstrap-3.3.7-dist/css/bootstrap.min.css@题目@xixiyo',
                    4:'4@1@misubishi@2017@netease.com@http://localhost:63342/lechang1923/bootstrap-3.3.7-dist/css/bootstrap.min.css@title@iwillgetit'
                },'allMessage',{});
                msShowWin.onShowStatus='allMessage';
                console.log("传参失败!"+unrecieve,msCtrlWin.parseWsMessageRaw({
                    3:'3@0@sun@2013@baidu.com@http://localhost:63342/lechang1923/bootstrap-3.3.7-dist/css/bootstrap.min.css@题目@xixiyo',
                    4:'4@1@misubishi@2017@netease.com@http://localhost:63342/lechang1923/bootstrap-3.3.7-dist/css/bootstrap.min.css@title@iwillgetit'
                },'allMessage',[]));
            }
        })
    },
    getUnreadMessage:function(){
        $.ajax({
            type:"POST",
            url:"http://119.23.253.225:8080/lechang-bpm/messageController/getUnreadMessage",
            data:null,
            contentType:"application/json;charset=utf-8",
            success: function (recieve) {
                if (recieve.success&&recieve.msg.indexOf("成功")) {
                    if (Object.keys(recieve.obj).length != 0) {
                        // if(func){func(recieve.obj,object);}     //处理缓存信息函数({缓存信息},{附加信息})
                        msCtrlWin.__proto__.unReadMessage=msCtrlWin.parseWsMessageRaw(recieve.obj,'unReadMessage',{});
                        msCtrlWin.__proto__.userToUnRead=msCtrlWin.parseWsMessage(recieve.obj,'userToUnRead',{});
                        msShowWin.unReadNum=Object.keys(recieve.obj).length;
                        msShowWin.onShowStatus='unReadMessage';
                    } else {
                        //缓存信息为空
                        messageControl.prototype.unReadMessage = msCtrlWin.parseWsMessageRaw({
                            3:'0@sun@2013@baidu.com@http://localhost:63342/lechang1923/bootstrap-3.3.7-dist/css/bootstrap.min.css@xixiyo@iwillgetit',
                            4:'1@misubishi@2017@netease.com@http://localhost:63342/lechang1923/bootstrap-3.3.7-dist/css/bootstrap.min.css@题目@iwillgetit'
                        },'unReadMessage',{});
                        msShowWin.onShowStatus='unReadMessage';
                        messageShow.prototype.unReadNum=Object.keys({
                            3:'0@sun@2013@baidu.com@http://localhost:63342/lechang1923/bootstrap-3.3.7-dist/css/bootstrap.min.css@xixiyo@iwillgetit',
                            4:'1@misubishi@2017@netease.com@http://localhost:63342/lechang1923/bootstrap-3.3.7-dist/css/bootstrap.min.css@题目@iwillgetit'
                        }).length;
                    }
                }else {alert('获取失败');}
            },error: function(unrecieve) {
                console.log("传参失败!"+unrecieve);
                // var msCtrlWin=new messageControl();
                // var msShow=new messageShow();
            }
        })
    },
    getTargetUser:function(str){
        var result=[];
        $.ajax({
            type:"POST",
            url:"http://119.23.253.225:8080/lechang-bpm/messageController/getTargetUser",
            data:JSON.stringify({roleCode:str},null,4),
            contentType:"application/json;charset=utf-8",
            async:false,
            success: function (recieve) {
                if (recieve.success&&recieve.msg.indexOf("成功")) {
                    if (Object.keys(recieve.obj).length != 0) {
                        // if(func){func(recieve.obj,object);}     //处理缓存信息函数({缓存信息},{附加信息})
                        var msCtrlWin=new messageControl();
                        result=msCtrlWin.targetUser=recieve.obj;
                    } else {
                        //缓存信息为空
                    }
                }else {alert('获取失败');}
            },error: function(unrecieve) {
                console.log("传参失败!"+unrecieve);
            }
        })
        return result;
    },
    confirmRead:function(data){
        $.ajax({
            type:"POST",
            url:"http://119.23.253.225:8080/lechang-bpm/messageController/confirmRead",
            data:JSON.stringify(data,4,false),
            contentType:"application/json;charset=utf-8",
            success: function (recieve) {
                if (recieve.success&&recieve.msg.indexOf("成功")) {
                    //成功
                }else {alert('获取失败');}
            },error: function(unrecieve) {
                console.log("传参失败!"+unrecieve);
            }
        })
    },
    delMessage:function(data){
        $.ajax({
            type:"POST",
            url:"http://119.23.253.225:8080/lechang-bpm/messageController/delMessage",
            data:JSON.stringify(data,4,false),
            contentType:"application/json;charset=utf-8",
            success: function (recieve) {
                if (recieve.success&&recieve.msg.indexOf("成功")) {
                    //成功
                }else {alert('获取失败');}
            },error: function(unrecieve) {
                console.log("传参失败!"+unrecieve);
            }
        })
    },
    parseWsMessage:function(recieveList,type,object){            //用户编码——>索引信息编码——>索引信息
        var obj=typeof object=='object'?object:{};
        var reg=/@[^@]*/g;
        for(var i in recieveList){
            var obji={};
            obji['mId']=i;     //收信息id
            obji['mMessage']='';
            obji['mStatus']=recieveList[i].match(/^\d*[^@]/)[0];        //紧急程度
            if(typeof recieveList[i]=='string'){
                var arr=recieveList[i].match(reg);
                obji['mUser']=arr[0].replace(/^@/,'');          //用户名称
                obji['mType']=(obji['mId'] in  this.unReadMessage?'unReadMessage':'allMessage')||type; //是否未读
                obji['mTime']=arr[1].replace(/^@/,'');          //发送时间
                obji['mLink']=arr[2].replace(/^@/,'');          //发送时间
                arr[3]=arr[3].replace(/^@/,'');
                for(var j=3;j<arr.length;j++){                 //信息获取
                    obji['mMessage']=obji['mMessage']+arr[j];
                }
            }
            if(!this[type][obji['mUser']]){
                this[type][obji['mUser']]={};
            }
            this[type][obji['mUser']][obji['mId']]=obji;       //userToMessage={ userCode:{ messageId:messageObj,...}...}
        }
        return Object.keys(recieveList).length>0?obj:obji;      //recieveList只输入单条信息或者输入多条信息的不同返回
    },
    parseWsMessageRaw:function(recieveList,type,object){         //信息编码——>索引信息
        var obj=object instanceof Array?[]:object;          ////object为{}或[]代表是否return为Array类型
        var reg=/@[^@]*/g;
        for(var i in recieveList){
            var obji={};
            obji['mId']=i;     //收信息id
            obji['mMessage']='';
            obji['mStatus']=recieveList[i].match(/^\d*[^@]/)[0];
            if(typeof recieveList[i]=='string'){
                var arr=recieveList[i].match(reg);
                // obji['mStatus']=arr[0].replace(/^@/,'');        //紧急程度
                obji['mUser']=arr[0].replace(/^@/,'');          //用户名称
                obji['mType']=(obji['mId'] in  this.unReadMessage?'unReadMessage':'allMessage')||type; //是否未读
                obji['mTime']=arr[1].replace(/^@/,'');          //发送时间
                obji['mLink']=arr[2].replace(/^@/,'');          //网页
                obji['mFile']=arr[3].replace(/^@/,'');          //附件
                obji['mTitle']=arr[4].replace(/^@/,'');          //题目
                arr[5]=arr[5].replace(/^@/,'');
                for(var j=5;j<arr.length;j++){                 //信息获取
                    obji['mMessage']=obji['mMessage']+arr[j];
                }
            }
            if(object instanceof Array ){
                obj.push(obji);
            }else {
                obj[obji['mId']] = obji;       //Message={ messageId:messageObj,...}
            }
        }
        return Object.keys(recieveList).length>0?obj:obji;      //recieveList只输入单条信息或者输入多条信息的不同返回
    },
    userListOpen:function(selector,userList,userTo){

    }
};
function fileCtrl(selectorTable){
    this.__proto__.selectorTable=selectorTable||'#table_div1';
}
fileCtrl.prototype= {
    uploading:null,
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
        $(field).find('thead').append(tr);
        //page_set(1,5,10);
    },
    tableData(obj, field) {
        var number = obj.length;
        for (var j = 0; j < number; j++) {
            var tr='<tr>' +
                '<td>'+obj[j].fmId+'</td>'+
                '<td>'+obj[j].fileName+'</td>'+
                '<td>'+obj[j].operateTime+'</td>'+
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
            success:function (current) {
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
function messageShow(selector){
    if(typeof selector=='string'){      //选择器字符串和DOM对象的容器container
        this.container=$(selector);
    }else if(this.isDom(selector)){
        this.container=selector;
    }
    return dataBindFunc(this);
}
messageShow.prototype={
    container:null,
    onShowStatus:'unReadMessage',
    unReadNum:0,
    isDom:function(obj){        //判断是否DOM对象
        if(typeof HTMLElement === 'object'){
            return obj instanceof HTMLElement;
        }else{
            return obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string';
        }
    },
    onshow:function(e){         //点击所有信息列或未读信息列表或发送用户框的行为
        var val=e?$(e.target).val():null;
        var msCtrlWin=new messageControl();
        var msShow=new messageShow('.msg-tb.receive > tbody');
        var msShow2=new messageShow('.msg-tb.send > tbody');
        if(val=='allList'){
            msShow.cleanAll();
            msCtrlWin.getAllMessage();
            msShow.appendArr(msCtrlWin.allMessage,'allMessage');
        }else if(val=='unReadList'){
            msShow.cleanAll();
            msCtrlWin.getUnreadMessage();
            msShow.appendArr(msCtrlWin.unReadMessage,'unReadMessage');
        }else if(val=='userSend'){
            $('#msgModal:eq(0)').modal('show');
            $('#msgModal:eq(0)').find('.modalType').html('消息发送');
            $('#msgModal:eq(0)').find('button.send').removeClass('confirmMs').html('发送');
            $('#msgModal:eq(0) input').attr('readOnly',false);
            $('#msgModal:eq(0) span.file').empty();
            var $event1=$._data($('input.userList')[0],'events');
            var $event2=$._data($('button.send.btn')[0],'events');
            if(!$event1||!$event1['change']){
                $('input.userList').on('change',(e)=>{
                    let val=$(e.target).val();
                    let msCtrlUserList=new messageControl();
                    let list=msCtrlUserList.getTargetUser(val);
                    $('select.userList').empty();
                    select_add($('select.userList'),list||msCtrlUserList.targetUser);
                })
            }
            if(!$event2||!$event2['click']){
                $('button.send.btn').click((e)=>{
                    var mUser=$('select.userList:eq(0)').val()?$('select.userList:eq(0)').val():(()=>{alert('请选择目标用户');throw SyntaxError()})();
                    var mTitle=$('input.titleSend:eq(0)').val()?$('input.titleSend:eq(0)').val():(()=>{alert('请填充题目');throw SyntaxError()})();
                    if($(e.target).hasClass('confirmMs')){
                        mUser=$('input.userList:eq(0)').val();
                        mTitle=mTitle+'[已读]';
                    }

                    if(!$(e.target).hasClass('confirmMs')||true){
                        msCtrlWin.sendMessage.push(val);
                        msShow2.cleanAll();
                        msShow2.appendArr(msCtrlWin.sendMessage);
                    };
                })
            }
        } else{
            msShow.cleanAll();
            msShow.appendArr(msCtrlWin[msShow.onShowStatus],msShow.onShowStatus);      //默认显示(保留)
        }
        $('.toread').on('click',msShowWin.domCtrl);
    },
    appendArr:function(objArr,type){        //对container列表进行消息入队列append
        if(type){      //索引列表objArray入列
            for(var i in objArr){
                if (i != 'type') {
                    $(this.container).append(this.DomMessage(objArr[i]));
                }
            }
        }else if(objArr instanceof Array){        //数组类型生成Dom入列
            for(var i in objArr) {
                $(this.container).append(this.DomSendMessage(objArr[i]));
            }
        }else if(!objArr.type){       //即时入列obj
            $(this.container).append(this[objArr.mType](objArr));
        }
    },
    DomMessage:function(obj){            //信息的模板Dom
        var msCtrl=new messageControl();
        var emergenceLevel={
            0:'common',
            1:'urgency',
            2:'serious'
        };
        var linkDomStr=obj.mLink?('<a href="javascript:linkClick('+obj.mId+')" ><i class="fa fa-mouse-pointer"></i>网址</a>'):'';
        var fileDomStr=obj.mFile?('<a href="'+obj.mFile+'" ><i class="fa fa-mouse-pointer"></i>附件</a>'):'';
        var typeDomStr=obj.mId in msCtrl.unReadMessage?'<button class="btn btn-default">待办</button>':'(已读时间)';
        var template='<tr id="'+obj.mId+'" class="'+emergenceLevel[obj.mStatus]+ ' toread '+obj.type+'">\n' +
            '\t<td><i class="fa fa-circle"></i></td>\n' +
            '\t<td>'+obj.mUser+'</td>\n' +
            '\t<td><span class="lineTitle">'+obj.mTitle+'</span>'+linkDomStr+fileDomStr+'</td>\n' +
            '\t<td>'+obj.mTime+'</td>\n' +
            '\t<td>'+typeDomStr+'</td>\n' +
            '\t<td><i class="fa fa-close"></i></td>\n' +
            '</tr>';
        return template;
    },
    DomSendMessage:function(obj){            //已发信息的模板Dom
        var msCtrl=new messageControl();
        var emergenceLevel={
            0:'common',
            1:'urgency',
            2:'serious'
        };
        var linkDomStr=obj.mLink?('<a href="javascript:linkClick('+obj.mId+')" ><i class="fa fa-mouse-pointer"></i>附件</a>'):'';
        var typeDomStr=true?'<button class="btn btn-default">待办</button>':'<button class="btn btn-default">已办</button>';
        //保留选择。。。好像有点问题这里
        var template='<tr id="'+obj.mId+'" class="'+emergenceLevel[obj.mStatus]+ ' toread '+obj.type+'">\n' +
            '\t<td><i class="fa fa-circle"></i></td>\n' +
            '\t<td>'+obj.mUser+'</td>\n' +
            '\t<td><span class="lineTitle">'+obj.mTitle+'</span>'+linkDomStr+'</td>\n' +
            '\t<td>'+obj.mTime+'</td>\n' +
            '\t<td>'+typeDomStr+'</td>\n' +
            '\t<td><i class="fa fa-close"></i></td>\n' +
            '</tr>';
        return template;
    },
    headerCtrl:function(e){
        var dom=e.delegateTarget;
        var tg=e.target;
        var msShow=new messageShow('.msg-tb.receive > tbody');
        var msAfterSort = msShow.msSort($(tg).attr('value'));
        msShow.cleanAll();
        msShow.appendArr(msAfterSort,true);
        $('.toread').on('click',msShow.domCtrl);
    },
    domCtrl:function(e){        //dom的点击反应操作，保留作为模态框使用
        var dom=e.delegateTarget;
        var tg=e.target;
        var msShow=new messageShow('.msg-tb.receive > tbody');
        if($(tg).hasClass('fa-close')){
            msShow.cleanAll(dom);
        }else if($(tg).hasClass('lineTitle')){
            var msCtrl=new messageControl();
            var $event1=$._data($('#msgModal input.userList')[0],'events');
            var msObj=msCtrl.allMessage[$(dom).attr('id')];
            msShow.showMessageRecieve(msObj,$event1);
        }
    },
    showMessageRecieve:function(msObj,$event1){
        var modalObj=$('#msgModal:eq(0)');
        modalObj.modal('show');
        modalObj.find('textarea').empty();
        modalObj.find('.modalType').html('消息接收');
        modalObj.find('button.send').addClass('confirmMs').html('确认');
        if($event1&&$event1['change']){
            $('#msgModal input.userList:eq(0)').off('change');
            $('#msgModal select.userList:eq(0)').empty();
        }
        modalObj.find('input.userList').val(msObj.mUser).attr('readOnly',true);
        modalObj.find('input.webSend').val(msObj.mLink).attr('readOnly',true);
        modalObj.find('input.titleSend').val(msObj.mTitle).attr('readOnly',true);
        modalObj.find('textarea.contentSend').val(msObj.mMessage);
        modalObj.find('button.classify').html(((str)=>{let stat={0:'普通',1:'紧急'};return stat[str]})(msObj.mStatus));
    },
    cleanAll:function(obj) {        //删除或清空容器内容
        obj ? $(obj).remove() : $(this.container).empty();
    }
    // },
    // changeUnReadNum:function(number){
    //     this.unReadNum=number;
    //     $('.info-num').html(this.unReadNum);
    // }
};
function dataBindFunc(obj){     //ES5使用的数据绑定函数;
    obj.setter=function(prop,initValue,func){
        if(!prop in this){
            throw SyntaxError('属性不在对象中，请重设');
        }
        var using=($.inArray(prop,Object.keys(this))>=0)?this:this.__proto__;
        if(!using[prop+'_x']){
            using[prop+'_x']=using[prop]||0;
        }
        console.log(typeof func);
        if(typeof func=='function'){
            Object.defineProperty(using,prop,{
                configurable:true,
                set:func,
                get:function(){
                return using[prop+'_x'];
            }});
            using[prop]=initValue;
        }else{
            throw SyntaxError('不是函数噢~');
        }
    };
    obj.getter=function(prop,func){
        if(!prop in this){
            throw SyntaxError('属性不在对象中，请重设');
        }
        var using=($.inArray(prop,Object.keys(this))>=0)?this:this.__proto__;
        if(!using[prop+'_x']){
            using[prop+'_x']=0;
        }
        if(typeof func=='function'){
            Object.defineProperty(using,prop,{configurable:true,get:func});
        }else{
            throw SyntaxError('不是函数噢~');
        }
    };

    return obj;
}

function dataFormat(){
    var date=new Date();
    var obj={
        year:date.getFullYear(),
        month:date.getMonth()+1,
        date:date.getDate(),
        day:date.getDay()+1,
        hour:date.getHours(),
        min:date.getMinutes(),
        second:date.getSeconds()
    }
    for(var i in obj){
        obj[i]=obj[i].toString();
    }
    this.dateObect=obj;
    var str=obj.year+'/'+obj.month+'/'+obj.date+' '+obj.hour+':'+obj.min+':'+obj.second;
    return str;
}
dataFormat.prototype={
    dateObect:null,
}

//-------------事件函数---------------
var msCtrlWin=new messageControl();
var msShowWin=new messageShow('.msg-tb.receive > tbody');     //全局messageControl（内置dataBindFunc 数据变化检测对象）
msShowWin.setter('unReadNum',0,function(value){       //变量检测变化函数
    this.unReadNum_x=value;
    $('.info-num').html(value);
    $('a .receive span').html(value);
});
msShowWin.setter('onShowStatus','unReadMessage',function(value){        //改变当前显示列表——触发更改排序对象数据
    this.onShowStatus_x=value;
    var storage=[];
    delete msCtrlWin[value].type;
    for(var i in msCtrlWin[value]){
        storage.push(msCtrlWin[value][i]);
    }
    msCtrlWin.__proto__[value+'Arr']=storage.slice();
    delete storage;
    msShowWin.__proto__['msSort']=(function(contentType){       //闭包内部缓存定义-this为windows
        var direction=true,     //以true为顺排，false为逆排
            storageType = 'default';
        if(storageType != contentType){
            direction=false;
        }
        return function(value){         //携带着缓存数据的闭包外调函数-this为messageShow对象
            var msCtrl = new messageControl();
            direction = direction == true ? false : true;
            var storage= msCtrl[contentType+'Arr'].slice();
            if(storage instanceof Array){
                return storage.sort(function(objA,objB){        //排序逻辑（字符与数字的不同情形）
                    if(!parseInt(objA[value]) && !parseInt(objB[value])){
                        return direction ? objA[value] > objB[value] : objB[value] > objA[value];
                    }else {
                        return direction ? objA[value] - objB[value] : objB[value] - objA[value];
                    }
                });
            }else{
                throw SyntaxError('不是数组？？？');
            }
        }
    })(this.onShowStatus_x);
});


//allMessage赋值时的数组生成,给引用型数据赋setter并不好，不能直接修改allMessage
// msCtrlWin.setter('allMessage',msCtrlWin.allMessage,function(value){
//     var allMessage_x=value;
//     var storage=[];
//     delete value.type;
//     for(var i in value){
//         storage.push(value[i]);
//     }
//     msCtrlWin.__proto__['allMessageArr']=storage.slice();
//     delete storage;
// });
// msCtrlWin.setter('unReadMessage',msCtrlWin.unReadMessage,function(value){        //unReadMessage赋值时的数组生成
//     var unReadMessage_x=value;
//     var storage=[];
//     delete value.type;
//     for(var i in value){
//         storage.push(value[i]);
//     }
//     msCtrlWin.__proto__['unReadMessageArr']=storage.slice();
//     delete storage;
//     });
var wsCommunicating=new communicating();
msCtrlWin.getUnreadMessage();
msCtrlWin.getAllMessage();
msShowWin.onshow();
$('.send').click(wsCommunicating.doSend);
linkClick=function(messageCode){      //点击附件跳转——外部调用函数
    var msCtrl=new messageControl();
    var link=msCtrl.allMessage[messageCode].mLink;
    if(messageCode in msCtrl.unReadMessage){
        msCtrl.confirmRead(messageCode);
        delete msCtrl.unReadMessage[messageCode];
        messageShow.prototype.unReadNum--;
        msShowWin.onshow();
    }
    window.open(link);
};
$('.msg-tb tr').on('click',msShowWin.headerCtrl);
$('.btns').on('click','button',msShowWin.onshow);
$(".open-tap-top").bind("click",open_tap_top);
open_tap_i();
$(".right-tree .open-tap").bind("click", function (e) {
    var tg=$(e.target);
    //alert(tg.prop("tagName"));
    if(tg.prop("tagName")=="I"){
        $("#myModal").modal("hide");
    }else {
        $("#myModal").modal("show");
    }
});
$(".rightControlSet[mouseoncolor]").hover(function () {
    if(this.btnOverObj){
    }else {
        var obj=new mouseAction();
        this.btnOverObj=obj;
    }this.btnOverObj.mouseOnBackgroundAnimate(this,$(this).attr('mouseoncolor'));
});
$('.data_show').on('click','th',function (e) {
    var tg=$(e.target);
    console.log(tg,tg.parents('.rightControlSet').attr('id'),tg.attr('name'));
    var idName=tg.parents('.rightControlSet').attr('id');
    var tableName=$(".page_"+idName).attr('name');
    var data=$.extend({},globalStorage.lastSelectStr[idName].json[0]);
    for(var i=0;i<globalStorage.lastSelectStr[idName].json.length;i++){
        if(tableName==globalStorage.lastSelectStr[idName].json[i].tableName){
            data=$.extend({},globalStorage.lastSelectStr[idName].json[i]);
        }
    }
    if(globalStorage.lastSelectData[idName][0][tableName].colum==tg.attr('name')){
        data.order=(data.order===globalStorage.sortInformation.preOrder)?'down':'up';
    }else {
        data.colum=tg.attr('name');
        data.order=globalStorage.sortInformation.preOrder;
    }
    ajaxTemplate.prototype.ajaxPackage.select(data,pageSetCallback,{lastSelectStr:globalStorage.lastSelectStr[idName],tableName:tableName,id:idName},null);
});
//-------------非ajax函数-------------
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
function showOf(id,data,tableName,objCreate) {
    //if(obj create映射多表多字段按索引多行显示)elseif(单纯的一个字符显示)else(表格显示)
    if(typeof objCreate =='object'){
        var classObj=document.getElementsByClassName(id.replace(/\./,'')+'-rowClass')[objCreate.rowNum];
        if(classObj.localName=='input'||classObj.localName=='button'){
            $(classObj).val(data);
        }else{
            $(classObj).html(data);
        }
    }else if(typeof data !=='object') {
        $("#" + id).html(data);
    }else{
        globalStorage.tableData=data;
        if(globalStorage.showField[globalStorage.tablesId[tableName]]){
            tableDataPlace(data,globalStorage.tablesId[tableName],id);
        }else {
            ajaxTemplate.prototype.ajaxPackage.showTableField(globalStorage.tablesId[tableName], tableFieldStorage, globalStorage.tablesId[tableName], id);
        }page_set(1,data['attributes']['page']['totalPage'],globalStorage.lastSelectData[id][0][tableName].pageSize,id,globalStorage.lastSelectStr[id],function(current,id){
            globalStorage.lastSelectData[id][0][$(".page_"+id).attr('name')].currentPage=current;
            var data=globalStorage.lastSelectData[id][0][$(".page_"+id).attr('name')];
            $('#'+id+' tbody.data_show').empty();
            ajaxTemplate.prototype.ajaxPackage.select(data,pageSetCallback,{lastSelectStr:globalStorage.lastSelectStr[id],tableName:$(".page_"+id).attr('name'),id:id},null);
        });          //开始构造前端表格！！
    }
}
// function btnOverAction(color) {
//     if(this.btnOverObj){
//         this.btnOverObj.mouseOnBackgroundAnimate(this,color);
//     }else {
//         var obj=new mouseAction();
//         this.btnOverObj=obj;
//     }
// }
function tableShow(recieve,pack,next) {
    if(recieve.obj.length==globalStorage.pageInformation.pageSize){
        pack.selectObj.json[pack.i].currentPage++;
        globalStorage.pageInformation.pageNumStorage[pack.selectObj.json[pack.i].tableName]=pack.selectObj.json[pack.i].currentPage;
        ajaxTemplate.prototype.ajaxPackage.select(pack.selectObj.json[pack.i],arguments.callee,pack,next);
    }
}
var tableStorage=function (recieve,object) {
    for(var i=0;i<recieve.obj.length;i++){
        globalStorage.tablesId[recieve.obj[i]['tableName']]=recieve.obj[i]['id'];
    }
};ajaxTemplate.prototype.ajaxPackage.showTables(null,tableStorage,null);        //getTable函数应用处理

var tableFieldStorage=function (recieve,object,id) {       //object=='030230234```'
    globalStorage.tableField[object]=recieve.obj;
    if((recieve.obj.length*90+150)>parseInt($("#table_div1").width())){
        $("#table_div2").css({"width":recieve.obj.length*120+150+"px"});
        $("#table_div1").css({"overflow-x":"scroll"});
    }
    var o=new resolueData();
    insert_tableField(o.tableResole.showField(globalStorage.tableField[object],globalStorage.showField,id)[object],'#'+id+' thead.data_show');
    tableDataPlace(globalStorage.tableData,object,id);
};

var tableDataPlace=function (recieve,tableNum,id) {
    insert_table_data(recieve.obj,tableNum,'#'+id+' tbody.data_show');
};

function insert_table_data(obj,tableNum,field) {
    $(field).empty();
    var number = obj.length;
    var fields=globalStorage.showField[tableNum];
    for (var j = 0; j < number; j++) {
        if (obj[j].delstatus == 0) {
            var tr = document.createElement("tr");
            for (var i = 0; i < fields.length; i++) {
                if (fields[i].fieldName != "delstatus") {  //data_field_recieve[i].fieldName != "id" &&
                    //var fieldName=obj_keys[j];
                    var el = obj[j][fields[i].fieldName];         //到时改为obj【j】.content
                    var td = document.createElement("td");
                    td.innerHTML = el;
                    tr.appendChild(td);
                }
            }$(field).append(tr);
        }
    }
}

var pageSetCallback=function (recieve,object) {
    var map=recieve.attributes,selectStr=object.lastSelectStr,id=object.id,tableName=object.tableName;
    insert_table_data(recieve.obj,globalStorage.tablesId[tableName],'#'+id+' tbody.data_show');
    page_set(map.page.currentPage,map.page.totalPage,map.page.pageSize,id,selectStr,function(current,id) {
        globalStorage.lastSelectData[id][0][$(".page_"+id).attr('name')].currentPage=current;
        var data=globalStorage.lastSelectData[id][0][$(".page_"+id).attr('name')];
        $('#'+id+' tbody.data_show').empty();
        ajaxTemplate.prototype.ajaxPackage.select(data,pageSetCallback,{lastSelectStr:globalStorage.lastSelectStr[id],tableName:$(".page_"+id).attr('name'),id:id},null);
    });
};

function page_set(current_page,total_page,page_size,id_name,object,functionObj) {
    var id=id_name||object['showField'][object.json[0].tableName]['id'];       //页码是哪个表的页码呢
    $(".page_"+id).attr('name',function () {
        try {
            return object.json[0].tableName;
        }catch (ex){
            return object.key[0];
        }
    });
    $(".page_"+id).pagination({
        currentPage: parseInt(current_page),// 当前页数
        totalPage: parseInt(total_page),// 总页数
        isShow: true,// 是否显示首尾页
        count: parseInt(page_size),// 显示个数
        homePageText: "首页",// 首页文本
        endPageText: "尾页",// 尾页文本
        prevPageText: "上一页",// 上一页文本
        nextPageText: "下一页",// 下一页文本
        callback: function(current) {
            functionObj(current,id,object);
        }
    });
}

function insert_tableField(obj,field) {       //回掉函数所获json数据的处理
    //alert(JSON.stringify())
    console.log(obj);
    var number=obj.length;
    var tr=document.createElement("tr");
    for(var j=0;j<number;j++){
        //alert(obj[j].content);
        var thShow = obj[j].content+"/"+obj[j].fieldName;         //到时改为obj【j】.content
        var th=document.createElement("th");
        th.setAttribute('name',obj[j].fieldName);
        th.setAttribute('class','sort');
        th.innerHTML=thShow;
        tr.appendChild(th);
    }
    $(field).empty().append(tr);
    //page_set(1,5,10);
}

addPoint=function(value) {  //用于加引号按字符串查询
    return "'"+value+"'";
};
bindOf=function(datas) {    //入口函数main
    //if(表格显示)elseif(多表多字段多行显示)
    if(datas['str'].iterator==1){
        for(var tablesName in datas['str'].showField){
            //每个表格对应一个last select str
            globalStorage.lastSelectStr[datas['str'].showField[tablesName].id]=datas['str'];
        }
    }
    else if(datas['str'].iterator==2){
        //show copy row storage用于保存当前某行的改动信息
        globalStorage.showCopyRowStorage[datas['str'].showCopy.copyRow]=datas['str'].showCopy;
        //一行对应一句last select str
        globalStorage.lastSelectStr[datas['str'].showCopy.copyRow]=datas['str'];
    }
    var data=datas['str'];
    switch (data instanceof Array) {
        //true:data是数组(更新功能)
        case true: {
            for (var i = 0; i < data.length; i++) {
                var arrayAjax = new ajaxTemplate();
                console.log(data[i]);
                arrayAjax.ajaxFunc(data[i],datas['next']);
            }
        }break;
        //false:data不是数组(新增，简单查询，删除，表格显示，多表多字段单行，多表多字段按索引多行)
        case false: {
            //多表多字段相关的事件
            if(data.showField&&Object.keys(data.showField).length){
                globalStorage.showField=data.showField;
                //循环可显示字段获取对应表名
                for(var tablesName in data.showField){
                    //默认lastSelectData关联表格id
                    var showTarget=data.showField[tablesName].id;
                    if(data.iterator==2){
                        //多表多字段按索引自添增时，给予lastSelectData关联行id(基本iterator==2的都含有show copy)
                        showTarget=data.showCopy.copyRow;
                    }
                    globalStorage.lastSelectData[showTarget]=[];
                }
            }
            var objectAjax=new ajaxTemplate();
            //if打开文件类型/elseif文件查询类型/else表格多行显示，多表多字段按索引多行显示，多表多字段单行显示
            if(data.actionType=='fileOpen'){
                objectAjax.package.fileOpen($(this).val(),null);
            } else if(data.actionType=='fileSelect'){
                //复制该行默认的多表多字段按索引自显示的结构，解耦合
                var lastSelectDataRetrive=$.extend({},globalStorage.lastSelectStr[data.data.queryTarget]);
                //把搜索的结果覆盖给原来的自显示操作（没保留原本的限制）
                lastSelectDataRetrive.json[0].data=data.data.replaceData;
                objectAjax.ajaxFunc(lastSelectDataRetrive,datas['next']);
            }else {
                objectAjax.ajaxFunc(data, datas['next']);
            }
        }break;
        default:alert('what?how can you do that?');
    }
};
function open_tap_i() {
    $(".open-tap-top i").addClass("fa fa-chevron-right");
    $(".open-tap > ul").css({"display":"none"});
}
function openTapAnimate(e) {
    var tg= e ;                                         //用于兼容性保留
    var tgDiv_child=tg.parent().next("ul").find("div");
    var tgUl=tg.parent().next("ul");
    var tgI=tg.parent().children("i");
    var tgUl_find=tg.parent().parent().find("ul");
    var tgI_find=tg.parent().next("ul").find("i");
    //alert(tg.html());
    if (tgUl.css("display") == "none") {
        leftTreeClose(tg);
        tg.parent().removeClass("left-tree-div-child").addClass("left-tree-div-parent");
        tgDiv_child.addClass("left-tree-div-child");
        tgUl.css({"display": "block"});
        tgI.removeClass("fa-chevron-right").addClass("fa-chevron-down");
    } else {
        tgUl_find.css({"display": "none"});
        tgI.removeClass("fa-chevron-down").addClass("fa-chevron-right");
        tgI_find.removeClass("fa-chevron-down").addClass("fa-chevron-right");
        if(tg.parentsUntil(".left-tree-div-parent")&&!tg.parent().parent().parent().hasClass("open-tap-top")){
            tg.parent().removeClass("left-tree-div-parent").addClass("left-tree-div-child");
        }else {
            tg.parent().removeClass("left-tree-div-parent");
        }
    }
}
function leftTreeClose(e) {
    var tg=e.parent().parent().parent();
    var tgUl_find=tg.children().find("ul");
    //alert(tgUl_find.html());
    var tgI_find=tg.children().find("i");
    var tgDiv_find=tg.children().find("div");
    console.log(tg);
    if(tg.hasClass("open-tap-top")){
        tgDiv_find.removeClass("left-tree-div-parent");
    }else {
        tgDiv_find.removeClass("left-tree-div-parent").addClass("left-tree-div-child");
    }
    tgUl_find.css({"display":"none"});
    tgI_find.removeClass("fa-chevron-down").addClass("fa-chevron-right");

}
function open_tap_top(e) {
    var tg=$(e.target);
    //alert(tg.prop("tagName"));
    if(tg.prop("tagName")=="I"){
        openTapAnimate(tg);
    }else if(tg.prop("tagName")=="SPAN"||tg.prop("tagName")=="DIV"){
    }
}
//-------------ajax函数---------------




})