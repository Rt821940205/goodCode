/**
 * 单位新增|编辑
 */
import { deptUserManage } from '@/pages/system/Dept/user';
import './org.less';
import { orgedit } from '@/pages/system/Dept/orgedit';
import { navTree } from '@/pages/system/Dept/orgTree';

const tabs = {
  type: 'container',
  body: [
    {
      type: 'tabs',
      className:"w-full",
      id: 'orgTab',
      tabs: [
        {
          title: '组织信息',
          id: 'oInfo',
          reload: true,
          tab: [orgedit],
        },
        {
          title: '组织成员',
          reload: true,
          tab: deptUserManage,
        },
        {
          title: '角色信息',
          reload: true,
          tab: [
            {
              type: 'service',
              name: 'roleForm',
              api: {
                method: 'post',
                url: '/api/graphql?query=${organizeId}',
                data: {
                  query: `{find_sys_role_organize(obj: {organize_id:$organizeId}) {
                      organize_id
                      create_id
                      role_id
                      id
                      sys_role_organize_just_sys_role {
                        name
                        description
                        remark
                      }
                    }}`,
                  variables: {
                    organizeId: '$organizeId',
                  },
                },
                adaptor: function (payload: any) {
                  if (Array.isArray(payload.errors)) {
                    return { find_sys_role: [] };
                  }
                  let relList = payload.data.find_sys_role_organize;
                  let find_sys_role: Array<any> = [];
                  if (Array.isArray(relList) && relList.length > 0) {
                    find_sys_role = relList
                      .filter((item: any) => {
                        return undefined != item.sys_role_organize_just_sys_role;
                      })
                      .map((item: any) => {
                        return {
                          id: item.id,
                          name: item.sys_role_organize_just_sys_role.name,
                          description: item.sys_role_organize_just_sys_role.description,
                        };
                      });
                  }
                  return {
                    find_sys_role: find_sys_role,
                  };
                },
              },
              body: {
                type: 'crud',
                source: '$find_sys_role',
                syncLocation: false,
                autoGenerateFilter: true,
                columns: [
                  {
                    name: "${index+1}",
                    label: '序号',
                  },
                  {
                    name: 'name',
                    label: '角色',
                  },
                  {
                    name: 'description',
                    label: '描述',
                    showCounter: true,
                    maxLength: 500,
                    validations: {
                      maxLength: 500,
                    },
                    validationErrors: {
                      maxLength: '长度应该小于500',
                    },
                  },
                  {
                    type: 'operation',
                    label: '操作',
                    width:"6.25rem",
                    buttons: [
                      {
                        label: '删除',
                        type: 'button',
                        level: 'link',
                        actionType: 'dialog',
                        className: 'text-danger',
                        reload: 'roleForm',
                        dialog: {
                          title: '系统消息',
                          body: [
                            '确认要删除该角色吗?',
                            {
                              type: 'form',
                              title: '',
                              api: {
                                method: 'post',
                                url: '/api/graphql',
                                data: {
                                  query: `mutation {
                                  delete_sys_role_organize(id: "$id", obj: {})
                                }`,
                                  variables: null,
                                },
                                adaptor: function (payload: any) {
                                  let backNum = payload.data.delete_sys_role_organize;
                                  return {
                                    backNum: backNum,
                                  };
                                },
                              },
                              body: [{ type: 'hidden', name: 'id' }],
                            },
                          ],
                        },
                      },
                    ],
                  },
                ],
              },
            },
          ],
        },
      ],
    },
  ],
};

/**
 * 单位表单
 */
export const systemOrgManage = {
  type: 'page',
  name: 'officeForm',
  bodyClassName:"p-0",
  asideResizor: true,
  asideMinWidth: 240,
  asideMaxWidth: 1000,
  asideClassName:"w-60",
  data: {
    chooseId: '',
  },
  aside: [navTree],
  body: [tabs],
};
