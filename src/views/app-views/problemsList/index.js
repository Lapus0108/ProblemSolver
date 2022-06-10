import React, { useState, useEffect } from "react";
import { Row, Col, Card, Menu, Progress, Tooltip, Button } from "antd";
import Flex from "components/shared-components/Flex";
import "./problemsList.css";
import {
  DeleteOutlined,
  CheckCircleOutlined,
  CalendarOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
import { COLORS } from "constants/ChartConstant";
import axios from "axios";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

const ProblemsList = (props) => {
  const [problems, setProblems] = useState([]);
  const history = useHistory();

  useEffect(() => {
    axios.get(`http://localhost:8222/problems/`).then((res) => {
      setProblems(res.data);
    });
  }, []);

  const ItemHeader = ({ name, category }) => (
    <div>
      <h4 className="mb-0">{name}</h4>
      <span className="text-muted" style={{ textTransform: "capitalize" }}>
        Difficulty: {category}
      </span>
    </div>
  );

  const ItemAction = ({ id, removeId }) => (
    <EllipsisDropdown
      menu={
        <Menu>
          <Menu.Item key="0" onClick={() => removeId(id)}>
            <DeleteOutlined />
            <span className="ml-2">Delete Problem</span>
          </Menu.Item>
        </Menu>
      }
    />
  );

  const ItemInfo = ({ totalSolved, totalCorrectSolved, dateAdded }) => (
    <Flex alignItems="center">
      <div className="mr-3">
        <Tooltip title="Correct solutions">
          <CheckCircleOutlined className="text-muted font-size-md" />
          <span className="ml-1 text-muted">
            {totalCorrectSolved}/{totalSolved}
          </span>
        </Tooltip>
      </div>
      <div className="mr-3">
        <Tooltip title="Date uploaded">
          <CalendarOutlined className="text-muted font-size-md" />
          <span className="ml-1 text-muted">{dateAdded}</span>
        </Tooltip>
      </div>
    </Flex>
  );

  const ItemProgress = ({ progression }) => (
    <Progress
      percent={progression}
      strokeColor={getProgressStatusColor(progression)}
      size="small"
    />
  );

  const getProgressStatusColor = (progress) => {
    if (progress >= 80) {
      return COLORS[1];
    }
    if (progress < 60 && progress > 30) {
      return COLORS[3];
    }
    if (progress < 30) {
      return COLORS[2];
    }
    return COLORS[0];
  };

  const GridItem = ({ data, removeId }) => (
    <Card>
      <Flex alignItems="center" justifyContent="between">
        <ItemHeader name={data.name} category={data.difficulty} />
        {props?.token?.id == data.teacherId && (
          <ItemAction id={data.id} removeId={removeId} />
        )}
      </Flex>
      <div className="mt-2">
        <ItemInfo
          totalSolved={data.totalSolved}
          totalCorrectSolved={data.totalCorrect}
          dateAdded={data.dateAdded}
        />
      </div>
      <div className="mt-3">
        <ItemProgress
          progression={Math.round((data.totalCorrect / data.totalSolved) * 100)}
        />
      </div>

      <div className="mt-3 problem-button-row">
        <Button
          icon={<EyeOutlined />}
          type="primary"
          htmlType="submit"
          shape="round"
          onClick={() => history.push(`/app/problem/${data.id}`)}
        >
          See details
        </Button>
      </div>
    </Card>
  );

  const deleteProblem = (id) => {
    const payload = {
      id_user: props.token.id,
      id_problem: id,
    };
    axios.post("https://URL/delete-problem", payload).then((res) => {
      if (res.data.success == 1) {
        const data = problems.filter((elm) => elm.id !== id);
        setProblems(data);
      }
    });
  };

  return (
    <div class="problems-list-container">
      <div class="problems-list-title">Problems list</div>
      <div className="my-4 container-fluid">
        {
          <Row gutter={16}>
            {problems.map((elm) => (
              <Col xs={24} sm={24} lg={8} xl={8} xxl={6} key={elm.id}>
                <GridItem data={elm} removeId={(id) => deleteProblem(id)} />
              </Col>
            ))}
          </Row>
        }
      </div>
    </div>
  );
};

const mapStateToProps = ({ auth }) => {
  const { token } = auth;
  return { token };
};

export default connect(mapStateToProps)(ProblemsList);
