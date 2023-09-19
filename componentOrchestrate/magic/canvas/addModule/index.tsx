//新增或编辑模块
import { useState, forwardRef, useImperativeHandle } from 'react'
import { Modal, Form, Input, message } from 'antd';
import { addModule,updateModule } from '@/services/xuanwu/magic';
import { useAppId } from '@/pages/componentOrchestrate/hooks';
type FormValues = {
  module_name?: string,
  id?: string,
}
export type AddModuleRefProps = {
  init:(type:'add'| 'edit',values?:FormValues)=>void
}
type AddModuleProps = {
  onOk?:(moduleId?:string)=>void
}

const AddModule = forwardRef<AddModuleRefProps, AddModuleProps>(({onOk}, ref) => {
  useImperativeHandle(ref, ():AddModuleRefProps => ({
    init: (type,values) => {
      form.resetFields();
      if (type === 'edit') {
        form.setFieldsValue({
          ...values
        })
      }
      setType(type)
      setOpen(true)
    },
  }))

  const [form] = Form.useForm();

  const [open, setOpen] = useState(false)

  const [type, setType] = useState<'add' | 'edit'>('add')
  
  const [confirmLoading, setConfirmLoading] = useState(false)

  const appId = useAppId()

  const edit = async (values: FormValues) => {
    const { module_name = '' ,id=''} = values
    setConfirmLoading(true)
    try {
      await updateModule({ module_name,id, appId })
      onOk?.()
      setOpen(false);
      message.success('修改模块成功')
    } finally {
      setConfirmLoading(false)
    }
  }

  const add = async (values: FormValues) => {
    const { module_name = '' } = values
    setConfirmLoading(true)
    try {
      const {create_sys_module:moduleId} = await addModule({ module_name, appId })
      onOk?.(moduleId)
      setOpen(false);
      message.success('新增模块成功')
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
      confirmLoading={confirmLoading}
      title={type === 'add' ? '新增模块':"编辑模块"}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form
            form={form}
            name="模块名称"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            style={{ maxWidth: 600 }}
            autoComplete="off"
          >
            <Form.Item
              label="模块名称"
              name="module_name"
              rules={[{ required: true, message: '请输入模块名称' }]}
            >
              <Input />
            </Form.Item>
            
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

export default AddModule