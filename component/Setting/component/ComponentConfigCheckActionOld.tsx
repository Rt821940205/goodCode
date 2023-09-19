export function ComponentConfigCheckAction(componentId: any) {
    return {
    label: '测试',
    level:"enhance",
    actionType: 'confirm',
    "close": false,

    type: 'button',
    api: {
      method: 'post',
      url: '/api/component/checkComponentConfig',
      dataType: 'form',
     
      requestAdaptor: function (api: any) {

        let config = {}

        for(let k in api.data){

          if(k.indexOf('field__')==0){
            config[k.substring(7)] = api.data[k]
          }
    }

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