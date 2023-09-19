import {useState,forwardRef,useImperativeHandle, useEffect, useRef} from 'react'
import { Modal, Form, Select, message} from 'antd';
import { queryModules,createPageByModule ,createFlowXML} from '@/services/xuanwu/magic';
import { useAppId } from '@/pages/componentOrchestrate/hooks';
import { type ListItem } from '../index';
import {createProgressPage,createDispatchPage,createFullFillPage,createProgressPageByShop,createDispatchPageByShop,createFullFillPageByShop} from './template';
import { getUUID } from '@/utils';
import { NodeType, Visible } from '@/@types/magic';
import { useDispatch } from 'umi';
import {  MenuType } from '@/@types/magic';

type FormValues = {
  module_id: string,
}

type ChooseModuleProps = {
  dataType:MenuType.MAGIC | MenuType.WORKSHOP ,
  onOk?:()=>void
}

export type  ChooseModuleRefProps = {
  init: (item: ListItem) => void
}

type ModuleItem = {
  app_id: string,
  module_name: string,
  id:string
}

const ChooseModule = forwardRef<ChooseModuleRefProps,ChooseModuleProps>(({onOk,dataType}, ref) => {
  const curItemRef = useRef<ListItem | {}>({current:{}})
 
  const dispatch = useDispatch()

  useImperativeHandle(
    ref,
    ():ChooseModuleRefProps => {
      return {
        init(item) {
          form.resetFields();
          curItemRef.current = { ...item }
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
      .then(async (values: Required<FormValues>) => {
        setConfirmLoading(true)
        const {module_id} = values
        try {
          const item = curItemRef.current as ListItem
          const {applicationname} = item
          const defaultParams = {
            app_id:appId,
            module_id,
            parent_id:module_id,
            hide: Visible.HIDE,
            node_type:NodeType.PAGE
          }
          
          const processUuid = getUUID()
          const processKey = `Process-${appId}-${processUuid}`
          
          const isWorkShopType = dataType === MenuType.WORKSHOP

          const processId = await createPageByModule({
            ...defaultParams,
            parent_id:module_id,
            page_name: `${applicationname}-进度页面`,
            hide: Visible.SHOW,
            body: JSON.stringify(
              isWorkShopType ? createProgressPageByShop(item, processKey):createProgressPage(item, processKey)
            )
          })
   
          const flowId = await createPageByModule({
            ...defaultParams,
            parent_id: processId,
            page_name: `${applicationname}-落实流程`,
            node_type: NodeType.FLOW,
            body:processKey
          })

          
          const dispatchId = await createPageByModule({
            ...defaultParams,
            parent_id:flowId,
            page_name: `${applicationname}-下发页面`,
            body: JSON.stringify(
              isWorkShopType ? createDispatchPageByShop(item):createDispatchPage(item)
            )
          })


          const fullFillId = await createPageByModule({
            ...defaultParams,
            parent_id:dispatchId,
            page_name: `${applicationname}-落实页面`,
            body: JSON.stringify(
              isWorkShopType ? createFullFillPageByShop(item):createFullFillPage(item)
            )
          })
         
          await createFlowXML(processUuid,{
            appId,
            appName:applicationname,
            processKey,
            dispatchId,
            fullFillId,
          })
         
          setOpen(false);
          message.success('模块选择成功')
          
          dispatch({
            type: 'magic/setRefreshCanvas',
            payload:true
          })

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
      title='选择模块'
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
      </Form>
    </Modal>
  )
})

export default ChooseModule