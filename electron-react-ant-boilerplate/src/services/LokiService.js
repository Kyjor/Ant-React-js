
const loki = require("lokijs");
// import Loki here...
class LokiService {
  constructor(props) {
    // initial property values
    this.db = null;
    this.dbList = [];
    // function bindings
    this.dbInitialized = this.dbInitialized.bind(this);
    this.init = this.init.bind(this);
    this.getDb = this.getDb.bind(this);
    this.getComments = this.getComments.bind(this);
    this.removeComments = this.removeComments.bind(this);
    this.updateComments = this.updateComments.bind(this);
  }

  /**
   * @function dbInitialized
   * @desc used when Loki is done initializing the local instance
   */
  dbInitialized = () => {
    // do something when the db is successfully set up
    console.log('initialized db')
  };

  /**
   * @function init
   * @desc call on startup of app to initialize Loki
   */
  init = cb => {
    // run loki stuff here
    console.log('loading')
    this.db = new loki("./projects/testProject.json", {
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

  /**
   * UTILITIES
   *
   * @description create helper/utility functions for your use cases.  If you need to CRUD (create, read, update, delete) comments,
   * create functions here to help you do that so that every component can use them instead of copying the same functions into each
   * component that needs them
   * @func getComments
   * @func removeComments
   * @func updateComments
   *
   */
  getComments = () => {
    // return comments here (or throw error)
  };
  removeComments = commentIds => {
    // delete comments here and return execution status (or throw error)
  };
  updateComments = comments => {
    // update comments here and return execution status (or throw error)
  };
}

// create one instance of the class to export so everyone can share it
const lokiServiceInstance = new LokiService();
export default lokiServiceInstance;
