import React from 'react';
import styles from './column.scss'
import Task from './task';
import { Droppable, Draggable } from "react-beautiful-dnd";
import styled from 'styled-components';

const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgray;
  border-radius: 2px;
  width: 220px;

  display: flex;
  flex-direction: column;
`;
const Title = styled.h3`
  padding: 8px;
`;
const TaskList = styled.div`
  padding: 8px;
  background-color: ${props => props.isDraggingOver ? 'skyblue' : 'white'};
  flex-grow: 1;
  min-height: 200px;
`;
export default class Column extends React.Component{
  render() {
    return (
      <Draggable draggableId={this.props.column.id} index={this.props.index}>
        {(provided) => (

      <Container
        {...provided.draggableProps}
        ref={provided.innerRef}
      >
        <Title {...provided.dragHandleProps}>
          {this.props.column.title}</Title>
        <Droppable
          droppableId={this.props.column.id}
          //type={this.props.column.id === 'column-3' ? 'done' : 'active'}
          type="task"
          //isDropDisabled={ this.props.isDropDisabled }
        >

          {(provided, snapshot) => (
            <div>
              <TaskList
                ref={provided.innerRef}
                {...provided.droppableProps}
                isDraggingOver={snapshot.isDraggingOver}
              >

                {this.props.tasks.map((task, index) => <Task key={task.id} task={task} index={index}/>)}
                {provided.placeholder}
              </TaskList>
            </div>

          )}
        </Droppable>

      </Container>
        )}
      </Draggable>

    );
  }
}
