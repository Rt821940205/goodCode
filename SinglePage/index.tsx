import '@/components/amis/components/ModelDataFormRenderer';
import '@/components/amis/components/ModelDataListRenderer';
import '@/components/amis/components/ModelPageRenderer';
import '@/components/amis/components/UploadFileRenderer';
import '@/components/amis/components/UploadImageRenderer';
import { history } from '@@/core/history';
import './index.less';
import AmisRenderer from '@/components/AmisRenderer';
import { SchemaNode } from '@fex/amis/lib/types';

export function fetchPageSchema(props: React.PropsWithChildren<{}>) {
  const { query = {} } = history.location;
  const params = props.route.pageId ? { ...query, pageId: props.route.pageId } : query;
  //
  const schema: SchemaNode = {
    type: 'page',
    bodyClassName: 'p-0',
    data: {
      ...params,
    },
    // initApi: {
    //   method: 'get',
    //   url: '/api/authority/user/organize',
    //   responseData: {
    //     '&': '$$',
    //   },
    // },
    body: [
      {
        type: 'service',
        schemaApi: {
          method: 'post',
          sendOn: 'pageId>0',
          url: '/api/graphql?_=getPageDef&_pageId=${pageId}',
          data: {
            query: `query find(\\$id: ID){
                              item:find_sys_page_view(obj: {id: \\$id}) {
                                body
                              }
                            }`,
            variables: {
              id: '${pageId}',
            },
          },
          adaptor: function (payload: any) {
            try {
              return JSON.parse(payload.data.item[0].body);
            } catch (e) {
              return JSON.parse(
                payload.data.item[0].body.replace(/\n/g, '\\n').replace(/\r/g, '\\r'),
              );
            }
          },
        },
      },
    ],
  };
  return schema;
}

/**
 * 单页面显示
 * @constructor
 */
const SinglePageList: React.FC = (props) => {
  const schema = fetchPageSchema(props);

  return <AmisRenderer schema={schema} />;
};
export default SinglePageList;
