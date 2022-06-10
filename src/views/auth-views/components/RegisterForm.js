import React, { useEffect } from "react";
import { connect } from "react-redux";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, Alert, Select } from "antd";
import {
  showAuthMessage,
  showLoading,
  hideLoading,
  hideAuthMessage,
  authenticated,
} from "redux/actions/Auth";
import { useHistory } from "react-router-dom";
import { motion } from "framer-motion";
import JwtAuthService from "services/JwtAuthService";
import axios from "axios";

const { Option } = Select;

const rules = {
  email: [
    {
      required: true,
      message: "Please input your email address",
    },
    {
      type: "email",
      message: "Please enter a validate email!",
    },
  ],
  username: [
    {
      required: true,
      message: "Please enter a valid username",
    },
  ],
  role: [
    {
      required: true,
      message: "Please select an account type",
    },
  ],
  password: [
    {
      required: true,
      message: "Please input your password",
    },
  ],
  confirm: [
    {
      required: true,
      message: "Please confirm your password!",
    },
    ({ getFieldValue }) => ({
      validator(rule, value) {
        if (!value || getFieldValue("password") === value) {
          return Promise.resolve();
        }
        return Promise.reject("Passwords do not match!");
      },
    }),
  ],
};

export const RegisterForm = (props) => {
  const {
    showLoading,
    hideLoading,
    token,
    loading,
    redirect,
    message,
    showMessage,
    hideAuthMessage,
    authenticated,
    allowRedirect,
  } = props;
  const [form] = Form.useForm();
  let history = useHistory();

  const onSignUp = () => {
    form
      .validateFields()
      .then((values) => {
        showLoading();
        axios
          .post("http://localhost:8222/users/register", values)
          .then((res) => {
            if (res.data.hasOwnProperty("id")) {
              hideLoading();
              history.push("/auth/login");
            } else {
              hideLoading();
              showAuthMessage(res.data.error);
            }
          })
          .catch((err) => {
            showAuthMessage("Couldn't create account");
          });
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  useEffect(() => {
    if (token !== null && allowRedirect) {
      history.push(redirect);
    }
    if (showMessage) {
      setTimeout(() => {
        hideAuthMessage();
      }, 3000);
    }
  });

  return (
    <>
      <motion.div
        initial={{ opacity: 0, marginBottom: 0 }}
        animate={{
          opacity: showMessage ? 1 : 0,
          marginBottom: showMessage ? 20 : 0,
        }}
      >
        <Alert type="error" showIcon message={message}></Alert>
      </motion.div>
      <Form
        form={form}
        layout="vertical"
        name="register-form"
        onFinish={onSignUp}
      >
        <Form.Item
          name="name"
          label="Username"
          rules={rules.username}
          hasFeedback
        >
          <Input prefix={<UserOutlined className="text-primary" />} />
        </Form.Item>
        <Form.Item name="role" label="Account type" rules={rules.role}>
          <Select placeholder="Select role">
            <Option value="student">Student</Option>
            <Option value="teacher">Teacher</Option>
          </Select>
        </Form.Item>
        <Form.Item name="email" label="Email" rules={rules.email} hasFeedback>
          <Input prefix={<MailOutlined className="text-primary" />} />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={rules.password}
          hasFeedback
        >
          <Input.Password prefix={<LockOutlined className="text-primary" />} />
        </Form.Item>
        <Form.Item
          name="confirm"
          label="ConfirmPassword"
          rules={rules.confirm}
          hasFeedback
        >
          <Input.Password prefix={<LockOutlined className="text-primary" />} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Sign Up
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

const mapStateToProps = ({ auth }) => {
  const { loading, message, showMessage, token, redirect } = auth;
  return { loading, message, showMessage, token, redirect };
};

const mapDispatchToProps = {
  showAuthMessage,
  hideAuthMessage,
  showLoading,
  hideLoading,
  authenticated,
};

export default connect(mapStateToProps, mapDispatchToProps)(RegisterForm);
