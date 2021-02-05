let initialData;

exports.newCard = function (id)
{
  return {id: `card-${id}`, content: `Take out the trash${id}`}
}
exports.newColumn = function (id)
{
  return {id: `column-${id}`, title: `column ${id}`, cardIds: [`card-${id}`]}
}

exports.init = function(init)
{
  return this;
};

exports.defaultCardInformation = function ()
{
  return {
    count: 4,
    newCard: '',
    cards: {
      'card-1': { id: 'card-1', content: 'Take out the trash'},
      'card-2': { id: 'card-2', content: 'Take out the trh2'},
      'card-3': { id: 'card-3', content: 'Take out the trash3'},
      'card-4': { id: 'card-4', content: 'Take out the trash4'},
    },
  };
}


exports.defaultColumnInformation = function ()
{
  return  {
    columns:{
      'column-1': {
        id: 'column-1',
        title: 'To do',
        cardIds: ['card-1', 'card-2', 'card-3', 'card-4'],
      },
      'column-2': {
        id: 'column-2',
        title: 'In Progress',
        cardIds: [],
      },
      'column-3': {
        id: 'column-3',
        title: 'Done',
        cardIds: [],
      },
    },
    columnOrder: ['column-1','column-2','column-3'],
  };

}
