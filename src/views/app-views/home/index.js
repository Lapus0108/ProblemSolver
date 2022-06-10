import React, { useEffect, useState } from "react";
import { Row, Col, Button, Table, Card, Tag } from "antd";
import StatisticWidget from "components/shared-components/StatisticWidget";
import GoalWidget from "components/shared-components/GoalWidget";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { connect } from "react-redux";

const titles = ["Total solutions", "Total problems", "Total new students"];

const roles = ["Guru", "Master", "Crafter"];

// const performersRes = [
//   {
//     id: "#5331",
//     name: "Clayton Bates",
//     last_solution_date: "8 May 2020",
//     problems: "15",
//     percentage: "64",
//     rank: "Guru",
//   },
//   {
//     id: "#5332",
//     name: "Gabriel Frazier",
//     last_solution_date: "6 May 2020",
//     problems: "14",
//     percentage: "77",
//     rank: "Guru",
//   },
//   {
//     id: "#5333",
//     name: "Debra Hamilton",
//     last_solution_date: "1 May 2020",
//     problems: "14",
//     percentage: "100",
//     rank: "Master",
//   },
//   {
//     id: "#5334",
//     name: "Stacey Ward",
//     last_solution_date: "28 April 2020",
//     problems: "10",
//     percentage: "85",
//     rank: "Mentor",
//   },
//   {
//     id: "#5335",
//     name: "Troy Alexander",
//     last_solution_date: "28 April 2020",
//     problems: "7",
//     percentage: "63",
//     rank: "Mentor",
//   },
// ];

const Home = (props) => {
  const [counters, setCounters] = useState([]);
  const [solvePercentage, setSolvePercentage] = useState(100);
  const [performers, setPerformers] = useState([]);
  const history = useHistory();

  const getPerformers = () => {
    axios
      .get(`http://localhost:8222/statistics/top-performers`)
      .then((res) => {
        setPerformers(res.data);
      })
      .catch((err) => console.log(err));
  };

  const getMainStats = () => {
    axios
      .get(`http://localhost:8222/statistics/${props.token.id}`)
      .then((res) => {
        var response = res.data;
        console.log(response);
        response = Object.entries(response).slice(0, 2);
        response[response.length] = ["2", 14];
        setCounters(response);
        setSolvePercentage(
          Math.round(
            res.data.myCorrectSolutionsTotal / res.data.mySolutionsTotal,
            2
          )
        );
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getMainStats();
    getPerformers();
  }, []);

  const tableColumns = [
    {
      title: "Student",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Problems solved",
      dataIndex: "totalSolutions",
      key: "problems",
      render: (text, record) => (
        <div className="d-flex align-items-center">
          <span className="ml-2">
            {record.totalSolutions +
              " (" +
              (record.totalSolutions > 0
                ? Math.round(record.correctSolutions / record.totalSolutions, 2)
                : 0) +
              "%)"}
          </span>
        </div>
      ),
    },
    {
      title: "Last solution",
      dataIndex: "lastUpload",
      key: "last_solution_date",
    },
    {
      title: () => <div className="text-right">Rank title</div>,
      key: "status",
      render: (_, record) => {
        let rank = roles[Math.floor(Math.random() * roles.length)];
        return (
          <div className="text-right">
            <Tag
              className="mr-0"
              color={
                rank === "Guru" ? "cyan" : rank === "Master" ? "blue" : "yellow"
              }
            >
              {rank}
            </Tag>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <Row gutter={16}>
        <Col xs={24} sm={24} md={24} lg={18}>
          <Row gutter={16}>
            {counters.map((elm, i) => (
              <Col xs={24} sm={24} md={24} lg={24} xl={8} key={i}>
                <StatisticWidget
                  title={titles[i]}
                  value={elm[1]}
                  status={Math.round(1 + Math.random() * 6)}
                  subtitle="Compared to last month (May 2022)"
                />
              </Col>
            ))}
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Card title="Top performers">
                <Table
                  className="no-border-last"
                  columns={tableColumns}
                  dataSource={performers}
                  rowKey="id"
                  pagination={false}
                />
              </Card>
            </Col>
          </Row>
        </Col>
        <Col xs={24} sm={24} md={24} lg={6}>
          <GoalWidget
            title="Your correct solutions"
            value={solvePercentage}
            subtitle="You need a bit more effort to increase your score"
            extra={
              <Button
                type="primary"
                onClick={() => history.push("/app/problems")}
              >
                Problems list
              </Button>
            }
          />
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = ({ auth }) => {
  const { token } = auth;
  return { token };
};

export default connect(mapStateToProps)(Home);
