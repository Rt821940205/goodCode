import { Renderer } from '@fex/amis';
import * as React from 'react';

/** 编辑行为参数 */

/** 重复代码 ModelInfoDialog */
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


export default class ScheduleTaskInEdit extends React.Component {
  render(): any {
    let { actionInName, render } = this.props;

    let bodyTaskInItems: Array<any> = [];


    console.log(actionInName);

    const body = {


            type: 'service',
            schemaApi: {
              method: 'get',
              url: '/api/def/model/complete/info/key?key=' + actionInName,
              adaptor: function (payload: any) {
                let data = payload.data;

                let fields = payload.data.fields.filter((f: any) => !isDefaultField(f.name) && f.category !=1 && f.name !='target_end_point' && f.name !='task_id');

                // bodyTaskInItems.push({
                //     type:'tpl',
                //     tpl: '测试'
                // })


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

                    let name = 'schedule_in[' + item.name+']';


                    if(item.typeName == 'Boolean'){
                      value = value == 'true' ? true:false;
                    }

                    fields[name] = value;
                    fields['label'] = item.displayName;
                    fields['description'] = item.description;

                    console.log(item);


                    let formItem:any = {
                      type: 'input-text',
                      name: name,
                      description: item.description,
                      placeholder: item.description,
                      required: required,
                      label: item.displayName,
                    }


                    if(item.typeName == 'Boolean'){
                      formItem = {
                        type: 'switch',
                        name: name,
                        option: item.description,
                        label: item.displayName,
                      }
                    } else if(item.typeName == 'Int' || item.typeName == 'Long'){
                      formItem.type = 'input-number'
                    }

                    bodyTaskInItems.push({
                      type: 'page',
                      data: fields,
                      body:formItem,
                    });
                  });


                console.log(bodyTaskInItems);

                return bodyTaskInItems


                // return {
                //   ...payload,

                //   data: {
                //     modelInfo: data,
                //     bodyTaskInItems: bodyTaskInItems,
                //     modelFields: data.fields.filter((f: any) => !isDefaultField(f.name) && f.category !=1 && f.name !='target_end_point' && f.name !='task_id'),
                //   },
                // };
              },
            },
            body: [
                {
                    type:'tpl',
                    tpl: '编辑入参'
                },

                {
                    type: 'page',
                    body: "${bodyTaskInItems}"

                }

            ],


    };
    return render('body', body, this.props);
  }
}


  Renderer({
    type: 'schedule-task-in-edit',
    autoVar: true,
  })(ScheduleTaskInEdit);
