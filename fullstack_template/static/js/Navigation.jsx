import React from "react";
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from 'reactstrap';
import {Link} from "react-router-dom";


export default class Navigation extends React.Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false
        };
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    render() {
        return (
            <div>
                <Navbar color="light" light expand="md">
                    <NavbarBrand href="/">Avatara</NavbarBrand>
                    <NavbarToggler onClick={this.toggle}/>
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="ml-auto" navbar>
                            <NavItem>
                              <Link to="/safe-states/">Safe States</Link>
                            </NavItem>
                            <NavItem>
                                <Link to="/service-modes/">Service Modes</Link>
                            </NavItem>
                            <NavItem>
                               <Link to="/torque-offset/">Torque Offset</Link>
                            </NavItem>
                            <NavItem>
                                <Link to="/step-response/">Step Response</Link>
                            </NavItem>
                        </Nav>
                    </Collapse>
                </Navbar>
            </div>

        );
    }
}