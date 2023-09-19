export const Loglist = {
  visibleOn: 'processInstanceId!==undefined',
  type: 'service',
  name: 'flow_log',
  api: '/api/flow/monitor/log?processInstanceId=${processInstanceId}',
  body: [
    {
      type: 'panel',
      title: '处理人意见区',
      body: [
        {
          type: 'table',
          title: '',
          source: '${items|filter:activityType:equals:"userTask"}',
          className: 'log-list',
          columns: [
            {
              type: 'avatar',
              text: '${assignee}',
              // label: '节点',
              width: 40,
            },
            {
              name: 'assignee',
              // label: '处理人',
              width: 100,
            },
            {
              name: 'approvalResult',
            },
            // {
            //   type: 'date',
            //   format: 'YYYY-MM-DD HH:mm:ss',
            //   name: 'startTime',
            //   label: '开始',
            // },
            {
              type: 'date',
              format: 'YYYY-MM-DD HH:mm:ss',
              name: 'endTime',
              // label: '结束',
            },
            // {
            //   name: 'durationInMillis',
            //   label: '耗时(ms)',
            // },
          ],
        },
      ],
    },
  ],
};
