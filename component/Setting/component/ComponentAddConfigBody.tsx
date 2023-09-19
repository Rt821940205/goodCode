/**
 * 添加配置
 * 从组件元数据Field获取。
 */

//  import { MockBizModel } from '@/pages/app/datasource/util/bizModel';
//  import { ModelField, modelFieldCategory } from '@/pages/app/datasource/util/modelField';
 import {isDefaultField} from '@/pages/component/Setting/component/ComponentHelper'
import config from 'config/config';
export const ComponentAddConfigBody = (componentId:any) => {
  
  const configBody: any = {
  type: 'service',
  schemaApi: {
    method: 'get',
    url: '/api/def/model/complete/info?modelId=' + componentId,
    adaptor: function (payload: any) {
      let fields = payload.data.fields;
      let bodyItems: Array<any> = [];
      let data = payload.data;
      bodyItems.push({
        type: 'page',
        data: fields,
        body:{
        type: 'input-text',
        name: 'displayName',
        required: true,
        showCounter: true,
        maxLength: 20,
        validations: {
          maxLength: 20,
        },
        validationErrors: {
          maxLength: '长度超出限制，请输入小于20字的名称',
        },
        placeholder: '请输入一个长度小于20的名称',
        // mode: 'horizontal',
        label: '配置名',
      }});

      fields
        .filter((item: any) => {
          return item.category == 2 || item.category == 4;
        })
        .forEach((item: any) => {
          let required = false;
          if (item.notNull == 1) {
            required = true;
          }

          let fields = {};


          let value  = item.defaultValue;
          if(item.typeName == 'Boolean'){
            value = value == 'true' ? true:false;
          }

          fields[item.name] = value;
          fields['label'] = item.displayName;
          fields['description'] = item.description;

          console.log(item);


          let formItem:any = {
            type: 'input-text',
            name: item.name,
            description: item.description,
            placeholder: item.description,
            required: required,
            label: item.displayName,
          }

          
          if(item.typeName == 'Boolean'){
            formItem = {
              type: 'switch',
              name: item.name,
              // value:fields[item.name],
              // mode: 'horizontal',
              // description: item.description,
              option: item.description,
              label: item.displayName,
            }
          } else if(item.typeName == 'Int' || item.typeName == 'Long'){
            formItem.type = 'input-number'
          }

          bodyItems.push({
            type: 'page',
            data: fields,
            body:formItem,
          });
        });
      bodyItems.push({
        type: 'page',
        data: fields,
        body:{
        type: 'textarea',
        name: 'description',
        label: '配置描述',
        // mode: 'horizontal',
        showCounter: true,
        maxLength: 500,
        validations: {
          maxLength: 500,
        },
        validationErrors: {
          maxLength: '长度应该小于500',
        },
      }});
      return {
        type: 'form',
        mode: 'horizontal',

        data: {
          ___model: data,
        },
        actions: [
          // {
          //   actionType: "reload",
          //   componentId: "configListCrud"
          // }
        ],
       
        title: '',
        body: bodyItems,
      };
    },
  },
}
return configBody;
}
