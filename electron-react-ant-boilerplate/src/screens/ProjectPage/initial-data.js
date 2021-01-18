const loki = require("lokijs");
const fs = window.require('fs');
let projectFileName
let db;
//let myModule = require('./ProjectPage').initProjectPage('test'); //Prints 'test'

// db = new loki(`./projects/testProject.json`, {
//   autoload: true,
//   autoloadCallback : databaseInitialize,
//   autosave: true,
//   autosaveInterval: 4000
// });

let dataNodes;
let nodeList;
let initialData;
function databaseInitialize() {

  dataNodes = db.getCollection("dataNodes", {
    autoupdate: true
  });
//  console.log(dataNodes)

  if (dataNodes === null) {
    console.log("creating new collection");
    dataNodes = db.addCollection("dataNodes", {
      autoupdate: true
    });
    // defaultCardInformation();
    // defaultColumnInformation();
  }
  let x;
  // nodeList = dataNodes.find({ 'Id': { '$ne': null } });
  // nodeList.forEach(loadInitialData)
  const cardData = dataNodes === null ? {
    count: dataNodes.get(1).count,
    newTask: dataNodes.get(1).newTask,
    tasks: dataNodes.get(1).tasks,
  } : defaultCardInformation();
  const columnData = dataNodes === null ?
    {
      columns: dataNodes.get(2).columns,
      columnOrder: dataNodes.get(2).columnOrder,
    }
    :defaultColumnInformation();
   initialData = dataNodes === null
    ?
    {
      count: cardData.count,
      newTask: cardData.newTask,
      tasks: cardData.tasks,
      columns: columnData.columns,
      columnOrder: columnData.columnOrder,
    }
    :
    {
      count: cardData.count,
      newTask: cardData.newTask,
      tasks: cardData.tasks,
      columns: columnData.columns,
      columnOrder: columnData.columnOrder,
    }
  db.saveDatabase();
  console.log(dataNodes);
  // dataNodes = db.getCollection("dataNodes", {
  //   autoupdate: true
  // });
  //
  // if (dataNodes === null) {
  //   dataNodes = db.addCollection("dataNodes", {
  //     autoupdate: true
  //   });
  //   // defaultCardInformation();
  //   // defaultColumnInformation();
  //   return;
  // }
  // let x;
  // nodeList = dataNodes.find({ 'Id': { '$ne': null } });
  // nodeList.forEach(loadInitialData)
}

