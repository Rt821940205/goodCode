/**
 * 实体详情页面（实体信息、实体属性、实体行为）
 * author
 */
// import './index.less';
import AmisRenderer from '@/components/AmisRenderer';
import { setEntityForm } from '@/components/entityForm';
import { getEntityProp } from '@/components/entityProp';
import { history } from '@@/core/history';
import { modelActionsForm } from '@/pages/app/model/manage/Setting/modelActions';
const { query = {} } = history.location;
const { appId, modelId } = query;
import { setBreadcrumb } from '@/utils';

import { SchemaNode } from '@fex/amis/lib/types';
const breadcrumb = setBreadcrumb(); // 面包屑组件
const schema : SchemaNode=
      {
      type: 'page',
      className: 'base-light-page-center page-w1400 bg-white rounded-lg mt-6',
      name: 'modelForm',
      initApi: 'get:/api/def/model/complete/info?modelId=${modelId}&_=init',
      body: [
        breadcrumb,
        {
          type: 'container',
          className: 'p-4',
          body: [
            {
              type: 'container',
              body: [
                {
                  "type": "tpl",
                  className: 'flex mb-4',
                  "tpl": "基本信息"
                },
                setEntityForm(
                  {
                    messages: {
                      saveSuccess: '更新成功',
                      saveFailed: '更新失败',
                    },
                    api: {
                      method: 'post',
                      url: '/api/def/model/save',
                      adaptor: function (payload: any) {
                        console.log(payload);
                        return {
                          modelId: payload.data.id,
                          ...payload,
                        };
                      },
                    },
                  },
                  [],
                ),
              ]
            },
            {
              type: 'container',
              className: '',
              body: [
                {
                  "type": "tpl",
                  className: 'flex mb-4',
                  "tpl": "实体属性"
                },
                getEntityProp(appId, modelId, modelActionsForm)
              ],
            },
          ],
        },
      ],
    }
export default function () {
  return <AmisRenderer schema={schema} />;
}
