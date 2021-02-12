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
const electron = window.require('electron')
const ipcRenderer = electron.ipcRenderer;
const fs = electron.fs;
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
    this.handleOnClick = this.handleOnClick.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
  }

  componentDidMount() {
    LokiService.init(() => {
      this.setState({ lokiLoaded: true })
    });
    ipcRenderer.on('test1', this.handleMessage)
  }
  handleOnClick(){
    //console.log('onclick')
    ipcRenderer.send('test', 'helfdsgfslo')
  }
  handleMessage(event, data){
    console.log('message', data)
  }
  render() {
    const { children } = this.props;
      return (


        <>

        <Layout>
        <Header />
        <Layout className={styles.app}>
          <Layout.Content>{children}</Layout.Content>
        </Layout>
        <Footer />
      </Layout>
          <button
           // onClick={() => this.setState({ isNewWindow: true })}
            onClick={this.handleOnClick}>
            Open in new window</button>
          </>
          )
  }
}

export default App;
