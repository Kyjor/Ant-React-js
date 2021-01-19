
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
    this.removeComments = this.removeComments.bind(this);
    this.updateCard = this.updateCard.bind(this);
    this.saveDB = this.saveDB.bind(this);
  }

  /**
   * @function dbInitialized
   * @desc used when Loki is done initializing the local instance
   */
  dbInitialized = () => {
    // do something when the db is successfully set up
    console.log('initialized db')
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
    console.log('loading')
    this.db = new loki("./projects/newghadsadahnewProject.json", {
      // options
      autoload: true,
      autoloadCallback/* or dbInitialize?? whatever the property is for when the context is ready */: () => {
        this.dbInitialized();
        !!cb && cb();
      },
    });
  };

  getDb = () => {
  console.log('gettingDB')

    console.log(this.db)
    return  this.db;
  };

  getCollection = (collection) => {
    return this.db.getCollection(collection);
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
  createCard = (cardId, cardContent, columnId) => {
    console.log('increat card')
    let cardsObject = this.dataNodes.get(1);
    const prevCards = cardsObject.tasks;
    const newCount = cardsObject.count + 1;
    console.log(newCount)
    const newCardList = {
      ...prevCards,
      [cardId] : {id: cardId, content: cardContent},
    }
    cardsObject.tasks = newCardList;
    cardsObject.count = newCount;
    console.log(cardsObject);
    let columnsObject = this.dataNodes.get(2);
    //const prevColumns = columnsObject.columns;
    console.log(columnsObject)
    //console.log(columnsObject.columns[columnId])
    let newColumns = columnsObject.columns;
      newColumns = {
      ...newColumns,
      [columnId]: {
        ...newColumns[columnId],
        taskIds: [...newColumns[columnId].taskIds, cardId],
      }
    }
    columnsObject.columns = newColumns;
    this.dataNodes.update(cardsObject);
    this.dataNodes.update(columnsObject);
    this.db.saveDatabase();
  }
  getComments = () => {
    // return cards here (or throw error)
  };
  removeComments = commentIds => {
    // delete comments here and return execution status (or throw error)
  };
  updateCard = ( cardId,cardContent) => {
    // update cards here and return execution status (or throw error)
    let cardsObject = this.dataNodes.get(1);
    cardsObject.tasks[cardId].content = cardContent;
    this.dataNodes.update(cardsObject);
    this.db.saveDatabase();
  };

  saveDB = () => this.db.saveDatabase();

}

// create one instance of the class to export so everyone can share it
const lokiServiceInstance = new LokiService();
export default lokiServiceInstance;
