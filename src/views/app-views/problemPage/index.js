import React, {useEffect, useState} from 'react';
import './problemPage.css';
import { Input, Button, Table, Card, Form } from 'antd';
import {
    PlusOutlined
} from '@ant-design/icons';
import axios from "axios";
import { connect } from 'react-redux';
import { useHistory, useParams } from "react-router-dom";

const { TextArea } = Input;

const ProblemPage = (props) => {
    const { id } = useParams();
    const history = useHistory();
    const [form] = Form.useForm();
    const [problemInfo, setProblemInfo] = useState({});


    useEffect(() => {
        // axios.get(`https://URL/problem?id={id}`).then((res) =>{
        //     setProblemInfo(res.data.problem)
        // }).catch(err => console.log(err))
        const resp = {
            "id" : 16,
            "user" : "Lapus12",
            "name" : "Bubble sort",
            "upload_date": "25.07.2020",
            "difficulty" : "medium",
            "description" : "Emilus - A developer friendly & highly scalable admin dashboard template built with React & top notch technologies stack. It offers a clean code base and detailed documentation which allow you to develop your web application faster and cost effectively. Emilus can be used to build any modern web application including a SaaS, admin panels, CRM, CMS, e-commerce panel, etc"
        }
        setProblemInfo(resp)
    }, [])

    const submitSolution = (values) => {
        const payload = {
            "id_problem": id,
            "id_user": props.token.id_user,
            "solution": values.solution
        }
        axios
            .post('https://URL/send-solution', payload)
            .then(res => {
                if (res.data.success == 1) {
                    history.push("/app/problems")
                }
            });
    };

    return (
        <div className="container">
            {Object.keys(problemInfo).length > 0 &&
            <Card>
                <div className="d-md-flex justify-content-md-between">
                    <div>
                        <div class="problem-title mt-3">{problemInfo.name}</div>
                        <div>
                            <p>

                                <span>Upload date: <b>{problemInfo.upload_date}</b></span><br />
                                <span>Uploaded by: <b>{problemInfo.user}</b></span><br />

                            </p>
                        </div>
                    </div>
                    <div className="mt-3 text-right">
                        <h2 className="mb-1 font-weight-bold">Problem #{problemInfo.id}</h2>
                        <p>Difficulty: <b style={{textTransform: 'capitalize'}}>{problemInfo.difficulty}</b></p>

                    </div>
                </div>
                <p class="problem-description">{problemInfo.description}</p>
                { props?.token?.role == "student" &&
                <Form form={form} name="control-hooks" onFinish={submitSolution}>
                    <Form.Item name="solution" rules={[{ required: true }]}>
                        <TextArea rows={7} placeholder="Upload problem solution in order to be reviewed by the teacher" />
                    </Form.Item>
                    <Form.Item style={{ float: 'right' }}>
                        <Button icon={<PlusOutlined />} type="primary" htmlType="submit" shape="round">
                            Upload solution
                        </Button>
                    </Form.Item>
                </Form>}
            </Card> }
        </div>
    )
}

const mapStateToProps = ({ auth }) => {
    const { token } =  auth;
    return { token}
  };
  
  export default connect(mapStateToProps)(ProblemPage)

















