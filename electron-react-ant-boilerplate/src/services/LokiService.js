
const loki = require("lokijs");
// import Loki here...
class LokiService {
  constructor(props) {
    // initial property values
    this.db = null;
    this.dbList = {};
    this.dataNodes = null;
    this.cardNodes = null;
    this.cardCountNode = null;
    this.cardTemplateNodes = null;
    this.columnCountNode = null;
    this.columnNodes = null;
    this.columnOrderNode = null;

    // function bindings
    this.dbInitialized = this.dbInitialized.bind(this);
    this.init = this.init.bind(this);
    this.getDb = this.getDb.bind(this);
    this.getComments = this.getComments.bind(this);
    this.deleteCard = this.deleteCard.bind(this);
    this.updateCard = this.updateCard.bind(this);
    this.updateColumnOrder = this.updateColumnOrder.bind(this);
    this.updateColumnCardIdOrder = this.updateColumnCardIdOrder.bind(this);
    this.updateCardsInColumns = this.updateCardsInColumns.bind(this);
    this.saveDB = this.saveDB.bind(this);
    this.updateCollection = this.updateCollection.bind(this);
  }

  /**
   * @function dbInitialized
   * @desc used when Loki is done initializing the local instance
   */
  dbInitialized = () => {
    // do something when the db is successfully set up
    this.cardCountNode = this.db.getCollection("cardCountNode", {
      autoupdate: true
    });

    if (this.cardCountNode === null) {
      this.cardCountNode = this.db.addCollection("cardCountNode", {
        autoupdate: true
      });
    }
    //
    this.cardNodes = this.db.getCollection("cardNodes", {
      autoupdate: true
    });

    if (this.cardNodes === null) {
      this.cardNodes = this.db.addCollection("cardNodes", {
        autoupdate: true
      });
    }
    //
    this.cardTemplateNodes = this.db.getCollection("cardTemplateNodes", {
      autoupdate: true
    });

    if (this.cardTemplateNodes === null) {
      this.cardTemplateNodes = this.db.addCollection("cardTemplateNodes", {
        autoupdate: true
      });
    }
    //
    this.columnCountNode = this.db.getCollection("columnCountNode", {
      autoupdate: true
    });

    if (this.columnCountNode === null) {
      this.columnCountNode = this.db.addCollection("columnCountNode", {
        autoupdate: true
      });
    }
    //columnNodes
    this.columnNodes = this.db.getCollection("columnNodes", {
      autoupdate: true
    });

    if (this.columnNodes === null) {
      this.columnNodes = this.db.addCollection("columnNodes", {
        autoupdate: true
      });
    }
    //columnNodes
    this.columnOrderNode = this.db.getCollection("columnOrderNode", {
      autoupdate: true
    });

    if (this.columnOrderNode === null) {
      this.columnOrderNode = this.db.addCollection("columnOrderNode", {
        autoupdate: true
      });
    }
  };

  /**
   * @function init
   * @desc call on startup of app to initialize Loki
   */
  init = cb => {
    // run loki stuff here
    this.db = new loki("./projects/Project.json", {
      // options
      autoload: true,
      autoloadCallback/* or dbInitialize?? whatever the property is for when the context is ready */: () => {
        this.dbInitialized();
        !!cb && cb();
      },
    });
  };

  getDb = () => {

    return  this.db;
  };

  getCollection = (collection) => {
    if(collection === 'cardCountNode') { return this.cardCountNode }
    if(collection === 'cardTemplateNodes') { return this.cardTemplateNodes }
    if(collection === 'columnCountNode') { return this.columnCountNode }
    if(collection === 'columnNodes') { return this.columnNodes }
    if(collection === 'columnOrderNode') { return this.columnOrderNode }
    if(collection === 'cardNodes') { return this.cardNodes }

    return null;
  }
  updateCollection = (node) => {
    this.cardCountNode.update(node)
    this.db.saveDatabase()
  }

  insert = (newObject) => {
    this.cardCountNode.insert(newObject)
    this.db.saveDatabase()
  }

  /**
   * UTILITIES
   *
   * @description create helper/utility functions for your use cases.  If you need to CRUD (create, read, update, delete) comments,
   * create functions here to help you do that so that every component can use them instead of copying the same functions into each
   * component that needs them
   * @func getCards
   * @func removeCards
   * @func updateCards
   *
   */
  createCard = (cardId, cardContent, columnId, newCount) => {
    let cardCount = this.cardCountNode.get(1);
    cardCount.count = newCount;
    let columnIdInt = parseInt(columnId.slice(7, columnId.length));
    this.cardNodes.insert({id: cardId, content: cardContent, parent: columnId});
    let selectedColumn = this.columnNodes.get(columnIdInt);
    selectedColumn.cardIds = [...selectedColumn.cardIds, cardId]

    this.columnNodes.update(selectedColumn);
    this.cardCountNode.update(cardCount);
    this.db.saveDatabase();
  }
  getComments = () => {
    // return cards here (or throw error)
  };
  deleteCard = (cardId, columnId, newCount) => {
    let cardCount = this.cardCountNode.get(1);
    cardCount.count = newCount;
    let columnIdInt = parseInt(columnId.slice(7, columnId.length));
    let selectedColumn = this.columnNodes.get(columnIdInt);
    let cardIdInt =  parseInt(cardId.slice(5,cardId.length));
    let cardObject = this.cardNodes.get(cardIdInt);
    this.cardNodes.remove(cardObject);

    const newCardIds = selectedColumn.cardIds;
    newCardIds.splice(newCardIds.indexOf(cardId),1);

    selectedColumn = {
      ...selectedColumn,
      [columnId]: {
        ...selectedColumn[columnId],
        cardIds: newCardIds,
      }
    }


    this.columnNodes.update(selectedColumn);
    this.cardCountNode.update(cardCount);
    this.db.saveDatabase();
  };

  updateCard = (cardContent,cardId) => {
    let cardIdInt =  parseInt(cardId.slice(5,cardId.length));
    console.log(cardIdInt)
    // update cards here and return execution status (or throw error)
    let cardObject = this.cardNodes.get(cardIdInt);
    cardObject.content = cardContent;
    this.cardNodes.update(cardObject);
    this.db.saveDatabase();
  };

  updateColumnOrder = (columnOrder) => {
    let order = this.columnOrderNode.get(1);
    order.columnOrder = columnOrder;
    this.columnOrderNode.update(order);
    this.db.saveDatabase();
  }
  updateColumnCardIdOrder = (newColumn) => {

    let columnIdInt = parseInt(newColumn.id.slice(7,8));
    let column = this.columnNodes.get(columnIdInt);
    console.log(column)
    column.cardIds = newColumn.cardIds;
    this.columnNodes.update(column);
    this.db.saveDatabase();

  }
  updateCardsInColumns = (newStart, newFinish) => {
    console.log()
    let startColumnIdInt = parseInt(newStart.id.slice(7,newStart.id.length));
    let finishColumnIdInt = parseInt(newFinish.id.slice(7,newFinish.id.length));
    let startColumn = this.columnNodes.get(startColumnIdInt);
    let finishColumn = this.columnNodes.get(finishColumnIdInt);
    startColumn.cardIds = newStart.cardIds;
    finishColumn.cardIds = newFinish.cardIds;
    this.columnNodes.update(startColumn);
    this.columnNodes.update(finishColumn);
    this.db.saveDatabase();


  }

  saveDB = () => this.db.saveDatabase();
}

// create one instance of the class to export so everyone can share it
const lokiServiceInstance = new LokiService();
export default lokiServiceInstance;
