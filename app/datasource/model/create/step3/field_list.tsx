// import { FieldAdd } from './field_add';
//
// export const FieldList = {
//   type: 'crud',
//   showHeader: false,
//   borderMode: 'none',
//   builderMode: 'full',
//   resizable: false,
//   strictMode: false,
//   columns: [
//     {
//       type: 'tpl',
//       tpl: '',
//       hiddenOn: 'this.primary == 1',
//     },
//     {
//       type: 'tpl',
//       tpl: "<span class='fa fa-key'></span>",
//       hiddenOn: 'this.primary == 0',
//     },
//     {
//       name: 'name',
//     },
//     {
//       name: 'displayName',
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
//                 confirmText: '',
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
//                   title: '实体属性编辑',
//                   body: FieldAdd,
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
