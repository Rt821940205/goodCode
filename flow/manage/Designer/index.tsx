import React from 'react';

import { history } from '@@/core/history';
import './index.less';

export default class FlowDesigner extends React.Component {
  processDefinitionId: any;
  appId: any;

  constructor(props: any) {
    super(props);
    //
    const { query = {} } = history.location;
    const { id, appId } = query;
    this.processDefinitionId = id;
    this.appId = appId;
    console.log(this.processDefinitionId);
  }

  render() {
    return (
      <>
        <iframe
          style={{
            border: 0,
            height:"100vh"
          }}
          src={
            this.processDefinitionId
              ? `/bpm-process-designer/?id=${this.processDefinitionId}`
              : `/bpm-process-designer/?appId=${this.appId}`
          }
          width="100%"
          height="100%"
        />
      </>
    );
  }
}
