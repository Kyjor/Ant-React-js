// Libs
import React, { Component } from "react";
import PropTypes from "prop-types";
import { Layout } from "antd";
// Styles
import styles from "./App.scss";
// Components
import Header from "@/components/@shared/Header";
import Footer from "@/components/@shared/Footer";
import LokiService from "../services/LokiService";
import NewWindowComponent from "../components/NewWindowComponent";
/**
 * App
 *
 * @class App
 * @extends {Component}
 */
class App extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      lokiLoaded: false,
      // To keep track of the new window if opened or closed
      isNewWindow: false,
    }
  }

  componentDidMount() {
    LokiService.init(() => {
      this.setState({ lokiLoaded: true })
    });
  }

  render() {
    const { children } = this.props;
      return (

        // onClose will be fired when the new window is closed
        // everything inside NewWindowComponent is considered props.children and will be
        // displayed in a new window
        <>
        {this.state.isNewWindow &&
        <NewWindowComponent onClose={() => this.setState({ isNewWindow: false })}>
            <h2>This will display in a new window</h2>
          <div>cry cry</div>
            </NewWindowComponent>
          }
        <Layout>
        <Header />
        <Layout className={styles.app}>
          <Layout.Content>{children}</Layout.Content>
        </Layout>
        <Footer />
      </Layout>
          <button
            onClick={() => this.setState({ isNewWindow: true })}>
            Open in new window</button>
          </>
          )
  }
}

export default App;
