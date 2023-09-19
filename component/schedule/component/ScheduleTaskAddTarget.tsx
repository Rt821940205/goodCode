/**
 * 调度新增任务
 * 
 */
 import  '@/pages/component/schedule/component/ScheduleTaskInEdit'

export const ScheduleTaskAddTarget = {
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

      let scheduleComponentsTarget = payload.data.data.filter(c=>c.actions.filter(a=>a.name.indexOf('sh') < 0).length>0 && c.name !='eg_134d_schedule_plugin');
      console.log(scheduleComponentsTarget);

      // 所有组件Action选项
      let allScheduleComponentsOptionsTarget = {}
      scheduleComponentsTarget.forEach(c=>{
        allScheduleComponentsOptionsTarget[c.name] = c.actions.filter(a=>a.name.indexOf('sh') < 0).map(a=>{return {label: a.displayName, value: a.name} })
      });
      console.log(allScheduleComponentsOptionsTarget)

       // 所有组件ActionMap
       let allScheduleComponentsActionsTarget = {}
       scheduleComponentsTarget.forEach(c=>{
        let actions = {};
        c.actions.filter(a=>a.name.indexOf('sh') < 0).forEach(a=>{ actions[a.name] = a;})
        allScheduleComponentsActionsTarget[c.name] = actions;
       });
       console.log(allScheduleComponentsOptionsTarget)

      // 所有组件Map
      let allScheduleComponentsTarget = {}
      scheduleComponentsTarget.forEach(c=>{
        allScheduleComponentsTarget[c.name] = c;

      });
      console.log(allScheduleComponentsTarget)



      return {
        ...payload,
        data: {
          allScheduleComponentsOptionsTarget:allScheduleComponentsOptionsTarget,
          allScheduleComponentsTarget:allScheduleComponentsTarget,
          allScheduleComponentsActionsTarget:allScheduleComponentsActionsTarget,
          scheduleComponentsOptionsTarget:scheduleComponentsTarget.map(c=> {return {label: c.displayName, value: c.name}})
        }
    };
    }
  },
  "body": [
    {
      "label": "接收组件",
      "type": "select",
      "name": "componentTarget",
      "source": "${scheduleComponentsOptionsTarget}",
      description:'${allScheduleComponentsTarget[componentTarget].description}',
    },
   
    {
     visibleOn: "data.componentTarget",
      "label": "接收行为",
      "type": "select",
      "name": "actionTarget",
      "source": "${allScheduleComponentsOptionsTarget[componentTarget]}",
      description:'${allScheduleComponentsActionsTarget[componentTarget][actionTarget].description}',

    },
    {
      visibleOn: "data.actionTarget",
      "type": "service",
      "api": {
        method: 'post',
        url: '/api/def/model/pages?_=componentConfig',
        requestAdaptor: function (api: any) {
          console.log(api);
          return {
            ...api,
            data: {
              appId: "396320893233737728",

              pageNum: 1,
              parentId: api.data.allScheduleComponentsTarget[api.data.componentTarget].id,
              pageSize: 100,
              categories: [101015],
              state: 1,
            },
          };
        },
        adaptor: function (payload: any) {
          let scheduleConfigComponentsTarget = payload.data.data.filter(c=>c.name.indexOf('sh') == 0);

               // 所有配置Map
      let allScheduleConfigComponentsTarget = {}
      scheduleConfigComponentsTarget.forEach(c=>{
        allScheduleConfigComponentsTarget[c.id] = c;

      });
      console.log(allScheduleConfigComponentsTarget)
          
          return {
            ...payload,
            data: {
              allScheduleConfigComponentsTarget:allScheduleConfigComponentsTarget,
              configOptionsTarget: payload.data.data.map(c=> {return {label: c.displayName, value: c.id}})
            },
          };
        },
      },
      body:  {
        "label": "接收配置",
        "type": "select",
        "name": "configIdTarget",
        "source": "${configOptionsTarget}",
        description:'${allScheduleConfigComponentsTarget[configIdTarget].description}'
      },
    },
    // {
    //   visibleOn: "data.configIdTarget",
    //   type:'schedule-task-in-edit',
    //   actionInName: '${allScheduleComponentsActions[component][action].params.in.value}'
    // }
  ]
}