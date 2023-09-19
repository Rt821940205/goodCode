import AmisRenderer from '@/components/AmisRenderer';
import { FlowTaskForm } from '@/pages/flow/task/View/form';
import { Loglist } from './loglist';
import { SchemaNode } from '@fex/amis/lib/types';
import React from 'react';
import { history } from 'umi';

/**
 * 流程接口-演示流程
 *
 * @constructor
 */
const FlowMonitorManage: React.FC = () => {
  const { query = {} } = history.location;
  const { processDefinitionId, processInstanceId } = query;
  //
  const schema: SchemaNode = {
    type: 'page',
    title: '流程模拟',
    toolbar: [],
    data: {
      processDefinitionId: processDefinitionId,
      processInstanceId: processInstanceId,
      allTask: true
    },
    body: [
      {
        label: '选择流程',
        type: 'select',
        name: 'pd_id',
        source: {
          method: 'get',
          url: '/api/flow/monitor/list',
          responseData: '${items|pick:label~name,value~id}',
        },
        value: '${processDefinitionId}',
        onEvent: {
          change: {
            actions: [
              {
                actionType: 'link',
                args: {
                  link: '?',
                  params: {
                    processDefinitionId: '${event.data.value}',
                  },
                },
              },
            ],
          },
        },
      },
      {
        visibleOn: 'processDefinitionId!==undefined',
        type: 'form',
        title: '',
        name: 'flow_pic',
        actions: [],
        body: [
          {
            type: 'image',
            imageMode: 'original',
            src: '/api/flow/monitor/diagram?processDefinitionId=${processDefinitionId}&processInstanceId=${processInstanceId}&_=${now}',
          },
        ],
      },
      {
        visibleOn: 'processDefinitionId!==undefined',
        type: 'panel',
        body: [
          // 流程的发起表单
          {
            visibleOn: 'processInstanceId===undefined',
            type: 'service',
            schemaApi: {
              method: 'get',
              url: '/api/flow/monitor/start?processDefinitionId=${processDefinitionId}',
              adaptor: function (payload: any) {
                if (payload.data.pageId) {
                  return {
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
                          id: payload.data.pageId,
                        },
                      },
                      adaptor: function (payload: any) {
                        const pageData = JSON.parse(payload.data.item[0].body);
                        pageData.data.processDefinitionId = processDefinitionId;
                        return pageData;
                      },
                    },
                  };
                } else {
                  let startFormFields = payload.data.processDefinition.startFormDefined
                    ? payload.data.formProperties.map((field: any) => {
                        return {
                          type: 'input-text',
                          name: field.id,
                          label: field.name,
                          value: field.value,
                          required: field.required,
                        };
                      })
                    : [];
                  if (payload.data.formKey) {
                    startFormFields = [
                      ...startFormFields,
                      {
                        type: 'hidden',
                        name: 'formKey',
                        value: payload.data.formKey,
                      },
                    ];
                  }
                  return {
                    type: 'form',
                    title: '流程发起',
                    submitText: '发起流程任务',
                    mode: 'horizontal',
                    redirect:
                      '?processDefinitionId=${processDefinitionId}&processInstanceId=${processInstanceId}',
                    api: {
                      method: 'post',
                      url: '/api/flow/monitor/create?processDefinitionId=${processDefinitionId}',
                      adaptor: function (payload: any) {
                        return {
                          processInstanceId: payload.data.id,
                        };
                      },
                    },
                    body: startFormFields,
                  };
                }
              },
            },
          },
          // 任务审批
          FlowTaskForm,
          // 流转记录
          Loglist,
        ],
      },
    ],
  };

  return <AmisRenderer schema={schema} breadcrumb={{ routes: [] }} />;
};
export default FlowMonitorManage;
