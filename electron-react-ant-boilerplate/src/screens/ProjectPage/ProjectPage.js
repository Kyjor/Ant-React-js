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
import LokiService from "../../services/LokiService"; // or wherever the above file is stored

let myModule = require('./initial-data').init('test'); //Prints 'test'

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
    let createNewCard = this.props.createNewCard;
    let updateTaskContent = this.props.updateTaskContent;

    return <Column column={column} tasks={tasks} index={index} createNewCard = {createNewCard.bind(this)} updateTaskContent={updateTaskContent.bind(this)}/>
  }

}

/**
 * Home
 *
 * @class Projects
 * @extends {Component}
 */
exports.initProjectPage = function(init)
{
  console.log(init);
  return this;
};
let initialData;
exports.setInitialData = function (data)
{
  console.log(data);
  initialData = data;
}
let isDBLoaded;
class ProjectPage extends Component {
  constructor(props) {
    super(props);
    this.loadProject = this.loadProject.bind(this);
    this.databaseInitialize = this.databaseInitialize.bind(this);
    this.addNodeToTable = this.addNodeToTable.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.createNewCard = this.createNewCard.bind(this);
    this.updateTaskContent = this.updateTaskContent.bind(this);
    // this.fetchData = this.fetchData.bind(this);
    // this.fetchData().then(r => {
    //   this.state = r;
    // });
    this.testCallback = this.testCallback.bind(this);
    //this.state = myModule.returnData();

     // console.log(this.state);a
    isDBLoaded = false;

    this.state = {
      lokiLoaded: false
    }

  }
  testCallback () {
    console.log('Im done');

    const db = LokiService.getDb(() => {console.log('getDb') })
    console.log(db);
    dataNodes = db.getCollection("dataNodes", {
      autoupdate: true
    });
    console.log(dataNodes)
    console.log('1')
    let cardData
    let columnData
    if(dataNodes !== null)
    {
       cardData = {
        count: dataNodes.get(1).count,
        newTask: dataNodes.get(1).newTask,
        tasks: dataNodes.get(1).tasks,
      }
       columnData =
        {
          columns: dataNodes.get(2).columns,
          columnOrder: dataNodes.get(2).columnOrder,
        }
    }
    else if (dataNodes === null)
    {
      dataNodes = db.addCollection("dataNodes", {
        autoupdate: true
      })
       cardData = dataNodes.insert(myModule.defaultCardInformation());
       columnData =dataNodes.insert(myModule.defaultColumnInformation());
    }
    // const cardData = dataNodes !== null ? {
    //   count: dataNodes.get(1).count,
    //   newTask: dataNodes.get(1).newTask,
    //   tasks: dataNodes.get(1).tasks,
    // } : () => {
    //   dataNodes = db.addCollection("dataNodes", {
    //     autoupdate: true
    //   })
    //   dataNodes.insert(myModule.defaultCardInformation());
    // };

    console.log('2')

    // const columnData = dataNodes !== null ?
    //   {
    //     columns: dataNodes.get(2).columns,
    //     columnOrder: dataNodes.get(2).columnOrder,
    //   }
    //   : dataNodes.insert(myModule.defaultColumnInformation());
    console.log('3')

    initialData =
      {
        count: cardData.count,
        newTask: cardData.newTask,
        tasks: cardData.tasks,
        columns: columnData.columns,
        columnOrder: columnData.columnOrder,
      }
 //     :
 //      {
 //        count: cardData.count,
 //        newTask: cardData.newTask,
 //        tasks: cardData.tasks,
 //        columns: columnData.columns,
 //        columnOrder: columnData.columnOrder,
 //      }
    console.log('4')

    db.saveDatabase();

    const newState = {
      ...this.state,
      initialData
    };
    console.log('hi')
    this.setState(newState);
    //isDBLoaded = true;
    console.log(this.state.initialData.tasks)
  }
  // componentDidMount() {
  //   myModule.myMethod(this.testCallback);
  // }
  componentDidMount() {
    LokiService.init(() => {
      console.log('loaded')
      this.testCallback();
      this.setState({ lokiLoaded: true })
      //myModule.myMethod(this.testCallback);

    });
  }

  fetchData = async () => {
    let data  = await myModule.myMethod();
    console.log(data);
    return data;
  }
  createNewCard(columnId)
  {
    const prevTasks = this.state.initialData.tasks;
    const newCount = this.state.initialData.count + 1;
    const newId = `task-${newCount}`;
    const newTaskList = {
      ...prevTasks,
      [newId]: {id: newId, content: `Take out the trash${newCount}`},
    }
    let newColumns = this.state.initialData.columns;
    newColumns = {
      ...newColumns,
      [columnId]: {
        ...newColumns[columnId],
        taskIds: [...newColumns[columnId].taskIds, newId],
      }
    }
    //newTaskList.push({['task-5']: {id: 'task-5', content: 'Take out the trash5'}})

    const newState = {
      ...this.state,
      tasks: newTaskList,
      columns: newColumns,
      count: newCount,
    };
    this.setState(newState);
  }
  updateTaskContent(newContent, taskId)
  {
    console.log('updating content')
    const prevTasks = this.state.initialData.tasks;
    const newTaskList = {
      ...prevTasks,
      [taskId]: {id: taskId, content: newContent},
    }

    const newState = {
      ...this.state,
      tasks: newTaskList,
    };
    this.setState(newState);
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
    //console.log(index)
    //console.log({node})
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
    const homeIndex = this.state.initialData.columnOrder.indexOf(start.source.droppableId);
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
    ? destination.index / Object.keys(this.state.initialData.tasks).length
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
    const newColumnOrder = Array.from(this.state.initialData.columnOrder);
    newColumnOrder.splice(source.index,1);
    newColumnOrder.splice(destination.index,0, draggableId);
    const newState = {
      ...this.state,
      columnOrder: newColumnOrder,
    };
    this.setState(newState);
    return;
  }
  const start = this.state.initialData.columns[source.droppableId]
  const finish = this.state.initialData.columns[destination.droppableId]

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
        ...this.state.initialData.columns,
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
    {console.log(this.state.lokiLoaded)}
      return this.state.lokiLoaded ? (
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
                    {this.state.initialData.columnOrder.map((columnId, index) => {
                      const column = this.state.initialData.columns[columnId];
                      return (
                        <InnerList
                          key={column.id}
                          column={column}
                          taskMap={this.state.initialData.tasks}
                          index={index}
                          createNewCard = {this.createNewCard.bind(this)}
                          updateTaskContent = {this.updateTaskContent.bind(this)}
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
    ) : (
      <div>Loading...</div>
      );
    }
}

export default ProjectPage;
