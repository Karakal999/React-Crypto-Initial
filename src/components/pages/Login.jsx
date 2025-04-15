import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/authContext';
import { useNavigate, useLocation } from 'react-router-dom';

const { Title } = Typography;

export default function Login() {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(!location.state?.isSignUp);
  const { login, signup, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      const returnPath = location.state?.from || '/';
      navigate(returnPath);
    }
  }, [user, navigate, location]);

  const onFinish = async values => {
    setLoading(true);
    try {
      if (isLogin) {
        await login(values.email, values.password);
      } else {
        await signup(values.email, values.password);
      }
      const returnPath = location.state?.from || '/';
      navigate(returnPath);
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

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
      <Card style={{ width: 400, padding: '20px' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>
          {isLogin ? 'Login' : 'Sign Up'}
        </Title>

        <Form name="auth" onFinish={onFinish} layout="vertical">
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 6, message: 'Password must be at least 6 characters!' },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" loading={loading}>
              {isLogin ? 'Login' : 'Sign Up'}
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center' }}>
          <Button type="link" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Need an account? Sign up' : 'Already have an account? Login'}
          </Button>
          <Button type="link" onClick={() => navigate('/')}>
            Continue as Guest
          </Button>
        </div>
      </Card>
    </div>
  );
}
