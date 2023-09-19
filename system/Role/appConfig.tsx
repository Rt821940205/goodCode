import './index.less';
import { appResource } from './appResource';
import { appList } from './appList';

export const appConfig = {
  reload: true,

  title: '功能点授权配置',
  tab: [
    {
      type: 'page',
      name: 'appConfigSetting',
      body: [
        {
          type: 'service',
          className: 'applist-wrapper',
          body: [appList],
        },
        {
          type: 'container',
          className: 'right-tabs-wrapper',
          body: [appResource],
        },
      ],
    },
  ],
};
