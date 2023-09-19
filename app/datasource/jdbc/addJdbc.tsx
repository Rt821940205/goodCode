import { jdbcConnectButton } from '@/pages/app/datasource/jdbc/connectTest';
import { Constants } from '@/pages/app/datasource/util/Constants';
let datasourceServerCategory = 1016;
export const jdbcFormBody = [
  {
    type: 'hidden',
    disabled: true,
    name: 'modelId',
  },
  {
    type: 'hidden',
    disabled: true,
    name: 'appId',
  },
  {
    type: 'hidden',
    disabled: true,
    name: 'fieldIdNameMapping',
  },
  {
    type: 'input-text',
    name: 'displayName',
    validations: {
      maxLength: 20,
    },
    required: true,
    labelRemark: {
      body: 'UI展示名',
      icon: 'question-mark',
    },
    validationErrors: {
      maxLength: '长度超出限制，请输入小于20字的名称',
    },
    label: '数据源名称',
  },
  {
    type: 'hidden',
    name: 'category',
    value: datasourceServerCategory,
  },
  {
    label: '实体类型:',
    name: 'display',
    type: 'hidden',
    // 存储类
    value: true,
  },
  {
    type: 'select',
    name: 'type',
    label: '数据库类型',
    required: true,
    options: [
      {
        label: 'MySQL',
        value: 'MySQL',
      },
      // {
      //   label: 'SQL Server',
      //   value: 'MSSQL',
      // },
      // {
      //   label: 'Hive',
      //   value: 'HIVE',
      // },
    ],
  },
  {
    type: 'input-text',
    name: 'mysqlUrl',
    label: '数据源url',
    hiddenOn: "this.type != 'MySQL'",
    required: true,
    value: Constants.MySQL_URL_DEFAULT.toString(),
  },
  {
    type: 'input-text',
    name: 'mssqlUrl',
    label: '数据源url',
    hiddenOn: "this.type != 'MSSQL'",
    required: true,
    value: 'jdbc:sqlserver://ipAddress:1433;DatabaseName=test',
  },
  {
    type: 'input-text',
    name: 'hiveUrl',
    label: '数据源url',
    hiddenOn: "this.type != 'HIVE'",
    required: true,
    value: 'jdbc:hive2://ipAddress:10000',
  },
  {
    type: 'input-text',
    name: 'username',
    label: '用户名',
    required: true,
  },
  {
    type: 'input-password',
    name: 'password',
    label: '密码',
    required: true,
  },
  jdbcConnectButton,
];
