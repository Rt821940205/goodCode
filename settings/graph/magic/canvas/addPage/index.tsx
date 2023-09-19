import { useState, forwardRef, useImperativeHandle, useEffect } from 'react'
import { Modal, Form, Input, Select, message } from 'antd';
import { queryModules, addPageByModule, addFlowByModule, addFlowXML } from '@/services/xuanwu/magic';
import { useAppId } from '@/pages/componentOrchestrate/hooks';
import { NodeType } from '@/@types/magic';
import { getUUID } from '@/utils'
import { useDispatch } from 'umi';
type FormValues = {
  module_id?: string,
  page_name?: string,
  node_type?: NodeType.FLOW | NodeType.PAGE
  parent_id?: string,
}
type AddPageProps = {
  onOk?: (pageId?: string) => void
}


export type AddPageRefProps = {
  init: (values?: FormValues) => void
}

type ModuleItem = {
  app_id: string,
  module_name: string,
  id: string
}

const AddPage = forwardRef<AddPageRefProps, AddPageProps>(({ onOk }, ref) => {

  const [parentType, setParentType] = useState<'module' | 'page'>('page')

  const [confirmLoading, setConfirmLoading] = useState(false)

  useImperativeHandle(
    ref,
    (): AddPageRefProps => {
      return {
        init(values) {
          form.resetFields();
          setOpen(true)
          const { parent_id } = values || {}
          const parentType = parent_id ? 'page' : 'module'
          setParentType(parentType)
          form.setFieldsValue({
            ...values
          })
        }
      }
    },
  )
  const [form] = Form.useForm();

  const [open, setOpen] = useState(false)

  const appId = useAppId()

  const [moduleOptions, setModuleOptions] = useState<ModuleItem[]>([])

  const dispatch = useDispatch()

  const clearType = () => {
    dispatch({
      type: 'magic/setShowAddPage',
      payload: {}
    });
    setOpen(false);
  };

  useEffect(() => {
    open && (async () => {
      const data = await queryModules({ appId })
      setModuleOptions(data.modules || [])
    })()
  }, [open])



  const add = async (values: Required<FormValues>) => {
    const { node_type, page_name } = values
    setConfirmLoading(true)
    try {
      const params = { appId, ...values }
      if (node_type === NodeType.PAGE) {
        const { create_sys_page_view: pageId } = await addPageByModule(params)
        onOk?.(pageId)
      } else if (node_type === NodeType.FLOW) {
        const processKey = `Process-${appId}-${getUUID()}`
        const { create_sys_page_view: pageId } = await addFlowByModule(processKey, params)
        await addFlowXML(processKey, { page_name })
        onOk?.(pageId)
      }
      clearType();
      message.success('新增页面成功')
    } finally {
      setConfirmLoading(false)
    }
  }

  const handleOk = () => {
    form.validateFields()
      .then((values: Required<FormValues>) => {
        add(values)
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  const handleCancel = () => {
    clearType(false);
  };



  return (
    <Modal
      title='新增页面'
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={confirmLoading}
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
          name="module_id"

          rules={[{ required: true, message: '请选择模块名称' }]}
        >
          <Select
            disabled={parentType === 'page'}
            placeholder='请选择模块名称'
            fieldNames={{ label: "module_name", value: "id" }}
            options={moduleOptions}
          >
          </Select>
        </Form.Item>

        <Form.Item
          label="页面名称"
          name="page_name"
          rules={[{ required: true, message: '请输入页面名称' }]}
        >
          <Input placeholder='请输入页面名称' />
        </Form.Item>

        <Form.Item
          label="页面类型"
          name="node_type"
          rules={[{ required: true, message: '请选择页面类型' }]}
        >
          <Select
            placeholder='请选择页面类型'
            options={[
              {
                label: '普通页面',
                value: NodeType.PAGE
              },
              {
                label: '流程',
                value: NodeType.FLOW
              }
            ]}
          >
          </Select>
        </Form.Item>

        {/* 前面节点的页面id */}
        <Form.Item
          style={{ display: "none" }}
          label="parent_id"
          name="parent_id"
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
})

export default AddPage