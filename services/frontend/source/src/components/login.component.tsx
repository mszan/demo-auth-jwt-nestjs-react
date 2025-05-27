import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Col, Divider, Form, Input, Row, Typography } from "antd";
import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

type LoginFormFieldType = {
  username: string;
  password: string;
};

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, jwtTokens } = React.useContext(AuthContext);

  const [isLoading, setIsLoading] = React.useState(false);

  const onFinish = async (values: LoginFormFieldType) => {
    setIsLoading(true);
    try {
      await login(values.username, values.password);
      navigate("/");
      window.location.reload();
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  };

  if (jwtTokens && jwtTokens.accessToken) {
    return <Navigate to="/" />;
  }

  return (
    <React.Fragment>
      <Row
        align="middle"
        justify="center"
        style={{ minHeight: "95vh", alignItems: "center" }}
      >
        <Col xs={20} xl={6}>
          <div style={{ textAlign: "center" }}>
            <Typography.Title
              style={{
                fontWeight: 800,
                fontStretch: "expanded",
              }}
            >
              KRAFTAPP
            </Typography.Title>
            <Typography.Paragraph>
              <Typography.Text>
                An example app demonstrating JWT auth
              </Typography.Text>
            </Typography.Paragraph>
          </div>
          <Divider />
          <Form
            name="login"
            onFinish={onFinish}
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <Form.Item
              name="username"
              style={{ width: "100%" }}
              rules={[
                { required: true, message: "Please input your Username!" },
              ]}
            >
              <Input
                name="username"
                prefix={<UserOutlined />}
                placeholder="Username (imUser or imAdmin)"
              />
            </Form.Item>
            <Form.Item
              name="password"
              style={{ width: "100%" }}
              rules={[
                { required: true, message: "Please input your Password!" },
              ]}
            >
              <Input
                name="password"
                prefix={<LockOutlined />}
                type="password"
                placeholder="Password (Test@1234)"
              />
            </Form.Item>

            <Form.Item style={{ maxWidth: 200 }}>
              <Button
                block
                type="primary"
                htmlType="submit"
                disabled={isLoading}
              >
                Log in
              </Button>
            </Form.Item>
          </Form>
          <Divider />
          <Typography.Paragraph style={{ textAlign: "center" }}>
            <Typography.Text>
              Dawid Mszanowski ©{new Date().getFullYear()}
            </Typography.Text>
          </Typography.Paragraph>
        </Col>
      </Row>
    </React.Fragment>
  );
};
