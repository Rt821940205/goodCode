import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import styles from './index.less'
import SvgIcon from '@/components/svgIcon'
import { Form, Button, Col, Row, Switch, Tooltip, Popconfirm, message, Typography } from "antd";
import { NodeData, CheckObj, DynamicFormFour } from '@/@types/orchestrate';
import { useDispatch, useSelector } from 'umi';
import { ConnectState } from '@/models/connect';
import { CustomInput } from '../../components/CustomInput'
import { testView, queryResponseResult, paramResult } from '@/services/xuanwu/orcherate'
import { useAppId } from '@/pages/componentOrchestrate/hooks'
import GlobalConfig from '../../GlobalConfig';
const { Text, } = Typography;



import { render as renderAmis } from '@fex/amis';

interface Props {
  onChangeNode: (nodeObj: NodeData) => void,
  showModal: (dynamic: DynamicFormFour | undefined) => void,
  onCancel: () => void,
  isMessageChange: (bool: boolean) => void
}

const StepFour = (Props: Props, ref: any) => {
  useImperativeHandle(ref, () => ({
    getDynamicForm: () => {
      return dynamicForm
    },
    getActiveNode: () => {
      return activeNode
    },
    onSave: (isChangeRef: any) => {
      console.debug('第四步变量设置，保存数据', onSave, isChangeRef)
      return onSave(isChangeRef)
    },
    dynamicClick: (checkObj: CheckObj) => {
      return dynamicClick(checkObj)
    }
  }));
  const globalConfigList = useSelector(({ orchestrate: { globalConfigList } }: ConnectState) => globalConfigList)
  const nodes = useSelector(({ orchestrate: { nodes } }: ConnectState) => nodes)
  const activeNode = useSelector(({ orchestrate: { activeNode } }: ConnectState) => activeNode)
  const superVariable = useSelector(({ orchestrate: { superVariable } }: ConnectState) => superVariable)
  const componentInfo = useSelector(({ orchestrate: { componentInfo } }: ConnectState) => componentInfo)
  const appId = useAppId()
  var { onChangeNode, showModal, onCancel, isMessageChange } = Props
  const [messageApi, contextHolder] = message.useMessage();
  const [dynamicForm, setDynamicForm] = useState<DynamicFormFour[]>([])
  const dispatch = useDispatch()
  const [debugLoading, setDebugLoading] = useState('')  // 回显配置参数
  useEffect(() => {
    var {
      input: { properties: propertiesInp = {}, required = [] } = {},
      output: { properties: propertiesOut = {} } = {},
    } = activeNode
    var list: DynamicFormFour[] = []
    Object.keys(propertiesInp).forEach((key) => {
      var { type, enum: enumList, value } = propertiesInp[key]
      list.push({
        ...propertiesInp[key],
        key: key,
        // value: ( type ==='string' && !enumList) ? (value || []) : value,
        value: value || [],
        required: required.includes(key)
      })
    })
    setDynamicForm(list)
    setIsResult(false)
    setIsSkip(false)
    setResultContent('')
    setResultResponse('')
    setResultParam('')
    if (propertiesOut?.dataId) {
      setIsResult(true)
      setIsSkip(false)
      setResultContent('接收成功')
      queryResponseResult({ dataId: propertiesOut?.dataId, app_id: appId }).then((res) => {
        setResultResponse(JSON.stringify(res?.result))
        setResultParam(JSON.stringify(res?.formData))
      })
    } else if (propertiesOut?.isSkip) {
      setIsResult(true)
      setIsSkip(true)
      setResultContent('')
      setResultResponse('')
      setResultParam('')
    }
  }, [activeNode])
  const [form] = Form.useForm();
  const test = async () => {
    try {
      await form.validateFields();
      return true
    } catch (errorInfo) {
      return false
    }
  }
  const [key, setKey] = useState('')
  const [currentKey, setCurrentKey] = useState('')



  const onVariable = (key: string) => {
    if (key) {
      setCurrentKey(key);
      var dynamic = dynamicForm.find((item: DynamicFormFour) => item.key === key)
      console.debug('找到要绑定的变量', dynamic)
      setKey(key)
      showModal(dynamic)
    }
  }
  const initDynamic = () => {
    setDynamicForm((prevState) => {
      var initialValues = {};
      prevState.forEach((item: DynamicFormFour) => {
        item.value = (item.value || []).map((item: any) => {
          var { parentKey } = item
          var serialNumber = ""
          if (parentKey === 'in') {
            serialNumber = "全局输入"
          } else if (parentKey === 'static') {
            serialNumber = ""
          } else {
            serialNumber = superVariable.findIndex((item: any) => item.key === parentKey)
            if (serialNumber != undefined) {
              serialNumber = serialNumber + 1
            } else {
              serialNumber = ''
            }
          }
          return { ...item, serialNumber }
        })
        initialValues[item.key as string] = [...item.value]
      })

      setTimeout(() => {
        form.setFieldsValue(initialValues)
      })
      return [...prevState];
    })


  }
  const dynamicClick = (checkObj: CheckObj) => {
    const old = form.getFieldValue(key)
    var { parentKey } = checkObj
    var serialNumber = "全局输入"
    if (parentKey != 'in') {
      serialNumber = superVariable.findIndex((item: any) => item.key === parentKey)
      if (serialNumber != undefined) {
        serialNumber = serialNumber + 1
      } else {
        serialNumber = ''
      }
    }
    form.setFieldsValue({
      [key]: [...old || [], { ...checkObj, serialNumber }]
    })
  }
  useEffect(() => {
    setKey('')
    initDynamic()
  }, [superVariable.length, activeNode])


  const turnMap = () => {
    let properties = {}
    dynamicForm.forEach((df: DynamicFormFour) => {
      var { title, key, type } = df
      var value = form.getFieldValue(key as string)
      value = value.map((item: any) => {
        var { key, title, parentKey } = item
        return {
          node: parentKey,
          key,
          title,
          parentKey
        }
      })
      properties[key as string] = {
        ...df,
        title,
        type,
        value,
      }
    })
    return properties
  }
  const paramSave = async () => {
    if (await test()) {
      let properties = turnMap()
      activeNode.input = {
        ...activeNode.input,
        ...{
          properties: { ...properties }
        }
      }
      return true
    } else {
      return false
    }
  }
  const [isResult, setIsResult] = useState(false)
  const [outDataId, setOutDataId] = useState('')
  const [resultContent, setResultContent] = useState('')
  const [resultResponse, setResultResponse] = useState('')
  const [resultParam, setResultParam] = useState('')

  const [isSkip, setIsSkip] = useState(false)
  const popconfirmClcik = () => {
    setIsResult(true)
    setIsSkip(true)
    setResultContent('')
    setResultResponse('')
  };
  const [globalSetting, setGlobalSetting] = useState<boolean>(false)
  const testPreview = async () => {
    if (!await paramSave()) {
      return
    }
    var bool = globalConfigList?.some((item: DynamicFormFour, index: number) => {
      return !item.sample && item.required
    })
    if (bool) {
      messageApi.open({
        type: 'warning',
        content: '请先在全局输入填写示例值',
      })
      setGlobalSetting(true)
    } else {
      let propertiesInp = turnMap()
      setTimeout(() => {
        dispatch({
          type: 'orchestrate/testNodes',
          resolve: (data: any) => {
            setResultParam(JSON.stringify(data?.formData))
          },
          api: paramResult,
          propertiesInp,
        })
      }, 0)


      setTimeout(() => {
        setDebugLoading("测试中，请稍候");
        dispatch({
          type: 'orchestrate/testNodes',
          resolve: (data: any) => {
            setDebugLoading('');
            setIsResult(true)
            setOutDataId(data?.dataId)
            setIsSkip(false)
            setResultContent('接收成功')
            setResultResponse(JSON.stringify(data?.result))
            if (data?.formData) {
              setResultParam(JSON.stringify(data?.formData))
            }

          },
          api: testView,
          propertiesInp,
          errorResolve: (error: any) => {
            setDebugLoading('');

            if (typeof error == 'object') {
              message.error(error.msg)
            } else {
              message.error(error)
            }


          }
        })
      }, 0)
    }
  }
  const onSave = async (isChangeRef: any) => {

    console.debug('onSave isChangeRef', isChangeRef)

    if (!await paramSave()) {
      return
    }

    onChangeNode({
      ...activeNode,
      output: {
        ...activeNode.output,
        properties: {
          dataId: outDataId,
          isSkip: isSkip
        }
      },
      isComplete: '1'
    })


    isMessageChange(false);
    onCancel()
  }
  // 字段名和中文切换
  const [checked, setChecked] = useState(true)
  const onChangeSwitch = (checked: boolean) => {
    setChecked(checked)
  };
  var { 'icon': img = '', actionTitle } = activeNode


  let resultParamValue = {};

  try {

    console.debug('resultParam', resultParam)

    if(resultParam && !resultParam['in']){
      resultParamValue = JSON.parse(resultParam || '{}')['in'] || {};
    }
  } catch (e) {
    console.error('载入默认结果参数失败', resultParam, e)
  }

  console.debug('resultParamValue', resultParamValue)


  return (
    <>
      {contextHolder}
      <div className={styles['title']}>
        {img ? <span className={styles['component-img']}>
          <img src={img} alt="" />
        </span> : <SvgIcon iconClass="default-node-choose" style={{ fontSize: '1rem' }}></SvgIcon>}
        <span>
          当 <span className={styles['highlight']}>{actionTitle}</span>
          时 <span className={styles['highlight']}>选择节点变量作为数据输出结果</span>
        </span>
      </div>
      <div className={styles['header-notice']}>
        <div className={styles['description']}>共{dynamicForm.length}项输入参数，请点击输入框输入或绑定</div>
        <div className={styles['switch-wrapper']}>

          <Switch checkedChildren="名称" unCheckedChildren="字段名" defaultChecked onChange={onChangeSwitch} />
          <Tooltip placement="topRight" title="打开开关显示字段中文名称,关闭开关显示字段名,字段名状态下支持编辑">
            <div className={styles['switch-btn-skip']}><span>?</span></div>
          </Tooltip>
        </div>
      </div>
      <div>
        <Form layout="vertical" form={form} name="control-hooks" labelWrap
          onValuesChange={() => {
            console.log('onValuesChange')
            isMessageChange(true)
          }}
        >
          {
            (dynamicForm || []).map((dynamic: any, dynamicIndex: number) => {


              console.log("dynamicForm", dynamicForm);

              var { key, title, type, default: placeholder, enum: enumList, description, required, value } = dynamic



              try {
                if (placeholder != undefined && placeholder != null && typeof placeholder != 'string') {
                  placeholder = JSON.stringify(placeholder);
                }
              } catch (e) {
              }

              // 如果有默认值，可以不传参数
              if (placeholder && placeholder != '') {
                required = false;
              }
              let isDeprecated = title && title.indexOf('弃用') >= 0;
              let formItem = <CustomInput dynamic={dynamic} placeholder={placeholder} inputClick={() => onVariable(key as string)} checked={checked}></CustomInput>
              return isDeprecated ? ('') : (
                <Form.Item name={key as string}
                  label={key == currentKey && title != description ? (<>
                    <Text ellipsis={{
                      tooltip: <div>
                        <div>描述: {description}</div>
                        <div>字段: {key}</div>
                      </div>
                    }}>
                      <Text>{title} </Text>
                      <Text type="secondary"> {description}</Text>
                    </Text>

                  </>) :

                    <Text>
                      {title}
                    </Text>

                  }
                  tooltip={{
                    title:
                      <div>
                        <div>描述: {description}</div>
                        <div>字段: {key}</div>
                      </div>
                  }}
                  // extra={ key == currentKey && title != description ? description:' '}
                  rules={[{ required: required }]} key={key}>
                  {formItem}


                </Form.Item>
              )
            })
          }
          <Row className={styles['sample-test']}>
            <Col span={24} className={styles['sample-label']}> <span className={styles['red']}>*</span> 样本测试</Col>
            <Col span={24} className={styles['sample-box']}>
              <div className={styles['sample-sub']}>为验证流程完整性，并获取样本数据，请点击【测试并预览】</div>
              <div className={styles['sample-variable']}>



                <div className={styles['sample-param']}>入参</div>
                <div className={styles['sample-data']}>

                  {






                    resultParam ?


                      renderAmis({
                        "type": "json",
                        "name": "json",
                        "levelExpand": 1,
                        "value": resultParamValue

                      })

                      : "-"
                  }
                </div>
              </div>
              <div className={styles['sample-btn']}>
                <Button type="primary" onClick={testPreview} loading={debugLoading != ''}>{debugLoading == '' ? '测试并预览' : debugLoading}</Button>
                <div className={styles['sample-btn-skip']}>
                  <Popconfirm
                    placement="leftTop"
                    title={
                      <div>
                        <div>您将跳过测试，可能影响：</div>
                        <div>1、无法验证的配置有效性，方案运行时可能出错；</div>
                        <div>2、无法获取真实的业务数据，后续节点无法引用。</div>
                      </div>
                    }
                    onConfirm={popconfirmClcik}
                    okText="跳过测试"
                    cancelText="取消"
                    className={styles['sample-btn-popconfirm']}
                  >
                    跳过
                    <Tooltip placement="topRight" title="测试并预览可帮助您检测节点执行情况，并获取真实的业务数据供后续节点引用。跳过测试并预览，可能导致方案运行时失败。">
                      <span className={styles['sample-btn-question']}>?</span>
                    </Tooltip>
                  </Popconfirm>
                </div>


              </div>
            </Col>
            {
              !isResult ? '' : !isSkip ?
                <Col span={24} className={styles['sample-box']}>
                  <div className={`${styles['sample-response']} ${styles.succee}`}> {resultContent} </div>
                  <div className={styles['sample-sub']}>请输入或补充结果,用于测试入参结果</div>
                  <div className={styles['sample-variable']}>
                    <div className={styles['sample-param']}>结果</div>
                    <div className={styles['sample-data']}>


                      {
                        renderAmis({
                          "type": "json",
                          "name": "json",
                          "levelExpand": 1,
                          "value": JSON.parse(resultResponse || '{}')

                        })
                      }

                      {/* <AmisRenderer schema={
                          {
                            "type": "page",
                            "body": [
                              {
                                "type": "json",
                                "name": "json",
                                "value": resultResponse
                              }
                            ]
                          }
                        } /> */}
                    </div>
                  </div>
                </Col>
                :
                <Col span={24} className={styles['sample-box-skip']}>
                  <div className={styles['sample-h3']}> 跳过测试步骤</div>
                  <div>您将跳过测试，可能影响：</div>
                  <div>1、无法验证的配置有效性，方案运行时可能出错；</div>
                  <div>2、无法获取真实的业务数据，后续节点无法引用。</div>
                  <div>建议通过【测试并预览】检测业务执行情况。</div>
                </Col>
            }

          </Row>
        </Form>
        <div className={styles['footer']}>
          <Button type="primary" onClick={onSave}>保存</Button>
        </div>
      </div>

      {/* 全局输入 */}
      <GlobalConfig
        open={globalSetting}
        onCancel={() => setGlobalSetting(false)}
      />
    </>
  )
}

export default forwardRef(StepFour)
