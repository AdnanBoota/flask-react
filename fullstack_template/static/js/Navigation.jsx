import React from "react";
import {Navbar, Nav, NavItem, MenuItem, NavDropdown} from "react-bootstrap";


export default class Navigation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {greeting: 'Hello ' + this.props.name};
    }


    render() {
        return (
            <Navbar>
                <Navbar.Header>
                    <Navbar.Brand>
                        <a href="#home">React-Bootstrap</a>
                    </Navbar.Brand>
                </Navbar.Header>

            </Navbar>

        );
    }
}