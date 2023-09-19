import '@/components/amis/components/ModelDataFormRenderer';
import AmisRenderer from '@/components/AmisRenderer';
import {history} from '@@/core/history';
import {SchemaNode} from '@fex/amis/lib/types';

export default function () {
  const { query = {} } = history.location;
  const { appId, modelId, dataId } = query;
  console.log(appId, modelId, dataId);

  const schema: SchemaNode = {
    type: 'page',
    className: 'base-light-page-center page-w1400 bg-white rounded-lg mt-6',
    data: {
      appId: appId,
      modelId: modelId,
      dataId: dataId,
    },
    body: [
      {
        type: 'service',
        api: {
          method: 'get',
          url: '/api/def/model/complete/info?modelId=${modelId}',
          adaptor: function (payload: any) {
            console.log(payload.data.fields);
            const filterNoNeedColumns = [
              'create_time',
              'modify_time',
              'create_id',
              'create_name',
              'action_type',
              'modify_name',
              'modify_id',
              'state',
            ];
            const formFields = payload.data.fields
              .filter((obj) => {
                return obj.state === 1;
              })
              .filter((obj) => filterNoNeedColumns.indexOf(obj.name) == -1)
              .map((obj) => {
                if (obj.name == 'id') {
                  return {
                    type: 'hidden',
                    name: obj.name,
                  };
                }
                //TODO:暂时写死了
                if (obj.name == 'image') {
                  return {
                    type: "input-image",
                    name: "image",
                    accept: ".jpeg,.jpg,.png,.gif",
                      receiver: {
                        url: '/api/component/executeComponent',
                        method: 'post',
                        data: {
                          component: "eg_fd98_file_plugin",
                          actionName: "eg_engine_upload"
                        },
                        adaptor: 'return { \n value: "/" + payload.data.path + "/" + payload.data.new_name\n }'
                      }
                  };
                }
                switch (obj.typeName) {
                  case 'Float':
                  case 'BigDecimal':
                    return {
                      type: 'input-number',
                      name: obj.name,
                      label: obj.displayName,
                    };
                  case 'Int':
                  case 'Long':
                    return {
                      type: 'input-number',
                      name: obj.name,
                      label: obj.displayName,
                      precision: 0,
                    };
                  case 'Timestamp':
                    console.log('============', obj);
                    return {
                      type: 'input-datetime',
                      format: 'yyyy-MM-DD HH:mm:ss',
                      name: obj.name,
                      label: obj.displayName,
                    };
                  case 'Date':
                    return {
                      type: 'input-date',
                      format: 'yyyy-MM-DD HH:mm:ss',
                      name: obj.name,
                      label: obj.displayName,
                    };
                  case 'String':
                  default:
                    return {
                      type: 'input-text',
                      name: obj.name,
                      label: obj.displayName,
                    };
                }
              });
            return {
              formFields: formFields,
              modelName: payload.data.displayName,
              createMutationName: payload.data.actions.filter(
                (obj) => !obj.nonDefault && obj.name.indexOf('create_') == 0,
              )[0].name,
              createMutationParamsObjType: payload.data.actions.filter(
                (obj) => !obj.nonDefault && obj.name.indexOf('create_') == 0,
              )[0].params.obj.type,
              updateMutationName: payload.data.actions.filter(
                (obj) => !obj.nonDefault && obj.name.indexOf('update_') == 0,
              )[0].name,
              findQueryName: payload.data.actions.filter(
                (obj) => !obj.nonDefault && obj.name.indexOf('find_') == 0,
              )[0].name,
              columns: payload.data.fields
                .filter((obj) => filterNoNeedColumns.indexOf(obj.name) == -1)
                .map((obj) => {
                  return {
                    label: obj.displayName,
                    name: obj.name,
                  };
                }),
            };
          },
        },
        body: [
          {
            type: 'model-data-form',
            modelId: '${modelId}',
            modelName: '${modelName}',
            formFields: '${formFields}',
            createMutationName: '${createMutationName}',
            createMutationParamsObjType: '${createMutationParamsObjType}',
            updateMutationName: '${updateMutationName}',
            findQueryName: '${findQueryName}',
            columns: '${columns}',
          },
        ],
      },
    ],
  };
  return <AmisRenderer schema={schema} />;
}
