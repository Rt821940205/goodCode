import AmisRenderer from '@/components/AmisRenderer';
import { jdbcList } from '@/pages/app/datasource/jdbc/jdbcList';
import { history } from '@@/core/history';
import { SchemaNode } from '@fex/amis/lib/types';

export default function () {
  const { query = {} } = history.location;
  const { appId, source_id } = query;
  const schema: SchemaNode = {
    type: 'page',
    title: '',
    className: 'base-light-page-center page-w1400 bg-white rounded-lg mt-6  p-6',
    data: {
      source_id: source_id,
      appId: appId,
    },
    initApi:'get:/api/def/model/complete/info?modelId='+source_id+'&_=loadJdbc',
    body: jdbcList,
  };
  return <AmisRenderer schema={schema} />;
}
