// Libs
import React, { Component } from "react";
// Styles
import styles from "./ProjectList.scss";
import {Button} from "antd";
import ProjectItems from "./ProjectItems/ProjectItems";
import "./ProjectList.scss";
//const loki = require("lokijs");
const projectFolder = './projects';
const fs = window.require('fs');
let lis = [];


/**
 * ProjectList
 *
 * @class ProjectList
 * @extends {Component}
 */
class ProjectList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: []
    };
    this.addProject = this.addProject.bind(this);
    this.loadList = this.loadList.bind(this);
  }
  componentDidMount() {
    console.log('componentDidMount')
    this.loadList();
  }
  addProject(e)
  {
    if (this._inputElement.value !== "") {
      var newItem = {
        text: this._inputElement.value,
        key: Date.now()
      };

      this.setState((prevState) => {
        return {
          items: prevState.items.concat(newItem)
        };
      });

      this._inputElement.value = "";
    }

    console.log(this.state.items);

    e.preventDefault();
  }
  loadList() {
    let listIndex = 0;
    console.log('loading list');
    //ul.className = 'collection';
    fs.readdir(projectFolder, (err, files) => {
      console.log({files});
      files.forEach(file => {
        console.log(file);
        const fileText = document.createTextNode(file);
        if (file !== "") {
          var newItem = {
            text: file,
            key: Date.now()
          };

          this.setState((prevState) => {
            return {
              items: prevState.items.concat(newItem)
            };
          });
        }
        listIndex++;
        if (listIndex === files.length) {
          //addListenersToList(lis);
        }
      });
    });
  }
  loadProject(file)
  {
    if (file !== "") {
      var newItem = {
        text: file,
        key: Date.now()
      };

      this.setState((prevState) => {
        return {
          items: prevState.items.concat(newItem)
        };
      });
    }

    console.log(this.state.items);
  }



  // addListenersToList(listObjects)
  // {
  //   let i;
  //   for (i = 0; i < lis.length; i++)
  //   {
  //     console.log('hi');
  //     lis[i].addEventListener('dblclick', function(event){
  //       var targetElement = event.target || event.srcElement;
  //       openProject(targetElement.innerHTML);
  //     });
  //     console.log(lis[i]);
  //   }
  //
  // }

  render() {
    return (
        <>
        <div className={styles.todoListMain}>
          <div className={styles.header}>
            <form onSubmit={this.addProject}>
              <input ref={(a) => this._inputElement = a}
                     placeholder="enter task">
              </input>
              <button type="submit">+</button>
            </form>
          </div>
          <ProjectItems entries={this.state.items}/>
        </div>
          </>

        );
  }
}

export default ProjectList;
