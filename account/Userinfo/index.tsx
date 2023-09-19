import React from 'react';

import AmisRenderer from '@/components/AmisRenderer';
import { SchemaNode } from '@fex/amis/lib/types';
import './index.less'
const Userinfo: React.FC = () => {
  const schema: SchemaNode = {
    type: 'page',
    title: '',
    className: 'userinfo-page-wrapper',
    body: [
      {
        type: 'form',
        className: 'userinfo-page-form-wrapper',
        title: '个人信息',
        mode: 'horizontal',
        //TODO: 应使用当前用户id 查询用户信息， 因graphql更新完成用户信息后， token对应的用户信息没有更新， 或者使用自定义特殊的action 更新用户信息
        initApi: 'get:/api/authority/user/info',
        api: {
          method: 'post',
          url: '/api/graphql',
          data: {
            query:
              'mutation update(\\$id: Long!, \\$obj: input_sys_user_info!){update_sys_user_info(id: \\$id, obj: \\$obj) }',
            variables: {
              id: '$id',
              obj: {
                id: '$id',
                real_name: '$realName',
                mobile: '$mobile',
                email: '$email',
                avatar: '$avatar',
              },
            },
          },
        },
        body: [
          {
            hidden: true,
            name: 'id',
          },
          {
            type: 'input-text',
            name: 'realName',
            label: '姓名',
            size: 'sm',
          },
          {
            type: 'input-text',
            name: 'mobile',
            label: '手机号',
            validations: {
              isPhoneNumber: true,
            },
            validationErrors: {
              isPhoneNumber: '只允许填写11位数字',
            },
            size: 'md',
          },
          {
            type: 'input-email',
            name: 'email',
            label: '邮箱',
            size: 'md',
          },
          {
            type: 'input-image',
            name: 'avatar',
            label: '头像',
            frameImage: '/favicon.ico',
            accept: '.jpeg,.jpg,.png',
            limit: {
              minWidth: 10,
            },
            receiver: {
              url: '/api/component/execute',
              method: 'post',
              data: {
                component: 'eg_fd98_file_plugin',
                actionName: 'eg_engine_upload',
              },
              adaptor:
                'return { \n value:  payload.data.uri\n }',
            },
          },
        ],
      },
    ],
  };
  return <AmisRenderer schema={schema} />;
};
export default Userinfo;
