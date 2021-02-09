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
import Card from "./card";
import { Modal, Button } from 'antd';
const electron = window.require('electron')
const ipcRenderer = electron.ipcRenderer;
const fs = electron.fs;
//if you use fs

const Container = styled.div`
  display: flex;
`;
class InnerList extends React.PureComponent
{
  render()
  {
    const { column, cardMap, index} = this.props;
    const cards = column.cardIds.map(cardId => cardMap[cardId]);
    console.log(column)
    let createNewCard = this.props.createNewCard;
    let showModal = this.props.showModal;
    let deleteCard = this.props.deleteCard;
    let updateCardContent = this.props.updateCardContent;
    return <Column column={column} cards={cards} index={index} createNewCard = {createNewCard.bind(this)}showModal={showModal.bind(this)} deleteCard={deleteCard.bind(this)}  updateCardContent={updateCardContent.bind(this)}/>
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
    this.updateCardContent = this.updateCardContent.bind(this);
    this.testCallback = this.testCallback.bind(this);
    this.showModal = this.showModal.bind(this);
    this.deleteCard = this.deleteCard.bind(this);

    this.createAddWindow = this.createAddWindow.bind(this);

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
        [card.id]:{id: card.id, content:card.content, parent:card.parent, isArchived:false}
      }
    })

    columnList.forEach(thisColumn => {
      allColumns = {
        ...allColumns,
        [thisColumn.id]:{id:thisColumn.id, title:thisColumn.title, cardIds: thisColumn.cardIds}
      }
    })

    cardData = {
        count: cardCountNode.get(1).count,
        newCard: cardTemplateNodes.get(1).content,
        cards:cards,
      }
       columnData =
        {
          columns:allColumns,
          columnOrder: columnOrderNode.get(1).columnOrder,
        }

    const newState = {
      ...this.state,
      count: cardData.count,
      newCard: cardData.newCard,
      cards: cardData.cards,
      columns: columnData.columns,
      columnOrder: columnData.columnOrder,
    };
    this.setState(newState);
  }

  createAddWindow()
  {
    console.log(ipcRenderer)
    ipcRenderer.send('project:window');
    console.log('created add window')
  }

  componentDidMount() {
    ipcRenderer.send('MSG_FROM_RENDERER', 'hello main');
    //this.createAddWindow();
    LokiService.init(() => {
      this.testCallback();
      this.setState({ lokiLoaded: true })
    });
  }

  createNewCard(columnId)
  {
    const prevCards = this.state.cards;
    const newCount = this.state.count + 1;
    const newId = `card-${newCount}`;
    const newContent = `Take out the trash${newCount}`
    LokiService.createCard(newId, newContent, columnId, newCount);
    const prevCardIds = this.state.columns[columnId].cardIds;
    const newCardIds = [...prevCardIds, newId]
    const newCardList = {
      ...prevCards,
      [newId]: {id: newId, content: newContent, parent: columnId},
    }
    let newColumns = this.state.columns;
    newColumns = {
      ...newColumns,
      [columnId]: {
        ...newColumns[columnId],
        cardIds: newCardIds,
      }
    }

    const newState = {
      ...this.state,
      cards: newCardList,
      columns: newColumns,
      count: newCount,
    };
    this.setState(newState);
  }
  updateCardContent(newContent, cardId)
  {
    console.log(cardId)
    LokiService.updateCard(newContent,cardId);
    const prevCards = this.state.cards;
    const newCardList = {
      ...prevCards,
      [cardId]: {id: cardId, content: newContent},
    }

    const newState = {
      ...this.state,
      cards: newCardList,
    };
    this.setState(newState);
  }

  onDragStart = (start, provided) => {
    provided.announce(`You have lifted the card in the position ${start.source.index + 1}`);
    const homeIndex = this.state.columnOrder.indexOf(start.source.droppableId);
    document.body.style.transition = 'background-color 0.2s ease';
    this.setState({
      homeIndex,
    });
  };
  onDragUpdate = (update, provided) => {
    const message = update.destination
    ? `You have moved the card to position ${update.destination.index + 1}`
      : `You are currently not over a droppable area`;
    provided.announce(message);
    const { destination } = update;
    const opacity = destination
    ? destination.index / Object.keys(this.state.cards).length
      : 0;
    document.body.style.backgroundColor = `rgba(153, 141, 217, ${opacity})`;
  }
onDragEnd = (result, provided) => {
  const message = result.destination
    ? `You have moved the card from position ${result.source.index + 1} to ${result.destination.index + 1}`
    : `The card has been returned to its starting position of  ${result.source.index + 1}`;
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
    const newCardIds = Array.from(start.cardIds);
    newCardIds.splice(source.index, 1);
    newCardIds.splice(destination.index, 0, draggableId);
    const newColumn = {
      ...start,
      cardIds: newCardIds,
    };

    const newState = {
      ...this.state,
      columns: {
        ...this.state.columns,
        [newColumn.id]: newColumn,
      },
    };
    console.log('changed card id order')
    LokiService.updateColumnCardIdOrder(newColumn)
    this.setState(newState);
    return;
  }

  const startCardIds = Array.from(start.cardIds);
  startCardIds.splice(source.index, 1);
  const  newStart = {
    ...start,
    cardIds: startCardIds,
  };

  const finishCardIds = Array.from(finish.cardIds);
  finishCardIds.splice(destination.index, 0, draggableId);
  const newFinish = {
    ...finish,
    cardIds: finishCardIds,
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
  LokiService.updateCardsInColumns(newStart, newFinish);
  this.setState(newState);
};

  showModal = (cardContent) => {
    console.log(cardContent)
    this.setState({
      visible: true,
      modalContent: cardContent,
    });
  };
  deleteCard = (cardId, columnId) => {
     const newCount = this.state.count;
     LokiService.deleteCard(cardId,columnId,newCount);
     const newCardIds = this.state.columns[columnId].cardIds;
    newCardIds.splice(newCardIds.indexOf(cardId),1);
     let newCardList = this.state.cards;
      delete newCardList[cardId];
      console.log(newCardList)
     let newColumns = this.state.columns;
     newColumns = {
       ...newColumns,
       [columnId]: {
         ...newColumns[columnId],
         cardIds: newCardIds,
       }
    }
    console.log(newColumns)

     const newState = {
       ...this.state,
       cards: newCardList,
       columns: newColumns,
       count: newCount,
     };
     this.setState(newState);

  };

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false,

    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
      modalContent: '',

    });
  };

  render() {
      return this.state.lokiLoaded ? (
        <>
          <Layout>
            <Path />
            <div>
            <Button type="primary" onClick={() => {
              this.showModal()
              ipcRenderer.send('MSG_FROM_RENDERER', 'hello main');

            }}>
              Open Modal
            </Button>
            <Modal
              title="Basic Modal"
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
            >
              <p>{this.state.modalContent}</p>
              <p>Some contents...</p>
              <p>Some contents...</p>
            </Modal>
          </div>
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
                          cardMap={this.state.cards}
                          index={index}
                          createNewCard = {this.createNewCard.bind(this)}
                          updateCardContent = {this.updateCardContent.bind(this)}
                          showModal={this.showModal.bind(this)}
                          deleteCard={this.deleteCard.bind(this)}
                        />
                      )})}
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
