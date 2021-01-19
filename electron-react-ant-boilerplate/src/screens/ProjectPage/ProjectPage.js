// Libs
import React, { Component } from "react";
// Styled
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
class ProjectPage extends Component {
  constructor(props) {
    super(props);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.createNewCard = this.createNewCard.bind(this);
    this.updateTaskContent = this.updateTaskContent.bind(this);
    this.testCallback = this.testCallback.bind(this);

    this.state = {
      lokiLoaded: false
    }
  }
  testCallback () {
    const cardNodes = LokiService.getCollection('cardNodes');
    let x;
    //            nodeList = dataNodes.find({ 'Id': { '$ne': null } });
    if (cardNodes.find({ 'Id': { '$ne': null } }).length === 0)
    {
      for(x = 1; x < 6; x++)
      {
        cardNodes.insert(myModule.newCard(x))
      }
    }

    const cardCountNode = LokiService.getCollection('cardCountNode');
    if(cardCountNode.find({ 'Id': { '$ne': null } }).length === 0)
    {
      cardCountNode.insert({count: x-1,})
    }
    const cardTemplateNodes = LokiService.getCollection('cardTemplateNodes');
    if(cardTemplateNodes.find({ 'Id': { '$ne': null } }).length === 0)
    {
      cardTemplateNodes.insert({content: '',})
    }
    const columnCountNode = LokiService.getCollection('columnCountNode');
    if(columnCountNode.find({ 'Id': { '$ne': null } }).length === 0)
    {
      columnCountNode.insert({count: x-1})
    }
    const columnNodes = LokiService.getCollection('columnNodes');
    if(columnNodes.find({ 'Id': { '$ne': null } }).length === 0)
    {
      for(x = 1; x < 6; x++)
      {
        columnNodes.insert(myModule.newColumn(x))
      }
    }
    const columnOrderNode = LokiService.getCollection('columnOrderNode');
    if(columnOrderNode.find({ 'Id': { '$ne': null } }).length === 0)
    {
      columnOrderNode.insert({columnOrder: ['column-1','column-2','column-3','column-4','column-5'],})
    }
    //columnNodes.update(selectedColumn);
    //cardCountNode.update(cardCountNode.get(1));
    //LokiService.updateCollection(cardCountNode.get(1))
    LokiService.saveDB();


    let cardData
    let columnData
    let cardList = cardNodes.find({ 'Id': { '$ne': null } });
    let columnList = columnNodes.find({ 'Id': { '$ne': null } });
    let cards = {};
    let allColumns = {};
    cardList.forEach(card => {
      cards = {
        ...cards,
        [card.id]:{id: card.id, content:card.content}
      }
    })

    columnList.forEach(thisColumn => {
      allColumns = {
        ...allColumns,
        [thisColumn.id]:{id:thisColumn.id, title:thisColumn.title, taskIds: thisColumn.taskIds}
      }
    })



    cardData = {
        count: cardCountNode.get(1).count,
        newTask: cardTemplateNodes.get(1).content,
        tasks:cards,
      }
       columnData =
        {
          columns:allColumns,
          columnOrder: columnOrderNode.get(1).columnOrder,
        }

    const newState = {
      ...this.state,
      count: cardData.count,
      newTask: cardData.newTask,
      tasks: cardData.tasks,
      columns: columnData.columns,
      columnOrder: columnData.columnOrder,
    };
    this.setState(newState);
  }

  componentDidMount() {
    LokiService.init(() => {
      this.testCallback();
      this.setState({ lokiLoaded: true })
    });
  }

  createNewCard(columnId)
  {
    const prevTasks = this.state.tasks;
    const newCount = this.state.count + 1;
    const newId = `task-${newCount}`;
    const newContent = `Take out the trash${newCount}`
    LokiService.createCard(newId, newContent, columnId, newCount);
    const prevTaskIds = this.state.columns[columnId].taskIds;
    const newTaskIds = [...prevTaskIds, newId]
    const newTaskList = {
      ...prevTasks,
      [newId]: {id: newId, content: newContent},
    }
    let newColumns = this.state.columns;
    newColumns = {
      ...newColumns,
      [columnId]: {
        ...newColumns[columnId],
        taskIds: newTaskIds,
      }
    }

    const newState = {
      ...this.state,
      tasks: newTaskList,
      columns: newColumns,
      count: newCount,
    };
    this.setState(newState);
  }
  updateTaskContent(newContent, cardId)
  {
    LokiService.updateCard(newContent,cardId);
    const prevTasks = this.state.tasks;
    const newTaskList = {
      ...prevTasks,
      [cardId]: {id: cardId, content: newContent},
    }

    const newState = {
      ...this.state,
      tasks: newTaskList,
    };
    this.setState(newState);
  }

  onDragStart = (start, provided) => {
    provided.announce(`You have lifted the task in the position ${start.source.index + 1}`);
    const homeIndex = this.state.columnOrder.indexOf(start.source.droppableId);
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
    LokiService.updateColumnOrder(newColumnOrder);
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
    console.log('changed task id order')
    LokiService.updateColumnTaskIdOrder(newColumn)
    this.setState(newState);
    return;
  }

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
  console.log('moved')
  this.setState(newState);
};

  render() {
      return this.state.lokiLoaded ? (
        <>
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
                    {

                      this.state.columnOrder.map((columnId, index) => {
                      const column = this.state.columns[columnId];
                      return (
                        <InnerList
                          key={column.id}
                          column={column}
                          taskMap={this.state.tasks}
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