function loadInitialData(node,index, arr)
{
  // console.log(index)
  // console.log({node})
  // if (node.parent === undefined || node.parent === null)
  // {
  //   tabledata.push({id:node.$loki, name: node.name, desc: node.description, time: node.time});
  // }
  // else
  // {
  //   console.log({table});
  //   var parentRow = table.getRow(node.parent);
  //   if(parentRow === false)
  //   {
  //     var row = table.getRow(dataNodes.get(node.parent).parent);
  //     var children = row.getTreeChildren();
  //     console.log({children});
  //     let x
  //     for (x = 0; x < children.length; x++)
  //     {
  //       if (children[x]._row.data.id === node.parent)
  //       {
  //         parentRow = children[x];
  //         console.log('found it');
  //       }
  //     }
  //   }
  //   console.log(node.parent);
  //   console.log(parentRow);
  //   console.log({parentRow});
  //
  //   parentRow.addTreeChild ({id:node.$loki,name:node.name, desc:node.description, time:node.time});
  // }
  //
  // table.addData(tabledata);
  // tabledata.length = 0;
}


 exports.defaultColumnInformation = function ()
  {
    let columnInformation;
    columnInformation = {
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

    return columnInformation;
  }


   exports.defaultCardInformation = function ()
  {
    let cardInformation;
    cardInformation = {
    count: 4,
      newTask: '',
    tasks: {
    'task-1': { id: 'task-1', content: 'Take out the trash'},
    'task-2': { id: 'task-2', content: 'Take out the trh2'},
    'task-3': { id: 'task-3', content: 'Take out the trash3'},
    'task-4': { id: 'task-4', content: 'Take out the trash4'},
  },
    };
    console.log('edn')
    return cardInformation;
  }

  // const initialData = {
  //   count: 4,
  // newTask: '',
  // tasks: cardInformation.tasks,
  // columns:{
  //   'column-1': {
  //     id: 'column-1',
  //     title: 'To do',
  //     taskIds: ['task-1', 'task-2', 'task-3', 'task-4'],
  //   },
  //   'column-2': {
  //     id: 'column-2',
  //     title: 'In Progress',
  //     taskIds: [],
  //   },
  //   'column-3': {
  //     id: 'column-3',
  //     title: 'Done',
  //     taskIds: [],
  //   },
  // },
  // columnOrder: ['column-1','column-2','column-3'],
  // };


// const initialData = {
//   count: 4,
//   newTask: '',
//   tasks: {
//     'task-1': { id: 'task-1', content: 'Take out the trash1'},
//     'task-2': { id: 'task-2', content: 'Take out the trash2'},
//     'task-3': { id: 'task-3', content: 'Take out the trash3'},
//     'task-4': { id: 'task-4', content: 'Take out the trash4'},
//   },
//   columns:{
//     'column-1': {
//       id: 'column-1',
//       title: 'To do',
//       taskIds: ['task-1', 'task-2', 'task-3', 'task-4'],
//     },
//     'column-2': {
//       id: 'column-2',
//       title: 'In Progress',
//       taskIds: [],
//     },
//     'column-3': {
//       id: 'column-3',
//       title: 'Done',
//       taskIds: [],
//     },
//   },
//   columnOrder: ['column-1','column-2','column-3'],
//};

exports.init = function(init)
{
  console.log(init);
  return this;
  };

  exports.returnData = function ()
  {
    console.log(initialData);
    return initialData;
  }

  exports.getDB = function () {
    return db;
}

  exports.myMethod = function (cb){

    db = new loki(`./projects/testProject.json`, {
        autoload: true,
        autoloadCallback : () => {
          databaseInitialize();
          !!cb && cb();
        },
        autosave: true,
        autosaveInterval: 4000
      });
    // console.log(db)
    // db.loadDatabase({}, function (result) {
    //   console.log(result);
    //   console.log('check location')
    //   // put your log call here.
    //
    // });
    //   dataNodes = db.getCollection("dataNodes", {
    //     autoupdate: true
    //   });
    //   console.log(dataNodes)
    //
    // if (dataNodes === null) {
    //   console.log("creating new collection");
    //   dataNodes = db.addCollection("dataNodes", {
    //     autoupdate: true
    //   });
    //   // defaultCardInformation();
    //   // defaultColumnInformation();
    // }
    // let x;
    // // nodeList = dataNodes.find({ 'Id': { '$ne': null } });
    // // nodeList.forEach(loadInitialData)
    //   const cardData = dataNodes === null ? {
    //     count: dataNodes.get(1).count,
    //     newTask: dataNodes.get(1).newTask,
    //     tasks: dataNodes.get(1).tasks,
    //   } : defaultCardInformation();
    //   const columnData = dataNodes === null ?
    //     {
    //       columns: dataNodes.get(2).columns,
    //       columnOrder: dataNodes.get(2).columnOrder,
    //     }
    //     :defaultColumnInformation();
    //     initialData = dataNodes === null
    //     ?
    //     {
    //       count: cardData.count,
    //       newTask: cardData.newTask,
    //       tasks: cardData.tasks,
    //       columns: columnData.columns,
    //       columnOrder: columnData.columnOrder,
    //     }
    //     :
    //     {
    //       count: cardData.count,
    //       newTask: cardData.newTask,
    //       tasks: cardData.tasks,
    //       columns: columnData.columns,
    //       columnOrder: columnData.columnOrder,
    //     }
    //   db.saveDatabase();
    //   console.log(dataNodes);
      sleep(1000);
      return initialData;
    };



function sleep(miliseconds) {
  var currentTime = new Date().getTime();

  while (currentTime + miliseconds >= new Date().getTime()) {
//do nothing
  }
}
