import AmisRenderer from '@/components/AmisRenderer';
import {SchemaNode} from '@fex/amis/lib/types';
import {history} from "@@/core/history";

export default function () {
  const {query = {}} = history.location;
  const {fileId} = query;
  console.log(fileId)

  const schema: SchemaNode = {
    type: 'page',
    title: '',
    data: {
      id: fileId,
    },
    body: imgFileUploadPart,
  };
  return <AmisRenderer schema={schema}/>;
};

/** imgFileFromPart 添加和修改公用 */
export const imgFileUploadPart: SchemaNode = [
  {
    type: 'form',
    title: '图片文件存储',
    initFetchOn: 'this.id',
    initApi: {
      method: 'post',
      url: '/api/graphql?_=find_sys_img_file',
      data: {
        query: 'query {find_sys_img_file(obj:{id:$id}){id imgName imgSize imgPath fileName fileSize filePath}}',
        variables: {},
      },
      adaptor: function (payload: any) {
        let items = payload.data.find_sys_img_file[0];
        return {
          ...payload.data,
          data: items,
        };
      },
    },
    api: {
      method: 'post',
      url: '/api/graphql',
      data: {
        variables: {
          id: '$id',
          imgName: '$imgName',
          imgPath: '$imgPath',
          imgSize: '$imgSize',
          fileName: '$fileName',
          filePath: '$filePath',
          fileSize: '$fileSize'
        },
      },
      requestAdaptor(api: any) {
        let id = api.data.variables.id;
        let imgName = api.data.variables.imgName;
        let imgPath = api.data.variables.imgPath;
        let imgSize = parseInt(api.data.variables.imgSize);
        let fileName = api.data.variables.fileName;
        let filePath = api.data.variables.filePath;
        let fileSize = parseInt(api.data.variables.fileSize);
        let query = '';
        if (id > 0) {
          query = 'mutation{fileId:update_sys_img_file(id:' + id + ',obj:{' +
            'imgName:"' + imgName  + '",imgPath:"' + imgPath + '",imgSize: ' + imgSize
            + ', fileName:"' + fileName + '",filePath:"' + filePath + '",fileSize: ' + fileSize + '})}';
        } else {
          query = 'mutation{fileId:create_sys_img_file(obj:{imgName:"' + imgName
            + '",imgPath:"' + imgPath + '",imgSize: ' + imgSize
            + ', fileName:"' + fileName + '",filePath:"' + filePath + '",fileSize: ' + fileSize + '})}';
        }
        return {
          ...api,
          data: {
            ...api.data, // 获取暴露的 api 中的 data 变量
            query: query, // 新添加数据
          },
        };
      },
      adaptor: function (payload: any) {
        let backNum = payload.data.fileId.toString();
        return {
          id: backNum,
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
        type: "input-image",
        name: "imgPath",
        accept: ".jpeg,.jpg,.png,.gif",
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
            let value = payload.data.httpUrl;
            let imgName = payload.data.file_name;
            let imgSize = payload.data.size;
            return {
              value: value,
              imgPath: value,
              imgName: imgName,
              imgSize: imgSize,
            };
          },
        },
        autoFill: {
          imgPath: "${imgPath}",
          imgName: "${imgName}",
          imgSize: "${imgSize}",
        },
      },
      {
        type: 'input-text',
        name: 'imgName',
        label: '图片名称',
        size: 'md',
      },
      {
        type: 'input-text',
        name: 'imgSize',
        label: '图片大小',
        size: 'md',
      },
      {
        type: 'input-text',
        name: 'imgPath',
        label: '图片路径',
        size: 'md',
      },
      {
        "type": "divider"
      },
      {
        type: "input-file",
        name: "filePath",
        accept: "*",
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
            let value = payload.data.httpUrl;
            let fileName = payload.data.file_name;
            let fileSize = payload.data.size;
            return {
              value: value,
              filePath: value,
              fileName: fileName,
              fileSize: fileSize,
            };
          },
        },
        autoFill: {
          filePath: "${filePath}",
          fileName: "${fileName}",
          fileSize: "${fileSize}",
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
    ],
  },
];
