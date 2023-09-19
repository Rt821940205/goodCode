import AmisRenderer from '@/components/AmisRenderer';
import { apiModelInfoForm } from '@/pages/app/datasource/model/create/step_1_info';
import { api_field_mapping } from '@/pages/app/datasource/model/create/step_2_api_field_mapping';
import { modelActionsForm } from '@/pages/app/model/manage/Setting/modelActions';
import { modelPermissionForm } from '@/pages/app/model/manage/Setting/modelPermission';
import { history } from '@@/core/history';
import { SchemaNode } from '@fex/amis/lib/types';
import './index.less';

export default function () {
  // 页面全局变量在此存放
  const { query = {} } = history.location;
  const { appId, modelId } = query;
  const schema: SchemaNode = {
    type: 'page',
    title: '',
    name: 'modelForm',
    initApi: 'get:/api/def/model/complete/info?modelId=${modelId}',
    data: {
      appId: appId,
      modelId: modelId,
    },
    body: [
      {
        type: 'tabs',
        tabs: [
          {
            title: '服务信息',
            tab: {
              type: 'form',
              promptPageLeave: true,
              api: {
                method: 'post',
                url: '/api/def/model/save',
                adaptor: function (payload: any) {
                  let modelId = payload.data.id;
                  return {
                    modelId: modelId,
                  };
                },
              },
              title: '',
              body: apiModelInfoForm,
            },
          },
          {
            title: '服务属性',
            tab: {
              type: 'page',
              body: api_field_mapping,
            },
          },
          {
            title: '服务行为',
            tab: modelActionsForm,
          },
          // {
          //   title: '服务权限',
          //   tab: modelPermissionForm,
          // },
        ],
      },
    ],
  };
  return <AmisRenderer schema={schema} />;
}
