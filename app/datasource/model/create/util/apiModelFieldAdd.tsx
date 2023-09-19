import { modelFieldCategoryKey, modelFieldPrefix } from '@/pages/app/datasource/util/modelField';
export class paramObj {
  position: string;
  value: any;
  code: string;
  type: string;
  disable: any;
  id: any;
  index: any;

  constructor(
    position: string,
    value: any,
    code: string,
    type: string,
    disable: any,
    id: any,
    index: any,
  ) {
    this.position = position;
    this.value = value;
    this.code = code;
    this.type = type;
    this.disable = disable;
    this.id = id;
    this.index = index;
  }
}

class resultObj {
  paramName: string;
  displayName: string;
  paramType: string;
  disable: any;
  id: any;
  index: any;

  constructor(
    paramName: string,
    displayName: string,
    paramType: string,
    disable: any,
    id: any,
    index: any,
  ) {
    this.paramName = paramName;
    this.displayName = displayName;
    this.paramType = paramType;
    this.disable = disable;
    this.id = id;
    this.index = index;
  }
}

export function findMethodOrUrl(xpathd: string, item:any) {
  let results = [];
  // 最后一个/后面就是key
  let key = xpathd.substring(xpathd.lastIndexOf('/') + 1, xpathd.length);
  if (key === 'url' || key === 'method') {
    results.push({ k: key, v: item.value });
  }
  return results;
}

export function xpathFieldParse(xpathd: string, item: any) {
  let results = [];
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
  let position = xpathd.substring(startIndex, xpathd.indexOf(key) - 1);
  switch (position) {
    case modelFieldPrefix.PARAM_FIELD_POSITION.toString():
      let paramData = new paramObj('param', item.value, key, item.type, 1, item.index, item.index);
      results.push(paramData);
      break;
    case modelFieldPrefix.HEADER_FIELD_POSITION.toString():
      let headerData = new paramObj(
        'header',
        item.value,
        key,
        item.type,
        1,
        item.index,
        item.index,
      );
      results.push(headerData);
      break;
    case modelFieldPrefix.JSON_FIELD_POSITION.toString():
      let bodyDataRaw = new paramObj('body', item.value, key, 'JSON', 1, item.index, item.index);
      results.push(bodyDataRaw);
      break;
    case modelFieldPrefix.FORM_DATA_FIELD_POSITION.toString():
      let formData = new paramObj(
        'formData',
        item.value,
        key,
        item.type,
        1,
        item.index,
        item.index,
      );
      results.push(formData);
      break;
    case modelFieldPrefix.FORM_DATA_URL_ENCODING_FIELD_POSITION.toString():
      let formDataUrl = new paramObj(
        'urlEncoding',
        item.value,
        key,
        item.type,
        1,
        item.index,
        item.index,
      );
      results.push(formDataUrl);
      break;
    default:
      break;
  }
  return results;
}

export function parseResult(xpathd: string, item:any) {
  let results = [];
  // RESULT/resultConfig/content
  if (xpathd != undefined && xpathd.indexOf(modelFieldCategoryKey.RESULT_KEY.toString()) != -1) {
    let result = new resultObj(item.key, item.localName, item.type, 1, item.index, item.index);
    results.push(result);
  }
  return results;
}
