import React, { useEffect, useState } from "react";
import "./problemPage.css";
import { Input, Button, Table, Card, Form, Row, Col, Tag, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import { connect } from "react-redux";
import { useHistory, useParams } from "react-router-dom";

const { TextArea } = Input;

const ProblemPage = (props) => {
  const { id } = useParams();
  const history = useHistory();
  const [form] = Form.useForm();
  const [problemInfo, setProblemInfo] = useState({});
  const [solutions, setSolutions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeSolution, setActiveSolution] = useState(null);

  const tableColumns = [
    {
      title: "Student",
      dataIndex: "userName",
      key: "name",
    },
    {
      title: "Upload date",
      dataIndex: "dateAdded",
      key: "upload_date",
    },
    {
      title: () => <div className="text-right">Status</div>,
      key: "status",
      render: (_, record) => (
        <div className="text-right">
          <Tag
            className="mr-0"
            style={{ cursor: "pointer", textTransform: "capitalize" }}
            color={
              record.status === "correct"
                ? "cyan"
                : record.status === "wrong"
                ? "red"
                : "yellow"
            }
            onClick={
              record.status == "check" &&
              props.token.id == problemInfo.teacherId
                ? () => {
                    displayModal();
                    setActiveSolution(record.id);
                  }
                : () => {}
            }
          >
            {record.status}
          </Tag>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getProblemData();
  }, []);

  const getProblemData = () => {
    axios
      .get(`http://localhost:8222/problems/` + id)
      .then((res) => {
        setProblemInfo(res.data);
        setSolutions(res.data.solutions);
      })
      .catch((err) => console.log(err));
  };

  const displayModal = () => {
    setModalVisible(true);
  };

  const handleSendValidation = (validationResp) => {
    const payload = {
      verdict: validationResp,
    };

    axios
      .patch(
        `http://localhost:8222/solutions/${activeSolution}`,
        validationResp,
        { headers: { "Content-Type": "text/plain" } }
      )
      .then((res) => {
        getProblemData();
        setModalVisible(false);
        setActiveSolution(null);
      })
      .catch((err) => console.log(err));
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const submitSolution = (values) => {
    const payload = {
      problemId: parseInt(id, 10),
      userId: props.token.id,
      answer: values.solution,
    };
    axios
      .post("http://localhost:8222/solutions/", payload)
      .then((res) => {
        form.resetFields();
        getProblemData();
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <div className="container">
        {Object.keys(problemInfo).length > 0 && (
          <Card>
            <div className="d-md-flex justify-content-md-between">
              <div>
                <div class="problem-title mt-3">{problemInfo.name}</div>
                <div>
                  <p>
                    <span>
                      Upload date: <b>{problemInfo.dateAdded}</b>
                    </span>
                    <br />
                  </p>
                </div>
              </div>
              <div className="mt-3 text-right">
                <h2 className="mb-1 font-weight-bold">
                  Problem #{problemInfo.id}
                </h2>
                <p>
                  Difficulty:{" "}
                  <b style={{ textTransform: "capitalize" }}>
                    {problemInfo.difficulty}
                  </b>
                </p>
              </div>
            </div>
            <p class="problem-description">{problemInfo.description}</p>
            {props?.token?.role == "student" &&
              props.token.id != problemInfo.teacherId && (
                <Form
                  form={form}
                  name="control-hooks"
                  onFinish={submitSolution}
                >
                  <Form.Item name="solution" rules={[{ required: true }]}>
                    <TextArea
                      rows={7}
                      placeholder="Upload problem solution in order to be reviewed by the teacher"
                    />
                  </Form.Item>
                  <Form.Item style={{ float: "right" }}>
                    <Button
                      icon={<PlusOutlined />}
                      type="primary"
                      htmlType="submit"
                      shape="round"
                    >
                      Upload solution
                    </Button>
                  </Form.Item>
                </Form>
              )}
          </Card>
        )}
        <Card title="Uploaded solutions">
          <Table
            className="no-border-last"
            columns={tableColumns}
            dataSource={solutions}
            rowKey="id"
            pagination={false}
          />
        </Card>
      </div>

      <Modal
        title={`Check solution #${activeSolution}`}
        visible={modalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="wrong"
            type="primary"
            onClick={() => handleSendValidation("wrong")}
            danger
          >
            Mark as wrong
          </Button>,
          <Button
            key="correct"
            type="primary"
            onClick={() => handleSendValidation("correct")}
            style={{ backgroundColor: "green" }}
          >
            Mark as correct
          </Button>,
        ]}
      >
        <p>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s
        </p>
      </Modal>
    </div>
  );
};

const mapStateToProps = ({ auth }) => {
  const { token } = auth;
  return { token };
};

export default connect(mapStateToProps)(ProblemPage);
