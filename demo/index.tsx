import AmisRenderer from '@/components/AmisRenderer';
import { SchemaNode } from '@fex/amis/lib/types';

/**
 * 内部演示功能集合
 */
export default function () {
    const schema: SchemaNode = {
        type: 'page',
        title: '内部演示功能集合',
        data: {
            items: [],
        },
        body: [
            {
                type: 'table-view',
                trs: [
                    {
                        background: '#F7F7F7',
                        tds: [
                            {
                                body: {
                                    type: 'tpl',
                                    tpl: '模块',
                                },
                            },
                            {
                                body: {
                                    type: 'tpl',
                                    tpl: '功能',
                                },
                            },
                        ],
                    },
                    {
                        tds: [
                            {
                                // rowspan: 2,
                                body: {
                                    type: 'tpl',
                                    tpl: '组件能力',
                                },
                            },
                            {
                                body: {
                                    type: 'link',
                                    href: '/app/page/upload',
                                    body: '上传文件',
                                },
                            },
                        ],
                    },
                    {
                        tds: [
                            {
                                body: {
                                    type: 'link',
                                    href: '/flow/manage/list',
                                    body: '流程管理11',
                                },

                            },
                            {
                                body: {
                                    type: "select", name: "sss", label: "选择人员", "searchable": true,
                                    "selectMode": "associated",
                                    leftMode: 'tree', "source": {
                                        method: 'post',
                                        url: '/api/graphql',
                                        data: {},
                                        graphql: "{find_sys_organize(obj:{parent_id:0}){id organize_name parent_id category}}",
                                        responseData: {
                                            "options": [],
                                            "options[0][leftOptions]": "${find_sys_organize|pick:label~organize_name,value~id,defer~organize_name}",
                                            "options[0][children]": "${find_sys_organize|pick:ref~id,defer~id}",
                                            "options[0][leftDefaultValue]": ''
                                        }

                                    },
                                    deferApi: {
                                        method: 'post',
                                        url: '/api/graphql?ref=${ref}&dep=${value}',
                                        data: {
                                            variables: {
                                                "ref": "${ref}",
                                                "dep": "${value}",
                                                "organize_id": "${ref|isTrue:ref:value}",
                                                "orgOptionLabel": "${value|isTrue:'orgOptions':'options'}",
                                                "userOptionLabel": "${ref|isTrue:'userOptions':'options'}",
                                            },
                                            query: `
              query find(\\$organize_id:Long!) {
                \${value|isTrue:'find_sys_organize(obj: { state: 1, parent_id: \$organize_id }) {id organize_name}':''}
                \${ref|isTrue:'find_sys_organize_user(obj: { state: 1, organize_id: \$organize_id }) { user:sys_organize_user_just_sys_user_info {id real_name} }': ''}
              }
            `
                                        },
                                        adaptor: "return {...payload, data: {options: " +
                                            "payload.data.find_sys_organize?payload.data.find_sys_organize.map(it=>{return {label: it.organize_name, value: it.id, defer: true}})" +
                                            ": payload.data.find_sys_organize_user.map(it=>{return {label: it.user.real_name, value: it.user.id}})" +
                                            "}}"
                                    }
                                }
                            }
                        ],
                    },
                ],
            },
        ],
    }
    return <AmisRenderer schema={schema} />;
}
