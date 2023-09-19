import AmisRenderer from '@/components/AmisRenderer';
import { SchemaNode } from '@fex/amis/lib/types';
import { systemOrgManage } from './org';
import { history } from '@@/core/history';

export default function () {
  const { query = {} } = history.location;
  let { organizeId } = query;
  const schema: SchemaNode = {
    type: 'page',
    bodyClassName:"bg-white m-4 rounded-lg p-0 h-screen-sub-140",
    title: '',
    data:{
      organizeId:organizeId,
      chooseId:organizeId
    },
    body: [
      systemOrgManage
    ],
  };
  return <AmisRenderer schema={schema} />;
}
