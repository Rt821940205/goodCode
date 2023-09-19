export class ModelField {
  public id: any;
  public localName: string;
  public name: string;
  public length: number;
  public state: number;
  public displayName: string;
  public modelId: any = 0;
  public val: any;
  public defaultValue: any;
  //不应该有appid
  public appId: any;
  public typeName: string;
  public category: number;
  public bizNo: string;
  public modify: number = 0;
  public display: number = 1;
  public primary: number = 0;
  public unique: number = 0;
  public indexed: number = 0;
  public notNull: number = 0;
  public foreign: number = 0;
  public show: number = 1;
  asField: number;
  disable: number;
  conditionSelected: any;
  description:string = '';
//不应该有appid
  constructor(
    category: modelFieldCategory,
    localName: string,
    modelId?: bigint,
    appId?: any,
    value?,
  ) {
    this.category = category.valueOf();
    this.localName = localName;
    this.displayName = localName;
    this.modelId = modelId;
    //不应该有appid
    this.appId = appId;
    this.length = 20;
    this.state = 1;
    if (value != undefined) {
      this.setValue(modelFieldValueType.String, value);
    }
  }

  setId(id: any) {
    this.id = id;
  }

  setDescription(description:string){
    this.description = description
  }

  /**
   * 普通属性
   * @param name
   */
  setName(name: string) {
    this.name = name;
    this.bizNo = name;
  }

  setLocalName(localName:string) {
    this.localName = localName;
  }

  setUrl(name: string) {
    let newName = name;
    if (-1 === name.indexOf(modelFieldPrefix.URL_FIELD_PREFIX)) {
      newName = modelFieldPrefix.URL_FIELD_PREFIX + name;
    }
    this.setName(newName);
  }

  setDisplayName(displayName: string) {
    this.displayName = displayName;
  }

  setCategory(category: modelFieldCategory) {
    this.category = category;
  }

  /**
   * 字段长度
   * @param length
   */
  setLength(length: number) {
    this.length = length;
  }

  /**
   * 设置值
   * @param typeName 值类型
   * @param val 值
   */
  setValue(typeName: string, val: any) {
    this.typeName = typeName;
    if (val != undefined) {
      this.val = val;
      this.defaultValue = val;
    }
  }

  setValueType(valueType: string) {
    this.typeName = valueType;
  }
  /**
   * 设置值
   * @param typeName 值类型
   * @param val 值
   * @param defaultValue  当val为 undefined 时 使用它替代
   */
  setValueWithDefault(typeName: string, val: any, defaultValue: any) {
    this.typeName = typeName;
    if (val != undefined) {
      this.val = val;
      this.defaultValue = val;
    } else {
      this.val = defaultValue;
      this.defaultValue = defaultValue;
    }
  }

  /**
   * http中parm参数
   * @param name
   */
  setParam(name: string) {
    let newName = name;
    if (-1 === name.indexOf(modelFieldPrefix.PARAM_FIELD_PREFIX)) {
      newName = modelFieldPrefix.PARAM_FIELD_PREFIX + name;
    }
    this.name = newName;
  }

  /**
   * http中header参数
   * @param name
   */
  setHeader(name: string) {
    let newName = name;
    if (-1 === name.indexOf(modelFieldPrefix.HEADER_FIELD_PREFIX)) {
      newName = modelFieldPrefix.HEADER_FIELD_PREFIX + name;
    }
    this.name = newName;
  }

  /**
   * http中form data参数
   * @param name
   */
  setBodyFormData(name: string) {
    let newName = name;
    if (-1 === name.indexOf(modelFieldPrefix.FORM_DATA_FIELD_PREFIX)) {
      newName = modelFieldPrefix.FORM_DATA_FIELD_PREFIX + name;
    }
    this.name = newName;
  }

  /**
   * http中form data参数
   * @param name
   */
  setBodyFormUrlencodedField(name: string) {
    let newName = name;
    if (-1 === name.indexOf(modelFieldPrefix.FORM_DATA_URL_ENCODING_FIELD_PREFIX)) {
      newName = modelFieldPrefix.FORM_DATA_URL_ENCODING_FIELD_PREFIX + name;
    }
    this.name = newName;
  }

  /**
   * http中请求体json参数
   * @param name
   */
  setBodyJson(name: string) {
    let newName = name;
    if (-1 === name.indexOf('body')) {
      newName = 'body';
    }
    this.name = newName;
  }
}

export enum modelFieldCategory {
  /**
   * 配置，模型扩展信息的定义
   */
  CONFIG = 1,
  /**
   * 输入的参数的定义
   */
  INPUT = 2,
  /**
   * 输入结果的定义
   */
  RESULT = 3,
  /**
   * 同时作为输入与输出的定义
   */
  INPUT_RESULT = 4,
}

export enum modelFieldCategoryKey {
  /**
   * 配置，模型扩展信息的定义
   */
  CONFIG_KEY = 'CONFIG',
  /**
   * 输入的参数的定义
   */
  INPUT_KEY = 'INPUT',
  /**
   * 输入结果的定义
   */
  RESULT_KEY = 'RESULT',
  /**
   * 同时作为输入与输出的定义
   */
  INPUT_RESULT_KEY = 'INPUT_RESULT',
}

export enum modelFieldValueType {
  /**
   * 字符串
   */
  String = 'String',
  /**
   * 长整型
   */
  Long = 'Long',
}

export enum modelFieldConstant {
  /**
   * 字符串
   */
  SQL_DIALECT = 'config__SQLDialect',
  DATA_SOURCE_URL = 'datasourceConfig__jdbcUrl',
  DATA_SOURCE_USER = 'datasourceConfig__username',
  DATA_SOURCE_PWD = 'datasourceConfig__password',
}

export enum modelFieldPrefix {
  /**
   * 模型配置定义：API请求Param项的前缀
   */
  PARAM_FIELD_PREFIX = 'param__',
  PARAM_FIELD_POSITION = 'param',
  /**
   * 模型配置定义：API请求Header项的前缀
   */
  HEADER_FIELD_PREFIX = 'header__',
  HEADER_FIELD_POSITION = 'header',
  /**
   * 模型配置定义：API请求FormData项的前缀
   */
  FORM_DATA_FIELD_PREFIX = 'formData__',
  FORM_DATA_FIELD_POSITION = 'formData',

  /**
   * 模型配置定义：API请求UrlEncoding项的前缀
   */
  FORM_DATA_URL_ENCODING_FIELD_PREFIX = 'urlEncoding__',
  FORM_DATA_URL_ENCODING_FIELD_POSITION = 'urlEncoding',
  /**
   * 模型配置定义：API请求FormData项的前缀
   */
  JSON_FIELD_PREFIX = 'json__',
  JSON_FIELD_POSITION = 'JSON',

  /**
   * 认证 url字段 前缀
   */
  URL_FIELD_PREFIX = 'authenticationConfig__',
  AUTH_URL_FIELD_POSITION = 'authorizationConfig',

  /**
   * result 前缀
   */
  RESULT_FIELD_PREFIX = 'resultConfig__',
  RESULT_FIELD_POSITION = 'resultConfig',

  /**
   * config 前缀
   */
  CONFIG_PREFIX = 'config__',
  CONFIG_POSITION = 'config',

  /**
   * datasource config 前缀
   */
  DATA_SOURCE_PREFIX = 'datasourceConfig__',
  DATA_SOURCE_POSITION = 'datasourceConfig',
}

export enum Constants {
  ApiServiceDataPrefix = 'api__service__',

  ApiServiceFieldsPrefix = 'api__fields__',
  ApiDataNamePrefix = 'service__',
}
