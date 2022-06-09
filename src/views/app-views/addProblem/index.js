import React from 'react';
import './addProblem.css';
import { Form, Input, Button, Select,  } from 'antd';
import { 
	PlusOutlined
} from '@ant-design/icons';
import axios from "axios";
import { useHistory } from "react-router-dom";

const { Option } = Select;
const { TextArea } = Input;

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

const AddProblem = () => {
    const [form] = Form.useForm();
    const history = useHistory();


    const onFinish = values => {
        axios
        .post('https://URL/add-problem', values)
        .then(res => {
            if(res.data.success == 1){
                history.push("/app/problems")
            }
        });
    };

    return (
        <div class="add-problem-container">
            <div class="add-problem-title">Upload new problem</div>
            <div className="code-box add-problem-form">
                <Form {...layout} labelAlign={'left'} form={form} name="control-hooks" onFinish={onFinish}>
                    <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                        <Input placeholder="Ex: Bubble sort"/>
                    </Form.Item>
                    <Form.Item name="difficulty" label="Difficulty" rules={[{ required: true }]}>
                        <Select
                            placeholder="Select a difficulty level for the problem"
                            allowClear
                        >
                            <Option value="easy">Easy</Option>
                            <Option value="medium">Medium</Option>
                            <Option value="hard">Hard</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="description" label="Description" rules={[{ required: true }]}>
                        <TextArea rows={4} placeholder="Provide details about the problem, as well as some instances and their expected output"/>
                    </Form.Item>
                    <Form.Item style={{float: 'right'}}>
                        <Button icon={<PlusOutlined />} type="primary" htmlType="submit" shape="round">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

export default AddProblem
