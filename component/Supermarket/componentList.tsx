
export const crudCards = {
  className: "mb-6 border-none",
  bodyClassName:'p-0',
  body: [
    {
      type: 'container',
      className:'p-4  hover:border-primary rounded-lg',
      bodyClassName: 'flex justify-between',
      style: { 
        background: '#F0F6FF',
        border:'1px solid transparent'
      },
      body: [
        {
          type: 'container',
          bodyClassName: 'flex',
          body: [
            {
              type: 'avatar',
              src: '${icon}',
              shape: "square",
              className:"bg-transparent"
            },
            {
              type: 'container',
              className: "ml-2 mr-5 text-black",
              style: {
                height:"4.375rem"
              },
              body: [
                {
                  type: 'container',
                  body: '${component_name}',
                },
                {
                  type: "tooltip-wrapper",
                  content: "${description}",
                  body: [
                    {
                      type: 'container',
                      body: '${description}',
                      className:"text-gray overflow-line-2"
                    },
                  ]
                },
              ],
            },
          ]
        },
        {
          type: 'button',
          level: "light",
          size:'sm',
          label: '查看',
          actionType: 'link',
          url: '/component/setting?componentId=${id}'
        }
      ],
    },
  ],
  actionsCount: 10,
  itemAction: {
    type: 'button',
    actionType: 'link',
    link: '/component/setting?componentId=${id}',
  }
}
