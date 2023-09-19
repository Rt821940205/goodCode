import {isDefaultField} from '@/pages/component/Setting/component/ComponentHelper'


export function ComponentConfigCreateAction(componentId: any) {

    return {
    label: '保存',
    actionType: 'confirm',
    level: 'primary',
    type: 'button',

    api: {
      method: 'post',
      url: '/api/def/model/complete/save?_=componentCreate',
      requestAdaptor: function (api: any) {
        let model = api.data.___model;

        console.log(api);
        console.log(model)

        // 去掉modelId,name,actions
       delete model['id'];
       delete model['name'];
       delete model['actions'];
        // 设置categeory为 101015
        model.category = 101015;
        model.parentId = componentId;


        console.log("model1", model);
        let configFields = model.fields.filter((f: any) => !isDefaultField(f.name)).map((f:any)=>{
          delete f['id']
          return f;
        })

        console.log('configFields',configFields);
        
        
        for (let key in api.body['diff']) {
          console.log(key);

          if (key == 'displayName') {
            model.displayName = model.localName = api.data[key];
          } else if (key == 'description') {
            model.description = api.data[key];
          } else if (key != '___model') {
            console.log(key);
            let field = configFields.find((f: Object) => f['name'] == key);

            console.log(api.data, model.fields, key, field);
            field.defaultValue = api.data[key];
          }
        }
        // config_status
        console.log(model)
       let  configStatusField = model.fields.find((f:any)=>f.name=='engine_id')
       delete configStatusField['id']
       configStatusField.name = 'config_status';
       configStatusField.type = "Integer";
       configStatusField.defaultValue =configStatusField.samepleValue = "2"; 
       configStatusField.localName = configStatusField.displayName ="配置状态";
       configStatusField.description = ""
       configFields.push(configStatusField)
       model.fields = configFields;
       console.log('model', model);


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


    // api: {
    //   method: 'post',
    //   url: '/api/component/checkComponentConfig',
    //   dataType: 'form',
     
    //   requestAdaptor: function (api: any) {




    //     let model = api.data.___model;

    //     console.log(api);

    //     for (let key in api.body['diff']) {
    //       console.log(key);

    //        if (key != '___model') {
    //         let field = model.fields.find((f: Object) => f['name'] == key);
    //         console.log(api.data, model.fields, key, field);
    //         if(field){
    //         field['defaultValue'] = api.data[key];
    //         }
    //       }
    //     }

    //     console.log('model', model);



    //     let config = {}


    //     model.fields.forEach( (element:any) => {
    //       console.log(element);
    //       if(element.defaultValue){
    //       config[element.name] = element.defaultValue;
    //       }
    //     });

    //     console.log('config',config);

    // //     for(let k in api.data){

    // //     if(k !='pristine' && k !='__model'){ 
    // //         // if(typeof api.data[k] != 'object'){ 
    // //         // console.log(k);
    // //         // console.log(  api.data[k])

    // //       if(k.indexOf('field__')==0){
    // //         config[k.substring(7)] = api.data[k]
    // //       }else{
    // //         config[k] = api.data[k]
    // //       }
    // //     }
    // // }

    //     return {
    //       ...api,
    //       data: {
    //         componentId: componentId,
    //         ...config
    //       },
    //     };
    //   },
    //   adaptor: function (payload: any) {
    //     console.debug(payload);
    //     return {
    //       ...payload,
    //     };
    //   },
    // },
  }


}