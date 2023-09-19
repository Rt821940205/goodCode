import '@/components/amis/components/ModelDataFormRenderer';
import '@/components/amis/components/ModelDataListRenderer';
import '@/components/amis/components/ModelPageRenderer';
import '@/components/amis/components/UploadFileRenderer';
import '@/components/amis/components/UploadImageRenderer';
import { Loglist } from '@/pages/flow/task/View/loglist';

/**
 * 流程任务表单
 */
export const FlowTaskForm = [
  // 任务审批
  {
    type: 'service',
    name: 'approval_form',
    schemaApi: {
      method: 'get',
      url: '/api/flow/monitor/taskForm?processInstanceId=${processInstanceId}&allTask=${allTask|default:false}&taskId=${taskId}',
      adaptor: function (payload: any) {
        if (payload.data.xwFormId) {
          const xwFormId = payload.data.xwFormId;
          return {
            type: 'service',
            api: {
              method: 'post',
              url: '/api/graphql?_=get_flow_def',
              graphql:
                'query find($id:ID){find_custom_lcbd(obj:{id:$id}){id lcid zyyid zstid lcmc}}',
              data: {
                id: payload.data.xwFormId,
                state: 1,
              },
              responseData: {
                lcbd_info: '${find_custom_lcbd[0]}',
              },
            },
            body: [
              {
                type: 'service',
                schemaApi: {
                  method: 'post',
                  url: '/api/graphql?_=${lcbd_info.id}',
                  graphql: 'query find($id:ID){item:find_sys_page_view(obj:{id:$id}){body}}',
                  data: {
                    id: '${IF(lcbd_info.zstid=="", "426827698422153216", "434283220826062848")}',
                  },
                  adaptor: function (payload: any) {
                    let pageData: any;
                    try {
                      pageData = JSON.parse(payload.data.item[0].body);
                    } catch (e) {
                      pageData = JSON.parse(
                        payload.data.item[0].body.replace(/\n/g, '\\n').replace(/\r/g, '\\r'),
                      );
                    }
                    if (pageData.data == undefined) {
                      pageData.data = {};
                    }
                    pageData.data.lcbdid = xwFormId;
                    return pageData;
                  },
                },
              },
            ],
          };
        }
        let startFormData: any = [];
        const formDataId = payload.data.formDataId;
        const processVariables = payload.data.processVariables;
        if (payload.data.startViewPageId) {
          startFormData = [
            {
              type: 'service',
              schemaApi: {
                method: 'post',
                url: '/api/graphql?_=getflowpage',
                data: {
                  query: `query find(\\$id: ID){
                              item:find_sys_page_view(obj: {id: \\$id}) {
                                body
                              }
                            }`,
                  variables: {
                    id: payload.data.startViewPageId,
                  },
                },
                adaptor: function (payload: any) {
                  // 流程节点审批 将当前节点的页面id及任务id保存到data内。
                  const pageData = JSON.parse(payload.data.item[0].body);
                  if (pageData.data == undefined) {
                    pageData.data = {};
                  }
                  if (formDataId) {
                    pageData.data.dataId = formDataId;
                  }
                  return pageData;
                },
              },
            },
          ];
        } else if (payload.data.startPageId) {
          // 页面填写，没有配置显示页面
        } else if (payload.data.startFormProperties) {
          console.log('startFormProperties', payload.data.startFormProperties);
          payload.data.startFormProperties.map((field: any) => {
            if (payload.data.processVariables[field.id]) {
              field.value = payload.data.processVariables[field.id];
            }
          });
          startFormData = [
            {
              type: 'panel',
              title: '表单详情',
              body: {
                type: 'grid',
                columns: payload.data.startFormProperties.map((field: any) => {
                  return {
                    md: 4,
                    body: [
                      {
                        type: 'plain',
                        text: field.name + ': ' + field.value,
                      },
                    ],
                  };
                }),
              },
            },
          ];
        }
        if (payload.data.ended || payload.data.taskList.length == 0) {
          return [
            ...startFormData,
            Loglist,
            {
              type: 'button',
              label: '关闭',
              onEvent: {
                click: {
                  actions: [
                    {
                      actionType: 'goBack',
                    },
                  ],
                },
              },
            },
          ];
        }
        return payload.data.taskList.map((task: any) => {
          if (task.pageId) {
            const taskFormData = [
              {
                type: 'service',
                schemaApi: {
                  method: 'post',
                  url: '/api/graphql?_=getflowpage',
                  data: {
                    query: `query find(\\$id: ID){
                              item:find_sys_page_view(obj: {id: \\$id}) {
                                body
                              }
                            }`,
                    variables: {
                      id: task.pageId,
                    },
                  },
                  adaptor: function (payload: any) {
                    // 流程节点审批 将当前节点的页面id及任务id保存到data内。
                    let pageData: any;
                    try {
                      pageData = JSON.parse(payload.data.item[0].body);
                    } catch (e) {
                      pageData = JSON.parse(
                        payload.data.item[0].body.replace(/\n/g, '\\n').replace(/\r/g, '\\r'),
                      );
                    }
                    if (pageData.data == undefined) {
                      pageData.data = {};
                    }
                    pageData.data.taskId = task.id;
                    if (formDataId) {
                      pageData.data.dataId = formDataId;
                    }
                    if (processVariables) {
                      pageData.data.processVariables = processVariables;
                    }
                    return pageData;
                  },
                },
              },
            ];
            return [...startFormData, ...taskFormData];
          } else {
            let formFields = task.formProperties.map((field: any) => {
              return {
                type: 'input-text',
                name: field.id,
                label: field.name,
                value: field.value,
                required: field.required,
                readonly: !field.writable,
              };
            });
            if (formFields.length == 0) {
              formFields = [
                {
                  label: '审核结果:',
                  type: 'select',
                  name: 'approvalResult',
                  required: true,
                  value: '同意',
                  options: [
                    {
                      label: '同意',
                      value: '同意',
                    },
                    {
                      label: '拒绝',
                      value: '拒绝',
                    },
                  ],
                },
                {
                  visibleOn: 'approvalResult&&approvalResult=="同意"',
                  name: 'approvalReason',
                  type: 'textarea',
                  label: '同意原因:',
                  showCounter: true,
                  maxLength: 500,
                  placeholder: '请输入内容',
                },
                {
                  visibleOn: 'approvalResult&&approvalResult=="拒绝"',
                  name: 'approvalReason',
                  type: 'textarea',
                  label: '拒绝原因:',
                  required: true,
                  showCounter: true,
                  maxLength: 500,
                  placeholder: '请输入内容',
                },
              ];
            }
            if (task.formKey) {
              formFields = [
                ...formFields,
                {
                  type: 'hidden',
                  name: 'formKey',
                  value: task.formKey,
                },
              ];
            }
            return [
              ...startFormData,
              Loglist,
              {
                type: 'form',
                mode: 'horizontal',
                title: '我的审批',
                actions: [
                  {
                    type: 'button',
                    label: '取消',
                    onEvent: {
                      click: {
                        actions: [
                          {
                            actionType: 'goBack',
                          },
                        ],
                      },
                    },
                  },
                  {
                    type: 'submit',
                    level: 'primary',
                    label: '确认',
                  },
                ],
                data: {
                  taskId: task.id,
                },
                reload: 'flow_pic?now=${now},approval_form,flow_log',
                api: {
                  method: 'post',
                  url: '/api/flow/monitor/approval?taskId=${taskId}',
                  adaptor: function () {
                    return {
                      now: new Date().getTime(),
                    };
                  },
                },
                body: formFields,
              },
            ];
          }
        });
      },
    },
  },
];
