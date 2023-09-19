import React from 'react'
import ModuleList from './moduleList';
import Canvas from './canvas';
import styles from './index.less';

const Magic: React.FC = () => {

  return (
    <div className={styles.wrapper}>
      <ModuleList />
      <Canvas/>
    </div>
  )
}

export default Magic