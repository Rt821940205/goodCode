import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Input, Select, InputNumber, Switch, Space  } from "antd";

import styles from './selectConfig.less'
import { DynamicForm} from '@/@types/orchestrate';
import { AddEditConfigComponent } from '@/services/xuanwu/orcherate'

import {useAppId} from '@/pages/componentOrchestrate/hooks'
import { useDispatch, useSelector } from 'umi';
import { ConnectState } from '@/models/connect';

const { Option } = Select;
const { TextArea } = Input;

interface Props{
  isModalForm: boolean,
  onCancel: () => void,
  onConfigCancel?: ()=>void,
  title: string,
  config: any,
  updateThereData: ()=>void,
}

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const addConfig: React.FC<Props> = (Props) => {
  
  const activeNode = useSelector(({ orchestrate: { activeNode } }: ConnectState) => activeNode)
  const appId = useAppId()
  var {isModalForm, onCancel, config , onConfigCancel, title: inputTitle, updateThereData} = Props
  const [form] = Form.useForm();
  const [dynamicForm, setDynamicForm] = useState<DynamicForm[]>([])
  
  const handleOk =async () => {
    const values = await form.validateFields();
    var { dataId } = config
    var {title,description, configDefault} = values


    delete values.title
    delete values.description
    delete values.configDefault




    let payload: any = {
      "componentId": activeNode.name,
      title,
      description,
      configDefault,
      "app_id": appId,
      "value": values
    }
    if(inputTitle=='编辑组件配置'){

      inputTitle += `(${dataId})`

      payload.dataId = dataId
    }else{
      payload.refId = dataId
    }
    
    try {
      await AddEditConfigComponent({ ...payload })
      onCancel()
      onConfigCancel && onConfigCancel()
      updateThereData && updateThereData()
    } finally{

    }
  };
  const handleCancel = () => {
    setIsTips(false)
    seTipsContent('')
    onCancel()
  };

  const [isTips, setIsTips] = useState(false)
  const [tipsContent, seTipsContent] = useState('')
  const test =async ()=>{
    setIsTips(true)
    seTipsContent('配置测试通过')
    try {
      const values = await form.validateFields();
      console.log('Success:', values);
    } catch (errorInfo) {
    }
    // console.log(form.getFieldsValue())
  }

  const resetForm = ()=>{
    form.resetFields()
  }
  const [initialValues, setInitialValues] = useState({})
  useEffect(()=>{
    var { properties, required=[],description ,configDefault, title} = config


    if(config.dataId == '0'){
      title = '组件配置';
      description = '';
    }
    
    console.log('title',title)
    


    setInitialValues({})
    var list: any[]= []
    list.push({
      key: 'title',
      type: 'string',
      title: '配置名称',
      value: title,
      required: true
    })
    initialValues['title'] = title

    list.push({
      key: 'description',
      type: 'string',
      format:'text',
      title: '配置描述',
      value:  description,
      required: false
    })

    console.debug('config',list)
   


    initialValues['description'] = description



    list.push({
      key: 'configDefault',
      type: 'boolean',
      title: '是否默认配置',
      value: configDefault,
      required: false
    })

    initialValues['configDefault'] = configDefault

    console.debug("配置初使化", initialValues,configDefault,config);


    for (const key in properties) {
      const element = properties[key];
      list.push({
        ...element,
        key: key,
        required:required.includes(key)
      })
      initialValues[key] = element.value
    }
    setInitialValues((prevState)=>{
      return {
        ...prevState,
        ...initialValues
      }
    })
    setDynamicForm(list)
    resetForm()

  },[config])

  return (
    <Modal title={inputTitle + '(id:' + config?.dataId + ')'} open={isModalForm} onOk={handleOk} onCancel={handleCancel} 
      className={styles['add-config']}
      footer={[
        <Button key="test" onClick={test}>
          测试
        </Button>,
        <Button key="cancel" onClick={handleCancel}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          确定
        </Button>
      ]}
    >
      <Form {...layout} form={form} name="control-hooks" initialValues={initialValues} labelCol={{span: 5}} labelWrap>
        {
          dynamicForm.map((dynamic: any)=>{
            var {  key,  format,title, type , enum: enumList, description, required, value, default: placeholder} = dynamic
            let formItem = <Input placeholder={placeholder}  />
            let selected = value == undefined ?placeholder:value;
            console.log(type,format, key,placeholder,value,selected);

            if( type==='string'){
              formItem = <Input placeholder={placeholder} />
              if(enumList){
                formItem = 
                  <Select allowClear placeholder={placeholder}>
                    {
                      enumList?.map((cl:any)=>{
                        return (
                          <Option
                            value={cl}
                            label={cl}
                            key={cl}>
                            {cl}
                          </Option> 
                        )
                      })
                    }
                  </Select>
              }else if(format==='text'){
                console.log("长文本")
                formItem = <TextArea rows={4} placeholder={placeholder}  />
              }
            }else if(type==='int'){
              formItem = <InputNumber style={{width: '100%'}} placeholder={placeholder} />
            }else if(type==='boolean'){
              formItem = <Switch defaultChecked={value !=undefined? value: (placeholder==true || placeholder == "true" ? placeholder: undefined)}/>
            }
            
            return (
              <Form.Item name={key}  label={title || key} key={key} extra={description}  rules={[{ required: required }]}>
                  {formItem}
              </Form.Item>
            )
          })
        }
        {
          isTips && <div className={`${styles['tips']} ${styles['tips-success']} ${styles['tips-errer']}`}>
            {tipsContent}
          </div>
        }
      </Form>
    </Modal>
  )
}

export default addConfig