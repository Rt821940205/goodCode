import {useState,forwardRef,useImperativeHandle} from 'react'
import { Modal, Form, Input ,message} from 'antd';
import { renamePage} from '@/services/xuanwu/magic';
import { useDispatch } from 'umi';


type FormValues = {
  id:string,
  page_name: string,
}
type RenamePageProps = {
  onOk?:(pageId?:string)=>void
}


export type  RenamePageRefProps = {
  init: (values: FormValues) => void
}


const RenamePage = forwardRef<RenamePageRefProps,RenamePageProps>(({onOk}, ref) => {

  useImperativeHandle(
    ref,
  
    ():RenamePageRefProps => {
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

  const dispatch = useDispatch()

  const clearType = () => {
    dispatch({
      type: 'magic/setShowAddPage',
      payload: {}
    });
    setOpen(false);
  };

  const handleOk = () => {
    form.validateFields()
      .then(async (values: Required<FormValues>) => {
        setConfirmLoading(true)
        try {
          await renamePage({ ...values })
          clearType();
          message.success('重命名成功')
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
    clearType();
  };


  return (
    <Modal
      title='重命名页面'
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
          label="页面名称"
          name="page_name"
          rules={[{ required: true, message: '请输入页面名称' }]}
        >
          <Input  placeholder='请输入页面名称'/>
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

export default RenamePage