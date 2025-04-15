import React from 'react';
import { Layout, Menu, Spin, Button, Space } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  DashboardOutlined,
  WalletOutlined,
  LineChartOutlined,
  LogoutOutlined,
  LoginOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { useCrypto } from '../../context/cryptoContext';
import { useAuth } from '../../context/authContext';

const { Header, Content, Footer } = Layout;

export default function AppLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { loading } = useCrypto();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: <Link to="/">Dashboard</Link>,
    },
    {
      key: '/markets',
      icon: <LineChartOutlined />,
      label: <Link to="/markets">Markets</Link>,
    },
    ...(user
      ? [
          {
            key: '/portfolio',
            icon: <WalletOutlined />,
            label: <Link to="/portfolio">Portfolio</Link>,
          },
        ]
      : []),
  ];

  if (loading) {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#f0f2f5',
        }}
      >
        <Spin size="large" tip="Loading..." />
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          padding: '0 16px',
          background: '#fff',
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            color: '#1890ff',
            fontSize: '18px',
            fontWeight: 'bold',
            marginRight: '24px',
          }}
        >
          Crypto Dashboard
        </div>
        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{ flex: 1, border: 'none' }}
        />
        <div style={{ display: 'flex', alignItems: 'center', marginLeft: '16px' }}>
          {user ? (
            <>
              <span style={{ marginRight: '16px' }}>{user.email}</span>
              <Button type="text" icon={<LogoutOutlined />} onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Space>
              <Button type="link" icon={<LoginOutlined />} onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button
                type="primary"
                icon={<UserAddOutlined />}
                onClick={() => navigate('/login', { state: { isSignUp: true } })}
              >
                Register
              </Button>
            </Space>
          )}
        </div>
      </Header>

      <Content
        style={{
          margin: '24px 16px',
          padding: 24,
          background: '#fff',
          borderRadius: '4px',
        }}
      >
        {children}
      </Content>

      <Footer style={{ textAlign: 'center' }}>
        Crypto Dashboard ©{new Date().getFullYear()} Created with React & Ant Design
      </Footer>
    </Layout>
  );
}
