const initial =
/*
* First, we should read out and construct our columns
* Second, we attach children nodes to the columns
* */

  {
    taskCount: 4, // taskCountNode
    newTask: '', //newTaskNode
    tasks: {
      'task-1': {id: 'task-1', content: 'Take out the trash'}, //separate taskNodes
      'task-2': {id: 'task-2', content: 'Take out the trh2'},
      'task-3': {id: 'task-3', content: 'Take out the trash3'},
      'task-4': {id: 'task-4', content: 'Take out the trash4'},
    },
    columnCount: 3, // columnCount
    columns: {
      'column-1': { //separateColumnNodes
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
    columnOrder: ['column-1', 'column-2', 'column-3'],
  }
