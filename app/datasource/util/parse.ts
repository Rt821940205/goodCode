import {
  Constants,
  modelFieldCategoryKey,
  modelFieldPrefix,
} from '@/pages/app/datasource/util/modelField';

export class ParamData {
  paramName: string;
  paramValue: any;
  paramType: string;
}
export class BodyData {
  type = 'none';
  formData:any[] = [];
  JSON = '';
  formUrlencoded: any;
}

export class HeaderData {
  headerName: string;
  headerValue: any;
  headerType: string;
}
export class ApiData {
  displayName: string;
  name: string;
  id: string;
  appId: any;
  modelId: any;
  url: string;
  method: string;
  header:any[] = [];
  params:any[] = [];
  body = new BodyData();
  responseBody: string;
  showName: string;
  constructor(appId:any, modelId:any) {
    this.appId = appId;
    this.modelId = modelId;
  }
  parseData(apiDataField: any) {
    this.id = apiDataField.id;
    this.name = apiDataField.name;
    this.displayName = apiDataField.displayName.substring(
      Constants.ApiDataNamePrefix.toString().length,
    );
    this.showName = apiDataField.displayName.substring(
      Constants.ApiDataNamePrefix.toString().length,
    );
    let valueString = apiDataField.defaultValue;
    let json = JSON.parse(valueString);
    // {
    //   "config": [
    //
    //   ],
    //   "input": [
    //
    //   ],
    //   "result": [
    //
    //   ]
    // }

    json.forEach((item:any) => {
      let xpathd = item.xpathKey;
      this.xpathParse(xpathd, item);
    });
    console.log(this.body);
  }

  private xpathParse(xpathd: string, item: any) {
    // 最后一个/后面就是key
    let key = xpathd.substring(xpathd.lastIndexOf('/') + 1, xpathd.length);
    // prefix 第一个/之前的就是类型 CONFIG INPUT RESULT INPUT_RESULT
    let prefix = xpathd.substring(0, xpathd.indexOf('/', 0));
    // position prefix之后的就是position
    let jude = xpathd.substring(0, xpathd.indexOf(key) - 1);
    let startIndex = xpathd.indexOf(prefix) + 6;
    if (-1 != jude.indexOf('//')) {
      startIndex = xpathd.indexOf(prefix) + 7;
    }
    let position = xpathd.substring(startIndex, xpathd.lastIndexOf("/"));
    this.parseConfigField(prefix, key, item);
    switch (position) {
      case modelFieldPrefix.PARAM_FIELD_POSITION.toString():
        let paramData = new ParamData();
        paramData.paramName = key;
        paramData.paramValue = item.value;
        paramData.paramType = item.type;
        console.log('paramData');
        console.log(item);
        this.params.push(paramData);
        break;
      case modelFieldPrefix.HEADER_FIELD_POSITION.toString():
        let headerData = new HeaderData();
        headerData.headerName = key;
        headerData.headerValue = item.value;
        headerData.headerType = item.type;
        console.log('headerData');
        console.log(item);
        this.header.push(headerData);
        break;
      case modelFieldPrefix.JSON_FIELD_POSITION.toString():
        let bodyDataRaw = new BodyData();
        bodyDataRaw.JSON = item.value;
        bodyDataRaw.type = 'JSON';
        this.body = bodyDataRaw;
        break;
      case modelFieldPrefix.FORM_DATA_FIELD_POSITION.toString():
        let param = new ParamData();
        param.paramName = key;
        param.paramValue = item.value;
        param.paramType = item.type;
        this.body.type = 'formData';
        this.body.formData.push(param);
        break;
      case modelFieldPrefix.FORM_DATA_URL_ENCODING_FIELD_POSITION.toString():
        let paramUrl = new ParamData();
        paramUrl.paramName = key;
        paramUrl.paramValue = item.value;
        paramUrl.paramType = item.type;
        this.body.formData.push(paramUrl);
        this.body.type = modelFieldPrefix.FORM_DATA_URL_ENCODING_FIELD_POSITION.toString();
        break;
      default:
        break;
    }
  }

  private parseConfigField(prefix: string, key: string, item: any) {
    if (modelFieldCategoryKey.CONFIG_KEY.toString() == prefix) {
      switch (key) {
        case 'method':
          this.method = item.value;
          break;
        case 'url':
          this.url = item.value;
          break;
        default:
          break;
      }
    }
  }
}
