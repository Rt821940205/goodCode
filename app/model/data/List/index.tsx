import '@/components/amis/components/ModelDataListRenderer';
import AmisRenderer from '@/components/AmisRenderer';
import {history} from '@@/core/history';
import {SchemaNode} from '@fex/amis/lib/types';
// import './index.less';

export default function () {
  const {query = {}} = history.location;
  const {appId, modelId} = query;

  console.log(modelId);

  const schema: SchemaNode = {
    type: 'page',
    className: 'base-light-page-center page-w1400 bg-white rounded-lg mt-6',
    data: {
      appId: appId,
      modelId: modelId,
    },
    body: [
      {
        type: 'service',
        api: {
          method: 'get',
          url: '/api/def/model/complete/info?modelId=${modelId}',
          adaptor: function (
            payload: {
              data: {
                displayName: any;
                fields: any;
                category: string;
                actions: any[];
              };
            },
            response: any,
          ) {
            let fields = payload.data.fields;
            // 保留state为1的field 留下 state为0的
            fields = fields.filter((item: any) => {
              return item.state === 1;
            });
            const filterArr = [
              'create_id',
              'create_name',
              'modify_id',
              'modify_name',
              'create_time',
              'modify_time',
              'action_type',
              'state',
            ];
            let label = [];
            let searchFields = [];
            for (let i = 0; i < fields.length; i++) {
              if (fields[i].localName && filterArr.indexOf(fields[i].name) < 0) {
                let objOption = {
                  label: fields[i].displayName,
                  name: fields[i].name,
                  align: 'center',
                };

                if (
                  fields[i].category == null ||
                  fields[i].category == 3 ||
                  fields[i].category == 4
                ) {
                  label.push(objOption);
                }
                let inputType = '';
                if (fields[i].typeName === 'String' || fields[i].typeName === 'Long') {
                  inputType = 'input-text';
                } else {
                  inputType = 'input-number';
                }
                let inputObj = {
                  type: inputType,
                  name: 'obj.' + fields[i].name,
                  label: fields[i].displayName,
                  clearable: true,
                  className: 'mr-5 mb-3',
                };
                if (
                  fields[i].name != 'image' &&
                  (fields[i].category == null || fields[i].category == 2 || fields[i].category == 4)
                ) {
                  searchFields.push(inputObj);
                }
              }
            }
            const customActions = payload.data.actions
              .filter((obj) => obj.nonDefault)
              .map((obj) => {
                return {
                  name: obj.name,
                  params: {
                    id: obj.params.id
                      ? {
                        name: obj.params.id.name,
                        type: obj.params.id.type,
                      }
                      : undefined,
                    obj: obj.params.obj
                      ? {
                        name: obj.params.obj.name,
                        type: obj.params.obj.type,
                      }
                      : undefined,
                  },
                  displayName: obj.displayName,
                };
              });
            const isService = payload.data.category == '101610' || payload.data.category == '101210' || payload.data.category == '101017' || payload.data.category == '101020';

            let listQueryParamsObjType = payload.data.actions.filter(
              (obj: any) => !obj.nonDefault && obj.name.indexOf('pages_') == 0,
            )[0]?.params?.obj.type;
            let listQueryName = payload.data.actions.filter(
              (obj: any) => !obj.nonDefault && obj.name.indexOf('pages_') == 0,
            )[0]?.name

            //actionType = "componentExec";
            let componentExecInObjType = payload.data.actions.filter(
              (obj: any) => !obj.nonDefault && obj.name.indexOf('exec_') == 0,
            )[0]?.params?.obj.type;
            let componentExecName = payload.data.actions.filter(
              (obj: any) => !obj.nonDefault && obj.name.indexOf('exec_') == 0,
            )[0]?.name;

            // console.log('payload.data',payload.data)
            return {
              modelName: payload.data.displayName,
              searchFields: searchFields,
              listQueryParamsObjType: listQueryParamsObjType,
              listQueryName: listQueryName,
              componentExecInObjType: componentExecInObjType,
              componentExecName: componentExecName,
              imageActionName: payload.data.actions.filter((obj: any) => {
                return obj.nonDefault && obj.actionType == 'UploadAction';
              })[0]?.params.actionName.value,
              imageActionConfigModelId: payload.data.actions.filter((obj: any) => {
                return obj.nonDefault && obj.actionType == 'UploadAction';
              })[0]?.params.configId.value,
              importActionName: payload.data.actions.filter((obj: any) => {
                return obj.nonDefault && obj.actionType == 'ImportAction';
              })[0]?.params.actionName.value,
              importActionConfigModelId: payload.data.actions.filter((obj: any) => {
                return obj.nonDefault && obj.actionType == 'ImportAction';
              })[0]?.params.configId.value,
              importActionModelId: modelId,
              uploadActionName: payload.data.actions.filter((obj: any) => {
                return obj.nonDefault && obj.actionType == 'UploadAction';
              })[0]?.params.actionName.value,
              uploadActionConfigModelId: payload.data.actions.filter((obj: any) => {
                return obj.nonDefault && obj.actionType == 'UploadAction';
              })[0]?.params.configId.value,
              exportActionName: payload.data.actions.filter((obj: any) => {
                return obj.nonDefault && obj.actionType == 'ExportAction';
              })[0]?.params.actionName.value,
              exportActionConfigModelId: payload.data.actions.filter((obj: any) => {
                return obj.nonDefault && obj.actionType == 'ExportAction';
              })[0]?.params.configId.value,
              exportActionModelId: modelId,
              deleteMutationName: isService
                ? undefined
                : payload.data.actions.filter(
                  (obj) => !obj.nonDefault && obj.name.indexOf('delete_') == 0,
                )[0].name,
              columns: label,
              customActions: customActions,
            };
          },
        },
        body: [
          {
            type: 'model-data-list',
            searchFields: '${searchFields}',
            listQueryParamsObjType: '${listQueryParamsObjType}',
            componentExecInObjType: '${componentExecInObjType}',
            componentExecName: '${componentExecName}',
            importActionName: '${importActionName}',
            importActionConfigModelId: '${importActionConfigModelId}',
            importActionModelId: '${importActionModelId}',
            uploadActionName: '${uploadActionName}',
            uploadActionConfigModelId: '${uploadActionConfigModelId}',
            exportActionName: '${exportActionName}',
            exportActionConfigModelId: '${exportActionConfigModelId}',
            exportActionModelId: '${exportActionModelId}',
            modelId: '${modelId}',
            modelName: '${modelName}',
            listQueryName: '${listQueryName}',
            deleteMutationName: '${deleteMutationName}',
            columns: '${columns}',
            customActions: '${customActions}',
          },
        ],
      },
    ],
  };
  return <AmisRenderer schema={schema}/>;
}
