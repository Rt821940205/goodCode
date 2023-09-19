import { Renderer } from '@fex/amis';
import * as React from 'react';

class CustomRenderer extends React.Component {
  render() {
    const { tip } = this.props;
    return (
      <div>
        <input></input>这是自定义组件：{tip}
      </div>
    );
  }
}

Renderer({
  type: 'my-renderer',
  autoVar: true,
})(CustomRenderer);
