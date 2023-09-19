export const Loglist = {
  visibleOn: 'processInstanceId!==undefined',
  type: 'service',
  name: 'flow_log',
  api: '/api/flow/monitor/log?processInstanceId=${processInstanceId}',
  body: [
    {
      type: 'table',
      title: '流转记录',
      source: '$items',
      columns: [
        {
          name: 'activityName',
          label: '节点',
        },
        {
          name: 'assignee',
          label: '处理人',
        },
        {
          type: 'date',
          format: 'YYYY-MM-DD HH:mm:ss',
          name: 'startTime',
          label: '开始',
        },
        {
          type: 'date',
          format: 'YYYY-MM-DD HH:mm:ss',
          name: 'endTime',
          label: '结束',
        },
        {
          name: 'durationInMillis',
          label: '耗时(ms)',
        },
      ],
    },
  ],
};
