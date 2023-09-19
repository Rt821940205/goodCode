import {useState,forwardRef,useImperativeHandle, useRef} from 'react'
import { Modal, Form, Input, message,Select} from 'antd';
import { saveApiSevice,editApiSevice} from '@/services/xuanwu/entity';
import { useAppId } from '@/pages/settings/hooks';
import {APIField} from '@/@types/entity';

enum AuthType {
  NOAUTH = 'none',
  CHINAOLY = 'chinaoly',
  WYY = 'wyy'
}

type AddApiProps = {
  onOk?:(pageId?:string)=>void
}

type FormValues = {
  displayName: string,
  authentication_type:AuthType
  id: string,
  [key:string]:any
}

export type  AddApiRefProps = {
  init:(type:'add'| 'edit',row?:any)=>void
}

const getChinaolyForm = () => {
  return <>
  <Form.Item
      label="authUrl"
      name="authUrl"
      rules={[
        { required: true, message: '请输入authUrl' },
        { type:"url"}
      ]}
    >
        <Input placeholder='请输入authUrl'/>
    </Form.Item>

    <Form.Item
      label="appKey"
      name="appKey"
      rules={[
        { required: true, message: '请输入appKey' },
      ]}
    >
        <Input placeholder='请输入appKey'/>
    </Form.Item>

    <Form.Item
      label="appSecret"
      name="appSecret"
      rules={[
        { required: true, message: '请输入appSecret' }
      ]}
    >
        <Input placeholder='请输入appSecret'/>
    </Form.Item>
  </>
}

const getWyyForm = () => { 
  return <>
    <Form.Item
      label="accessId"
      name="accessId"
      rules={[
        { required: true, message: '请输入accessId' },
      ]}
    >
        <Input placeholder='请输入accessId'/>
    </Form.Item>

    <Form.Item
      label="privateKey"
      name="privateKey"
      rules={[
        { required: true, message: '请输入privateKey' }
      ]}
    >
        <Input placeholder='请输入privateKey'/>
    </Form.Item>
  </>
}

const getFormByAuthType = (type:AuthType) => { 
  const authForms = {
    [AuthType.CHINAOLY]: getChinaolyForm,
    [AuthType.WYY]:getWyyForm
  }
  return authForms[type]?.()
}




const createField = (name:string,val:string):APIField=>{
  return {
    localName: name,
    name,
    length: 20,
    state: 1,
    displayName:name,
    val,
    defaultValue:val,
    typeName: "String",
    category: 1,
    bizNo: name,
    modify: 0,
    display: 1,
    primary: 0,
    unique: 0,
    indexed: 0,
    notNull: 0,
    foreign: 0,
    show: 1,
    description: ""
  }
}

const fieldsMapByType = new Map([
  [
    AuthType.NOAUTH, {
      authentication_type:"authentication_type",
    }
  ],
  [
    AuthType.CHINAOLY, {
      authentication_type:"authentication_type",
      appKey: 'authenticationConfig__appKey',
      appSecret: 'authenticationConfig__appSecret',
      authUrl: 'authenticationConfig__url',
    }
  ],
  [
    AuthType.WYY,
    {
      authentication_type:"authentication_type",
      accessId: 'authenticationConfig__accessId',
      privateKey: 'authenticationConfig__privateKey',
    }
  ]
])


