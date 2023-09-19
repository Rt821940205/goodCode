import AmisRenderer from '@/components/AmisRenderer';
import { SchemaNode } from '@fex/amis/lib/types';
import React from 'react';
import './index.less';
import { history } from '@@/core/history';

/**
 * 应用中心 应用列表
 */
export default class composePage extends React.Component {
  render(): any {
    const { query = {} } = history.location;
    const { componentId,appId,dataId,version } = query;
    const schema: SchemaNode = [
      {
        type: 'service',
        schemaApi: {
          method: 'get',
          url: '/api/component/execute?action=eg_1ac2_compose_build_url_action&component=eg_1ac2_component_compose_plugin&app_id=' + appId + '&dataId=' + dataId + '&componentId=' + componentId + '&version=' +version ,
          adaptor: function (payload: any) {
            let url = payload.data.url;
            window.location.href = url
            return {}
            },
        },
      },
    ];
    return <AmisRenderer schema={schema} />;
  }
}
