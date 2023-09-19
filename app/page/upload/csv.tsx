import {SchemaNode} from '@fex/amis/lib/types';

export const csvFileImportPart: SchemaNode = [
  {
    type: 'form',
    title: '上传CSV文件',
    api: {
      method: 'post',
      url: '/api/csv/import',
      data:{
        configModelId: '380748979689951232',
        actionName: 'eg_4cd6b743_load_action',
        modelId: '378508487933730816',
        absolutePath: '$absolutePath'
      },
      adaptor: function (payload: any) {
        let size = payload.data.size;
        return {
          ... payload,
          status:0,
          msg: " 成功导入"+ size + "条数据!",
        };
      },
    },
    mode: 'horizontal',
    body: [
      {
        type: 'hidden',
        name: 'id',
      },
      {
        type: "input-file",
        name: "filePath",
        accept: ".csv",
        required: true,
        receiver: {
          url: '/api/component/executeComponent',
          method: 'post',
          data: {
            component: 'eg_fd98_file_plugin',
            actionName: 'eg_engine_upload',
          },
          adaptor: function (payload: any) {
            console.log(payload.data);
            let value = "/"+ payload.data.path + '/' + payload.data.new_name;
            let fileName = payload.data.file_name;
            let fileSize = payload.data.size;
            let absolutePath = payload.data.diskPath + payload.data.path + "/" + payload.data.new_name;
            return {
              value: value,
              filePath: value,
              fileName: fileName,
              fileSize: fileSize,
              absolutePath: absolutePath,
            };
          },
        },
        autoFill: {
          filePath: '${filePath}',
          fileName: '${fileName}',
          fileSize: '${fileSize}',
          absolutePath: '${absolutePath}',
        },
      },
      {
        type: 'input-text',
        name: 'fileName',
        label: '文件名称',
        size: 'md',
      },
      {
        type: 'input-text',
        name: 'fileSize',
        label: '文件大小',
        size: 'md',
      },
      {
        type: 'input-text',
        name: 'filePath',
        label: '文件路径',
        size: 'md',
      },
      {
        type: 'input-text',
        name: 'absolutePath',
        label: '文件绝对路径',
        size: 'md',
      },
    ],
  },
];
