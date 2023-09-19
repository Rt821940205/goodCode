import React, {  useRef } from 'react'
import Card from '../Card';
import styles from './index.less';
import * as echarts from 'echarts/core';
import {
  TooltipComponent,
  LegendComponent
} from 'echarts/components';
import { PieChart } from 'echarts/charts';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import useEharts from '../../hooks/useEharts'

echarts.use([
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout
]);

const option = {
  color:['#F6C63A','#EB7F66','#7685A2','#73DDB3','#4E7BF2',"#FDA284","#64C5EE"],
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    right: 0,
    top:0,
    itemWidth: 10,
    itemHeight: 10,
    itemGap: 10,
    textStyle: { //图例文字的样式
      fontSize: '1rem'
   },
  },
  series: [
    {
      type: 'pie',
      left: 0,
      top:0,
      radius: '70%',
      startAngle:"180",
      center: ['40%', '50%'],
      labelLine: {
        length2:0,
        lineStyle: {
        }
      },
      label: {
        formatter: '{b}{c}',
        fontSize:'1rem'
      },
      data: [
        { value: 628, name: '人口' },
        { value: 853, name: '禁毒' },
        { value: 430, name: '政保' },
        { value: 274, name: '刑侦' },
        { value: 274, name: '治安' },
        { value: 430, name: '食药环' },
        { value: 430, name: '情指' }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
};
const TypePie: React.FC = () => {
  const ref = useRef(null)
  
  useEharts(ref, option)
  
  return (
    <Card title='任务类型' icon='icon-iconziyuantongji' className={styles.card}>
      <div style={{height:'15.5rem'}} ref={ref}>
      </div>
    </Card>
  )
}

export default TypePie