// Core
import React, { PureComponent } from 'react';
import {func, string, bool} from 'prop-types';

// Instruments
import Styles from './styles.m.css';
import Checkbox from '../../theme/assets/Checkbox';
import Edit from '../../theme/assets/Edit';
import Star from '../../theme/assets/Star';
import Remove from '../../theme/assets/Remove';

export default class Task extends PureComponent {
    static propTypes = {
        id: string.isRequired,
        completed: bool.isRequired,
        favorite: bool.isRequired,
        created: string.isRequired,
        modified: string.isRequired,
        message: string.isRequired,
        _removeTaskAsync: func.isRequired,
        _updateTaskAsync: func.isRequired
    }

    state = {
        isTaskEditing: false,
        newTaskMessage:this.props.message
    }

    _getTaskShape = ({
        id = this.props.id,
        completed = this.props.completed,
        favorite = this.props.favorite,
        message = this.props.message,
    }) => ({
        id,
        completed,
        favorite,
        message,
    });

    _setTaskEditingState = (state) => {
        this.setState({
            isTaskEditing: state
        })

        //focus???
    }
    _removeTaskAsync = async() => {

    }

    _updateTaskAsync = async() => {

    }

    _updateTask = () => {
        const {_updateTaskAsync,id} = this.props;
        _updateTaskAsync(id);
        this._setTaskEditingState(false);
    }

    _updateTaskMessageOnClick = () => {
        if (this.state.isTaskEditing){
            this._updateTask;
            return null;
        } else {
            this._setTaskEditingState(true);
        }
    }

    _updateNewTaskMessage = (event) => {
        const updatedTaskMessage = event.target.value;
        this.setState({
            newTaskMessage: updatedTaskMessage
        })
    }

    _cancelUpdatingTaskMessage = () => {
        event.preventDefault();
        this._setTaskEditingState(false);
        this.setState({
            newTaskMessage: this.props.message
        })
    }

    _updateTaskMessageOnKeyDown = (event) => {
        const {newTaskMessage} = this.state;
        if (!newTaskMessage){
            return null;
        }

        const pressedKey = event.key;
        if (pressedKey === 'Escape'){
            this._cancelUpdatingTaskMessage;
        } else if (pressedKey === 'Enter'){
            this._updateTask;
        }
    }

    _toggleTaskCompletedState = () => {

    }

    _toggleTaskFavoriteState = () => {
        const {_updateTaskAsync,favorite} = this.props;
        const task = this._getTaskShape({favorite:!favorite});
        _updateTaskAsync(task);
    }

    _removeTask = () => {

    }

    render () {
        const {completed, message, favorite} = this.props;

        return (
            <li className = { Styles.task }>
                <div className = {Styles.content}>
                    <Checkbox
                        inlineBlock
                        checked = {completed}
                        className = {Styles.toggleTaskCompletedState}
                        color1 = '#3B8EF3'
                        color2 = '#FFF'
                       // onClick = {this._completeTask}
                    />
                    <span><Remove/></span>
                    <input
                        type = 'text'
                        value = {message}
                        onChange = {this._updateNewTaskMessage}
                    />
                </div>
                <div className = {Styles.actions}>
                    <Star
                        inlineBlock
                        checked = {favorite}
                        className = {Styles.toggleTaskFavoriteState}
                        onClick = {this._toggleTaskFavoriteState}
                    />
                    <Edit
                        inlineBlock
                        className = {Styles.updateTaskMessageOnClick}
                        onClick = {this._updateTaskMessageOnClick}
                        onKeyPress = {this._updateTaskMessageOnKeyDown}
                    />
                </div>
            </li>
        );
    }
}
