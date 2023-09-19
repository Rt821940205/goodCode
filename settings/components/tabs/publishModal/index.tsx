import {useState,forwardRef,useImperativeHandle, useEffect} from 'react'
import { Modal, Form, Select, message} from 'antd';
import { queryPublishList,queryIdsByPublish,publish} from '@/services/xuanwu/magic';
import { useSelector } from 'umi';
import {ConnectState} from '@/models/connect';
import { useAppId } from '@/pages/settings/hooks';
type FormValues = {
  ids:string[],
}

type PublishModalProps = {
  onOk?:()=>void
}

export type  PublishModalRefProps = {
  init: () => void
}

type ModuleItem = {
  mc: string,
  id:string
}

const PublishModal = forwardRef<PublishModalRefProps,PublishModalProps>((_, ref) => {
  const appId = useAppId()
  const { app_name } = useSelector(({ magic: { appInfo } }: ConnectState) => appInfo)
  
  useImperativeHandle(
    ref,
    ():PublishModalRefProps => {
      return {
        init() {
          form.resetFields();
          setOpen(true)
          queryIdsByPublish({ appId })
            .then((data) => {
            const ids = data?.find_custom_xmkjhyydzjb?.map((item:any) => {
              return item.xmkjid
            });
            form.setFieldsValue({
              ids
            })
          })
        }
      }
    },
  )

  const [form] = Form.useForm();

  const [open, setOpen] = useState(false)

  const [confirmLoading, setConfirmLoading] = useState(false)


  const handleOk = () => {
    form.validateFields()
      .then(async (values: Required<FormValues>) => {
        setConfirmLoading(true)
        try {
          let { ids } = values
          await publish(ids,{appId,app_name})
          setOpen(false);
          message.success('发布成功')
          window.location.href = '/app/manage/list';
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

  
  const [options, setOptions] = useState<ModuleItem[]>([])

  useEffect(() => {
    (async () => {  
      const data = await queryPublishList()
      const list = data?.find_custom_xmkj || []
      setOptions(list)
    })()
  }, [])




  return (
    <Modal
      title='发布'
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
          label="应用发布"
          name="ids"
          rules={[{ required: true, message: '请选择' }]}
        >
          <Select
            placeholder='请选择'
            mode="multiple"
            fieldNames={{ label: "mc", value: "id" }}
            options={options}
          >
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
})

export default PublishModal