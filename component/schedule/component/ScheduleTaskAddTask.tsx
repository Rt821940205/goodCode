/**
 * 调度新增任务
 * 
 */
 import  '@/pages/component/schedule/component/ScheduleTaskInEdit'
 import {ScheduleTaskAddTarget} from '@/pages/component/schedule/component/ScheduleTaskAddTarget'
 import {ScheduleTaskAddFrom} from '@/pages/component/schedule/component/ScheduleTaskAddFrom'
export const ScheduleTaskAddTask = {
  "type": "page",
  "body": {
    "type": "wizard",
    "onEvent": {
      "submitSucc": {
        "actions": [
          
          {
            actionType: "reload",
            componentId: "scheduleTaskList"
          },
          {
            "actionType": "closeDialog",
            "componentId": "ScheduleTaskAddTask"
          }
        ]
      },
    },
    "api": {
      url: '/api/component/executeComponent',
      dataType: 'form',
      method: 'post',
      requestAdaptor: function (api: any) {
        console.log(api);


        let scheduleInParam = api.data.schedule_in || {};
        scheduleInParam.targetEndPoint= `xuanwu://common?action=${api.data.actionTarget}&configId=${api.data.configIdTarget}`;


        let componentIn = {
          scheduleComponent: api.data.component,
          scheduleAction: api.data.action,
          scheduleConfigId: api.data.configId,
          inParam: JSON.stringify(scheduleInParam)

         }

        return {
          ...api,
          data: {
            component: 'eg_134d_schedule_plugin',
            actionName: 'eg_134d51e3_create_action',
            scheduleName: api.data.scheduleName,
            ...componentIn
          },
        };
      },
      adaptor: function (payload: any, response: any, api: any) {
        return {
          ...payload
        }
      }
    },
    "mode": "horizontal",
    "steps": [
      {
        "title": "设置任务来源",
        "body": ScheduleTaskAddFrom
      },
      {
        "title": "设置处理组件",
        "body": ScheduleTaskAddTarget
      },
      {
        "title": "设置任务参数",
        "body":   {
            visibleOn: "data.action",
            type:'schedule-task-in-edit',
            actionInName: '${allScheduleComponentsActions[component][action].params.in.value}'
          }
      }
    ]
  }
}