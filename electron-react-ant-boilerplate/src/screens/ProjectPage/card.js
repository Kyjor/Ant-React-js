import React from 'react';
import styles from './card.scss'
import {Draggable} from "react-beautiful-dnd";
import styled from "styled-components";
import ContentEditable from 'react-contenteditable'
import {Button} from "antd";

const Container = styled.div`
    border-radius: 2px;

    padding: 8px;
    margin-bottom: 8px;
    background-color: ${props => props.isDragDisabled
      ? 'lightgrey'
      : props.isDragging
        ? 'lightgreen'
        : 'white'};
  display: flex;
`;

const Handle = styled.div`
  width: 20px;
  height: 20px;
  background-color: orange;
  border-radius: 4px;
  margin-right: 8px;
`;
const EditButton = styled.button`
`;
let currentText = '';
let currentCardId = null;
export default class Card  extends React.Component{
  constructor(props) {
    super(props);
   // this.handleBlur = this.handleBlur.bind(this);
  }
  handleFocus = (evt) => {
    var test = evt;
    this.currentText = evt.target.innerText;
  }
  handleTextChange = (evt, props) => {
    //this.setState({ content: evt.target.value });
    currentText = evt.target.value;
    currentCardId = props.card.id;
   // props.updateCardContent(evt.target.value, props.card.id);
  };
  handleBlur = () => {
    this.props.updateCardContent(currentText,this.props.card.id);
    currentText = '';
  }
  handleOpen = (cardContent) =>
  {
    this.props.showModal(cardContent);
  }
  handleDelete = (cardId, columnId) =>
  {
    this.props.deleteCard(cardId, columnId);
  }
  render(){
    const updateCardContent = this.props.updateCardContent;

    const isDragDisabled = this.props.card.id === 'card-1';
    const cardContent = this.props.card.content === ''
      ? 'empty'
      : this.props.card.content
    ;

    return (
      <Draggable
        draggableId={this.props.card.id}
        index={this.props.index}
        isDragDisabled={isDragDisabled}
      >

        {(provided, snapshot) =>(
          <Container
               {...provided.draggableProps}
               {...provided.dragHandleProps}
               ref={provided.innerRef}
               isDragging={snapshot.isDragging}
               isDragDisabled={isDragDisabled}
               aria-roledescription="Press space bar to lift the card"
          >
            <Handle {...provided.dragHandleProps} />
            <ContentEditable
              html={cardContent}
              onChange={(evt) => this.handleTextChange(evt,this.props)}
              onFocus={(evt) => this.handleFocus(evt)}
              onBlur={() => this.handleBlur()}
            />
            <Button onClick={() => this.handleOpen(cardContent)}></Button>
            <Button onClick={() => this.handleDelete(this.props.card.id, this.props.card.parent.id)}></Button>
          </Container>

        )}
      </Draggable>
    );
  }
}
