import React, {  useRef } from 'react'
import Card from '../Card'
import { Radio } from 'antd';
import styles from './index.less';
import * as echarts from 'echarts/core';
import { GridComponent } from 'echarts/components';
import { BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import useEChats from '../../hooks/useEharts';
echarts.use([GridComponent, BarChart, CanvasRenderer]);

const getColor = (index = 0) => {

  const rgbString = ['0, 99, 247','238, 172, 100','6, 194, 112']
  
  return new echarts.graphic.LinearGradient(0, 0, 1, 0, [ //这里是渐变的角度，上下左右四个方向
    {
      offset: 0,
      color: `rgb(${rgbString[index]}, 0.2)`//这里是渐变色的起始颜色
    },
    {
      offset: 0.4,
      color: `rgb(${rgbString[index]}, 0.6)`//这里是渐变色的起始颜色
    },
    {
      offset: 1,
      color: `rgb(${rgbString[index]}, 1)`// 这里是渐变色的结束颜色
    }
  ])
}

const option = {
  yAxis: {
    axisTick: {
      show:false
    },
    axisLine: {
      show:false
    },
    axisLabel: {
      fontSize: "1rem",
      color:"#333"
    },
    type: 'category',
    data: ['人口', '禁毒', '政保', '刑侦', '治安', '食药环', '情指'].reverse()
  },
  grid:{ // 让图表占满容器
    top:"0px",
    bottom: "0px",
    left: '55px',
    right:"60px"
  },
  xAxis: {
    type: 'value',
    show:false
  },
  series: [
    {
      data: [
        {
          value: 16,
          itemStyle: {
              color: getColor(0)
          }
        },
        {
          value: 11,
          itemStyle: {
              color: getColor(1)
          }
        },
        {
          value: 11,
          itemStyle: {
              color: getColor(2)
          }
        },
        {
          value: 8,
          itemStyle: {
              color: getColor(0)
          }
        },
        {
          value: 4,
          itemStyle: {
              color: getColor(1)
          }
        },
        {
          value: 2,
          itemStyle: {
              color: getColor(2)
          }
        },
        {
          value: 20,
          itemStyle: {
              color: getColor(0)
          }
        },
      ],
      type: 'bar',
      showBackground: true,
      backgroundStyle: {
        color: 'rgba(180, 180, 180, 0.2)'
      },
      label: {
        show: true,
        position: 'right',
        fontSize:"1rem",
        formatter: '{c}min'
      }
    }
  ]
};
const TimeBar: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null)

  useEChats(ref, option)
  
  return (
    <Card
      title='处理时长'
      icon='tz-handle-time'
      className={styles.card}
      extra={
      <Radio.Group value={1}>
        <Radio value={1}>月</Radio>
        <Radio value={2}>季</Radio>
        <Radio value={3}>年</Radio>
      </Radio.Group>
      }
    >
      <div ref={ref}  style={{height:'15.5rem'}}></div>
    </Card>
  )
}

export default TimeBar