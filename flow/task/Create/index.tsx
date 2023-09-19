import AmisRenderer from '@/components/AmisRenderer';
import { history } from '@@/core/history';
import { SchemaNode } from '@fex/amis/lib/types';

import '@/components/amis/components/ModelDataFormRenderer';
import '@/components/amis/components/ModelDataListRenderer';
import '@/components/amis/components/ModelPageRenderer';
import '@/components/amis/components/UploadFileRenderer';
import '@/components/amis/components/UploadImageRenderer';

/**
 * 流程任务发起
 */
export default function () {
  const { query = {} } = history.location;
  const { processDefinitionId } = query;

  const schema: SchemaNode = {
    type: 'page',
    title: '',
    className: 'base-light-page p-4',
    data: {
      ...query,
    },
    body: [
      {
        type: 'service',
        schemaApi: {
          method: 'get',
          url: '/api/flow/monitor/start?processDefinitionId=${processDefinitionId}',
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
            } else if (payload.data.pageId) {
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
                      label: field.name + ':',
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
                    label: '发起',
                  },
                ],
                mode: 'horizontal',
                redirect: '/task/view?processInstanceId=${processInstanceId}',
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
    ],
  };
  return <AmisRenderer schema={schema} />;
}
