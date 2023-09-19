import './Title.less';
import avatar from '../../../assets/images/avatar.png';
import { createApplication } from '@/components/createApplication';

export function getTitle(userName: string, isShow: boolean = true) {
  return {
    type: 'container',
    className:'w-full mb-6',
    body: [
      {
        type: 'container',
        bodyClassName:"flex flex-col justify-content items-center",
        body: [
          {
            type: 'tpl',
            tpl: "<img class='home-avatar mb-4' src='" + avatar + "' />",
          },
          {
            type: 'tpl',
            className: 'text-lg text-black',
            tpl: `Hi ${userName}`,
          },
          {
            type: 'tpl',
            tpl:'欢迎加入开发开放平台'
          },
          {
            type: 'tpl',
            tpl: '快来一起搭建你的高效管理应用吧！',
          },
          isShow &&
          {
            type: 'container',
            className:'my-4',
            body: [
              {
                type: 'button',
                level: 'primary',
                className:'home-create-btn',
                icon: 'fa fa-plus',
                label: '创建应用',
                actionType: 'dialog',
                dialog: createApplication(),
              },
            ],
          },
        ],
      },
      
    ],
  };
}
