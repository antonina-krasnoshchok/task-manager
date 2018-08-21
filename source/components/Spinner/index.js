// Core
import React from 'react';
import {createPortal} from 'react-dom';

// Instruments
import Styles from './styles.m.css';

export const Spinner  = ({isTasksFetching}) =>{
    const portal = document.getElementById('spinner');
    return(
        createPortal(
            isTasksFetching ? <div className={Styles.spinner} /> : null,
            portal
        )
    )
}