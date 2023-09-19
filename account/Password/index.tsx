import React from 'react';

import AmisRenderer from '@/components/AmisRenderer';
import {SchemaNode} from '@fex/amis/lib/types';
import './index.less'
const Password: React.FC = () => {
  const schema: SchemaNode = {
    type: 'page',
    title: '',
    className: 'password-page-wrapper',
    body: [
      {
        type: 'form',
        title: '',
        api: {
          method: "post",
          dataType: "form",
          url: "/api/authority/user/password",
        },
        rules: [
          {
            "rule": "!(oldpassword == newpassword)",
            "message": "旧密码与新密码不能相同"
          },
          {
            "rule": "repassword == newpassword",
            "message": "两次输入的密码需要一致"
          }
        ],
        mode: 'horizontal',
        body: [
          {
            type: 'input-password',
            name: 'oldpassword',
            required: true,
            label: '原密码',
            size: 'md',
          },
          {
            type: 'input-password',
            required: true,
            name: 'newpassword',
            validations: {
              matchRegexp: '/^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,20}$/'
            },
            validationErrors: {
              matchRegexp: '密码必须由8-20位字母、数字、特殊符号(@$!%*#?&)组成'
            },
            label: '新密码',
            size: 'md',
          },
          {
            type: 'input-password',
            name: 'repassword',
            validations: {
              matchRegexp: '/^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,20}$/'
            },
            validationErrors: {
              matchRegexp: '密码必须由8-20位字母、数字、特殊符号(@$!%*#?&)组成'
            },
            required: true,
            label: '确认密码',
            size: 'md',
          },
        ],
      },
    ],
  };
  return <AmisRenderer schema={schema} />;
};

export default Password;
