import React from 'react';
import styles from './column.scss'
import Task from './task';
import { Droppable} from "react-beautiful-dnd";
import styled from 'styled-components';

const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgray;
  border-radius: 2px;
`;
const Title = styled.h3`
  padding: 8px;
`;
const TaskList = styled.div`
  padding: 8px;
`;
export default class Column extends React.Component{
  render() {
    return (

      <Container>
        <Title className={styles.title}> {this.props.column.title}</Title>
        <Droppable droppableId={this.props.column.id}>

          {(provided) => (
            <div>
              <TaskList
                ref={provided.innerRef}
                {...provided.droppableProps}>
                {this.props.tasks.map((task, index) => <Task key={task.id} task={task} index={index}/>)}
                {provided.placeholder}
              </TaskList>
            </div>

          )}
        </Droppable>

      </Container>
    );
  }
}
