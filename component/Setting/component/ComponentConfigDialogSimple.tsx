import { ModelInfoDialogSimple } from '@/pages/component/Setting/component/ModelInfoDialogSimple';

/**
 * 查看配置
 */
export const ComponentConfigDialog = {
  closeOnEsc: true,
  closeOnOutside: true,
  // size: 'lg',
  title: '配置详情',
  actions: [
    {
      type: 'button',
      label: '取消',
      level:"light",
      actionType: 'cancel',
    },
    {
      type: 'button',
      primary: true,
      label: '确认',
      actionType: 'cancel',
    },
    
  ],
  body: ModelInfoDialogSimple('${id}'),
};
