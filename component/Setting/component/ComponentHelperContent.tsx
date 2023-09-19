/**
 * 组件帮助说明
 */



export function ComponentHelperContent() {
  return     {
    type: 'service',
    visibleOn: "this.componentModel && this.componentModel.id>10",
    api: {
      "method": "post",
      "url": "/api/graphql",
      "dataType": "json",
      "graphql": "query find($obj: input_sys_component_helper!){ find_sys_component_helper(obj: $obj) {      id componentkey componentcontent componenttitle state create_id create_name modify_id modify_name modify_time create_time    } }",
      "data": {
        "obj.componentkey": "${componentModel.name}"
      },
      "responseData": {
        "&": "$$",
        "helper": "${find_sys_component_helper[0]}"
      }
    },
    body:[
     
      {
        visibleOn: "this.helper && this.helper.id && this.helper.id>0", 
        type: 'container',
        bodyClassName:"mt-2",
        body: [
          {
            type: "fieldSet",
            title:"组件说明${componentModel.name}"
          },
          {
            type: 'static',
            tpl: '${helper.componentcontent|raw}',
          }
        ]
         
      }
    ]
};
}
