import {useState,forwardRef,useImperativeHandle} from 'react'
import { Modal, Form, Input, message} from 'antd';
import { saveComponent} from '@/services/xuanwu/server';
import { useAppId } from '@/pages/settings/hooks';
const {TextArea} = Input


type AddComponentProps = {
  onOk?:(pageId?:string)=>void
}

export type  AddComponentRefProps = {
  init: () => void
}


const AddComponent = forwardRef<AddComponentRefProps,AddComponentProps>(({onOk}, ref) => {
  useImperativeHandle(
    ref,
    ():AddComponentRefProps => {
      return {
        init() {
          form.resetFields();
          setOpen(true)
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
      .then(async (values) => {
        setConfirmLoading(true)
        try {
          console.log('values :>> ', values);
          const {dataId} = await saveComponent({ ...values,appId})
          setOpen(false);
          message.success('新增组件成功')
          onOk?.(dataId)
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

  return (
    <Modal
      title='新建组件'
      open={open}
      onOk={handleOk}
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
          label="组件名称"
          name="title"
          rules={[
            { required: true, message: '请输入组件名称' },
            { type:"string", max:20}
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="组件描述"
          name="description"
          rules={[
            { required: true, message: '请输入组件描述' },
            { type:"string", max:500}
          ]}
        >
          <TextArea
            showCount
            maxLength={500}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
})

export default AddComponent