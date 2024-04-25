import React from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, message, Form, Input } from 'antd';
import { config } from '../config';

const Login: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const success = (message: string) => {
    messageApi.open({
      type: 'success',
      content: message,
    });
  };

  const error = (message: string) => {
    messageApi.open({
      type: 'error',
      content: message,
    });
  };
  const onFinish = async (values: any) => {
    console.log('Received values of form: ', values);

    try {
      // Send a POST request to the login API endpoint
      const response = await fetch(`${config.apiUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'client-id': config.clientID,
          'client-secret': config.clientSecret,
        },
        body: JSON.stringify(values), // Pass the form values as JSON in the request body
      });

      if (response.ok) {
        const data = await response.json();
        // Assuming the API returns a token upon successful login
        const token = data.token;
        // Save the token to localStorage for future use
        localStorage.setItem('token', token);
        localStorage.setItem('rolename', data.rolename);
        localStorage.setItem('name', data.name);
        localStorage.setItem('isLogin', 'true');
        success('Login successful');
        window.location.href = '/';
        // Redirect or perform any other action upon successful login
      } else {
        // Handle unsuccessful login (e.g., incorrect credentials)
        error('Login failed. Please check your credentials.');
      }
    } catch (err) {
      error('An error occurred while logging in. Please try again later.');
      console.error('Error logging in:', err);
      // Handle other errors that may occur during login
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      {contextHolder}
      <Card
        title={
          <span
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            Login K3 Dashboard
          </span>
        }
        style={{ width: 500 }}
        hoverable
      >
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your Username!' }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
