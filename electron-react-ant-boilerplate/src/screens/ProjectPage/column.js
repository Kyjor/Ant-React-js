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

class InnerList extends React.PureComponent
{
  constructor(props) {
    super(props)
  }
  // shouldComponentUpdate(nextProps)
  // {
  //   if(nextProps.tasks === this.props.tasks)
  //   {
  //     return false;
  //   }
  //   return true;
  // }

    render()
    {
      //const updateTaskContent = this.props.updateTaskContent;
     // let showModal = this.props.showModal
      const { tasks = [],...rest }= this.props;

      return tasks.map((task,index) => (
         <Task key={task.id} task={task} index={index} {...rest} >
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


  }
  render() {
    let createNewCard = this.props.createNewCard;
    let updateTaskContent = this.props.updateTaskContent;
    let showModal = this.props.showModal;
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
          <AddButton onClick={() => createNewCard(this.props.column.id)}>+</AddButton>
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
                <InnerList tasks={this.props.tasks}
                           updateTaskContent={(content,id) => updateTaskContent(content,id)}
                           showModal={showModal}

                />
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
