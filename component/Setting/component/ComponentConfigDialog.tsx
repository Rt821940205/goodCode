import { ModelInfoDialog } from '@/pages/component/Setting/component/ModelInfoDialog';

/**
 * 查看配置
 */
export const ComponentConfigDialog = {
  closeOnEsc: true,
  closeOnOutside: true,
  size: 'lg',
  title: '配置详情',
  actions: [
  
    // {
    //   label: '测试配置',
    //   actionType: 'ajax',
    //   type: 'button',
    //   // api: 'post:/api/component/checkConfig?configId=' + '${id}',
    //   api: {
    //     method: 'post',
    //     url: '/api/component/checkConfig',
    //     dataType: 'form',
    //     data: {
    //       configId: '${id}',
    //     },
    //     adaptor: function (payload: any) {
    //       console.debug(payload);
    //       return {
    //         ...payload,
    //       };
    //     },
    //   },
    // },
    {
      type: 'button',
      label: '取消',
      actionType: 'cancel',
    },
    {
      type: 'button',
      primary: true,
      label: '确认',
      actionType: 'cancel',
    },
    
  ],
  body: ModelInfoDialog('${id}'),
};
