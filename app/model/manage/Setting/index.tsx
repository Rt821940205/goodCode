import AmisRenderer from '@/components/AmisRenderer';
import { modelActionsForm } from '@/pages/app/model/manage/Setting/modelActions';
import { modelFieldsForm } from '@/pages/app/model/manage/Setting/modelFields';
import { modelInfoFormEdit } from '@/pages/app/model/manage/Setting/modelInfo';
import { history } from '@@/core/history';
import { SchemaNode } from '@fex/amis/lib/types';
import './index.less';
import {beforeHandle, errorHandle} from "@/services/xuanwu/api";

export default function () {
  // 页面全局变量在此存放
  const { query = {} } = history.location;
  const { appId, modelId } = query;
  const schema: SchemaNode = {
    type: 'page',
    title: '${displayName}',
    name: 'modelForm',
    initApi: 'get:/api/def/model/complete/info?modelId=${modelId}&_=init',
    data: {
      appId: appId,
      modelId: modelId,
    },
    body: [
      {
        type: 'tabs',
        tabs: [
          {
            title: '实体信息',
            tab: {
              type: 'form',
              messages: {
                saveSuccess: '更新成功',
                saveFailed: '更新失败',
              },
              api: {
                method: 'post',
                url: '/api/def/model/save',
                adaptor: function (payload: any) {
                  if(beforeHandle(payload)){
                    let modelId = payload.data.id;
                    return {
                      modelId: modelId,
                    };
                  }
                  return errorHandle(payload);
                },
              },
              title: '',
              body: modelInfoFormEdit,
            },
          },
          {
            title: '实体属性',
            tab: modelFieldsForm,
          },
          {
            title: '实体行为',
            tab: modelActionsForm,
          },
          // {
          //   title: '实体权限',
          //   tab: modelPermissionForm,
          // },
        ],
      },
    ],
  };
  return <AmisRenderer schema={schema} />;
}
