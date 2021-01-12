// Libs
import React, { Component } from "react";
// Styles
import styles from "./ProjectPage.scss";
// Layouts
import Layout from "@/layouts/App";
// Components
import Path from "@/components/Projects/Path";
import ProjectList from "@/components/Projects/ProjectList";
import {DragDropContext} from "react-beautiful-dnd";

import initialData from "./initial-data";
import Column from "./column";
const loki = require("lokijs");
const fs = window.require('fs');
let db;
let dataNodes;
let nodeList;

/**
 * Home
 *
 * @class Projects
 * @extends {Component}
 */
class ProjectPage extends Component {
  constructor(props) {
    super(props);
    this.loadProject = this.loadProject.bind(this);
    this.databaseInitialize = this.databaseInitialize.bind(this);
    this.addNodeToTable = this.addNodeToTable.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.state = initialData;
  }

  loadProject(projectName)
  {
    db = new loki(`./projects/${projectName}`, {
      autoload: true,
      autoloadCallback : this.databaseInitialize,
      autosave: true,
      autosaveInterval: 4000
    });

  }
  databaseInitialize() {
    dataNodes = db.getCollection("dataNodes", {
      autoupdate: true
    });

    if (dataNodes === null) {
      dataNodes = db.addCollection("dataNodes", {
        autoupdate: true
      });
    }
    let x;
    nodeList = dataNodes.find({ 'Id': { '$ne': null } });
    nodeList.forEach(this.addNodeToTable)
  }
  addNodeToTable(node,index, arr)
  {
    console.log(index)
    console.log({node})
    // if (node.parent === undefined || node.parent === null)
    // {
    //   tabledata.push({id:node.$loki, name: node.name, desc: node.description, time: node.time});
    // }
    // else
    // {
    //   console.log({table});
    //   var parentRow = table.getRow(node.parent);
    //   if(parentRow === false)
    //   {
    //     var row = table.getRow(dataNodes.get(node.parent).parent);
    //     var children = row.getTreeChildren();
    //     console.log({children});
    //     let x
    //     for (x = 0; x < children.length; x++)
    //     {
    //       if (children[x]._row.data.id === node.parent)
    //       {
    //         parentRow = children[x];
    //         console.log('found it');
    //       }
    //     }
    //   }
    //   console.log(node.parent);
    //   console.log(parentRow);
    //   console.log({parentRow});
    //
    //   parentRow.addTreeChild ({id:node.$loki,name:node.name, desc:node.description, time:node.time});
    // }
    //
    // table.addData(tabledata);
    // tabledata.length = 0;
  }
onDragEnd = result => {

}

  render() {
    return (
      <>
        {this.loadProject(this.props.location.query.projectName)}
        <Layout>
          <div className={styles.home}>
            Hi
            <Path />
            <DragDropContext onDragEnd={this.onDragEnd}>
              {this.state.columnOrder.map(columnId => {
                const column = this.state.columns[columnId];
                const tasks = column.taskIds.map(taskId => this.state.tasks[taskId]);
                return <Column key={column.id} column={column} tasks={tasks}/>
              })}
            </DragDropContext>


          </div>
        </Layout>
      </>

    );
  }
}

export default ProjectPage;
