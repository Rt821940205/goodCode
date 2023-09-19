import React from 'react'
import { Card } from 'antd'
import styles from './index.less'
import { Button } from 'antd'

import { Car } from '@/@types/orchestrate';

const CardBox: React.FC<Car> = (Props) => {
  var { id, title, description, properties, im, out, selectComp, highlight, isConfig, isDefault, editModalConfig } = Props
  // var { id, title, description, properties, im, out, selectComp, highlight, isConfig, editModalConfig} = Props
  // var id={id} title={title} description={description} im={im} out={out} 
  const edit = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation()
    editModalConfig && editModalConfig({ id, title, "x-component-id": '', description, properties })
  }
  return (
    <Card className={`${styles['card-box']} ${highlight === id ? styles['card-box-highlight'] : ''}`} onClick={() => selectComp({ id, title, description, properties, im, out })}>
      <div className={styles['card-content']}>

        <div className={styles['card-content-title']}>
         
        { isDefault && <span className={styles['card-content-default']}>[默认]</span>}
          {title}
        </div>
        <div className={styles['card-content-description']}>
          {description}
        </div>
      </div>
      {
        isConfig && id != "0" && <div>
          <Button type="link" onClick={(e) => edit(e)}>编辑</Button>
        </div>
      }
    </Card>
  )
}


export default CardBox