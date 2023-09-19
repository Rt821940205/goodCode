/**
 * 资源统计
 * author rencj@chinaoly.com
 */
import { getCustomIcon } from './CustomIcon';
import './Statistics.less';
export function getStatistics() {
  return {
    type: 'service',
    api: {
      method: 'POST',
      url: '/api/graphql',
      data: {
        query: `{data:exec_custom_yysyzhb(obj: {}) {zhou_yccs huanbi_yccs zhou_sycs huanbi_sycs}}`,
      },
      adaptor(payload: any) {
        const data = payload.data.data[0] || {huanbi_yccs:0,huanbi_sycs:0,zhou_sycs:0,zhou_yccs:0};
        if (data.huanbi_yccs == null) {
          data.huanbi_yccs = 0;
        }
        if (data.huanbi_sycs == null) {
          data.huanbi_sycs = 0;
        }
        return { ...payload, data: data };
      },
    },
    body: {
      type: 'flex',
      justify: "space-between",
      className:'p-10',
      items: [
        {
          type: 'container',
          bodyClassName: 'px-10 flex flex-col items-center justify-center',
          body: [
            {
              type: 'container',
              body: getCustomIcon('home-use-time', 'big-icon'),
            },
            {
              type: 'container',
              className: 'count-label',
              body: "应用使用次数<span class='mx-4 text-danger text-md'>${zhou_sycs}</span>次 ",
            },
            {
              type: 'container',
              bodyClassName: 'flex justify-center',
              body: [
                {
                  type: 'tpl',
                  className: 'count-label',
                  tpl: '周环比',
                },
                {
                  type: 'container',
                  visibleOn: '${huanbi_sycs > 0}',
                  body: getCustomIcon('icon-shangsheng', 'count-icon'),
                },
                {
                  type: 'container',
                  visibleOn: '${huanbi_sycs==0}',
                  body: ' &nbsp;-',
                },
                {
                  type: 'container',
                  visibleOn: '${huanbi_sycs < 0}',
                  body: getCustomIcon('icon-xiajiang', 'count-icon'),
                },
                {
                  type: 'tpl',
                  tpl:
                    "${huanbi_sycs == 0 ? '' : huanbi_sycs|percent:2}",
                },
              ],
            },
          ],
        },
        {
          type: 'container',
          bodyClassName: 'px-10 flex flex-col items-center justify-center',
          body: [
            {
              type: 'container',
              body: getCustomIcon('home-use-error-time', 'big-icon'),
            },
            {
              type: 'container',
              className: 'count-label',
              body: "应用异常次数<span class='mx-4 text-danger text-md'>${zhou_yccs}</span>次 ",
            },
            {
              type: 'container',
              bodyClassName: 'flex justify-center',
              body: [
                {
                  type: 'tpl',
                  className: 'count-label',
                  tpl: '周环比',
                },
                {
                  type: 'container',
                  visibleOn: '${huanbi_yccs> 0}',
                  body: getCustomIcon('icon-shangsheng', 'count-icon'),
                },
                {
                  type: 'container',
                  visibleOn: '${huanbi_yccs==0}',
                  body: ' &nbsp;-',
                },
                {
                  type: 'container',
                  visibleOn: '${huanbi_yccs< 0}',
                  body: getCustomIcon('icon-xiajiang', 'count-icon'),
                },
                {
                  type: 'tpl',
                  tpl:
                    "${huanbi_yccs == 0 ? '' : huanbi_yccs|percent:2}",
                },
              ],
            },
          ],
        },
      ],
    },
  };
}
