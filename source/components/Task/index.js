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
        message: string.isRequired,
        _removeTaskAsync: func.isRequired,
        _updateTaskAsync: func.isRequired
    }

    state = {
        isTaskEditing: false,
        newMessage:this.props.message
    }

    constructor(props) {
        super(props);
        this.taskInput = React.createRef();
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
        });

    }

    _updateTask = () => {
        const {_updateTaskAsync, message} = this.props;
        const {newMessage} = this.state;
        this._setTaskEditingState(false);
        if (message === newMessage) {
            return null;
        }
        _updateTaskAsync(this._getTaskShape({message:newMessage}));
    }

    _updateTaskMessageOnClick = () => {
        const {isTaskEditing} = this.state;
        if (isTaskEditing){
            this._updateTask();
            return null;
        } else {
            this._setTaskEditingState(true);
        }
    }

    componentDidUpdate(){
        const {isTaskEditing} = this.state;
        if(isTaskEditing){
            this.taskInput.current.focus();
        }
    }

    _updateNewTaskMessage = (event) => {
        const updatedTaskMessage = event.target.value;
        this.setState({
            newMessage: updatedTaskMessage
        })
    }

    _cancelUpdatingTaskMessage = () => {
        this._setTaskEditingState(false);
        this.setState({
            newMessage: this.props.message
        })
    }

    _updateTaskMessageOnKeyDown = (event) => {
        const {newMessage} = this.state;
        if (!newMessage){
            return null;
        }

        const pressedKey = event.key;
        if (pressedKey === 'Escape'){
            this._cancelUpdatingTaskMessage();
        } else if (pressedKey === 'Enter'){
            this._updateTask();
        }
    }

    _toggleTaskCompletedState = () => {
        const {_updateTaskAsync,completed} = this.props;
        const task = this._getTaskShape({completed:!completed});
        _updateTaskAsync(task);
    }

    _toggleTaskFavoriteState = () => {
        const {_updateTaskAsync,favorite} = this.props;
        const task = this._getTaskShape({favorite:!favorite});
        _updateTaskAsync(task);
    }

    _removeTask = () => {
        const {_removeTaskAsync,id} = this.props;
        _removeTaskAsync(id);
    }

    render () {
        const {completed, favorite} = this.props;
        const {newMessage, isTaskEditing} = this.state;

        return (
            <li className = { Styles.task }>
                <div className = {Styles.content}>
                    <Checkbox
                        inlineBlock
                        checked = {completed}
                        className = {Styles.toggleTaskCompletedState}
                        color1 = '#3B8EF3'
                        color2 = '#FFF'
                        onClick = {this._toggleTaskCompletedState}
                    />
                    <input
                        type = 'text'
                        maxLength = {50}
                        disabled = {!isTaskEditing}
                        ref = {this.taskInput}
                        value = {newMessage}
                        onChange = {this._updateNewTaskMessage}
                        onKeyDown = {this._updateTaskMessageOnKeyDown}
                    />
                </div>
                <div className = {Styles.actions}>
                    <Star
                        inlineBlock
                        color1 = '#3B8EF3'
                        color2 = '#000'
                        checked = {favorite}
                        className = {Styles.toggleTaskFavoriteState}
                        onClick = {this._toggleTaskFavoriteState}
                    />
                    <Edit
                        inlineBlock
                        checked = {false}
                        color1 = '#3B8EF3'
                        color2 = '#000'
                        className = {Styles.updateTaskMessageOnClick}
                        onClick = {this._updateTaskMessageOnClick}
                    />
                    <Remove
                        inlineBlock
                        color1 = '#3B8EF3'
                        color2 = '#000'
                        width = {17}
                        height = {17}
                        className = { Styles.removeTask }
                        onClick = {this._removeTask}
                    />
                </div>
            </li>
        );
    }
}
