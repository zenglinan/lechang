// $(document).ready(function(){
//     // new_element=document.createElement("script");
//     // new_element.setAttribute("type","text/javascript");
//     // new_element.setAttribute("src","../js/wrap_5_temp.js");// 在这里引入了a.js
//     // document.body.appendChild(new_element);
//     //$("#ii").on("click",[{actionType:"insert",json:{tableName:"test_1",data:[{cat:addPoint($("#ui").val()),dog:addPoint($("#uu").val())}]}}],bindOf);
//     //$("#ii").on("click",{actionType:"select",json:[{currentPage:1,pageSize:5,tableName:"test_1",data:[{cat:addPoint($("#ui").val())}]}],tableIndex:{outputIndex:{},inputIndex:{test_1:"cat"}},showField:{test_1:{fieldName:"pig",id:"iu"}},iterator:0},bindOf);
//     $("#ii").on("click",{actionType:"select",json:[{currentPage:1,pageSize:5,tableName:"test_1",data:[{cat:addPoint($("#ui").val())}]},{currentPage:1,pageSize:5,tableName:"test_2",data:[{dog:addPoint($("#uu").val())}]}],tableIndex:{outputIndex:{test_2:"cat"},inputIndex:{test_1:"cat"}},showField:{test_1:{fieldName:"pig",id:"iu"}},iterator:0},bindOf);
// });

