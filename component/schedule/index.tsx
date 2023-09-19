import AmisRenderer from '@/components/AmisRenderer';
import { SchemaNode } from '@fex/amis/lib/types';
import React from 'react';
import './index.less';
import '@/pages/component/schedule/component/ScheduleTaskManageDialog'
import {ScheduleTaskDetail} from '@/pages/component/schedule/component/ScheduleTaskDetail'
import {ScheduleTaskAddTask} from '@/pages/component/schedule/component/ScheduleTaskAddTask'


import {GraphQlRequestAdaptor} from '@/api/GraphQlRequestAdaptor'

/**
 * 组件调度任务
 * 1. 获得调度任务元数据
 * 2. 获得查询调度任务的GraphQL
 * 3. 创建任务 dialog
 * 4. 停止或启动任务 dialog
 *
 * 简单示例，暂查询、分页，筛选等处理
 */








export default class AppList extends React.Component {
  render(): any {
    const metaName = "sys_component_schedule"
    let fields = '';
    const schema: SchemaNode = [
      {
        type: 'page',
        className: "p-6",
        name: 'taskList',
        id: 'taskList',
        toolbar: [
          {
            level: 'primary',
            label: '新增任务',
            "type": "button",
            "actionType": "dialog",
            "dialog": {
              "id": "ScheduleTaskAddTask",
              "actions": [],
              // "size":"lg",
              "title": "新增任务",
              "body": ScheduleTaskAddTask
            }
          }
        ],
        initApi: {
          method: 'get',
          url: '/api/def/model/complete/info/key?key=' + metaName,
          adaptor: function (payload: any) {
            let data = payload.data;
            fields = data.fields.map((f:any)=>f.name);

            return {
              ...payload,
              data: {
                modelInfo: data,
                modelFields: data.fields,
                listQueryName: 'pages_' + data.name,
              },
            };
          },
        },
        body:{
          type:'page',

          body:[
            // {
            //   type: 'service',
            //   visibleOn: "typeof listQueryName !== 'undefined'",
            //   api:{
            //     method: 'post',
            //     url: '/api/graphql?_=find_' + metaName,
            //     requestAdaptor: (api: any) => GraphQlRequestAdaptor.findQuery( metaName, {id:'385870044149788672'}, fields)(api),
            //     adaptor: function (payload: any) {
            //       return {
            //         ...payload
            //     }},
            //   },

            //   body:{
            //   }
            // },
            //  {
            //   type: 'service',
            //   api:{
            //     url: '/api/component/routes',
            //     adaptor: function (payload: any) {
            //       return {
            //         ...payload
            //     }},
            //   },

            //   body:{
            //   }
            // },
            {
              type: 'service',
              name:'scheduleTaskList',
              id:'scheduleTaskList',
              visibleOn: "typeof listQueryName !== 'undefined'",
              api:{
                method: 'post',
                url: '/api/graphql?_=${listQueryName}',
                requestAdaptor: (api: any) => GraphQlRequestAdaptor.pageQuery( metaName,  fields, {}, 1, 100)(api),
                adaptor: function (payload: any) {
                  if (Array.isArray(payload.errors)) {
                    payload.errors.forEach((err: any) => {
                      console.log(JSON.stringify(err));
                    });
                    return {
                      status: 2,
                      msg: '出错了',
                    };
                  }
                  let items = payload.data.page_data.data;
                  let total = payload.data.page_data.total;
                  console.log(items);
                  return {

                    items: items,
                    total: total,

                }},
              },
              body:[

                {
                  type: 'table',
          className: "pt-3",

                  source: '$items',
                  columns: [
                    {
                      name: 'id',
                      label: '任务ID',
                    },
                    {
                      name: 'name',
                      label: '任务名',
                    },
                    {
                      name: 'create_time',
                      label: '创建时间',
                    },
                    // {
                    //   name: 'component',
                    //   label: '组件标识',
                    // },
                    {
                      name: 'action',
                      label: '行为标识',
                    },
                    // {
                    //   name: 'config_id',
                    //   label: '配置ID',
                    // },
                    // {
                    //   name: 'in_param',
                    //   label: '任务参数',
                    // },
                    {
                      name: 'start_at',
                      label: '开始时间',
                    },

                    {
                      name: 'end_at',
                      label: '结束时间',
                    },
                    {
                      name: 'status',
                      label: '状态',
                      "type": "status"
                    },


                    {
                      type: 'operation',
                      label: '管理',
                      buttons: [
                        {
                          visibleOn: 'status == 1',
                          type:'schedule-task-manage-dialog',
                          taskId :'${id}',
                          name :'${name}',
                          action:'eg_134d4f37_stop_action',
                          displayName: '停止'

                      }, {
                        visibleOn: 'status == 0',
                            type:'schedule-task-manage-dialog',
                            taskId :'${id}',
                            name :'${name}',
                            action:'eg_134da96f_start_action',
                            displayName: '启动'

                        },
                      ],
                    },
                    {
                      "label": "详情",
                      "type": "button",
                      "actionType": "dialog",
                      "dialog": {
                        "size": "lg",
                        "title": "弹框标题",
                        "body": ScheduleTaskDetail
                      }
                    },


                  ],
                }
              ],

            },


          ],
        }
      }
    ];
    return <AmisRenderer schema={schema} />;
  }
}
