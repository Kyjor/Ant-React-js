import React from 'react';
import styles from './task.scss'
import {Draggable} from "react-beautiful-dnd";
import styled from "styled-components";
import ContentEditable from 'react-contenteditable'

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
export default class Task extends React.Component{
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
    currentCardId = props.task.id;
   // props.updateTaskContent(evt.target.value, props.task.id);
  };
  handleBlur = () => {
    this.props.updateTaskContent(currentText,this.props.task.id);
    currentText = '';
  }
  render(){
    const updateTaskContent = this.props.updateTaskContent;

    const isDragDisabled = this.props.task.id === 'task-1';
    const taskContent = this.props.task.content === ''
      ? 'empty'
      : this.props.task.content
    ;
    return (
      <Draggable
        draggableId={this.props.task.id}
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
               aria-roledescription="Press space bar to lift the task"
          >
            <Handle {...provided.dragHandleProps} />
            <ContentEditable
              html={taskContent}
              onChange={(evt) => this.handleTextChange(evt,this.props)}
              onFocus={(evt) => this.handleFocus(evt)}
              onBlur={() => this.handleBlur()}
            />
          </Container>
        )}
      </Draggable>
    );
  }
}
