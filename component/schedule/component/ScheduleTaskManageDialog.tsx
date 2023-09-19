import { Renderer } from '@fex/amis';
import * as React from 'react';

export default class ScheduleTaskManageDialog extends React.Component {
  render(): any {
    let { name,taskId,action,displayName, render } = this.props;


    const body = {
                          label: `${displayName}`,
                          type: 'button',
                          level: 'link',
                          "actionType": "dialog",
                          "dialog": {
      "closeOnEsc": true,
      "closeOnOutside": true,
      "title": `${displayName}${name} 提醒`,
      "body": `确认要${displayName}任务(id=${taskId})吗？`,
      "actions": [
        {
          "label": `确认${displayName}`,
          "actionType": "ajax",
          "primary": true,
          "reload": "scheduleTaskList",
          "type": "button",
      "close": true,

          "api": {
            url: '/api/component/executeComponent',
            dataType: 'form',
            method: 'post',
            requestAdaptor: function (api:any) {
                return {
                    ...api,
                    data: {
                       taskId: taskId,
                        component: 'eg_134d_schedule_plugin',
                        actionName: action,
                    }
                };
            },
            adaptor: function (payload:any) {


                return {
                    ...payload,
                };
            },
        },
        }
      ],
    }};
    return render('body', body, this.props);
  }
}


  Renderer({
    type: 'schedule-task-manage-dialog',
    autoVar: true,
  })(ScheduleTaskManageDialog);
