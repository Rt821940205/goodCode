/**
 * 调度新增任务
 * 
 */
export const ScheduleTaskAddFrom = {
  "type": "service",
  api: {
    method: 'post',
    url: '/api/def/model/pages?_=componentAlls',
    requestAdaptor: function (api: any) {
      return {
        ...api,
        data: {
          appId: "396320893233737728",
          name: api?.data?.keywords,
          categories: [101016],
          state: 1,
          pageSize: 200,
        },
      };
    },
    adaptor: function (payload: any, response: any, api: any) {

      let scheduleComponents = payload.data.data.filter(c=>c.name.indexOf('sh') == 0);
      console.log(scheduleComponents);

      // 所有组件Action选项
      let allScheduleComponentsOptions = {}
      scheduleComponents.forEach(c=>{
        allScheduleComponentsOptions[c.name] = c.actions.filter(a=>a.name.indexOf('sh') == 0).map(a=>{return {label: a.displayName, value: a.name} })
      });
      console.log(allScheduleComponentsOptions)

       // 所有组件ActionMap
       let allScheduleComponentsActions = {}
       scheduleComponents.forEach(c=>{
        let actions = {};
        c.actions.filter(a=>a.name.indexOf('sh') == 0).forEach(a=>{ actions[a.name] = a;})
        allScheduleComponentsActions[c.name] = actions;
       });
       console.log(allScheduleComponentsOptions)

      // 所有组件Map
      let allScheduleComponents = {}
      scheduleComponents.forEach(c=>{
        allScheduleComponents[c.name] = c;

      });
      console.log(allScheduleComponents)



      return {
        ...payload,
        data: {
          allScheduleComponentsOptions:allScheduleComponentsOptions,
          allScheduleComponents:allScheduleComponents,
          allScheduleComponentsActions:allScheduleComponentsActions,
          scheduleComponentsOptions:scheduleComponents.map(c=> {return {label: c.displayName, value: c.name}})
        }
    };
    }
  },
  "body": [
    {
      label: "任务名称",
      type:'input-text',
      name: "scheduleName",
      description: "本任务名称，请填写可以具体描述业务的名称",
      "required": true,

    },
    {
      "label": "调度组件",
      "type": "select",
      "name": "component",
      "required": true,

      "source": "${scheduleComponentsOptions}",
      description:'${allScheduleComponents[component].description}',
    },
   
    {
     visibleOn: "data.component",
     "required": true,

      "label": "调度行为",
      "type": "select",
      "name": "action",
      "source": "${allScheduleComponentsOptions[component]}",
      description:'${allScheduleComponentsActions[component][action].description}',

    },
 

    {
      visibleOn: "data.action",
      "type": "service",
      "api": {
        method: 'post',
        url: '/api/def/model/pages?_=componentConfig',
        requestAdaptor: function (api: any) {
          console.log(api);
          return {
            ...api,
            data: {
              pageNum: 1,
              appId: "396320893233737728",

              parentId: api.data.allScheduleComponents[api.data.component].id,
              pageSize: 100,
              categories: [101015],
              state: 1,
            },
          };
        },
        adaptor: function (payload: any) {
          let scheduleConfigComponents = payload.data.data.filter(c=>c.name.indexOf('sh') == 0);

               // 所有配置Map
      let allScheduleConfigComponents = {}
      scheduleConfigComponents.forEach(c=>{
        allScheduleConfigComponents[c.id] = c;

      });
      console.log(allScheduleConfigComponents)
          
          return {
            ...payload,
            data: {
              allScheduleConfigComponents:allScheduleConfigComponents,
              configOptions: payload.data.data.map(c=> {return {label: c.displayName, value: c.id}})
            },
          };
        },
      },
      body:  {
        "label": "调度配置",
        "required": true,

        "type": "select",
        "name": "configId",
        "source": "${configOptions}",
        description:'${allScheduleConfigComponents[configId].description}'
      },
    },
  //   {
  //     "type": "tpl",
  //  visibleOn: "data.configId",
  //  tpl:"任务来源设置完成"

  //    },
    // {
    //   visibleOn: "data.action",
    //   type:'schedule-task-in-edit',
    //   actionInName: '${allScheduleComponentsActions[component][action].params.in.value}'
    // }
  ]
}