import type { RadioChangeEvent } from 'antd';
import { Alert, message, Radio, Button, Form, Input } from 'antd';
import React, { useState } from 'react';
import { history, useModel } from 'umi';
import { getResponse } from '@/api/common';
import { getUserInfo } from '@/utils';
import './index.less';
import Footer from '@/components/Footer';
import { UserOutlined ,LockOutlined} from '@ant-design/icons';
import signIcon from '../../../../public/favicon.ico';
import pkiImg from '@/assets/images/pkiImg.png';
const options = [
  { value: 0, label: '用户登录' },
  { value: 1, label: 'PKI登录' },
];

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

function condition(item: any) {
  const menuRouteList = ['/system', '/system2', '/task', '/flow', '/component'];
  let matched = menuRouteList.filter((it: any) => {
    let other = item.permission;
    return other.substring(0, it.length) == it;
  });
  return Array.isArray(matched) && matched.length > 0;
}

const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
  const { initialState, setInitialState } = useModel('@@initialState');
  const [value, setValue] = useState(0);
  const radioChange = ({ target: { value } }: RadioChangeEvent) => {
    setValue(value);
  };
  const handleSubmit = async (values: API.LoginParams) => {
    getResponse('login', values)
      .then(async (res) => {
        // 获取登录成功获取用户信息
        const currentUser = await getUserInfo();
        const userResourceList = await getResponse('userResource', { appId: '1' });
        setInitialState((s: any) => ({ ...s, currentUser }));
        setInitialState((s: any) => ({ ...s, userResourceList }));
        if (Array.isArray(userResourceList)) {
          const appCenter = userResourceList.filter((it: any) => {
            return it.permission == '/app/manage/list/wdyy';
          });
          const menuResourcePermission = userResourceList
            .filter((item: any) => {
              return item.type == 'module' && condition(item);
            })
            ?.map((item: any) => {
              return item.permission;
            });
          if (
            (!Array.isArray(appCenter) || appCenter?.length == 0) &&
            menuResourcePermission != undefined
          ) {
            message.success('登录成功！');
            history.push(menuResourcePermission[0]);
          } else {
            message.success('登录成功！');
            const { query = {} } = history.location;
            const { redirect } = query;
            history.push(redirect || '/');
          }
        }

        return userResourceList;
      })
      .catch((e) => {
        setUserLoginState(e);
      });
  };

  // 获取配置信息
  let logo = signIcon;
  let plateformName = '';
  let loginTypeShow = 0;
  if (initialState?.settings) {
    logo = initialState?.settings.logo;
    plateformName = initialState?.settings.platform_name;
    loginTypeShow = initialState?.settings.feat_loginType_on;
  }

  const codeLogin = () => {
    return (

      <Form
        name="basic"
        layout="vertical"
        initialValues={{ remember: true }}
        onFinish={handleSubmit}
        autoComplete="off"
        className='login-form'
      >
        <Form.Item
          name="accountName"
          className="login-form-item"
          rules={[{ required: true, message: '请输入用户账号!' }]}
        >
          <Input
            prefix={<UserOutlined  className='login-form-item-icon'/>}
            placeholder='请输入用户名'
          />
        </Form.Item>

        <Form.Item
          name="password"
          className="login-form-item"
          rules={[{ required: true, message: '请输入登录密码!' }]}
        >
          <Input.Password
            prefix={<LockOutlined className='login-form-item-icon'/>}
            placeholder='请输入密码'
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" className="login-container-login-btn" htmlType="submit">
            登录{' '}
          </Button>
        </Form.Item>

      </Form>
    );
  };

  const pkiLogin = () => {
    return (
      <div className="login-pki-login-wrapper">
        <img src={pkiImg} className="pkiImg" />
      </div>
    );
  };

  const { code } = userLoginState;
  return (
    <div className="login-container">
      <video
        src="/login-bg.mp4"
        className="login-bg"
        autoPlay
        loop
        muted>
      </video>

      <div className="login-form-wrapper">

        <div className='login-container-header'>
              <img src={logo} />
            <div className='login-container-name'>{plateformName}</div>
        </div>

          {code && code !== 67100200 && <LoginMessage content={'错误的用户名和密码'} />}

          {value === 0 && codeLogin()}
        {value === 1 && pkiLogin()}
        {loginTypeShow == 1 ? <Radio.Group
          buttonStyle="solid"
          options={options}
          optionType="button"
          className="login-type-radio"
          value={value}
          onChange={radioChange}
        /> : <></> }
       </div>

      <div className="login-footer-wrapper">
        <Footer theme='light'/>
      </div>

    </div>
  );
};

export default Login;
