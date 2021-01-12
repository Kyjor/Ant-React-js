import React, { Component } from "react";
import styles from '../ProjectList.scss';
import {Link} from "react-router-dom";
class ProjectItems extends Component {
  createTasks(item) {
    var projectName = item.text;
    var listItem = <li key={item.key}><Link to={{pathname:"/projectPage",query: {projectName} }}>{item.text}</Link></li>;

    return listItem;
  }

  render() {
    var projectEntries = this.props.entries;
    var listItems = projectEntries.map(this.createTasks);

    return (
      <ul className={styles.theList}>
        {listItems}
      </ul>
    );
  }
}

export default ProjectItems;
