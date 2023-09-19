import AmisRenderer from '@/components/AmisRenderer';
import { apiListBody } from '@/pages/app/datasource/api/apiList';
import { history } from '@@/core/history';
import { SchemaNode } from '@fex/amis/lib/types';

import { setBreadcrumb } from '@/utils';
export default function () {
  // 获取 appId
  const { query = {} } = history.location;
  const { appId, modelId } = query;
  const breadcrumb = setBreadcrumb(); // 面包屑组件
  const schema: SchemaNode = {
    type: 'page',
    title: '',
    className: "base-light-page-center page-w1400 bg-white rounded-lg mt-6",
    data: {
      modelId: modelId,
      appId: appId,
    },
    initApi: {
      method: 'get',
      url: '/api/def/model/complete/info?_=getServiceInfo&appId=${appId}&modelId=${modelId}',
      adaptor: function (payload:any, response:any, api:any) {
        let modelId = api.query.modelId;
        let appId = api.query.appId;
        let displayName = payload.data.displayName;
        let auth_type = payload.data.fields.filter((e:any) => {
          return e.name === 'authentication_type';
        })[0].defaultValue;
        return {
          data: {
            displayName: displayName,
            auth_type: auth_type,
            appId: appId,
            modelId: modelId
          },
        };
      },
    },
    body: [
      breadcrumb,
      apiListBody,
    ]
  };
  return <AmisRenderer schema={schema} />;
}