$(document).ready(function(){
    // var data={str:[{actionType:"insert",json:{tableName:"test_1",data:[{dog:addPoint($("#ui").val()),pig:addPoint($("#uu").val())}]}}]};

    // $("#ii").on("click",function () {
    //     var data=[{actionType:"insert",json:{tableName:"test_1",data:[{dog:addPoint($("#ui").val()),pig:addPoint($("#uu").val())}]}}];
    //     console.log(data);
    //     bindOf(data);
    // });
    // $("#ii").on("click",function(){
    //     var data= {actionType:"update",
    //         json:[
    //             {actionType:"select",currentPage:1,pageSize:5,tableName:"test_1", data:[{dog:addPoint($("#ui").val()),pig:addPoint($("#uu").val())}]},
    //             {actionType:"update",tableName:"org",data:[{dog:addPoint($("#iu").val())}]},
    //             {actionType:"update",tableName:"test_1",data:[{cat:addPoint($("#iu").val())}]}
    //         ],
    //         updateField:{org:{fieldName:"dog",id:"iu"},test_1:{fieldName:"cat",id:"iu"}},iterator:0};
    // bindOf(data);
    // });
    // var o={name:'kaka',id:90};
    // console.log(o);
    // var child={};
    // $.extend(child,o);
    // child.name='tutu';
    // console.log(child,o);
    // function cout() {
    //   alert('开心');
    // };
    // $("#ii").on("click",function(){var data={actionType:"deleted",json:[{actionType:"deleted",tableName:"test_1",data:[{dog:addPoint($("#ui").val()),pig:addPoint($("#uu").val())}]}],iterator:0}; bindOf(data); });
    // $("#ii").on("click",function(){ var data={ str:[{actionType:"insert",json:{tableName:"test_1",data:[{cat:addPoint($("#ui").val())}]}}],next:{ str:{actionType:"select",json:[{currentPage:1,pageSize:5,tableName:"test_1",data:[{cat:addPoint($("#ui").val())}]}],tableIndex:{outputIndex:{},inputIndex:{test_1:"dog"}},showField:{test_1:{fieldName:"",id:"iu"}},iterator:0},next:{}}}; bindOf(data); })
    // $("#ii").on("click",function(){
    //     var data={ str:{actionType:"select",json:[{currentPage:1,pageSize:10,tableName:"test_1",data:[{cat:addPoint($("#ui").val())}]}],tableIndex:{outputIndex:{test_1:""},inputIndex:{}},showField:{test_1:{fieldName:[{name:"cat"},{name:"dog"},{name:"pig"}],id:"iu"}},tableNet:{},iterator:1},next:{}};
    //     bindOf(data);
    // })
    // bindOf({ str:{actionType:"select",json:[{currentPage:1,pageSize:10,colum:'',order:'',tableName:"test_1",data:[]}],tableIndex:{outputIndex:{},inputIndex:{}},showField:{test_1:{fieldName:[{name:"cat"},{name:"dog"},{name:"pig"}],id:"iu"}},tableNet:{},iterator:1},next:{}});

    // bindOf({str:{actionType:"select",json:[{currentPage:1,pageSize:10,colum:"",order:"",tableName:"test_1",data:[{cat:"777"}]}],tableIndex:{outputIndex:{},inputIndex:{test_1:""}},showField:{test_1:[{fieldName:"cat",id:"t2"},{fieldName:"dog",id:"t3"}]},tableNet:{},iterator:0},next:{}});

    //controlInform={"t1":{"data":[{"tableName":"test_1","fieldName":"cat"}]},"t2":{"data":[{"tableName":"test_1","fieldName":"cat"}],"action":[{"0":{"0":"t1","1":"","length":2,"actionType":null},"1":{"0":"t2","1":"","2":"t3","3":"","length":4,"actionType":null},"length":2,"actionType":"showSelect"}]},"t3":{"data":[{"tableName":"test_1","fieldName":"dog"}],"action":[]}}//controlInformEnd

    // $(".hd-top").on("click",function(){
    //     var data={str:{actionType:"deleted",json:[{actionType:"deleted",tableName:"test_1",data:[{cat:addPoint('cat')}]}],iterator:0},next:{}};
    //     // var data={str:{actionType:"update",json:[{actionType:"select",currentPage:1,pageSize:5,tableName:"test_1",data:[{cat:addPoint('cat')}]},{actionType:"update",tableName:"test_1",data:[{dog:addPoint('cat'),pig:addPoint('cat')}]}],updateField:{test_1:[{fieldName:"pig",id:"te6-3"},{fieldName:"dog",id:"te6-2"}]},iterator:0},next:{}};
    //     bindOf(data);
    // })
    // bindOf({str:{actionType:"select",json:[{currentPage:1,pageSize:10,colum:"",order:"",tableName:"test_1",data:[]},{currentPage:1,pageSize:10,colum:"",order:"",tableName:"lc_01",data:[]}],tableIndex:{outputIndex:{lc_01:""},inputIndex:{test_1:""}},showField:{test_1:[{fieldName:"dog",id:".tt2"}],lc_01:[{fieldName:"pig",id:".tt1"}]},tableNet:{},iterator:2,showCopy:{tableFirst:"test_1",index:{id:".tt1",data:[{tableName:"test_1",fieldName:"cat"},{tableName:"lc_01",fieldName:"dog"}]},copyRow:"1538318819453"}},next:{}});
    //
    // bindOf({str:{actionType:"select",json:[{currentPage:1,pageSize:10,colum:"",order:"",tableName:"$file",data:[]}],tableIndex:{outputIndex:{},inputIndex:{$file:""}},showField:{$file:[{fieldName:"path",id:".t1"},{fieldName:"name",id:".t2"}]},tableNet:{},iterator:2,showCopy:{tableFirst:"$file",index:{id:".t1",data:[{tableName:"$file",fieldName:"path"}]}}},next:{});


    // $(document.querySelector(".t4-rowClass")).on("click",function(){
    //     var data={
    //         str: {
    //             actionType:"fileUpload",
    //             tableName:["$file"],
    //             clickObj:this
    //         },
    //         next:{}
    //     };
    //     console.log(data);
    //     bindOf(data);
    // })

    // bindOf({
    //     str:{
    //         actionType:"select",
    //         json:[
    //             {
    //                 data:{pageNumber:1,pageSize:10,keyword:"经济圈",topic:"经济"},
    //                 tableName:"$file"
    //             }
    //             ],
    //         tableIndex:{
    //             outputIndex:{},
    //             inputIndex:{
    //                 $file:""
    //             }
    //         },
    //         showField:{
    //             $file:[
    //                 {
    //                     fieldName:"path",
    //                     id:".g1"
    //                 },
    //                 {
    //                     fieldName:"topic",
    //                     id:".g2"
    //                 },
    //                 {
    //                     fieldName:"category",
    //                     id:".g3"
    //                 },
    //                 {
    //                     fieldName:"path",
    //                     id:".g4"
    //                 }
    //                 ]
    //         },
    //         tableNet:{},
    //         iterator:2,
    //         showCopy:{
    //             tableFirst:"$file",
    //             index:{
    //                 id:".g1",
    //                 data:[
    //                     {
    //                         tableName:"$file",
    //                         fieldName:"path"
    //                     }
    //                     ]
    //             },
    //             copyRow:"1542532458457"
    //         }
    //     },
    //     next:{}
    // });

    // bindOf({
    //     str:{
    //         actionType:"select",
    //         json:[
    //             {currentPage:1, pageSize:10,colum:"",order:"",tableName:"table1",data:[]},
    //             {currentPage:1,pageSize:10,colum:"",order:"",tableName:"table2",data:[]}
    //         ],
    //         tableIndex:{
    //             outputIndex:{},
    //             inputIndex:{table2:"",table1:""}
    //         },
    //         showField:{
    //             table1:[
    //                 {fieldName:"field1",id:".g1"},
    //                 {fieldName:"field2",id:".g2"}
    //                 ],
    //             table2:[
    //                 {fieldName:"field1",id:".g1"},
    //                 {fieldName:"field2",id:".g3"}
    //                 ]
    //         },
    //         tableNet:{},
    //         iterator:2,
    //         showCopy:{
    //             tableFirst:"table1",
    //             index:{
    //                 id:".g1",data:[
    //                     {tableName:"table1",fieldName:"field1"},
    //                     {tableName:"table2",fieldName:"field1"}
    //                     ]
    //             },
    //             copyRow:"1542532458457"
    //         }
    //         },
    //     next:{}
    // });

    // bindOf({
    //     str:{
    //         actionType:"select",
    //         json:[
    //             {currentPage:1,pageSize:10,colum:"",order:"",tableName:"test_1",data:[]}
    //             ],
    //         tableIndex:{
    //             outputIndex:{},
    //             inputIndex:{
    //                 test_1:""
    //             }
    //             },
    //         showField:{
    //             test_1:[
    //                 {fieldName:"cat",id:".g1"},
    //                 {fieldName:"dog",id:".g2"},
    //                 {fieldName:"pig",id:".g3"},
    //                 {fieldName:"cat",id:".g4"}
    //                 ]
    //         },
    //         tableNet:{},
    //         iterator:2,
    //         showCopy:{
    //             tableFirst:"test_1",
    //             index:{
    //                 id:".g1",
    //                 data:[
    //                     {tableName:"test_1",fieldName:"cat"}
    //                     ]
    //             },
    //             copyRow:"1542532458457"
    //         }
    //         },
    //     next:{}
    // });

    bindOf({
        str:{
            actionType:"select",
            json:[
                {currentPage:1,pageSize:10,colum:"",order:"",tableName:"lc_0201_01",data:[]},
                {currentPage:1,pageSize:10,colum:"",order:"",tableName:"lc_0201_02",data:[]}
            ],
            tableIndex:{
                outputIndex:{},
                inputIndex:{lc_0201_02:"",lc_0201_01:""}
            },
            showField:{
                lc_0201_01:[
                    {fieldName:"lc_0201_01_02",id:".g1"},
                    {fieldName:"lc_0201_01_01",id:".g2"}
                ],
                lc_0201_02:[
                    {fieldName:"lc_0201_02_02",id:".g1"},
                    {fieldName:"lc_0201_02_01",id:".g3"}
                ]
            },
            tableNet:{},
            iterator:2,
            showCopy:{
                tableFirst:"lc_0201_01",
                index:{
                    id:".g1",
                    data:[
                        {tableName:"lc_0201_01",fieldName:"lc_0201_01_02"},
                        {tableName:"lc_0201_02",fieldName:"lc_0201_02_02"}
                    ]
                },
                copyRow:"1542532458457"
            }
        },
        next:{}
    });

    // $(document.querySelector(".t4-rowClass")).on("click",function(){
    //     var data={
    //         str:{
    //             data:{
    //                 queryStyle:"0",
    //                 queryTarget:"1542532458457",
    //                 queryImplement:".t4-rowClass",
    //                 replaceData:{
    //                     pageNumber:1,
    //                     pageSize:10,
    //                     keyword:addPoint(document.querySelector(".t2-rowClass").value),
    //                     topic:addPoint(document.querySelector(".t3-rowClass").value)}},
    //             actionType:"fileSelect"},
    //         next:{}
    //     };
    //     bindOf(data);
    // })
});