import AmisRenderer from '@/components/AmisRenderer';
import {SchemaNode} from '@fex/amis/lib/types';

export default function () {
  const schema: SchemaNode = {
    type: 'page',
    className:"base-light-page p-4",
    body: [
      {
        type: 'form',
        name: 'update',
        title: "",
        className:"w-96",
        panelClassName:"wrap-with-panel-false",
        initApi: {
          method: 'post',
          url: '/api/graphql',
          data: {
            query:
              '{\n  find_sys_setting(obj: {}) {\n    id\n    key_name\n    description\n    content\n  }\n}',
            variables: null,
          },
          adaptor: function (payload: any) {
            const fields = payload.data.find_sys_setting;
            let inputObj = {};
            for (let i = 0; i < fields.length; i++) {
              inputObj[fields[i].key_name] = fields[i].content;
            }
            return {
              data: {
                ...inputObj,
                editable: true,
                editStatus: false,
                saveAble: false,
              },
            };
          },
        },
        api: {
          method: 'post',
          url: '/api/graphql',
          data: {
            query: `mutation{
                            organization_name:update_sys_setting(id:"1",obj:{content:"$organization"})
                            mobile_name:update_sys_setting(id:"2",obj:{content:"$mobile"})
                            description_name:update_sys_setting(id:"3",obj:{content:"$description"})
                            other_name:update_sys_setting(id:"5",obj:{content:"$other"})
                            copyright_info_name:update_sys_setting(id:"9",obj:{content:"$copyright_info"})
                            copyright_content_name:update_sys_setting(id:"10",obj:{content:"$copyright_content"})
                            platform_name_name:update_sys_setting(id:"8",obj:{content:"$platform_name"})
                            logo_name:update_sys_setting(id:"4",obj:{content:"$logo"})
                        }`,
            variables: null,
          },
          adaptor: function (payload: any) {
            let backNum = payload.data.organization_name;
            console.log(payload);

            return {
              backNum: backNum,
            };
          },
        },
        actions: [
          {
            type: 'reset',
            label: '取消',
            level:"enhance",
            // 编辑功能 可编辑状态时展示
            visibleOn: '${AND(editable == true,editStatus == true)}',
            onEvent: {
              click: {
                actions: [
                  {
                    actionType: 'setValue',
                    componentId: 'roleEditStatus',
                    args: {
                      // 置为不可编辑状态
                      value: false,
                    },
                  },
                ],
              },
            },
          },
          {
            type: 'button',
            label: '编辑',
            onEvent: {
              click: {
                actions: [
                  {
                    actionType: 'setValue',
                    componentId: 'roleEditStatus',
                    args: {
                      // 置为可编辑状态
                      value: true,
                    },
                  },
                ],
              },
            },
            // 编辑功能开启 且 编辑状态关闭时展示
            visibleOn: '${AND(editable== true,editStatus == false)}',
            level: 'primary',
          },
          {
            type: 'button',
            label: '保存',
            visibleOn: '${OR(saveAble == true,editStatus == true)}',
            actionType: 'submit',
            level: 'primary',
            reload: 'window',
            onEvent: {
              "click": {
                "actions": [
                  {
                    "actionType": "custom",
                    "script": "localStorage.removeItem('app_init_data')"
                  }
                ]
              }
            }
          },
        ],
        body: [
          {
            type: 'fieldSet',
            title: '平台信息',
          },
          {
            type: 'input-image',
            name: 'logo',
            label: '平台logo:',
            required: true,
            accept: '.jpeg,.jpg,.png,.ico',
            maxSize: 1024 * 1024 * 2,
            receiver: {
              url: '/api/component/executeComponent',
              method: 'post',
              data: {
                component: 'eg_fd98_file_plugin',
                actionName: 'eg_engine_upload',
              },
              adaptor: function (payload: any) {
                let value = '/' + payload.data.path + '/' + payload.data.newName;
                return {
                  value: value,
                };
              },
            },
            autoFill: {
              avatar: '${value}',
            },
            visibleOn: '${OR(saveAble== true,editStatus == true)}',
          },
          {
            type: 'static-image',
            label: '平台logo:',
            visibleOn: '${AND(editable== true,editStatus == false)}',
            name: 'logo',
            thumbMode: 'contain',
            // imageMode:'thumb'
            // "enlargeAble": true
          },
          {
            type: 'input-text',
            name: 'platform_name',
            label: '平台名称:',
            required: true,
            visibleOn: '${OR(saveAble== true,editStatus == true)}',
            maxLength: 8,
            placeholder: '请输入8个字以内的名称'
          },
          {
            type: 'static',
            label: '平台名称:',
            showCounter: true,
            visibleOn: '${AND(editable== true,editStatus == false)}',
            name: 'platform_name',
          },
          {
            type: 'fieldSet',
            title: '版权信息',
          },
          {
            type: 'input-image',
            name: 'copyright_info',
            label: '版权图标:',
            // frameImage: "/favicon.ico",
            accept: '.jpeg,.jpg,.png',
            maxSize: 1024 * 1024 * 2,
            receiver: {
              url: '/api/component/executeComponent',
              method: 'post',
              data: {
                component: 'eg_fd98_file_plugin',
                actionName: 'eg_engine_upload',
              },
              adaptor: function (payload: any) {
                let value = '/' + payload.data.path + '/' + payload.data.newName;
                return {
                  value: value,
                };
              },
            },
            autoFill: {
              avatar: '${value}',
            },
            visibleOn: '${OR(saveAble== true,editStatus == true)}',
          },
          {
            type: 'static-image',
            label: '版权图标:',
            visibleOn: '${AND(editable== true,editStatus == false)}',
            name: 'copyright_info',
            thumbMode: 'contain',
          },
          {
            type: 'input-text',
            name: 'copyright_content',
            label: '版权内容:',
            visibleOn: '${OR(saveAble== true,editStatus == true)}',
            maxLength:100,
            placeholder: '请输入100字以内的内容'
          },
          {
            type: 'static',
            label: '版权内容:',
            showCounter: true,
            visibleOn: '${AND(editable== true,editStatus == false)}',
            name: 'copyright_content',
          },

          {
            type: 'hidden',
            // 是否是编辑功能
            name: 'editable',
            id: 'roleEditable',
            style: {
              color: 'white',
            },
          },
          {
            type: 'hidden',
            // 是否是可编辑状态
            name: 'editStatus',
            id: 'roleEditStatus',
            style: {
              color: 'white',
            },
          },
          {
            type: 'hidden',
            // 是否是可保存功能
            name: 'saveAble',
            id: 'roleSaveAble',
            style: {
              color: 'white',
            },
          },
        ],
      },
    ],
  };
  return <AmisRenderer schema={schema} />;
}
