// Core
import React, { Component } from 'react';

//components
import Task from '../Task';

// Instruments
import Styles from './styles.m.css';
import Checkbox from '../../theme/assets/Checkbox';
import { Spinner } from '../Spinner';
import { BaseTaskModel } from '../../instruments/helpers';
import { api } from '../../REST';

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

    _getAllCompleted = () => {
        const tasks = this.state.tasks;
        return tasks.every(task => task.completed);
    }

    _setTasksFetchingState = (state) => {
        this.setState({
            isTasksFetching: state
        })
    }

    _fetchTasksAsync = async() => {
        this._setTasksFetchingState(true);

        const tasksList = await api.fetchTasks();
        const tasks = tasksList.map(function(task){
            return {...task, modified:''};
        });

        this.setState({
            tasks,
            isTasksFetching:false
        })
    }

    _createTaskAsync = async(event) => {
        event.preventDefault();

        const {newTaskMessage} = this.state;
        if (!newTaskMessage){
            return null;
        }

        this._setTasksFetchingState(true);

        const result = await api.createTask(newTaskMessage);
        if (!!result){
            const newTask = {...result,modified:''};
            this.setState(({tasks}) => ({
                tasks:[newTask,...tasks]
            }));
        }

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

    _updateTaskAsync = async(task) => {
        event.preventDefault();
        this._setTasksFetchingState(true);

        const updatedTaskList = await api.updateTask(task);

        if (updatedTaskList.length>0){
            const tasks = this.state.tasks.map(function (task) {
                return updatedTaskList.find(updatedTesk => updatedTesk.id === task.id) || task
            });

            this.setState({
                tasks,
                isTasksFetching: false
            });
        }
    }

    _removeTaskAsync = async(id) => {
        event.preventDefault();
        this._setTasksFetchingState(true);

        const result = await api.removeTask(id);

        if (result){
            this.setState(({tasks}) => ({
                tasks: tasks.filter((task) => task.id !== id),
                isTasksFetching:false
            }));
        }
    }

    _completeAllTasksAsync = async() => {
        const tasks = this.state.tasks;

        if(!this._getAllCompleted()){
            this._setTasksFetchingState(true);

            const uncompletedTasks = tasks.filter(function(task){
                if (!task.completed) {
                    task.completed = !task.completed;
                    return task;
                }
            });
            const result = await api.completeAllTasks(uncompletedTasks);
            if (result){
                const tasks = this.state.tasks.map(function (task) {
                    return uncompletedTasks.find(uncompletedTask => uncompletedTask.id === task.id) || task
                });

                this.setState({
                    tasks,
                    isTasksFetching: false
                });
            }
        } else {
            return null;
        }
    }

    componentDidMount(){
        this._fetchTasksAsync();
    }

    render () {
        const {newTaskMessage, isTasksFetching, tasks} = this.state;
        const tasksJSX = tasks.map((task) => {
            return (
                <Task
                    key = {task.id}
                    {...task}
                    _removeTaskAsync = {this._removeTaskAsync}
                    _updateTaskAsync = {this._updateTaskAsync}
                />
            )
        });
        const allTaskCompletedFl = this._getAllCompleted();

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
                            {tasksJSX}
                        </ul>
                    </section>
                    <footer>
                        <div>Mark all task as completed</div>
                        <Checkbox
                            inlineBlock
                            checked = {allTaskCompletedFl}
                            className = {Styles.completeAllTasks}
                            color1 = '#3B8EF3'
                            color2 = '#FFF'
                            onClick = {this._completeAllTasksAsync}
                        />
                    </footer>
                </main>
            </section>
        );
    }
}
