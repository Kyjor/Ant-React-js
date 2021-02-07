import React from 'react';
import styles from './column.scss'
import Card from './card';
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
const CardList = styled.div`
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
      //const updateCardContent = this.props.updateCardContent;
     // let showModal = this.props.showModal
      const { cards = {},...rest }= this.props;
      console.log(cards)
      return cards.map((card,index) => (
        <>
          {console.log(index)}
          <Card key={card.id} card={card} index={index} {...rest} >
        </Card>
        </>

      ));
    }

}
export default class Column extends React.Component{
  constructor(props) {
    super(props)
    this.addCard = this.addCard.bind(this)
  }
  addCard()
  {


  }
  render() {
    let createNewCard = this.props.createNewCard;
    let updateCardContent = this.props.updateCardContent;
    let showModal = this.props.showModal;
    let deleteCard = this.props.deleteCard;
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
          type="card"
          //isDropDisabled={ this.props.isDropDisabled }
        >

          {(provided, snapshot) => (
            <div>
              <CardList
                ref={provided.innerRef}
                {...provided.droppableProps}
                isDraggingOver={snapshot.isDraggingOver}
              >
                <InnerList cards={this.props.cards}
                           updateCardContent={(content,id) => updateCardContent(content,id)}
                           showModal={showModal}
                           deleteCard={deleteCard}
                />
                {provided.placeholder}
              </CardList>
            </div>

          )}
        </Droppable>

      </Container>
        )}
      </Draggable>

    );
  }
}
