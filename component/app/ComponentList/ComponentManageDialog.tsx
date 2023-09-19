import { Renderer } from '@fex/amis';
import * as React from 'react';


export default class ComponentManageDialog extends React.Component {
  render(): any {
    let { componentTitle,message,appId,componentId,component,version,action,actionName, btnName, render } = this.props;

    if(!component){
     component = 'eg_a341_component_life_cycle_plugin';
    }

    if(!btnName){
      btnName = actionName;
    }

    const body = {
                          label: `${btnName}`,
                          type: 'button',
                      "className": "mr-1",

                          level: 'link',
                          "actionType": "dialog",
                          "dialog": {
      "closeOnEsc": true,
      "closeOnOutside": true,
      "title": `${actionName} ${componentTitle} 提醒`,
      "body": `${message}`,
      "actions": [
        {
          "label": `确认${actionName}`,
          "actionType": "ajax",
          "primary": true,
          "reload": "appComponentPagedList",
          "type": "button",
          "close": true,

          "api": {
            url: '/api/component/execute',
            dataType: 'form',
            method: 'post',
            requestAdaptor: function (api:any) {
                return {
                    ...api,
                    data: {
                       appId: appId,
                       componentId:componentId,
                       version:version,
                        component: component,
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
    type: 'component-manage-dialog',
    autoVar: true,
  })(ComponentManageDialog);
