import React from "react";
import Hello from "./Hello";
import {Button, Container, Row, Col} from "reactstrap";
import * as d3 from "d3";
import crossfilter from 'crossfilter';
import * as dc from 'dc';
import {csv} from 'd3-request';
import chartData from '../morley.csv';

const axios = require('axios');
export default class FirstChart extends React.Component {
    constructor(props) {
        super(props);
        //
        // this.toggle = this.toggle.bind(this);
        // this.state = {
        //     isOpen: false
        // };
    }

    // toggle() {
    //     this.setState({
    //         isOpen: !this.state.isOpen
    //     });
    // }
    componentDidMount() {

        var dataset;
        // var chart = dc.lineChart("#test");
        // d3.csv(chartData).then(function (d, error) {
        //     if (error) {
        //         console.log(error);
        //     } else {
        //         console.log(d);
        //     }
        //     ;
        // });

        axios.get('https://jsonplaceholder.typicode.com/todos/1')
            .then(function (response) {
                // console.log('coming here');
                // handle success
                // that_class.personaliseGreeting(response.data);
                console.log(response);
                dataset = response.data;
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .then(function () {
                // always executed
                // console.log('always coming here');
            });

        // csv(chartData, function (error, data) {
        //     console.log('coming here');
        //
        //     console.log(chartData);
        //     experiments.forEach(function (x) {
        //         x.Speed = +x.Speed;
        //     });

        var ndx = crossfilter(dataset),
            runDimension = ndx.dimension(function (d) {
                return +d.Run;
            }),
            speedSumGroup = runDimension.group().reduceSum(function (d) {
                return d.Speed * d.Run / 1000;
            });

        chart
            .width(768)
            .height(480)
            .x(d3.scaleLinear().domain([0, 20]))
            .curve(d3.curveStepBefore)
            .renderArea(true)
            .brushOn(false)
            .renderDataPoints(true)
            .clipPadding(10)
            .yAxisLabel("This is the Y Axis!")
            .dimension(runDimension)
            .group(speedSumGroup);

        chart.render();

        // });
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
                            <div id="test"></div>

                        </Col>
                    </Row>
                </Container>
            </div>

        );
    }
}