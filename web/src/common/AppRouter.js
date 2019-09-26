//import React, { Component } from 'react';
import {hashHistory, browserHistory} from 'react-router';

var history = hashHistory;

if(window.env === "LOCAL") {
    history  = hashHistory;
    window.isLocal = true;
} else {
    history  = browserHistory;
    window.isLocal = false;
}

export default history;
