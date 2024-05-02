import React, { useState } from 'react';
import {
  DashboardOutlined,
  FormOutlined,
  FileDoneOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme, Image, Tooltip, Button } from 'antd';
import UT from './assets/UT.png';
import FormEval from './pages/formEval';
import FormArea from './pages/formArea';
import DataUmum from './pages/dataUmum';
import Dashboard from './pages/dashboard';
import Login from './pages/login';
import MonitorinPerizinan from './pages/monitoringPerizinan';

const { Header, Content, Footer, Sider } = Layout;

const items: MenuProps['items'] = [
  {
    label: 'Dashboard',
    key: 'dashboard',
    icon: <DashboardOutlined />,
  },
  {
    label: 'Monitoring Perizinan',
    key: 'monitoring-perizinan',
    icon: <FileDoneOutlined />,
  },
  {
    label: 'Proteksi Kebakaran',
    key: 'proteksi-kebakaran',
    icon: <FormOutlined />,
    children: [
      {
        label: 'Data Umum',
        key: 'data-umum',
      },
      {
        label: 'Form Area',
        key: 'form-area',
      },
      {
        label: 'Form Eval Proteksi Kebakaran',
        key: 'form-eval-proteksi-kebakaran',
      },
    ],
  },
];

const App: React.FC = () => {
  const [isLogin, setIsLogin] = useState(
    localStorage.getItem('isLogin') === 'true'
  );
  const [current, setCurrent] = useState('dashboard');
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const onClick: MenuProps['onClick'] = (e) => {
    setCurrent(e.key);
  };

  return isLogin ? (
    <Layout>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
        style={{ backgroundColor: '#f74205', minHeight: 820 }}
        width={265}
      >
        <div className="demo-logo-vertical">
          <div style={{ padding: 10 }}>
            <span
              style={{
                width: '100%',
                height: '45px',
                border: '1px solid rgb(177 166 166)',
                display: 'flex',
                backgroundColor: 'whitesmoke',
              }}
            ></span>
          </div>
        </div>
        <Menu
          theme="light"
          mode="inline"
          onClick={onClick}
          selectedKeys={[current]}
          items={items}
          style={{ backgroundColor: '#edd1d1' }}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span
              style={{
                textAlign: 'center',
                color: 'black',
                height: 64,
                paddingInline: 48,
                lineHeight: '64px',
                fontSize: 20,
                fontWeight: 'bold',
              }}
            >
              {current === 'dashboard' ? (
                <>DASHBOARD</>
              ) : current === 'monitoring-perizinan' ? (
                <>MONITORING PERIZINAN</>
              ) : current === 'data-umum' ? (
                <>DATA UMUM</>
              ) : current === 'form-area' ? (
                <>FORM AREA</>
              ) : current === 'form-eval-proteksi-kebakaran' ? (
                <>FORM EVAL PROTEKSI KEBAKARAN</>
              ) : (
                <></>
              )}
            </span>
            <Tooltip title="Log Out">
              <LogoutOutlined
                style={{ fontSize: 20, marginRight: 48, cursor: 'pointer' }}
                onClick={() => {
                  localStorage.removeItem('isLogin');
                  localStorage.removeItem('token');
                  localStorage.removeItem('rolename');
                  localStorage.removeItem('name');
                  window.location.href = '/login';
                }}
              />
            </Tooltip>
          </div>
        </Header>
        <Content style={{ margin: '24px 16px 0', width: '100%' }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              width: '100%',
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {current === 'dashboard' ? (
              <Dashboard />
            ) : current === 'monitoring-perizinan' ? (
              <MonitorinPerizinan />
            ) : current === 'data-umum' ? (
              <DataUmum />
            ) : current === 'form-area' ? (
              <FormArea />
            ) : current === 'form-eval-proteksi-kebakaran' ? (
              <FormEval />
            ) : (
              <Login />
            )}
          </div>
        </Content>
      </Layout>
    </Layout>
  ) : (
    <Login />
  );
};

export default App;
