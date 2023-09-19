import React from 'react'
import DataList from './dataList';
import ModuleList from './moduleList';
import Canvas from './canvas';
import styles from './index.less';
import { useDataVisible } from '../hooks';

const Magic: React.FC = () => {
  const [magicVisible, workVisible] = useDataVisible()  

  return (
    <div className={styles.wrapper}>
      { (magicVisible || workVisible)  &&  <DataList /> }
      <ModuleList />
      <Canvas/>
    </div>
  )
}

export default Magic