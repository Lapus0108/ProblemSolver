import React, { useState, useEffect } from 'react'
import { Row, Col, Card, Menu, Progress, Tooltip, Button } from 'antd';
import Flex from 'components/shared-components/Flex';
import './problemsList.css';
import {
    DeleteOutlined,
    CheckCircleOutlined,
    CalendarOutlined,
    EyeOutlined
} from '@ant-design/icons';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import { COLORS } from 'constants/ChartConstant';
import axios from "axios";
import { connect } from 'react-redux';
import { useHistory } from "react-router-dom";

const problemsDummy = [
    {
        "id": 1,
        "name": "Bubble sort",
        "id_user" : 4,
        "description": "Pentru fiecare pereche de elemente consecutive din vectorul vv, dacă cele două numere nu sunt în ordine crescătoare, le inversăm. Repetăm procesul cât timp vectorul nu este sortat. Ne dăm seama că nu am terminat de sortat vectorul dacă la parcurgerea sa am efectuat măcar o interschimbare.",
        "difficulty": "hard",
        "total_solved": 32,
        "total_correct": 27,
        "date_added": "14.05.2022"
    },
    {
        "id": 2,
        "id_user" : 4,
        "name": "Merge sort",
        "description": "Pentru fiecare pereche de elemente consecutive din vectorul vv, dacă cele două numere nu sunt în ordine crescătoare, le inversăm. Repetăm procesul cât timp vectorul nu este sortat. Ne dăm seama că nu am terminat de sortat vectorul dacă la parcurgerea sa am efectuat măcar o interschimbare.",
        "difficulty": "easy",
        "total_solved": 16,
        "total_correct": 15,
        "date_added": "11.05.2022"
    },
    {
        "id": 3,
        "id_user" : 3,
        "name": "Heap sort",
        "description": "Pentru fiecare pereche de elemente consecutive din vectorul vv, dacă cele două numere nu sunt în ordine crescătoare, le inversăm. Repetăm procesul cât timp vectorul nu este sortat. Ne dăm seama că nu am terminat de sortat vectorul dacă la parcurgerea sa am efectuat măcar o interschimbare.",
        "difficulty": "medium",
        "total_solved": 17,
        "total_correct": 3,
        "date_added": "12.05.2022"
    }
]


const ProblemsList = (props) => {
    const [problems, setProblems] = useState(problemsDummy);
    const history = useHistory();

    useEffect(() => {
        axios.get(`https://URL/problems`)
            .then(res => {
                setProblems(res.data.problems);
            })
    }, [])


    const ItemHeader = ({ name, category }) => (
        <div>
            <h4 className="mb-0">{name}</h4>
            <span className="text-muted" style={{ textTransform: "capitalize" }}>Difficulty: {category}</span>
        </div>
    )


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
    )

    const ItemInfo = ({ totalSolved, totalCorrectSolved, dateAdded }) => (
        <Flex alignItems="center">
            <div className="mr-3">
                <Tooltip title="Correct solutions">
                    <CheckCircleOutlined className="text-muted font-size-md" />
                    <span className="ml-1 text-muted">{totalCorrectSolved}/{totalSolved}</span>
                </Tooltip>
            </div>
            <div className="mr-3">
                <Tooltip title="Date uploaded">
                    <CalendarOutlined className="text-muted font-size-md" />
                    <span className="ml-1 text-muted">{dateAdded}</span>
                </Tooltip>
            </div>
        </Flex>
    )

    const ItemProgress = ({ progression }) => (
        <Progress percent={progression} strokeColor={getProgressStatusColor(progression)} size="small" />
    )

    const getProgressStatusColor = progress => {
        if (progress >= 80) {
            return COLORS[1]
        }
        if (progress < 60 && progress > 30) {
            return COLORS[3]
        }
        if (progress < 30) {
            return COLORS[2]
        }
        return COLORS[0]
    }


    const GridItem = ({ data, removeId }) => (
        <Card>
            <Flex alignItems="center" justifyContent="between">
                <ItemHeader name={data.name} category={data.difficulty} />
                {props?.token?.role == "student" && props?.token?.id == data.id_user && 
                <ItemAction id={data.id} removeId={removeId} />}
            </Flex>
            <div className="mt-2">
                <ItemInfo
                    totalSolved={data.total_solved}
                    totalCorrectSolved={data.total_correct}
                    dateAdded={data.date_added}
                />
            </div>
            <div className="mt-3">
                <ItemProgress progression={Math.round((data.total_correct / data.total_solved) * 100)} />
            </div>
            
            <div className="mt-3 problem-button-row">
                <Button icon={<EyeOutlined />} type="primary" htmlType="submit" shape="round" onClick={() => history.push(`/app/problem/${data.id}`)}>
                    See details
                </Button>
            </div>
        </Card>
    )

    const deleteProblem = id => {
        const payload = {
            id_user: props.token.id,
            id_problem: id
        };
        axios
            .post('https://URL/delete-problem', payload)
            .then(res => {
                if (res.data.success == 1) {
                    const data = problems.filter(elm => elm.id !== id)
                    setProblems(data)
                }
            });
    }

    return (
        <div class="problems-list-container">
            <div class="problems-list-title">Problems list</div>
            <div className="my-4 container-fluid">
                {
                    <Row gutter={16}>
                        {problems.map(elm => (
                            <Col xs={24} sm={24} lg={8} xl={8} xxl={6} key={elm.id}>
                                <GridItem
                                    data={elm}
                                    removeId={id => deleteProblem(id)}
                                />
                            </Col>
                        ))}
                    </Row>
                }
            </div>
        </div>
    )
}

const mapStateToProps = ({ auth }) => {
    const { token } =  auth;
    return { token}
  };
  
  export default connect(mapStateToProps)(ProblemsList)
