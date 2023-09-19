import React from "react";
import { history } from "@@/core/history";
import { getResponse } from "@/api/common";
import "../Login/index.less";
import { stringify } from "querystring";

/**
 * 登录中转页面，检查登录
 * @constructor
 */
const LoginJump: React.FC = () => {

  const { query = {} } = history.location;
  const { redirect } = query;

  let redirectUri = "/home/index";
  if (redirect != undefined && !redirect.includes("login")) {
    redirectUri = redirect;
  }
  const fetchLoginPage = async () => {
    getResponse("loginPage", { xwPage: redirectUri })
      .then((res) => {
        console.log(res);
        let loginPath = res;
        if (loginPath == undefined || loginPath == "") {
          history.replace({
            pathname: '/user/login',
            search: stringify({
              redirect: redirectUri,
            }),
          });
        }else {
          window.location.href = loginPath;
        }
      });
  };
  fetchLoginPage();
  return (
    <div className="login-container">
    </div>
  );
};

export default LoginJump;
