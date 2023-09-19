import React, { useState } from 'react';
import styles from './index.less'
import { Button, Modal, message, Divider } from 'antd'
import { Define } from '@/pages/componentOrchestrate/AmisPropertyDefine'

import {
  SmileTwoTone,
  ProfileTwoTone ,
  ProfileOutlined,
  SettingOutlined,
  SettingTwoTone,
  FileTextTwoTone

} from '@ant-design/icons';
import { Tabs, Col, Row } from 'antd';


interface Props {
  value?: any[],
  inputClick: (field?: string | number, f?: string | number) => void,
  onChange?: (value: any) => void;
  dynamic: any,
  btn?: any,
  index?: number,
  dataTitle?: any,


}
export const AmisProperty: React.FC<Props> = (Props) => {

  var { dataTitle, dynamic, inputClick, onChange, value = [], btn = null, index = -1 } = Props


  console.debug('AmisProperty init', Props)

  let currentValue = value;

  const hasIndex = index != undefined && index >= 0;

  if (hasIndex) {
    currentValue = [value[index]]
    console.debug('currentValue', currentValue)
  }

  if (!dynamic) {

  };


  const triggerChange = (value: any) => {
    onChange?.(value)
  };


  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    console.debug('showModel', Props)
    setIsModalOpen(true);
  };

  const handleOk = (ret: any) => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const callback = (data: any, _tranform: any) => {


    console.debug('callback', data)

    if (data.item.parentKey != 'static' && data.item.value.indexOf('groovy:') == 0) {
      alert(Define.groovySupportError)
      return;
    }


    let amisValue = Define.getAmisDataValue(data);


    if (typeof amisValue == 'object') {
      amisValue = JSON.stringify(amisValue);
    }


    let esData = { key: amisValue }

    if (_tranform) {
      if (_tranform(data, esData)) {
        return;
      }
    }

    let itemValue = { ...data.item }
    itemValue = Object.assign(itemValue, esData);

    console.debug(itemValue)

    if (itemValue.node == 'static' || itemValue.parentKey == 'static') {
      itemValue['title'] = String(itemValue.key);
      itemValue['value'] = itemValue.key;
    }

    console.debug(itemValue)

    if (hasIndex) {


      value[index] = itemValue;


    } else {

      if (value.length > 0) {
        value.pop();
      }
      if (itemValue.key) {
        value.push(itemValue);
      }
    }


    triggerChange(value);
    setIsModalOpen(false);
    inputClick(itemValue);
  }



  const reactBtn = (_tranform: any) => {
    return {
      "name": "mycustom_btn",
      "children": ({
        data
      }) => (
        <div >

          <Divider />

          <Row>
            <Col flex="auto" className={styles.icon}>
              {hasIndex ? Define.nodeSettingNotice : (dynamic?.originKey ? Define.inSettingNotice : '请谨慎输入变量，并确保格式正确')}
            </Col>
            <Col flex="100px" className={styles.btn}><Button size='large' type="primary" onClick={() => callback(data, _tranform)}>
              {Define.confirmName}
            </Button>
            </Col>

          </Row>

        </div>
      )
    }
  }

  let amisSchema: any = false
  if (dynamic !== undefined) {
    amisSchema = dynamic['x-amis']
    amisSchema = Define.parseSchema(amisSchema);
  }

  const amisValue = Define.getAmisValue(currentValue);

  let isJson = Define.isAmisValueJson(amisValue, dynamic);

  amisValue.position = hasIndex ? 'node' : 'in';

  console.debug('amisSchema', amisSchema, amisValue)


  const getAmisServiceRender = (_schema: any, _tranform: any) => {
    return Define.getAmisServiceRender(_schema, _tranform, amisValue, reactBtn(_tranform));
  }


  let amisText: any = [];
  amisText.push(Define.amisTextNode);
  if (amisValue.parentKey != 'static') {
    amisText.push(Define.tplNode)
  }

  if ((dynamic?.format == 'MultipartFile' || dynamic?.format == 'binary' ||  dynamic?.name == 'file' || dynamic?.key == 'file' || dynamic?.originName == 'file') && dataTitle == '示例值') {

    amisText.push(Define.amisUploadFileNode);
  }



  let tabItems = [];
  if (amisSchema && amisValue.parentKey != 'in') {
    tabItems.push({
      key: '1',
      label: <div><SettingTwoTone />{Define.settingName}</div>,

      // label: Define.settingName,
      children: getAmisServiceRender(amisSchema, () => { }),
    });
  }



  if (isJson) {
    let errorJson = Define.errorJson;
    tabItems.push(
      {
        visible: false,
        key: '2',
        label: Define.jsonEditName,
        children: getAmisServiceRender(Define.jsonEditorNode, (source: any, target: any) => {
          if (source.json) {
            try {
              if (typeof JSON.parse(source.json) != 'object') {
                message.error(errorJson);
                return true;
              }
            } catch (e) {
              message.error(errorJson + '\n' + e);
              console.error(e);
              return true;
            }
            target['key'] = target['value'] = source.json;
          }
          return false;
        })
      });
  }

  tabItems.push(
    {
      key: '3',

      label: <><FileTextTwoTone />{dataTitle || Define.textEditName}</>,
      children: getAmisServiceRender(amisText, () => { }),
    });


  if (amisValue.parentKey != 'in' && (dynamic?.type == 'object' || dynamic?.type == 'array')) {
      let schema = JSON.parse(JSON.stringify(dynamic));

    tabItems.push(
      {
        key: '4',
        label: <><ProfileOutlined /> {Define.jsonSchemaEditName}</> ,
        children: getAmisServiceRender(Define.jsonSchemaNode(schema), () => { }),
      });
  }

  try {
    if (dynamic) {
      let schema = JSON.parse(JSON.stringify(dynamic));
      delete schema['value'];
      delete schema['key'];
      delete schema['x-amis'];

      tabItems.push(
        {
          key: '5',
          label: <div> {Define.schemaEditViewName}</div>,
          children: getAmisServiceRender(Define.jsonViewNode(schema), () => { }),
        });
    }
  } catch (e) {

  }






  let title = Define.propertyEditName + (dynamic && dynamic.title ? `：${dynamic.title} (${dynamic.name || dynamic.key})` : '');

  return (
    <>



      <span className={styles['btn-container']} onClick={showModal}>

        {btn ? btn :

          <SettingOutlined className={amisSchema ? styles.active : styles.icon} />
        }

      </span>

      <Modal title={title} footer={null} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>


        {dynamic?.description}

        {dynamic?.description && <p />}


        <Tabs type="card" size="large" items={tabItems} />



      </Modal>
    </>
  );
};
