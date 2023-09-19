import { modelFieldCategoryKey, modelFieldValueType } from '@/pages/app/datasource/util/modelField';

export class ApiSourceField {
  id: any;
  key: string;
  xpathKey: string;
  value: any;
  type: modelFieldValueType;
  localName: any;
  constructor(key:any) {
    this.key = key;
  }

  setValue(value: string, type: modelFieldValueType) {
    this.value = value;
    this.type = type;
  }

  /**
   * 设置值
   * @param typeName 值类型
   * @param val 值
   * @param defaultValue  当val为 undefined 时 使用它替代
   */
  setValueWithDefault(val: any, typeName: modelFieldValueType, defaultValue: any) {
    this.type = typeName;
    if (val != undefined) {
      this.value = val;
    } else {
      this.value = defaultValue;
    }
  }

  setXpathKey(paramPosition: string, modelFieldCategoryKey: modelFieldCategoryKey) {
    this.xpathKey = this.xpathKeyPrefixGenerator(paramPosition, modelFieldCategoryKey, this.key);
  }

  getXpathKey() {
    return this.xpathKey;
  }

  buildConfigXpathKey() {
    this.setXpathKey(undefined, modelFieldCategoryKey.CONFIG_KEY);
  }

  buildRootInputConfigXpathKey() {
    this.setXpathKey(undefined, modelFieldCategoryKey.INPUT_KEY);
  }

  buildRootResultConfigXpathKey() {
    this.setXpathKey(undefined, modelFieldCategoryKey.RESULT_KEY);
  }

  getKey() {
    return this.key;
  }

  xpathKeyPrefixGenerator(
    paramPosition: string,
    modelFieldCategoryKey: modelFieldCategoryKey,
    key:any,
  ) {
    paramPosition = paramPosition == undefined ? '' : paramPosition;
    return modelFieldCategoryKey.valueOf() + '/' + paramPosition + '/' + key;
  }
}
