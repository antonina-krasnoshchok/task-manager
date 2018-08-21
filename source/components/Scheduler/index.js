// Core
import React, { Component } from 'react';

//components
import Task from '../Task';

// Instruments
import Styles from './styles.m.css';
import Checkbox from '../../theme/assets/Checkbox';
import {Spinner} from '../Spinner';
import {BaseTaskModel} from '../../instruments/helpers';
import { api } from '../../REST';
// ! Импорт модуля API должен иметь именно такой вид (import { api } from '../../REST')


export default class Scheduler extends Component {
    state = {
        newTaskMessage: '',
        tasksFilter:'',
        isTasksFetching:false,
        tasks:[]
    };

    _updateTasksFilter = () => {

    }

    _updateNewTaskMessage = (event) => {
        const updatedTaskMessage = event.target.value;
        this.setState({
            newTaskMessage: updatedTaskMessage
        })
    }

    __getAllCompleted = () => {

    }

    __setTasksFetchingState = (state) => {
        this.setState({
            isTasksFetching: state
        })
    }

    __fetchTasksAsync = async() => {

    }

    _createTaskAsync = async(event) => {
        event.preventDefault();

        this.__setTasksFetchingState(true);

        const {newTaskMessage} = this.state;
        if (!newTaskMessage){
            return null;
        }

        const newTask = new BaseTaskModel();
        newTask.message = newTaskMessage;

        this.setState(({tasks}) => ({
            tasks:[newTask,...tasks]
        }));

        this.setState({
            newTaskMessage:'',
            isTasksFetching: false
        })
    }

    _handleFormSubmit = (event) => {
        event.preventDefault();
        this._createTaskAsync(event);
    }

    _submitOnEnter = (event) => {
        const enterKey = event.key ==='Enter';
        if (enterKey){
            event.preventDefault();
            this._createTaskAsync(event);
        }
    }

    _updateTaskAsync = async() => {

    }

    _removeTaskAsync = async() => {

    }

    _completeAllTasksAsync = async() => {

    }

    render () {
        const {newTaskMessage, isTasksFetching} = this.state;
        return (
            <section className = { Styles.scheduler }>
                <Spinner isTasksFetching = {isTasksFetching}/>
                <main>
                    <header>
                        <h1>Task manager</h1>
                        <input placeholder = {`search task`} />
                    </header>
                    <section>
                        <form onSubmit = {this._handleFormSubmit}>
                            <input
                                type = 'text'
                                placeholder = {`New task description`}
                                maxLength = '50'
                                value = {newTaskMessage}
                                onChange = {this._updateNewTaskMessage}
                                onKeyPress = {this._submitOnEnter}
                            />
                            <button type = 'submit'>Add</button>
                        </form>
                        <ul>
                            <Task/>
                            <Task/>
                        </ul>
                    </section>
                    <footer>
                        <div>Mark all task as completed</div>
                        <Checkbox
                            inlineBlock
                            // checked = {completed}
                            className = {Styles.completeAllTasks}
                            color1 = '#3B8EF3'
                            color2 = '#FFF'
                            // onClick = {this._completeTask}
                        />
                    </footer>
                </main>
            </section>
        );
    }
}
