import AmisRenderer from '@/components/AmisRenderer';
import { history } from '@@/core/history';
import { SchemaNode } from '@fex/amis/lib/types';
import { FlowTaskForm } from './form';
import './index.less';

/**
 * 流程任务详情页
 */
export default function () {
  const { query = {} } = history.location;
  const { allTask } = query;

  const schema: SchemaNode = {
    type: 'page',
    title: '',
    className: 'flow-task-view',
    data: {
      ...query,
      allTask: allTask == undefined ? false : true,
    },
    body: [
      {
        type: 'tabs',
        tabs: [
          {
            title: '表单',
            tab: FlowTaskForm,
          },
          {
            title: '流程',
            reload: true,
            tab: {
              type: 'service',
              dataProvider: 'setData({now: new Date().toString()})',
              body: [
                {
                  type: 'container',
                  style: {
                    width: '100%',
                  },
                  body: {
                    type: 'image',
                    width: '100%',
                    height: '500px',
                    src: '/api/flow/task/diagram?processInstanceId=${processInstanceId}&_=${now}',
                  },
                },
                {
                  type: 'button',
                  label: '关闭',
                  onEvent: {
                    click: {
                      actions: [
                        {
                          actionType: 'goBack',
                        },
                      ],
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    ],
  };
  return <AmisRenderer schema={schema} />;
}
