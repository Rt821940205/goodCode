import React, { useEffect, useRef } from 'react'
import { Radio, Dropdown, Menu, type MenuProps } from 'antd';
import { ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons';
import styles from './index.less';

const MinPercent = 40;
const MaxPercent = 200;
const menuItems: MenuProps['items'] = [
  {
    key: 200,
    label: '200%',
  },
  {
    key: 150,
    label: '150%',
  },
  {
    key: 100,
    label: '100%',
  },
  {
    key: 80,
    label: '80%',
  },
  {
    key: 50,
    label: '50%',
  },
];

type ScaleOperateProps = {
  percent?: number,
  onChange?: (percent: number) => void,
  containerRef: React.RefObject<HTMLElement>
}
const ScaleOperate: React.FC<ScaleOperateProps> = ({ percent = 100, onChange, containerRef }) => {
  const onMinu = () => {
    onChange?.(Math.max(MinPercent, percent - 10))

  };
  const onPlus = () => {
    onChange?.(Math.min(MaxPercent, percent + 10))
  };
  const onClick: MenuProps['onClick'] = ({ key }) => {
    onChange?.(Number(key))
  };

  const percentRef = useRef(percent)
  useEffect(() => {
    percentRef.current = percent
  }, [percent])

  useEffect(() => {
    if (!containerRef.current) {
      return
    }
    containerRef.current.onmousewheel = (e: MouseEvent) => {
      e.preventDefault()
      let scale = Number(percentRef.current + e.wheelDelta / 120 / 100 * 100);
      if (scale >= MaxPercent) {
        scale = MaxPercent
      } else if (scale <= MinPercent) {
        scale = MinPercent
      }
      onChange?.(parseInt(scale + ''))
    }
    return () => {
      if (!containerRef.current) {
        return
      }
      containerRef.current.onmousewheel = null
    }
  }, [containerRef])

  return (
    <div>
      <Radio.Group value="" className={styles['zoom']}>
        <Radio.Button
          className={styles['zoom-item']}
          onClick={onMinu}
          disabled={percent === MinPercent}
        >
          <ZoomOutOutlined />
        </Radio.Button>
        <Dropdown
          overlay={<Menu onClick={onClick} items={menuItems} />}
          placement="top"
          trigger={['click']}
        >
          <Radio.Button className={styles['zoom-count']}>{`${percent}%`}</Radio.Button>
        </Dropdown>
        <Radio.Button
          className={styles['zoom-item']}
          onClick={onPlus}
          disabled={percent === MaxPercent}
        >
          <ZoomInOutlined />
        </Radio.Button>
      </Radio.Group>
    </div>
  )
}

export default ScaleOperate