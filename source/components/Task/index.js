// Core
import React, { PureComponent } from 'react';

// Instruments
import Styles from './styles.m.css';
import Checkbox from '../../theme/assets/Checkbox';
import Edit from '../../theme/assets/Edit';
import Star from '../../theme/assets/Star';
import Remove from '../../theme/assets/Remove';

export default class Task extends PureComponent {
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

    _removeTaskAsync = async() => {

    }

    _updateTaskAsync = async() => {

    }

    _updateTask = () => {

    }

    _updateTaskMessageOnClick = () => {

    }
    render () {
        return (
            <li className = { Styles.task }>
                <div className = {Styles.content}>
                    <Checkbox
                        inlineBlock
                       // checked = {completed}
                        className = {Styles.toggleTaskCompletedState}
                        color1 = '#3B8EF3'
                        color2 = '#FFF'
                       // onClick = {this._completeTask}
                    />
                    <span><Remove/></span>
                    <input
                        type = 'text'
                    />
                </div>
                <div className = {Styles.actions}>
                    <Star
                        inlineBlock
                        className = {Styles.toggleTaskFavoriteState}
                    />
                    <Edit
                        inlineBlock
                        className = {Styles.updateTaskMessageOnClick}
                    />
                </div>
            </li>
        );
    }
}
