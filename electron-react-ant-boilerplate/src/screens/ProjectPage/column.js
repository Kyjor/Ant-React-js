import React from 'react';
import styles from './column.scss'
import Task from './task';
export default class Column extends React.Component{
  render() {
    return (
      <div className={styles.container}>
        <h3 className={styles.title}> {this.props.column.title}</h3>
        <div className={styles.taskList}>{this.props.tasks.map(task => <Task key={task.id} task={task}/>)}</div>
      </div>
    );
  }
}
