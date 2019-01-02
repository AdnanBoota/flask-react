// App.jsx
import React from "react";
import Navigation from "./Navigation";
import FirstChart from "./FirstChart";
import Hello from "./Hello";

require('../css/fullstack.css');

import HeaderBackgroundImage from '../images/header.jpg';

export default class App extends React.Component {
    constructor(props) {
        super(props);
    }

    addHeaderImg() {
        let headerBg = new Image();
        headerBg.src = HeaderBackgroundImage;
        // {this.addHeaderImg()}
    }

    render() {
        return (
            <div>
                <Navigation/>
                <FirstChart/>


            </div>
        );
    }
}