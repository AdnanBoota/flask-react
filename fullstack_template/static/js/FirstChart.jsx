import React from "react";
import Hello from "./Hello";
import {Button, Container, Row, Col} from "reactstrap";


export default class FirstChart extends React.Component {
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
            <div className='header-contents'>

                {/*<Hello name='Yahoo'/>*/}

                <Container>
                    <Row>
                        <Col md={12}>
                            <h1>Dc.js Chart</h1>
                            <hr/>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            <Button color="info">
                                Say Hello!
                            </Button>

                            

                        </Col>
                    </Row>
                </Container>
            </div>

        );
    }
}