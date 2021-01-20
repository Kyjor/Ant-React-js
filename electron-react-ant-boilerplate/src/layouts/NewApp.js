// Libs
import React, { Component } from "react";
import PropTypes from "prop-types";
import { Layout } from "antd";
// Styles
import styles from "./NewApp.scss";
// Components
import Header from "@/components/@shared/Header";
import Footer from "@/components/@shared/Footer";
import LokiService from "../services/LokiService";
/**
 * App
 *
 * @class App
 * @extends {Component}
 */
class NewApp extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      lokiLoaded: false
    }
  }

  componentDidMount() {
    LokiService.init(() => {
      this.setState({ lokiLoaded: true })
    });
  }

  render() {
    const { children } = this.props;
      return (<Layout>
        <Header />
        <Layout className={styles.app}>
          <Layout.Content>{children}</Layout.Content>
        </Layout>
        <Footer />
      </Layout>)
  }
}

export default NewApp;
