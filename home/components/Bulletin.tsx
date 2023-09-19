/**
 * 公告
 * author rencj@chinaoly.com
 */

import './Bulletin.less';
import { formatDate } from '@/utils';

export function getBulletin(pageSize: number = 7) {
  return {
    type: 'service',
    className: 'bulletin-service',
    api: {
      method: 'POST',
      url: '/api/graphql',
      data: {
        query:
          `{pages_custom_xtgg_1659922496244(obj:{},pageNum:1,pageSize:${pageSize}){data{id ggbt create_time}}}`,
      },
      adaptor: function (payload: any) {
        const list = payload.data.pages_custom_xtgg_1659922496244.data.map((item: any) => {
          return {
            id: item.id,
            title: item.ggbt,
            createTime: formatDate(item.create_time, 'yyyy.MM.dd'),
          };
        });
        return { list };
      },
    },
    body: [
      {
        visibleOn: '${list.length === 0}',
        type: 'flex',
        justify: 'center',
        alignItems: 'center',
        className: 'no-bulletin-wrapper',
        items: {
          type: 'container',
          body: [
            { type: 'container', className: 'no-bulletin' },
            { type: 'container', body: '暂无公告～', className: 'no-bulletin-label' },
          ],
        },
      },
      {
        visibleOn: '${list.length > 0}',
        type: 'each',
        name: 'list',
        items: {
          type: 'action',
          actionType: 'link',
          className: 'bulletin-action mx-6',
          link: '/singlePage?pageId=398516779569336320&ggid=${id}',
          blank: true,
          body: {
            type: 'flex',
            justify: 'space-between',
            className: 'bulletin-wrapper',
            items: [
              {
                type: 'tpl',
                tpl: '<span class="font-extrabold">【公告】</span>${title}',
              },
              { type: 'tpl', tpl: '${createTime}', className: 'bul-createTime' },
            ],
          },
        },
      },
    ],
  };
}
