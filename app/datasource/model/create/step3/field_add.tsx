// export const FieldAdd = {
//   type: 'form',
//   promptPageLeave: true,
//   api: {
//     method: 'post',
//     url: '/api/def/model/field/save',
//     adaptor: function (payload: any) {
//       let data = payload.data;
//       return {
//         data: data,
//       };
//     },
//   },
//   body: [
//     {
//       type: 'hidden',
//       name: 'modelId',
//     },
//     {
//       type: 'hidden',
//       name: 'id',
//     },
//     {
//       label: '显示名:',
//       mode: 'horizontal',
//       size: 'md',
//       type: 'input-text',
//       name: 'displayName',
//     },
//     {
//       label: '描述:',
//       mode: 'horizontal',
//       size: 'md',
//       showCounter: true,
//       maxLength: 500,
//       validations: {
//         maxLength: 500,
//       },
//       validationErrors: {
//         maxLength: '长度应该小于500',
//       },
//       type: 'input-text',
//       name: 'description',
//     },
//     {
//       name: 'notNull',
//       type: 'radios',
//       mode: 'horizontal',
//       label: '非空:',
//       value: 0,
//       options: [
//         {
//           label: '是',
//           value: 1,
//         },
//         {
//           label: '否',
//           value: 0,
//         },
//       ],
//     },
//     {
//       label: '类型:',
//       type: 'select',
//       name: 'typeName',
//       mode: 'horizontal',
//       searchable: true,
//       sortable: true,
//       value: 'String',
//       options: [
//         {
//           label: '数字',
//           value: 'Long',
//         },
//         {
//           label: '小数',
//           value: 'Float',
//         },
//         {
//           label: '日期',
//           value: 'Date',
//         },
//         {
//           label: '时间',
//           value: 'Timestamp',
//         },
//         {
//           label: '文本',
//           value: 'String',
//         },
//       ],
//     },
//     {
//       label: '精度:',
//       required: true,
//       mode: 'horizontal',
//       size: 'md',
//       type: 'input-number',
//       hiddenOn: 'this.typeName != "Float"',
//       name: 'precision',
//       value: 2,
//       min: 1,
//       max: 6,
//       onChange: function (newValue:any, oldValue:any, props:any) {
//         if (newValue != '' && newValue != undefined) {
//           let defaultValue = props.form.getValueByName('defaultValue');
//           let defaultValueNum = Number(defaultValue);
//           if (defaultValue != '' && defaultValue != undefined) {
//             props.form.setValueByName('defaultValue', defaultValueNum.toFixed(newValue));
//           }
//         }
//       },
//     },
//     {
//       label: '默认值:',
//       mode: 'horizontal',
//       hiddenOn: 'this.typeName != "String"',
//       size: 'md',
//       type: 'input-text',
//       value: '',
//       name: 'defaultValue',
//     },
//     {
//       label: '默认值:',
//       hiddenOn: 'this.typeName != "Int"',
//       mode: 'horizontal',
//       size: 'md',
//       value: 0,
//       type: 'input-number',
//       name: 'defaultValue',
//     },
//     {
//       label: '默认值:',
//       mode: 'horizontal',
//       hiddenOn: 'this.typeName != "Float"',
//       size: 'md',
//       value: 0.0,
//       type: 'input-number',
//       precision: '${precision}',
//       name: 'defaultValue',
//     },
//     {
//       label: '默认值:',
//       mode: 'horizontal',
//       hiddenOn: 'this.typeName != "Date"',
//       size: 'md',
//       format: 'yyyy-MM-DD HH:mm:ss',
//       type: 'input-date',
//       name: 'defaultValue',
//     },
//     {
//       label: '默认值:',
//       mode: 'horizontal',
//       hiddenOn: 'this.typeName != "Timestamp"',
//       size: 'md',
//       type: 'input-datetime',
//       format: 'yyyy-MM-DD HH:mm:ss',
//       name: 'defaultValue',
//     },
//     {
//       label: '长度:',
//       mode: 'horizontal',
//       size: 'md',
//       type: 'input-number',
//       hiddenOn: 'this.typeName != "String"',
//       name: 'length',
//       min: 20,
//       max: 2000,
//     },
//   ],
// };
