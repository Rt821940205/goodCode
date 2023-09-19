import AmisRenderer from '@/components/AmisRenderer';
import { SchemaNode } from '@fex/amis/lib/types';
import React from 'react';
import './index.less';
import { history } from '@@/core/history';

/**
 * 应用中心 应用列表
 */
export default class AppList extends React.Component {
  render(): any {
    const { query = {} } = history.location;
    const { componentId } = query;
    const schema: SchemaNode = [
      {
        type: 'service',
        schemaApi: {
          method: 'get',
          url: '/api/def/model/complete/info?modelId=' + componentId,
          adaptor: function (payload: any) {
            let fields = payload.data.fields;
            let displayName = payload.data.displayName;
            let bodyItems: Array<any> = [
              { type: 'static', name: 'displayName', value: displayName, label: '显示名称' },
            ];
            fields
              .filter((item: any) => {
                return item.category != null;
              })
              .forEach((item: any) => {
                bodyItems.push({
                  type: 'static',
                  name: item.name,
                  label: item.displayName,
                  value: item.defaultValue,
                });
              });
            bodyItems.push({
              type: 'button',
              onClick:function (props:any){
                history.goBack()
              },
              label: '返回',
            });
            return {
              type: 'container',
              class: 'hello',
              className:'hello-class',
              title: '',
              body: bodyItems,
            };
          },
        },
      },
    ];
    return <AmisRenderer schema={schema} />;
  }
}