const AddApi = forwardRef<AddApiRefProps,AddApiProps>(({onOk}, ref) => {
  useImperativeHandle(
    ref,
    ():AddApiRefProps => {
      return {
        init(type, row?: {
          displayName: string,
          id: string,
          fields: APIField[],
          [key: string]: any
        }) {
          form.resetFields();
          if (type === 'edit') {
            const { displayName, fields = [], id } = row || {}
            serverFiledsRef.current = [...fields] || []
            if(!fields?.length) return
            const authType = (fields.find(i => i.name === 'authentication_type') || {}).defaultValue as AuthType
            if (authType) {
              //通过field数组映射为form表单的键值
              const fieldsMap: Record<string, any> = fieldsMapByType.get(authType) || {}
              const serverFieldsMap = Object.entries(fieldsMap).reduce((res, [formField, serverField]) => {
                res[serverField] = formField
                return res
              }, {})

              const formValues = fields.reduce((vals,{name,defaultValue}) => {
                const formName = serverFieldsMap[name]
                formName && (vals[formName] = defaultValue)
                return vals
              }, {})

              setAuType(authType)
              form.setFieldsValue({ ...formValues, displayName ,id})
            }
          } else {
            setAuType(AuthType.NOAUTH)
            serverFiledsRef.current = []
          }
          setType(type)
          setOpen(true)
        }
      }
    },
  )

  const [form] = Form.useForm();
  const [type, setType] = useState<'add' | 'edit'>('add')
  const [open, setOpen] = useState(false)
  const [authType, setAuType] = useState<AuthType>(AuthType.NOAUTH)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const appId = useAppId()
  const serverFiledsRef = useRef<APIField[]>([])


    //根据不同类型的表单字段 映射生成后端需要的fields列表
  const getServeFields = (values:FormValues):APIField[] => { 
    const { authentication_type:type}  = values
    const fieldsMap = fieldsMapByType.get(type) || {}
    const fields = Object.keys(fieldsMap).map(formfield => {
      const realName = fieldsMap[formfield]
      const val = values[formfield]
      return {
        ...createField(realName,val),
        appId
      }
    })
    return fields
  }

  const edit = async (values:FormValues) => { 
    setConfirmLoading(true)
    try {
      const serverFields = getServeFields(values)
      const idByname = serverFiledsRef.current.reduce((res, {id,name}) => {
        res[name] = id
        return res
      }, {})
      const editFields = serverFields.map(field => {
        return {...field, id:idByname[field.name],modelId:values.id}
      })
      const payload = {
        ...values,
        appId,
        fields:editFields,
      }
      await editApiSevice(payload)
      setOpen(false);
      message.success('编辑API服务成功')
      onOk?.()
    } finally {
      setConfirmLoading(false)
    }
  }
  const add = async (values:FormValues) => { 
    setConfirmLoading(true)
    try {
      const payload = {
        ...values,
        appId,
        fields:getServeFields(values),
      }
      await saveApiSevice(payload)
      setOpen(false);
      message.success('新增API服务成功')
      onOk?.()
    } finally {
      setConfirmLoading(false)
    }
  }
  const handleOk = () => {
    form.validateFields()
    .then(values => {
       if (type === 'add') {
          add(values)
        } else if (type === 'edit') {
          edit(values)
        }
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  const handleCancel = () => {
    setOpen(false);
  };


  return (
    <Modal
      title={type === 'add' ? '新建API服务':"编辑API服务"}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={confirmLoading}
    >
      <Form
        form={form}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 19 }}
        style={{ maxWidth: 800 }}
        initialValues={{ authentication_type: AuthType.NOAUTH }}
        autoComplete="off"
      >
        <Form.Item
          label="服务名称"
          name="displayName"
          rules={[
            { required: true, message: '请输入服务名称' },
            { type:"string", max:20}
          ]}
        >
          <Input placeholder='请输入服务名称'/>
        </Form.Item>

        <Form.Item
         
          label="认证类型"
          name="authentication_type"
          rules={[
            { required: true, message: '请输入认证类型' },
          ]}
        >
          <Select
            placeholder='请选择认证类型'
            showSearch
            onChange={(type) => {
              setAuType(type)
            }}
            options={[
              {
                label:'No Auth',
                value: AuthType.NOAUTH
              },
              {
                label:'CHINAOLY',
                value: AuthType.CHINAOLY
              },
              {
                label:'微应用',
                value: AuthType.WYY
              }
            ]}
          >
          </Select>
        </Form.Item>
        {getFormByAuthType(authType)}
        <Form.Item
          style={{display:"none"}}
          label="id"
          name="id"
        >
          <Input/>
        </Form.Item>
      </Form>
    </Modal>
  )
})

export default AddApi