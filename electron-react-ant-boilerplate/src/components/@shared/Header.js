// Libs
import React, { Component } from "react";
import { Layout, Menu } from "antd";
// Styles
import styles from "./Header.scss";
import {Link} from "react-router-dom";

/**
 * Header
 *
 * @class Header
 * @extends {Component}
 */
class Header extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Layout.Header className={styles.header}>
        <div className={styles.logo} />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["1"]}
          className={styles.menu}
        >
          <Menu.Item key="1"><Link to="/">Home</Link></Menu.Item>
          <Menu.Item key="2"><Link to="/projects">Projects1</Link></Menu.Item>
          <Menu.Item key="3">nav 3</Menu.Item>
        </Menu>
      </Layout.Header>
    );
  }
}

export default Header;
