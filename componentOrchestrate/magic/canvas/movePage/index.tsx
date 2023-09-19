import {useState,forwardRef,useImperativeHandle, useEffect} from 'react'
import { Modal, Form, Input, Select, message} from 'antd';
import { queryModules,move2Module} from '@/services/xuanwu/magic';
import { useAppId } from '@/pages/componentOrchestrate/hooks';


type FormValues = {
  id:string,
  module_id: string,
}

type MovePageProps = {
  onOk?:(pageId?:string)=>void
}

export type  MovePageRefProps = {
  init: (values: FormValues) => void
}

type ModuleItem = {
  app_id: string,
  module_name: string,
  id:string
}

const MovePage = forwardRef<MovePageRefProps,MovePageProps>(({onOk}, ref) => {

  useImperativeHandle(
    ref,
    ():MovePageRefProps => {
      return {
        init(values) {
          form.resetFields();
          setOpen(true)
          form.setFieldsValue({
            ...values
          })
        }
      }
    },
  )

  const [form] = Form.useForm();

  const [open, setOpen] = useState(false)

  const [confirmLoading, setConfirmLoading] = useState(false)

  const appId = useAppId()

  const handleOk = () => {
    form.validateFields()
      .then(async (values: Required<FormValues>) => {
        setConfirmLoading(true)
        try {
        
          await move2Module({ ...values })
          setOpen(false);
          message.success('页面移动成功')
          onOk?.()
        } finally {
          setConfirmLoading(false)
        }
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  const handleCancel = () => {
    setOpen(false);
  };

  
  const [moduleOptions, setModuleOptions] = useState<ModuleItem[]>([])

  useEffect(() => {
    (async () => {  
      const data = await queryModules({appId})
      setModuleOptions(data.modules || [])
    })()
  }, [open])




  return (
    <Modal
      title='移动页面到模块'
      open={open} onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={confirmLoading}
    >
      <Form
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        style={{ maxWidth: 600 }}
        autoComplete="off"
      >
        <Form.Item
          label="模块名称"
          name="module_id"
          rules={[{ required: true, message: '请选择模块名称' }]}
        >
          <Select
            placeholder='请选择模块名称'
            fieldNames={{ label: "module_name", value: "id" }}
            options={moduleOptions}
          >
          </Select>
        </Form.Item>
       
        {/* 自身页面 */}
        <Form.Item
          style={{ display: "none" }}
          label="id"
          name="id"
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
})

export default MovePage