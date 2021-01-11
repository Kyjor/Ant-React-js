// Libs
import React, { Component } from "react";
// Styles
import styles from "./ProjectList.scss";
import {Button} from "antd";
import ProjectItems from "./ProjectItems/ProjectItems";
import "./ProjectList.scss";

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

  render() {
    return (

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

        );
  }
}

export default ProjectList;
