
import React, { useState, useEffect }from "react";
import { Form, Input, Button, Select } from "antd";
import styles from './index.less'
import SvgIcon from '@/components/svgIcon'
import { IfConditionItem,NodeData} from '@/@types/orchestrate'
import {DeleteOutlined} from '@ant-design/icons';
import { useSelector } from "umi";
import { ConnectState } from '@/models/connect';
import { generateIfNodeConfig } from "../../util";
import { CustomInput } from "../components/CustomInput";
import VariableModal from "../components/VariableModal";
import { CheckObj } from '@/@types/orchestrate';
import conditionList from './list'
import { COMPLETE } from '@/pages/componentOrchestrate/const';
import Drawer  from '@/pages/componentOrchestrate/manage/flow/component/drawer';
const { Option } = Select;
type ConditionItem = Pick<IfConditionItem, 'operator'|'value'|'query'>
type FormValues = {
  items:ConditionItem[][]
}
interface Props {
  open: boolean,
  onCancel: () => void,
  svg: string,
  onChange?:(data:NodeData)=>void
}
const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 },
};


const createItem = ():ConditionItem => {
  return {
    operator: '',
    value: '',
    query: [
      // {
      //   key: "body",
      //   parentKey: "in",
      //   serialNumber: "全局配置",
      //   title: "邮件内容",
      // }
    ]
  }
}
const execute: React.FC<Props> = ({ open, onCancel, svg,onChange }) => {
  const [form] = Form.useForm();

  const activeNode: NodeData = useSelector(({ orchestrate: { activeNode } }: ConnectState) => activeNode)
  const { nodeId: activeNodeId, nodeType: activeNodeType} = activeNode || {};
  let nodeChoosed: boolean = !!activeNodeId;
  useEffect(() => {
    const conditionItems: IfConditionItem[][] = activeNode?.nodeConfig?.properties?.if?.items || []
    let items:ConditionItem[][] = conditionItems.map(i => {
      return i.map(({query,value,operator}) => {
        console.log(query,value,operator)
        return {
          operator,
          value,
          // query:(query || []).map(i=>i.key).join(',')
          query
        }
      })
    })
    form.setFieldValue('items',items.length ? items:[[createItem()]])
  },[activeNode])

  const onSave = async ()=>{
    try {
      const values: FormValues = await form.validateFields();
      let conditions = values.items
      const formatConditions = conditions.map(item => {
        return item.map(({ query, operator,value }) => {
          const operatorItem = conditionList.find(i => i.value === operator) || {label:'',value:""}
          return {
            uiData: {
              operator: operatorItem
            },
            operator,
            value,
            valueType: 'string',
            query
          }
        })
      })
      const newNode: NodeData = {
        ...activeNode,
        nodeConfig: generateIfNodeConfig(formatConditions),
        isComplete:COMPLETE
      }
      onChange?.(newNode)
      onCancel()
      console.log('Success:', formatConditions);
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  const filterEmpty = () => {
    const items:ConditionItem[][] = form.getFieldValue('items') || []
    const notEmptyItems:ConditionItem[][] = items.filter((i) => i.length)
    if (notEmptyItems.length < items.length) {
      form.setFieldValue('items',notEmptyItems)
    }
  }
  const superVariable = useSelector(({ orchestrate: { superVariable } }: ConnectState) => superVariable)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const [field, setField]= useState<string | number>('')
  const [field2, setField2] = useState<string | number>('')
  const variableClick = (checkObj: CheckObj)=>{
    var { parentKey } = checkObj
    var serialNumber = "全局配置"
    if(parentKey != 'in'){
      serialNumber = superVariable.findIndex((item:any)=>item.key ===parentKey) 
      if(serialNumber !=undefined){
        serialNumber = serialNumber + 1
      }else {
        serialNumber = ''
      }
    }
    var notEmptyItems= form.getFieldValue(['items'])
    notEmptyItems[field][field2].query = [...notEmptyItems[field][field2]?.query,{...checkObj, serialNumber}]
    // form.setFieldValue('items',notEmptyItems)
    form.setFieldValue('items',notEmptyItems)
  }
  const onVariable = (field: string | number,field2: string| number )=> {
    setField(field)
    setField2(field2)
    setIsModalOpen(true);
  }
  // 条件
  return (
    <>
      <Drawer placement="right" onClose={onCancel} open={open} 
        mask={false}
        headerStyle={ {'display': 'none'} } 
        className={styles['execute']}
       >
        <div className={styles['drawer-wrapper']}>
          <div className={styles['title']}>
          <SvgIcon iconClass={svg}></SvgIcon> <span>执行条件</span>
          </div>
          <div className={styles['content']}>
            <div className={styles['sub-title']}><span className={styles['red']}>*</span> 当满足以下条件时执行操作</div>
            <div className={styles['content-form']}>
              <Form {...layout} form={form} name="control-hooks">
                <Form.List name={ ['items']}>
                  {
                    (fields, { add:addOr }) => {
                      return fields.map((field, index) => {
                        return (
                          <div key={index+'index'} className={styles['chunk-wrapper']}>
                            <div className={ index==0 ? styles['no-or']: styles['or']} > 
                              <span className={styles['line']}></span>  <span>或</span> <span className={styles['line']}></span>  
                            </div>
                            <div className={styles['chunk-also']}>
                              {
                                <Form.List name={field.name}>
                                  {
                                    (fields2,{add:addAlso,remove}) => {
                                      return fields2.map((field2,alsoIndex) => {
                                        return  <div key={alsoIndex+'alsoIndex'} className={styles['chunk-box']}>
                                        <div className={alsoIndex==0 ? styles['no-interval']: styles['interval']} > <span>且</span> </div>
                                        <div className={styles['chunk']}>
                                          {
                                              fields.length === 1 &&  fields2.length === 1 ? null:
                                              <div className={styles['delete-icon']}>
                                                  <DeleteOutlined onClick={() => {
                                                    remove(field2.name);
                                                    filterEmpty()
                                                  }} />
                                  
                                              </div>
                                          }
                                          <Form.Item name={[field2.name,'query']} label="变量名" rules={[{ required: true }]}>
                                            <CustomInput 
                                              inputClick={()=>onVariable(field.name,field2.name)}
                                            ></CustomInput>
                                          </Form.Item>
                                          <Form.Item name={[field2.name,'operator']} label="条件" rules={[{ required: true }]}>
                                          <Select allowClear>
                                            {
                                              conditionList.map((cl)=>{
                                                return (
                                                  <Option
                                                    value={cl.value}
                                                    label={cl.label}
                                                    key={cl.value}>
                                                    {cl.label}
                                                  </Option> 
                                                )
                                              })
                                            }
                                          </Select>
                                          </Form.Item>
                                          <Form.Item name={[field2.name,'value']} label="值" >
                                            <Input />
                                          </Form.Item>
                                            
                                          <Form.Item label="" className={styles['add-also']}>
                                              <Button
                                                type="link"
                                                onClick={()=>addAlso(createItem()) }>
                                                ＋新增且
                                              </Button>
                                          </Form.Item>
                                        </div>
                                      </div>
                                      })
                                    }
                                  }
                                </Form.List>
                              }
                            </div>
                            <div className={styles['add-or']}>
                              <Button type="link" onClick={() => addOr([createItem()])}>＋新增或</Button>
                            </div>
                          </div>
                        )
                      })
                    }
                  }
                 </Form.List>
              </Form>
            </div>
          </div>

          <div className={styles['footer']}>
            <Button type="primary" onClick={onSave}>保存</Button>
          </div>
        </div>
      </Drawer>
      <VariableModal 
          isModalOpen={nodeChoosed && isModalOpen && activeNodeType === 'if'}
          onCancel={handleCancel}
          variableClick={variableClick}
        isFastBind={false}
        style={{right:'32rem'}}
        ></VariableModal>
      
    </>
  )
}

export default execute