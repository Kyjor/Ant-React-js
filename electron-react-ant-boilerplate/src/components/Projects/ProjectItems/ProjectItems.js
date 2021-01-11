import React, { Component } from "react";

class ProjectItems extends Component {
  createTasks(item) {
    return <li key={item.key}>{item.text}</li>
  }

  render() {
    var projectEntries = this.props.entries;
    var listItems = projectEntries.map(this.createTasks);

    return (
      <ul className="theList">
        {listItems}
      </ul>
    );
  }
}

export default ProjectItems;
