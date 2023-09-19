import { ComponentConfigCheckAction } from '@/pages/component/Setting/component/ComponentConfigCheckAction';




/**
 * 编辑配置
 */
export const ComponentEditConfig  = (componentId:any) =>{

return  {
  type: 'button',
  visibleOn: "id && id.length>10",
  level: 'primary',
  label: '编辑',
  actionType: 'dialog',
  className:'supermarket-edit supermarket-btn',
  dialog: {
    title: '编辑配置',
    size: 'lg',
    actions: [
      // {
      //   type: 'button',
      //   label: '测试',
      // },
      ComponentConfigCheckAction(componentId),
      {
        type: 'button',
        label: '取消',
        actionType: 'cancel',
      },
      {
        type: 'button',
        label: '确认',
        actionType: 'confirm',
        level: 'primary',
      },
    ],
    body: [
      {
        type: 'service',

        schemaApi: {
          method: 'get',
          url: '/api/def/model/complete/info?modelId=${id}',
          adaptor: function (payload: any) {
            let fields = payload.data.fields;
            let bodyItems: Array<any> = [];
            let data = payload.data;

            // data.hx = hello;

            
            // data.setFieldData = (key:string, value:any)=>{
            //   let field = data.fields.find((f: Object) => f['name'] == key);   
            //   if(field){
            //     field[key] = value;
            //   }           
            // }


            // if (key == 'displayName') {
            //   model['displayName'] = api.data[key];

            // } else if (key == 'description') {
            //   model['description'] = api.data[key];
            // } else if (key != '___model') {
            //   let field = model.fields.find((f: Object) => f['name'] == key);
            //   console.log(api.data, model.fields, key, field);
            //   if(field){
            //   field['defaultValue'] = api.data[key];
            //   }
            // }

            bodyItems.push({
              type: 'page',
              data: fields,
              body:{
              type: 'input-text',
              name: 'displayName',
              required: true,
              showCounter: true,
              maxLength: 20,
              validations: {
                maxLength: 20,
              },
              validationErrors: {
                maxLength: '长度超出限制，请输入小于20字的名称',
              },
              placeholder: '请输入一个长度小于20的名称',
              // mode: 'horizontal',
              label: '配置名',
            }});

            fields
              .filter((item: any) => {
                return item.category == 2 || item.category == 4;
              })
              .forEach((item: any) => {
                let required = false;
                if (item.notNull == 1) {
                  required = true;
                }

                let fields = {};


                let value  = item.defaultValue;
                if(item.typeName == 'Boolean'){
                  value = value == 'true' ? true:false;
                }

                fields[item.name] = value;
                fields['label'] = item.displayName;
                fields['description'] = item.description;

                console.log(item);


                let formItem:any = {
                  type: 'input-text',
                  name: item.name,
                  description: item.description,
                  placeholder: item.description,
                  required: required,
                  label: item.displayName,
                }

                
                if(item.typeName == 'Boolean'){
                  formItem = {
                    type: 'switch',
                    name: item.name,
                    // value:fields[item.name],
                    // mode: 'horizontal',
                    // description: item.description,
                    option: item.description,
                    label: item.displayName,
                  }
                } else if(item.typeName == 'Int' || item.typeName == 'Long'){
                  formItem.type = 'input-number'
                }

                bodyItems.push({
                  type: 'page',
                  data: fields,
                  body:formItem,
                });
              });
            bodyItems.push({
              type: 'page',
              data: fields,
              body:{
              type: 'textarea',
              name: 'description',
              label: '配置描述',
              // mode: 'horizontal',
              showCounter: true,
              maxLength: 500,
              validations: {
                maxLength: 500,
              },
              validationErrors: {
                maxLength: '长度应该小于500',
              },
            }});
            return {
              type: 'form',
              mode: 'horizontal',

              data: {
                ___model: data,
              },
              // actions: [],
              actions: [
                // {
                //   actionType: "reload",
                //   componentId: "configListCrud"
                // }
              ],
              api: {
                method: 'post',
                url: '/api/def/model/complete/save?_=componentCreate',
                requestAdaptor: function (api: any) {



                  // let model = api.data.___model;

                  console.log(api);


                console.log('diff',api.body['diff']);



        let model = {};


        console.log(api.data.___model);


        for(let p in api.data.___model){
          console.log(p)
          model[p] = api.data.___model[p]
        }
    

        console.log('model',model);


                
                  for (let key in api.body['diff']) {
                    console.log(key);

                    if (key == 'displayName') {
                      model['displayName'] = api.data[key];


                    } else if (key == 'description') {
                      model['description'] = api.data[key];
                    } else if (key != '___model') {
                      let field = model.fields.find((f: Object) => f['name'] == key);
                      console.log(api.data, model.fields, key, field);
                      if(field){
                      field['defaultValue'] = api.data[key];
                      field['sampleVal'] = api.data[key];
                      field['val'] = api.data[key];
                      }
                    }
                  }

                  console.log('最终结果',model);

          
                  return {
                    ...api,
                    data: {
                      ...model,
                    },
                  };
                },
                adaptor: function (payload: any) {
                  return {
                    ...payload,
                  };
                },
              },
              title: '',
              body: bodyItems,
            };
          },
        },
      },
    ],
  },
}
};
