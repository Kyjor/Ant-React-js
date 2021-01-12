import React from 'react';
import styles from './task.scss'
export default class Task extends React.Component{
  render(){
    return <div className={styles.container}>{this.props.task.content}</div>
  }
}
