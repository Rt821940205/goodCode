export function ComponentConfigCheckAction(componentId: any) {
    return {
    label: '测试',
    actionType: 'confirm',
    "close": false,

    type: 'button',
    api: {
      method: 'post',
      url: '/api/component/checkComponentConfig',
      dataType: 'form',
     
      requestAdaptor: function (api: any) {




        let model = api.data.___model;

        console.log(api);

        for (let key in api.body['diff']) {
          console.log(key);

           if (key != '___model') {
            let field = model.fields.find((f: Object) => f['name'] == key);
            console.log(api.data, model.fields, key, field);
            if(field){
            field['defaultValue'] = api.data[key];
            }
          }
        }

        console.log('model', model);



        let config = {}


        model.fields.forEach( (element:any) => {
          console.log(element);
          if(element.defaultValue){
          config[element.name] = element.defaultValue;
          }
        });

        console.log('config',config);

    //     for(let k in api.data){

    //     if(k !='pristine' && k !='__model'){ 
    //         // if(typeof api.data[k] != 'object'){ 
    //         // console.log(k);
    //         // console.log(  api.data[k])

    //       if(k.indexOf('field__')==0){
    //         config[k.substring(7)] = api.data[k]
    //       }else{
    //         config[k] = api.data[k]
    //       }
    //     }
    // }

        return {
          ...api,
          data: {
            componentId: componentId,
            ...config
          },
        };
      },
      adaptor: function (payload: any) {
        console.debug(payload);
        return {
          ...payload,
        };
      },
    },
  }}