import React from 'react';
import ReactDOM from 'react-dom';
import { MainShell } from './states/main-shell';
import * as serviceWorker from './serviceWorker';
import 'app-reset/app-reset.css';
import './ui/index.css';
import './assets/fonts.css';

ReactDOM.render(<MainShell />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
