/**
 * 创建实体步骤1
 * author rencj@chinaoly.com
 */
 import AmisRenderer from '@/components/AmisRenderer';
 import { history } from '@@/core/history';
 import { SchemaNode } from '@fex/amis/lib/types';
 import {setEntity} from '@/components/entityStep'; // 创建实体表单组件
 import { setBreadcrumb } from '@/utils';

 export default function () {
   const { query = {} } = history.location;
   const { appId, modelId } = query;
   // 表单属性
   const props = {
     initApi: `get:/api/def/model/complete/info?modelId=${modelId}&_=step1`,
     api: {
       method: 'post',
       url: '/api/def/model/save',
       adaptor: function (payload: any) {
         return {
           ...payload,
           data: {
             ...payload.data,
             modelId: payload.data?.id
           }
         }
       },
     },
     redirect:'/app/entityMange/entityCreate/step_two?appId=${appId}&step=1&modelId=${id}&subPage=true',
   }

  // 页面不用page包裹时，头部插入面包屑组件
  const breadcrumb = setBreadcrumb(); // 面包屑组件
  const schema : SchemaNode= {
    type: 'page',
    body: [
      breadcrumb,
      setEntity(props, [], { value: 0, data: { appId }, steps: []})
    ],
    className: "base-light-page-center page-w1400 bg-white rounded-lg mt-6",
  }
   return <AmisRenderer schema={schema}  />;
 }
