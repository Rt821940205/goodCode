import {useState,forwardRef,useImperativeHandle} from 'react'
import { Modal, Form, Input, message} from 'antd';
import { saveLocalEntity} from '@/services/xuanwu/entity';
import { useAppId } from '@/pages/settings/hooks';

const { TextArea } = Input;


type AddEntityProps = {
  onOk?:(pageId?:string)=>void
}

export type  AddEntityRefProps = {
  init: () => void
}


const AddEntity = forwardRef<AddEntityRefProps,AddEntityProps>(({onOk}, ref) => {
  useImperativeHandle(
    ref,
    ():AddEntityRefProps => {
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
          const data = await saveLocalEntity({ ...values,appId})
          setOpen(false);
          message.success('新增实体成功')
          onOk?.(data)
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
      title='新建本地实体'
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
          label="实体名称"
          name="displayName"
          rules={[
            { required: true, message: '请输入实体名称' },
            { type:"string", max:20}
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="实体描述"
          name="description"
          rules={[
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

export default AddEntity