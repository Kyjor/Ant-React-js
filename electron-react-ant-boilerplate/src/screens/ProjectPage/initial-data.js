let initialData;

exports.newCard = function (id)
{
  return {id: `task-${id}`, content: `Take out the trash${id}`}
}
exports.newColumn = function (id)
{
  return {id: `column-${id}`, title: `column ${id}`, taskIds: [`task-${id}`]}
}

exports.init = function(init)
{
  return this;
};

exports.defaultCardInformation = function ()
{
  return {
    count: 4,
    newTask: '',
    tasks: {
      'task-1': { id: 'task-1', content: 'Take out the trash'},
      'task-2': { id: 'task-2', content: 'Take out the trh2'},
      'task-3': { id: 'task-3', content: 'Take out the trash3'},
      'task-4': { id: 'task-4', content: 'Take out the trash4'},
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
        taskIds: ['task-1', 'task-2', 'task-3', 'task-4'],
      },
      'column-2': {
        id: 'column-2',
        title: 'In Progress',
        taskIds: [],
      },
      'column-3': {
        id: 'column-3',
        title: 'Done',
        taskIds: [],
      },
    },
    columnOrder: ['column-1','column-2','column-3'],
  };

}
