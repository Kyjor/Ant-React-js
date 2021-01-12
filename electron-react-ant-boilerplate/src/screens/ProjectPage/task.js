import React from 'react';
import styles from './task.scss'
import {Draggable} from "react-beautiful-dnd";
import styled from "styled-components";

const Container = styled.div`
    border-radius: 2px;
    padding: 8px;
    margin-bottom: 8px;
    background-color: white;
`;
export default class Task extends React.Component{



  render(){
    return (
      <Draggable draggableId={this.props.task.id} index={this.props.index}>

        {(provided) =>(
          <Container
               {...provided.draggableProps}
               {...provided.dragHandleProps}
            ref={provided.innerRef}
          >{this.props.task.content}</Container>
        )}
      </Draggable>
    );
  }
}
