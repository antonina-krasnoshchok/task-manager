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
        const {_updateTaskAsync} = this.props;
        const {newTaskMessage} = this.state;
        _updateTaskAsync(this._getTaskShape({message:newTaskMessage}));
        this._setTaskEditingState(false);
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
            newTaskMessage: updatedTaskMessage
        })
    }

    _cancelUpdatingTaskMessage = () => {
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
        const {newTaskMessage, isTaskEditing} = this.state;

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
                    <span>
                        <Remove
                            onClick = {this._removeTask}
                        />
                    </span>
                    <input
                        type = 'text'
                        maxLength = '50'
                        disabled = {!isTaskEditing}
                        ref = {this.taskInput}
                        value = {newTaskMessage}
                        onChange = {this._updateNewTaskMessage}
                        onKeyDown = {this._updateTaskMessageOnKeyDown}
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
                    />
                </div>
            </li>
        );
    }
}
