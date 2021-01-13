import React from 'react';
import styles from './column.scss'
import Task from './task';
import { Droppable, Draggable } from "react-beautiful-dnd";
import styled from 'styled-components';

const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgray;
  background-color: white;
  border-radius: 2px;
  width: 220px;

  display: flex;
  flex-direction: column;
`;
const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
const Title = styled.h3`
  padding: 8px;

`;
const AddButton = styled.button`
  padding: 5px;
  align-self:center;
  margin-right: 5px;

`;
const TaskList = styled.div`
  padding: 8px;
  background-color: ${props => props.isDraggingOver ? 'skyblue' : 'inherit'};
  flex-grow: 1;
  min-height: 200px;
`;

class InnerList extends React.Component
{
  // shouldComponentUpdate(nextProps)
  // {
  //   if(nextProps.tasks === this.props.tasks)
  //   {
  //     return false;
  //   }
  //   return true;
  // }
  constructor() {
    super();
    this.callApi = this.callApi.bind(this);
  }
  callApi = () => {
    console.log('render');
    this.render();
  }
    render()
    {
      console.log('Rendering tasks');
      return this.props.tasks.map((task,index) => (
        <Task key={task.id} task={task} index={index}>
          {console.log(task)}
        </Task>
      ));
    }

}
export default class Column extends React.Component{
  constructor(props) {
    super(props)
    this.addTask = this.addTask.bind(this)
  }
  addTask()
  {
    console.log('task');
    const newTaskList = this.props.tasks;
    newTaskList.push('task-5':({id: 'task-5', content: 'Take out the trash5'}))
    const newState = {
      ...this.state,
      tasks: newTaskList,
    };
    this.setState(newState);
    return;
  }
  render() {
    return (
      <Draggable draggableId={this.props.column.id} index={this.props.index}>
        {(provided) => (

      <Container
        {...provided.draggableProps}
        ref={provided.innerRef}
      >
        <TitleContainer>
          <Title {...provided.dragHandleProps}>
            {this.props.column.title}</Title>
          <AddButton onClick={this.addTask}>+</AddButton>
        </TitleContainer>
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
                <InnerList tasks={this.props.tasks}/>
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
