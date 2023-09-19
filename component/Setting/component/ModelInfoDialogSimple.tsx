
/**
 * 组件行为参数列表
 */
const defaultFields = [
  'id',
  'state',
  'model_id',
  'modify_name',
  'create_id',
  'modify_id',
  'create_name',
  'modify_time',
  'create_time',
  'cls',
  'config_status'
];

function isDefaultField(key: string) {
  return defaultFields.includes(key);
}

export function ModelInfoDialogSimple(key: string) {
  return  {
      type: 'service',
      schemaApi: {
        method: 'get',
        url: '/api/def/model/complete/info/key?key=' + key,
                adaptor: function (payload: any) {
          let fields = payload.data.fields;
          let displayName = payload.data.displayName;
          let description = payload.data.displayName;
          let bodyItems: Array<any> = [
            { type: 'static', name: 'displayName', labelClassName:"text-black", className: "text-gray text-xs",value: displayName, label: '显示名称:' },
          ];
          fields
            .filter((item: any) => {
              return item.category != null && !isDefaultField(item.name);
            })
            .forEach((item: any) => {
              bodyItems.push({
                type: 'static',
                className: "text-gray text-xs",
                labelClassName:"text-black",
                name: item.name,
                label: item.displayName+':',
                value: item.defaultValue,
              });
            });
            bodyItems.push(
              { type: 'static', name: 'description',  labelClassName:"text-black",className: "text-gray text-xs",value: description, label: '配置描述:' },
            ) 
          return {
            type: 'form',
            labelWidth: "auto",
            labelAlign:"left",
            wrapWithPanel:false,
            title: '',
            mode: "horizontal",
            body: bodyItems,
            actions:[],
          };
        },
      },
    
   
  };
}
