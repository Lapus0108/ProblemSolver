import React from "react";
import { Menu, Dropdown, Avatar } from "antd";
import { connect } from 'react-redux'
import {
  LogoutOutlined
} from '@ant-design/icons';
import { signOut } from 'redux/actions/Auth';
import { useHistory } from "react-router-dom";


export const NavProfile = (props) => {
  const history = useHistory();
  const profileImg = "/img/avatars/thumb-1.jpg";
  const profileMenu = (
    <div className="nav-profile nav-dropdown">
      <div className="nav-profile-header">
        <div className="d-flex">
          <Avatar size={45} src={profileImg} />
          <div className="pl-3">
            <h4 className="mb-0">{props?.token?.user}</h4>
            <span className="text-muted" style={{textTransform: "capitalize"}}>{props?.token?.role}</span>
          </div>
        </div>
      </div>
      <div className="nav-profile-body">
        <Menu>
          <Menu.Item onClick={() => {

            history.push("/auth/login");
          }}>
            <span>
              <LogoutOutlined />
              <span className="font-weight-normal">Sign Out</span>
            </span>
          </Menu.Item>
        </Menu>
      </div>
    </div>
  );
  return (
    <Dropdown placement="bottomRight" overlay={profileMenu} trigger={["click"]}>
      <Menu className="d-flex align-item-center" mode="horizontal">
        <Menu.Item key="profile">
          <Avatar src={profileImg} />
        </Menu.Item>
      </Menu>
    </Dropdown>
  );
}

const mapStateToProps = ({ auth }) => {
  const { token } =  auth;
  return { token}
};

export default connect(mapStateToProps)(NavProfile)
