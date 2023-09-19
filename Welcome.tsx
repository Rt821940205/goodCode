import { PageContainer } from '@ant-design/pro-layout';
import { Alert, Card } from 'antd';
import React from 'react';

const Welcome: React.FC = () => {
  return (
    <PageContainer header={{ title: '' }}>
      <Card>
        <Alert
          message={'更多功能正加速开发中...'}
          type="success"
          showIcon
          banner
          style={{
            margin: -12,
            marginBottom: 24,
          }}
        />
      </Card>
    </PageContainer>
  );
};

export default Welcome;
