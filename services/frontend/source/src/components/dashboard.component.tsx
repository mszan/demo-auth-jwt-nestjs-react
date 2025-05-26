import {
  Button,
  Col,
  Descriptions,
  Divider,
  notification,
  Result,
  Row,
  Typography,
} from "antd";
import React, { useEffect } from "react";
import { AuthContext } from "../context/auth.context";
import { CurrentPageContext } from "../context/current-page.context";

export const Dashboard: React.FC = () => {
  const { setTitle } = React.useContext(CurrentPageContext);
  const { getJwtPayload, getJwtRefreshPayload, logout } =
    React.useContext(AuthContext);

  useEffect(() => {
    setTitle("dashboard");
  }, []);

  return (
    <React.Fragment>
      <Row>
        <Col span={24}>
          <Result
            status="success"
            title={`Welcome, ${getJwtPayload()?.username}!`}
            subTitle="You're logged in. This is a protected route."
            extra={
              <Button
                type="primary"
                onClick={() => {
                  logout();
                  notification.success({
                    message: "Logged out",
                    description: "You have successfully logged out.",
                  });
                }}
              >
                Logout
              </Button>
            }
          />
        </Col>
      </Row>
      <Row>
        <Divider />
      </Row>
      <Row justify={"center"}>
        <Col>
          <Typography.Title level={2}>access jwt payload</Typography.Title>
          <Descriptions column={1} bordered>
            {Object.entries(getJwtPayload() || {}).map(([key, value]) => (
              <Descriptions.Item key={key} label={key}>
                {typeof value === "object"
                  ? JSON.stringify(value)
                  : String(value)}
              </Descriptions.Item>
            ))}
          </Descriptions>
        </Col>
      </Row>
      <Row justify={"center"}>
        <Col>
          <Typography.Title level={2}>refresh jwt payload</Typography.Title>
          <Descriptions column={1} bordered>
            {Object.entries(getJwtRefreshPayload() || {}).map(
              ([key, value]) => (
                <Descriptions.Item key={key} label={key}>
                  {typeof value === "object"
                    ? JSON.stringify(value)
                    : String(value)}
                </Descriptions.Item>
              )
            )}
          </Descriptions>
        </Col>
      </Row>
    </React.Fragment>
  );
};
