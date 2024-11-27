"user client";

import { useHasMounted } from "@/util/customHook";
import { Button, Form, Input, Modal, notification } from "antd";
import {
  LoadingOutlined,
  SmileOutlined,
  SolutionOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Steps } from "antd";
import { useEffect, useState } from "react";
import email from "next-auth/providers/email";
import { sendRequest } from "@/util/api";

const ModelReactive = (props: any) => {
  const [current, setCurrent] = useState(0);
  const { isModalOpen, setIsMoalOpen, userEmail } = props;
  const [form] = Form.useForm();
  const [userId, setUserID] = useState("");

  const hasMounted = useHasMounted();
  useEffect(() => {
    if (userEmail) {
      form.setFieldValue("email", userEmail);
    }
  }, [userEmail]);
  if (!hasMounted) return <></>;

  const onFinishStep0 = async (values: any) => {
    const { email } = values;
    const res = await sendRequest<IBackendRes<any>>({
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_BACKEND_USER}/api/v1/auth/retry-active`,
      body: {
        email,
      },
    });
    if (res?.data) {
      setUserID(res?.data?._id);
      setCurrent(1);
    } else {
      notification.error({
        message: "call error ",
        description: res?.message,
      });
    }
  };
  const onFinishStep1 = async (values: any) => {
    const { code } = values;
    const res = await sendRequest<IBackendRes<any>>({
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_BACKEND_USER}/api/v1/auth/check-code`,
      body: {
        code,
        _id: userId,
      },
    });
    if (res?.data) {
      // setUserID(res?.data?._id);
      setCurrent(2);
    } else {
      notification.error({
        message: "call error ",
        description: res?.message,
      });
    }
  };
  return (
    <Modal
      title="Kích hoạt tài khoản"
      open={isModalOpen}
      onOk={() => setIsMoalOpen(false)}
      onCancel={() => setIsMoalOpen(false)}
      maskClosable={false}
      footer={null}
    >
      <Steps
        current={current}
        items={[
          {
            title: "Login",
            // status: "finish",
            icon: <UserOutlined />,
          },
          {
            title: "Verification",
            // status: "finish",
            icon: <SolutionOutlined />,
          },
          {
            title: "Done",
            // status: "wait",
            icon: <SmileOutlined />,
          },
        ]}
      />
      {current === 0 && (
        <>
          <div style={{ marginTop: 20 }}>
            <p>Tài khoản chưa được kích hoạt</p>
          </div>
          <Form
            name="verify"
            onFinish={onFinishStep0}
            autoComplete="off"
            layout="vertical"
            form={form}
          >
            <Form.Item label="Email" name="email">
              <Input disabled value={userEmail} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Resend
              </Button>
            </Form.Item>
          </Form>
        </>
      )}
      {current === 1 && (
        <>
          <div style={{ marginTop: 20 }}>
            <p>Vui lòng nhập mã xác thực</p>
          </div>
          <Form
            name="varify2"
            onFinish={onFinishStep1}
            autoComplete="off"
            layout="vertical"
            form={form}
          >
            <Form.Item
              label="Code"
              name="code"
              rules={[
                {
                  required: true,
                  message: "Please input your code!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Active
              </Button>
            </Form.Item>
          </Form>
        </>
      )}
      {current === 2 && (
        <div style={{ marginTop: 20 }}>
          <p>Tài khoản đã được kích hoạt thành công. Vui lòng đăng nhập lại</p>
        </div>
      )}
    </Modal>
  );
};

export default ModelReactive;
