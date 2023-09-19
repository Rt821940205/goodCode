import '@/components/amis/components/EngineComponent/EngineUiRenderer';
import { ActionParameters } from '@/pages/component/Setting/component/ActionParameters';
import { ModelInfoDialog } from '@/pages/component/Setting/component/ModelInfoDialog';
/**
 * 组件行为列表
 */
export const ComponentActions = {
  type: 'table',
  columnsTogglable: false,
  // title: '能力清单',
  source: '$actions',
  headerToolbar: [],
  className: 'supermarket-table',
  columns: [
    {
      name: 'displayName',
      label: '行为',
      fixed: 'left',
    },
    {
      name: 'name',
      label: '标识',
    },
    {
      name: 'description',
      label: '介绍',
    },
    {
      type: 'operation',
      label: '输入',
      buttons: [
        ActionParameters('查看输入', '输入参数详情', '${params.in.value}'),
        // {
        //   type: 'link',
        //   className: 'text-sm',
        //   // 临时处理网址
        //   href: 'http://' + location.host.replace(':8000', '') + ':8081/graphiql',
        //   body: '测试',
        // },
      ],
    },
    {
      type: 'operation',
      label: '输出',
      buttons: [
        { type: 'page', body: '-', visibleOn: 'returnType == "JSON"' },
        {
          label: '查看输出',
          type: 'button',
          level: 'link',
          visibleOn: 'returnType != "JSON"',
          actionType: 'dialog',
          dialog: {
            closeOnEsc: true,
            closeOnOutside: true,
            size: 'lg',
            title: '输出详情',
            actions: [],
            body: ModelInfoDialog('${returnType}'),
          },
        },
      ],
    },
    {
      type: 'operation',
      label: '测试',
      buttons: [
        {
          label: '测试',
          type: 'button',
          level: 'link',
          // visibleOn: 排除不能测试的组件,
          actionType: 'dialog',
          dialog: {
            closeOnEsc: true,
            closeOnOutside: true,
            size: 'lg',
            title: '组件测试',
            actions: [],
            body: {
              type: 'engine_ui_test',
              _key: '${componentModel.name}_${name}',
            },
          },
        },
      ],
    },
  ],
};
