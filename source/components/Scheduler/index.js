// Core
import React, { Component } from 'react';
import FlipMove from 'react-flip-move';

//components
import Task from '../Task';

// Instruments
import Styles from './styles.m.css';
import Checkbox from '../../theme/assets/Checkbox';
import Spinner from '../Spinner';
import { api } from '../../REST';
import { sortTasksByGroup } from '../../instruments/';

export default class Scheduler extends Component {
    state = {
        newTaskMessage: '',
        tasksFilter:'',
        isTasksFetching:false,
        tasks:[]
    };

    _updateTasksFilter = (event) => {
        const updatedTasksFilter = event.target.value;
        this.setState({
            tasksFilter: updatedTasksFilter.toLowerCase()
        });
    };

    _updateNewTaskMessage = (event) => {
        const enterKey = event.key ==='Enter';
        if (enterKey){
            this._createTaskAsync(event);
            return;
        }
        const newTaskMessage = event.target.value;
        this.setState({
            newTaskMessage
        });

    };

    _getAllCompleted = () => {
        const tasks = this.state.tasks;
        return tasks.every(task => task.completed);
    };

    _setTasksFetchingState = (state) => {
        this.setState({
            isTasksFetching: state
        });
    };

    _fetchTasksAsync = async() => {
        this._setTasksFetchingState(true);

        const tasksList = await api.fetchTasks();
        const tasks = tasksList.map(function(task){
            if(task.modified !== undefined) return task;
            else return {...task, modified:''};
        });

        const sortedTasks = sortTasksByGroup(tasks);

        this.setState({
            tasks:sortedTasks
        });
        this._setTasksFetchingState(false);
    };

    _createTaskAsync = async(event) => {
        event.preventDefault();

        const {newTaskMessage} = this.state;
        if (!newTaskMessage){
            return null;
        }

        this._setTasksFetchingState(true);

        const task = await api.createTask(newTaskMessage);
        if (task !== null){
            const newTask = {...task,modified:''};
            this.setState(({tasks}) => ({
                tasks:[newTask,...tasks]
            }));
        }

        this.setState({
            newTaskMessage:''
        });
        this._setTasksFetchingState(false);
    };

    _updateTaskAsync = async(task) => {
        this._setTasksFetchingState(true);

        const updatedTaskList = await api.updateTask(task);

        if (updatedTaskList.length>0){
            const tasks = this.state.tasks.map((task) => {
                return updatedTaskList.find(updatedTesk => updatedTesk.id === task.id) || task;
            });

            const sortedTasks = sortTasksByGroup(tasks);
            this.setState({
                tasks:sortedTasks
            });
        }
        this._setTasksFetchingState(false);
    };

    _removeTaskAsync = async(id) => {
        this._setTasksFetchingState(true);

        const result = await api.removeTask(id);

        if (result === undefined){
            this.setState(({tasks}) => ({
                tasks: tasks.filter((task) => task.id !== id)
            }));
        }
        this._setTasksFetchingState(false);
    };

    _completeAllTasksAsync = async() => {
        const tasks = this.state.tasks;
        const completedFlag = this._getAllCompleted();

        if(!completedFlag){
            this._setTasksFetchingState(true);

            const uncompletedTasks = tasks.filter(function(task){
                if (!task.completed) {
                    task.completed = !task.completed;
                    return task;
                }
            });
            const result = await api.completeAllTasks(uncompletedTasks);
            if (result === undefined){
                const tasks = this.state.tasks.map(function (task) {
                    return uncompletedTasks.find(uncompletedTask => uncompletedTask.id === task.id) || task
                });

                const sortedTasks = sortTasksByGroup(tasks);
                this.setState({
                    tasks:sortedTasks,
                    isTasksFetching: false
                });
            }
        } else {
            return null;
        }
    };

    componentDidMount(){
        this._fetchTasksAsync();
    };

    render () {
        const {newTaskMessage, isTasksFetching, tasks, tasksFilter} = this.state;
        const filteredTasks = tasks.filter(task => task.message.toLowerCase().indexOf(tasksFilter)!==-1);
        const tasksJSX = filteredTasks.map((task) => {
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
                <Spinner isSpinning = {isTasksFetching}/>
                <main>
                    <header>
                        <h1>Планировщик задач</h1>
                        <input
                            value = {tasksFilter}
                            placeholder = "Поиск"
                            type = 'search'
                            onChange = {this._updateTasksFilter}
                        />
                    </header>
                    <section>
                        <form onSubmit = {this._createTaskAsync}>
                            <input
                                className = {Styles.createTask}
                                type = 'text'
                                placeholder = 'Описaние моей новой задачи'
                                maxLength = {50}
                                value = {newTaskMessage}
                                onChange = {this._updateNewTaskMessage}
                            />
                            <button>Добавить задачу</button>
                        </form>
                        <div className={Styles.overlay}>
                            <ul>
                                <FlipMove duration={400}>
                                    {tasksJSX}
                                </FlipMove>
                            </ul>
                        </div>
                    </section>
                    <footer>
                        <Checkbox
                            checked = {allTaskCompletedFl}
                            color1 = '#363636'
                            color2 = '#fff'
                            onClick = {this._completeAllTasksAsync}
                        />
                        <span className = {Styles.completeAllTasks}>Все задачи выполнены</span>
                    </footer>
                </main>
            </section>
        );
    };
};
