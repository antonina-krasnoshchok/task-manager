// Core
import React from 'react';
import {createPortal} from 'react-dom';

// Instruments
import Styles from './styles.m.css';
import {bool} from "prop-types";

const portal = document.getElementById('spinner');

export default class Spinner extends React{
    static propTypes = {
        isSpinning: bool.isRequired,
    }

    render(){
        const {isSpinning} = this.props;
        return(
            createPortal(
                isSpinning ? <div className={Styles.spinner} /> : null,
                portal
            )
        )
    }
}