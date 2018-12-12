import React from "react";
import {Button, Container, Row, Col} from "reactstrap";

// var $ = require('jquery');
const axios = require('axios');


export default class Hello extends React.Component {
    constructor(props) {
        super(props);
        this.state = {greeting: 'Hello ' + this.props.name};
        // This binding is necessary to make `this` work in the callback
        this.getPythonHello = this.getPythonHello.bind(this);
    }

    personaliseGreeting(greeting) {
        this.setState({greeting: greeting + ' ' + this.props.name + '!'});
    }

    getPythonHello() {
        var that_class = this;
        // Make a request for a user with a given ID
        axios.get(window.location.href + 'hello')
            .then(function (response) {
                // console.log('coming here');
                // handle success
                that_class.personaliseGreeting(response.data);
                console.log(response);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .then(function () {
                // always executed
                // console.log('always coming here');
            });
        // $.get(window.location.href + 'hello', (data) => {
        //     console.log(data);
        //     this.personaliseGreeting(data);
        // });
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col md={12}>
                        <h1>{this.state.greeting}</h1>
                        <hr/>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <Button color="info" onClick={this.getPythonHello}>
                            Say Hello!
                        </Button>
                    </Col>
                </Row>
            </Container>
        );
    }
}