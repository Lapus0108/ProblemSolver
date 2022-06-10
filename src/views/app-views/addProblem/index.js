import React from "react";
import "./addProblem.css";
import { Form, Input, Button, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

const { Option } = Select;
const { TextArea } = Input;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const AddProblem = (props) => {
  const [form] = Form.useForm();
  const history = useHistory();

  const onFinish = (values) => {
    values["teacherId"] = props.token.id;

    axios.post("http://localhost:8222/problems/", values).then((res) => {
      history.push("/app/problems");
    });
  };

  return (
    <div class="add-problem-container">
      <div class="add-problem-title">Upload new problem</div>
      <div className="code-box add-problem-form">
        <Form
          {...layout}
          labelAlign={"left"}
          form={form}
          name="control-hooks"
          onFinish={onFinish}
        >
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input placeholder="Ex: Bubble sort" />
          </Form.Item>
          <Form.Item
            name="difficulty"
            label="Difficulty"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Select a difficulty level for the problem"
              allowClear
            >
              <Option value="Easy">Easy</Option>
              <Option value="Medium">Medium</Option>
              <Option value="Hard">Hard</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true }]}
          >
            <TextArea
              rows={4}
              placeholder="Provide details about the problem, as well as some instances and their expected output"
            />
          </Form.Item>
          <Form.Item name="answer" label="Answer" rules={[{ required: true }]}>
            <TextArea
              rows={4}
              placeholder="Provide the answer of the problem"
            />
          </Form.Item>
          <Form.Item style={{ float: "right" }}>
            <Button
              icon={<PlusOutlined />}
              type="primary"
              htmlType="submit"
              shape="round"
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

const mapStateToProps = ({ auth }) => {
  const { token } = auth;
  return { token };
};

export default connect(mapStateToProps)(AddProblem);
