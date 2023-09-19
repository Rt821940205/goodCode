/**
 * 添加配置
 * 从组件元数据Field获取。
 */

 import { MockBizModel } from '@/pages/app/datasource/util/bizModel';
 import { ModelField, modelFieldCategory } from '@/pages/app/datasource/util/modelField';


export const ComponentAddConfigBody = (componentId:any) => {
  
  const configBody: any = {
  type: 'service',
  schemaApi: {
    method: 'get',
    url: '/api/def/model/complete/info?modelId=' + componentId,
    adaptor: function (payload: any) {
      let fields = payload.data.fields;
      let bodyItems: Array<any> = [];
      bodyItems.push({
        type: 'input-text',
        name: 'configName',
        required: true,
        mode: 'horizontal',
        showCounter: true,
        maxLength: 20,
        validations: {
          maxLength: 20,
        },
        validationErrors: {
          maxLength: '长度超出限制，请输入小于20字的名称',
        },
        placeholder: '请输入一个长度小于20的名称',
        label: '配置名',
      });
      fields
        .filter((item: any) => {
          return item.category == 2 || item.category == 4;
        })
        .forEach((item: any) => {
          let required = false;
          if (item.notNull == 1) {
            required = true;
          }
          bodyItems.push({
            type: 'input-text',
            name: item.name,
            mode: 'horizontal',
            placeholder: item.description,
            required: required,
            label: item.displayName,
          });
          // 字段显示名称
          bodyItems.push({
            type: 'hidden',
            name: item.name,
            value: item.displayName,
          });
          // 字段注释
          bodyItems.push({
            type: 'hidden',
            name:  item.name,
            value: item.description,
          });
          // 字段类型
          bodyItems.push({
            type: 'hidden',
            name:  item.name,
            value: item.typeName,
          });
        });
      bodyItems.push({
        type: 'textarea',
        name: 'configDescription',
        label: '配置描述',
        mode: 'horizontal',
        showCounter: true,
        maxLength: 500,
        validations: {
          maxLength: 500,
        },
        validationErrors: {
          maxLength: '长度应该小于500',
        },
      });
      return {
        type: 'form',
        actions: [],
        api: {
          method: 'post',
          url: '/api/def/model/complete/save?_=componentCreate',
          requestAdaptor: function (api: any) {
            let component = api.data;
            let displayName = '';
            let description = '';
            const fields: Array<any> = [];
            for (let key in component) {
              console.log(key);
              if (key === 'configName') {
                displayName = component[key];
              }
              if (key === 'configDescription') {
                description = component[key];
              }
              if (key?.substring(0, fieldPrefix.length) === fieldPrefix) {
                const name = key.substring(fieldPrefix.length);
                const field = new ModelField(
                  modelFieldCategory.INPUT_RESULT,
                  component[fieldDisplayNamePrefix + name],
                );
                field.setName(name);
                field.setDescription(component[fieldDescPrefix + name]);
                field.setValue(component[fieldTypePrefix + name], component[key]);
                fields.push(field);
              }
            }
            const model: any = new MockBizModel();
            model.displayName = displayName;
            model.description = description;
            model.display = true;
            // 配置
            model.category = 101015;
            model.parentId = componentId;
            model.setFields(fields);
            return {
              ...api,
              data: {
                ...model,
              },
            };
          },
          adaptor: function (payload: any) {
            return {
              ...payload,
            };
          },
        },
        title: '',
        body: bodyItems,
      };
    },
  },
}
return configBody;
}
