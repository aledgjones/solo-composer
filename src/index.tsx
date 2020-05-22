import React from "react";
import ReactDOM from "react-dom";
import { store } from './services/state';
import { MainShell } from "./components/shell";
import * as serviceWorker from "./serviceWorker";

import "./assets/fonts/styles.css";

import firebase from "firebase/app";
import "firebase/analytics";

import "./styles.css";

const firebaseConfig = {
    apiKey: "AIzaSyB5yDa7L9wVYHS7z24BRlsh2CkTI76b_5A",
    authDomain: "solo-composer.firebaseapp.com",
    databaseURL: "https://solo-composer.firebaseio.com",
    projectId: "solo-composer",
    storageBucket: "solo-composer.appspot.com",
    messagingSenderId: "608580659899",
    appId: "1:608580659899:web:11c5cfc89b377cb449179e",
    measurementId: "G-B56K7Q17TJ"
};
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const root = document.getElementById("root") as HTMLElement;
ReactDOM.render(<MainShell />, root);
// ReactDOM.createRoot(root).render(<MainShell />);

// register the service worker
serviceWorker.register({
    onUpdate: (reg) => {
        store.update(s => {
            // force the new service worker to load and take control
            s.ui.onUpdate = () => {
                navigator.serviceWorker.addEventListener('controllerchange', () => window.location.reload());
                reg.waiting?.postMessage({ type: 'SKIP_WAITING' });
            };
        });

    }
});


