import AmisRenderer from '@/components/AmisRenderer';
import { SchemaNode } from '@fex/amis/lib/types';
import { history } from '@@/core/history';
import './index.less';
import { roleInfoForm } from '@/pages/system/Role/roleEdit';
import { member } from './member';
import { orgInfo } from '@/pages/system/Role/orgInfo';
import { pageConfig } from './pageConfig';
import { roleList } from './roleList';
//import { appConfig } from './appConfig';

export default function () {
  const { query = {} } = history.location;
  const { chooseId } = query;

  const bodyschema: SchemaNode = {
    type: 'page',
    title: '',
    bodyClassName: "p-0",
    asideResizor: true,
    asideMinWidth: 240,
    asideMaxWidth: 1000,
    asideClassName: "w-60",
    aside: [roleList],
    data: {
      chooseId: chooseId,
    },
    body: [
      {
        type: 'service',
        name: 'roleForm',
        body: [
          {
            type: 'container',
            body: [
              {
                type: 'tabs',
                id: 'roleTab',
                name: 'roleTabs',
                tabs: [
                  {
                    title: '角色信息',
                    reload: true,
                    tab: {
                      type: "container",
                      style: {
                        width:"37.5rem"
                      },
                      body:[roleInfoForm]
                    },
                  },
                  member,
                  orgInfo,
                  pageConfig,
                  //appConfig, 功能点授权配置先不要在当前页面使用
                ],
              },
            ],
          },
        ],
      },
    ],
  };
  const schema: SchemaNode = {
    type: 'page',
    bodyClassName:"bg-white m-4 rounded-lg p-0 h-screen-sub-140",
    title: '',
    body: [
      bodyschema
    ],
  };
  return <AmisRenderer schema={schema} />;
}
