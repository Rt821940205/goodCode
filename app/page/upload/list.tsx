import AmisRenderer from '@/components/AmisRenderer';
import {SchemaNode} from '@fex/amis/lib/types';
import {imgFileUploadPart} from '@/pages/app/page/upload/from';
import {csvFileImportPart} from '@/pages/app/page/upload/csv';

export default function () {
  const schema: SchemaNode = {
    type: 'page',
    body: {
      type: 'crud',
      api: {
        method: 'post',
        url: '/api/graphql',
        data: {
          query:
            'query pagesImgFile(\\$obj:input_sys_img_file,\\$perPage: Int, \\$page:Int){imgFiles:pages_sys_img_file(obj: \\$obj, pageSize:\\$perPage, pageNum:\\$page)  {data{id,imgName,imgPath,imgSize,fileName,filePath,fileSize},pageNum,pageSize,total}}',
          variables: {
            obj: '${obj}',
            page: '${pageNum}',
            perPage: '${pageSize}',
          },
        },
        requestAdaptor: function (api: any) {
          let pageNum = api.data.variables.page;
          let pageSize = api.data.variables.perPage;
          let query = api.data.query;
          console.log(api.data);
          return {
            ...api,
            data: {
              query: query,
              variables: {
                page: pageNum,
                pageNum: pageNum,
                perPage: pageSize,
                pageSize: pageSize,
              },
            },
          };
        },
        adaptor: function (payload: any) {
          let items = payload.data.imgFiles.data ? payload.data.imgFiles.data : [];
          let total = payload.data.imgFiles.total;
          let pageNum = payload.data.imgFiles.pageNum;
          let pageSize = payload.data.imgFiles.pageSize;
          return {
            pageSize: pageSize,
            pageNum: pageNum,
            perPage: pageSize,
            items: items,
            total: total,
          };
        },
      },
      headerToolbar: [
        {
          label: '导出 CSV',
          align: 'right',
          type: 'action',
          actionType: 'ajax',
          api: {
            url: '/api/csv/export',
            method: 'post',
            adaptor: function (payload: any) {
              console.log(payload);
              let downPath = payload.data.path;
              return {
                downPath: downPath,
              };
            },
          },
          feedback: {
            title: 'CSV下载地址',
            body: {
              type: 'link',
              href: '${downPath}',
              body: '下载',
              blank: true,
            },
          },
        },
        {
          type: 'action',
          label: '上传、导入 CSV分步骤',
          align: 'right',
          tooltip: '',
          actionType: 'dialog',
          dialog: {
            title: '上传CSV文件',
            body: csvFileImportPart,
          },
          target: 'crud',
        },
        {
          type: 'input-file',
          align: 'right',
          accept: '.csv',
          actionType: 'button',
          receiver: {
            url: '/api/component/executeComponent',
            method: 'post',
            data: {
              component: 'eg_fd98_file_plugin',
              actionName: 'eg_engine_upload',
            },
            adaptor: function (payload: any) {
              console.log(payload.data);
              let value = '/' + payload.data.path + '/' + payload.data.new_name;
              let fileName = payload.data.file_name;
              let fileSize = payload.data.size;
              let absolutePath =
                payload.data.diskPath + payload.data.path + '/' + payload.data.new_name;
              return {
                value: value,
                filePath: value,
                fileName: fileName,
                fileSize: fileSize,
                absolutePath: absolutePath,
              };
            },
          },
          target: 'crud',
        },
        {
          type: 'action',
          align: 'right',
          label: '新增',
          tooltip: '',
          level: 'primary',
          actionType: 'dialog',
          dialog: {
            title: '上传文件',
            body: imgFileUploadPart,
          },
          target: 'crud',
        },
      ],
      affixHeader: false,
      pageField: 'pageNum',
      perPageField: 'pageSize',
      source: '$items',
      perPage: 8,
      syncLocation: false,
      columns: [
        {
          name: 'id',
          label: 'ID',
        },
        {
          type: 'static-image',
          name: 'imgPath',
          label: '图片',
          thumbRatio: '1:1',
          thumbMode: 'cover',
          enlargeAble: true,
        },
        {
          name: 'imgName',
          label: '图片名称',
        },
        {
          name: 'imgSize',
          label: '图片大小',
        },
        {
          name: 'filePath',
          label: '文件路径',
        },
        {
          name: 'fileName',
          label: '文件名称',
        },
        {
          name: 'fileSize',
          label: '文件大小',
        },
        {
          type: 'operation',
          label: '操作',
          width:"7.5rem",
          buttons: [
            {
              label: '编辑',
              type: 'button',
              level: 'link',
              actionType: 'dialog',
              dialog: {
                title: '查看详情',
                body: imgFileUploadPart,
              },
            },
            {
              className: 'text-danger',
              label: '删除',
              type: 'button',
              level: 'link',
              actionType: 'ajax',
              confirmText: '确认要删除吗？',
              api: {
                method: 'post',
                url: '/api/graphql?fileId=${id}',
                data: {
                  query: 'mutation{delete_sys_img_file(id:"$id",obj:{})}',
                  variables: null,
                },
                adaptor: function (payload: any) {
                  let backNum = payload.data.delete_sys_img_file;
                  return {
                    backNum: backNum,
                  };
                },
              },
            },
          ],
        },
      ],
    },
  };
  return <AmisRenderer schema={schema} />;
}
