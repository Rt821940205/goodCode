// export const ModelRelationship = {
//   type: 'crud',
//   source: '$modelRels',
//   showHeader: false,
//   borderMode: 'none',
//   builderMode: 'full',
//   columns: [
//     {
//       name: 'description',
//     },
//   ],
//   itemActions: [
//     {
//       type: 'wrapper',
//       body: [
//         {
//           type: 'flex',
//           justify: 'space-between',
//           items: [
//             {
//               type: 'tooltip-wrapper',
//               tooltip: '删除',
//               body: {
//                 icon: 'fa fa-minus',
//                 type: 'button',
//                 level: 'link',
//                 actionType: 'dialog',
//                 dialog: {
//                   title: '系统消息',
//                   body: '确认要删除吗',
//                 },
//               },
//               className: 'mb-1',
//             },
//             {
//               type: 'tooltip-wrapper',
//               tooltip: '编辑',
//               body: {
//                 icon: 'fa fa-edit',
//                 type: 'button',
//                 level: 'link',
//                 actionType: 'drawer',
//                 drawer: {
//                   type: 'form',
//                   title: '编辑属性',
//                   promptPageLeave: true,
//                   size: 'md',
//                   wrapWithPanel: true,
//                   name: 'attribute_add',
//                   body: [
//                     {
//                       label: '显示名:',
//                       mode: 'horizontal',
//                       size: 'md',
//                       type: 'input-text',
//                       name: 'display_name',
//                     },
//                     {
//                       label: '描述:',
//                       mode: 'horizontal',
//                       showCounter: true,
//                       maxLength: 500,
//                       validations: {
//                         maxLength: 500,
//                       },
//                       validationErrors: {
//                         maxLength: '长度应该小于500',
//                       },
//                       size: 'md',
//                       type: 'input-text',
//                       name: 'description',
//                     },
//                     {
//                       label: '其他:',
//                       mode: 'horizontal',
//                       size: 'md',
//                       type: 'input-text',
//                       name: 'other',
//                     },
//                     {
//                       name: 'not_null',
//                       type: 'radios',
//                       mode: 'horizontal',
//                       label: '非空:',
//                       value: 0,
//                       options: [
//                         {
//                           label: '是',
//                           value: 1,
//                         },
//                         {
//                           label: '否',
//                           value: 0,
//                         },
//                       ],
//                     },
//                     {
//                       label: '类型:',
//                       mode: 'horizontal',
//                       size: 'md',
//                       type: 'input-text',
//                       name: 'type',
//                     },
//                     {
//                       label: '长度:',
//                       mode: 'horizontal',
//                       size: 'md',
//                       type: 'input-number',
//                       name: 'length',
//                     },
//                   ],
//                 },
//               },
//               className: 'mb-1',
//             },
//           ],
//         },
//       ],
//     },
//   ],
// };
