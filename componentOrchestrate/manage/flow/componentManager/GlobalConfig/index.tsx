import { GlobalInProperty } from "../components/AmisProperty/GlobalIn";
import { useState, useEffect } from "react";
import {  Button, Form, Input, Table, Upload, message } from "antd";
const { TextArea } = Input;
import type { ColumnsType } from 'antd/es/table';
import styles from './index.less';
import { ConnectState } from '@/models/connect';
import { useDispatch, useSelector } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
import { NodeData } from '@/@types/orchestrate';
import { Col, Row } from 'antd';
import Drawer  from '@/pages/componentOrchestrate/manage/flow/component/drawer';
interface Props {
  open: boolean,
  onCancel: () => void,
}
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 24 },
};
interface DataType {
  title: string;
  name: string;
  value: string;
}
import {
  MinusCircleOutlined

} from '@ant-design/icons';


import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { useAppId, useCurrentValue } from "@/pages/componentOrchestrate/hooks";
// import { Define } from "@/pages/componentOrchestrate/AmisPropertyDefine";
import { GlobalInDefine } from "@/pages/componentOrchestrate/GlobalInDefine";;
const beforeUpload = (file: RcFile) => {
  const isJpgOrPng = ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)
  if (!isJpgOrPng) {
    message.error('只允许上传 JPG/PNG的图片!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('图片必须小于2MB!');
  }
  return isJpgOrPng && isLt2M;
};
const globalConfig = (Props: Props, ref: any) => {
  const globalConfigList = useSelector(({ orchestrate: { globalConfigList } }: ConnectState) => globalConfigList)
  const nodes = useSelector(({ orchestrate: { nodes } }: ConnectState) => nodes)
  const componentInfo = useSelector(({ orchestrate: { componentInfo } }: ConnectState) => componentInfo)
  const dispatch = useDispatch()
  const appId = useAppId()
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState<string>();

  const currentImg = useCurrentValue(imageUrl)

  console.log('componentInfo', componentInfo)

  useEffect(() => {
    const { title, description, icon } = componentInfo
    form.setFieldsValue({
      title,
      description
    })
    setImageUrl(icon)
  }, [componentInfo])



  // let jsonSchemaValue = {
  //   "type": "object", "title": "全局输入参数",
  //   "properties": {}
  // }

  // globalConfigList.forEach((element: any) => {
  //   console.debug('配置清单', element)

  //   // if (element.key) {
  //   //   jsonSchemaValue['properties'][element.key] = element;
  //   // }

  // });

  // console.log('jsonSchemaValue', jsonSchemaValue)



  useEffect(() => {
    var global = GlobalInDefine.getGlobalInWithIndex(globalConfigList);
    setData(global)
  }, [JSON.stringify(globalConfigList)]);
  var { open, onCancel } = Props
  const originData: DataType[] = [];

  const [data, setData] = useState(originData);


  const setDataValue = (value: any, index: any, key: any) => {
    setData((prevState: any) => GlobalInDefine.update(prevState, value, index, key));
  }


  const columns: ColumnsType<DataType> = [

    {
      title: '',
      dataIndex: 'btn',
      key: 'btn',
      render: (text, record, index) => {
        return (
          <MinusCircleOutlined style={{ fontSize: '10px', color: 'red' }} onClick={e => {
            setData((prevState: any) => {
              prevState.splice(index, 1);
              return [...prevState];
            });
          }} />
        );
      }
    },
    {
      title: '显示名称',
      dataIndex: 'title',
      key: 'title',
      render: (text, record, index) => {
        return (
          <div>
            <Input value={text} onChange={e => {
              setData((prevState: any) => {
                prevState[index].title = e.target.value
                return [...prevState];
              });
            }} />
          </div>
        );
      }
    },
    {
      title: '字段名称',
      dataIndex: 'name',
      key: 'name',
      render: (text, record, index) => {
        return (
          <div>
            <Input value={text} onChange={e => {
              setData((prevState: any) => {
                prevState[index].name = e.target.value
                return [...prevState];
              });
            }} />
          </div>
        );
      }
    },
    {
      title: '示例值',
      dataIndex: 'sample',
      width: 160,

      key: 'sample',
      render: (text, record, index) => {
        return (
          <Row>
            <Col span={22}>
              <Input value={text} onChange={e => {
                setData((prevState: any) => {

                  let some = { ...prevState[index] }
                  some.sample = e.target.value
                  prevState[index] = some;
                  return [...prevState];
                });
              }} />

            </Col>
            <Col span={2}><GlobalInProperty valueKey='sample' title='示例值' dynamic={record} inputClick={(value: any) => setDataValue(value, index, 'sample')}></GlobalInProperty></Col>
          </Row>

        );
      }
    },
    {
      title: '默认值',
      dataIndex: 'default',
      key: 'default',
      render: (text, record, index) => {
        return (
          <Row>
            <Col span={22}>
              <Input value={text} onChange={e => {
                setData((prevState: any) => {
                  prevState[index].default = e.target.value
                  return [...prevState];
                });
              }} />

            </Col>
            <Col span={2}><GlobalInProperty valueKey='default' title='默认值' dynamic={record} inputClick={(value: any) => setDataValue(value, index, 'default')}></GlobalInProperty></Col>
          </Row>
        );
      }
    },
  ];

  const save = async () => {
    try {
      const values = await form.validateFields();
      var global = GlobalInDefine.getGlobalInWithName(data);


      dispatch({
        type: 'orchestrate/updateGlobalConfigList',
        payload: [...global]
      })
      const { title, description } = values
      dispatch({
        type: 'orchestrate/setComponentInfo',
        payload: {
          title,
          description,
          icon: currentImg.current
        }
      })
      dispatch({
        type: 'orchestrate/saveNodes',
        resolve: (data: any) => {
          console.debug(data);
          if (data.msg && data.msg.indexOf('注意') > 0) {
            message.success(data.msg);
          }
        }
      })
      onCancel()
      nodes.forEach((nodeObj: NodeData) => {
        var {
          input: { properties: propertiesInp = {} } = {}
        } = nodeObj
        for (const key in propertiesInp) {
          var { value: arr = [] } = propertiesInp[key] || {}
          var value: any = []
          arr?.forEach((a: any) => {
            var { key, title, parentKey } = a
            if (parentKey === 'in') {
              title = global.find((item: any) => item.key === key)?.title
            }
            value.push({
              key, title, parentKey
            })
          })
          propertiesInp[key].value = value
        }
      });
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  const stopEvent = (e: { stopPropagation: () => void; }) => {
    e.stopPropagation()
  }

  const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      const { status, msg, data } = info.file.response
      if (status !== 0) {
        message.error(`上传失败:${msg}`)
        setImageUrl('')
        return
      }
      const url = data.url
      message.success('上传成功!')
      setImageUrl(url)
    }
  };
  return (
    <>
      <div onClick={stopEvent}>
        <Drawer placement="right" onClose={onCancel} open={open}

          headerStyle={{ 'display': 'none' }}
          className={styles['global-config']}
        >
          <div className={styles['drawer-wrapper']}>
            <div className={styles['title']}>
              <span>组件设置</span>
            </div>
            <div className={styles['content']}>
              <div className={styles['content-form']}>
                <div className={styles['fieldset']}>
                  <span className={styles['fieldset-line']}></span>
                  <span className={styles['fieldset-text']}>基本信息</span>
                </div>
                <Form {...layout} form={form} name="control-hooks" layout="vertical" >
                  <Form.Item valuePropName="fileList" label="组件图标" rules={[{ required: true }]}>
                    <Upload
                      listType="picture-card"
                      data={{
                        app_id: appId,
                      }}
                      className="avatar-uploader"
                      showUploadList={false}
                      action="/api/component/execute?component=eg_fd98_file_plugin&actionName=eg_engine_upload"
                      beforeUpload={beforeUpload}
                      onChange={handleChange}
                    >
                      {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> :
                        <div>
                          <PlusOutlined />
                          <div style={{ marginTop: 8 }}>上传图片</div>
                        </div>
                      }
                    </Upload>
                  </Form.Item>
                  <Form.Item name="title" label="组件名" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="description" label="组件描述" rules={[{ required: true }]}>
                    <TextArea showCount maxLength={500} />
                  </Form.Item>

                </Form>

                <div className={styles['fieldset']}>
                  <span className={styles['fieldset-line']}></span>
                  <span className={styles['fieldset-text']}>全局输入参数信息</span>
                </div>

                <Table columns={columns} dataSource={data} pagination={false} />

                <div style={{ margin: 8 }}>注意：删除或调整参数名称后，节点中的引用需重新绑定</div>
              </div>
            </div>
            <div className={styles['footer']}>
              <Button type="primary" onClick={save}>保存</Button>
            </div>
          </div>
        </Drawer>
      </div>
    </>
  )
}

export default globalConfig
