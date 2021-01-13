// Libs
import React, { Component } from "react";
// Styles
import styles from "./ProjectPage.scss";
import styled from 'styled-components';

// Layouts
import Layout from "@/layouts/App";
// Components
import Path from "@/components/Projects/Path";
import ProjectList from "@/components/Projects/ProjectList";
import {DragDropContext, Droppable} from "react-beautiful-dnd";

import initialData from "./initial-data";
import Column from "./column";
import Task from "./task";
const loki = require("lokijs");
const fs = window.require('fs');
let db;
let dataNodes;
let nodeList;

const Container = styled.div`
  display: flex;
`;

class InnerList extends React.PureComponent
{
  render()
  {
    const { column, taskMap, index} = this.props;
    const tasks = column.taskIds.map(taskId => taskMap[taskId]);
    return <Column column={column} tasks={tasks} index={index}/>
  }

}

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
  onDragStart = (start, provided) => {
    provided.announce(`You have lifted the task in the position ${start.source.index + 1}`);
    const homeIndex = this.state.columnOrder.indexOf(start.source.droppableId);
    document.body.style.color = 'orange';
    document.body.style.transition = 'background-color 0.2s ease';
    this.setState({
      homeIndex,
    });
  };
  onDragUpdate = (update, provided) => {
    const message = update.destination
    ? `You have moved the task to position ${update.destination.index + 1}`
      : `You are currently not over a droppable area`;
    provided.announce(message);
    const { destination } = update;
    const opacity = destination
    ? destination.index / Object.keys(this.state.tasks).length
      : 0;
    document.body.style.backgroundColor = `rgba(153, 141, 217, ${opacity})`;
  }
onDragEnd = (result, provided) => {
  const message = result.destination
    ? `You have moved the task from position ${result.source.index + 1} to ${result.destination.index + 1}`
    : `The task has been returned to its starting position of  ${result.source.index + 1}`;
  provided.announce(message);
  const { destination, source, draggableId, type } =result;

  this.setState({
      homeIndex: null,
    });
  document.body.style.color = 'inherit' ;

  if(!destination) {
    return;
  }
  if(destination.droppableId === source.droppableId && destination.index === source.index)
  {
    return;
  }
  if(type === 'column')
  {
    const newColumnOrder = Array.from(this.state.columnOrder);
    newColumnOrder.splice(source.index,1);
    newColumnOrder.splice(destination.index,0, draggableId);
    const newState = {
      ...this.state,
      columnOrder: newColumnOrder,
    };
    this.setState(newState);
    return;
  }
  const start = this.state.columns[source.droppableId]
  const finish = this.state.columns[destination.droppableId]

  if (start === finish) {
    const newTaskIds = Array.from(start.taskIds);
    newTaskIds.splice(source.index, 1);
    newTaskIds.splice(destination.index, 0, draggableId);
    const newColumn = {
      ...start,
      taskIds: newTaskIds,
    };

    const newState = {
      ...this.state,
      columns: {
        ...this.state.columns,
        [newColumn.id]: newColumn,
      },
    };

    this.setState(newState);
    return;
  }
    //TODO: update lokijs data here}
//  {this.loadProject(this.props.location.query.projectName)}
  const startTaskIds = Array.from(start.taskIds);
  startTaskIds.splice(source.index, 1);
  const  newStart = {
    ...start,
    taskIds: startTaskIds,
  };

  const finishTaskIds = Array.from(finish.taskIds);
  finishTaskIds.splice(destination.index, 0, draggableId);
  const newFinish = {
    ...finish,
    taskIds: finishTaskIds,
  };
  const newState= {
    ...this.state,
    columns: {
      ...this.state.columns,
      [newStart.id]: newStart,
      [newFinish.id]: newFinish,
    },
  };
  this.setState(newState);
};

  render() {
    return (
      <>
        {this.loadProject('Cubby.json')}

        <Layout>
            <Path />
            <DragDropContext
              onDragEnd={this.onDragEnd}
              onDragUpdate={this.onDragUpdate}
              onDragStart={this.onDragStart}>
              <Droppable
                droppableId="all-columns"
                direction="horizontal"
                type="column"
              >
                { (provided) =>(
                  <Container
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                  {this.state.columnOrder.map((columnId, index) => {
                    const column = this.state.columns[columnId];
                    return (
                      <InnerList
                      key={column.id}
                      column={column}
                      taskMap={this.state.tasks}
                      index={index}
                      />
                    )
                  })}
                    {provided.placeholder}
              </Container>
                )}
              </Droppable>
            </DragDropContext>
        </Layout>
      </>

    );
  }
}

export default ProjectPage;
