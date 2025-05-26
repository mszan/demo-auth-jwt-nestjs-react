import { Button, Result } from "antd";
import React, { useEffect } from "react";
import { CurrentPageContext } from "../context/current-page.context";

export const NotFound: React.FC = () => {
  const { setTitle } = React.useContext(CurrentPageContext);

  useEffect(() => {
    setTitle("not found");
  }, []);

  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Button type="primary" href="/">
          Back Home
        </Button>
      }
    />
  );
};
