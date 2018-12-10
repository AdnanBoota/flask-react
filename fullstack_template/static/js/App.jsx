// App.jsx
import React from "react";
import Nav from "./Nav";
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
                <Nav/>

                <div className='header-contents'>

                    <Hello name='Adnan'/>
                </div>
            </div>
        );
    }
}