import React from "react";
import Hello from "./Hello";
import {Button, Container, Row, Col} from "reactstrap";
import crossfilter from 'crossfilter';
import * as d3 from "d3";
import * as dc from 'dc';
import moment from 'moment/src/moment';

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


        axios.get('https://api.jsonbin.io/b/5c1247d3279ac6128f593123')
            .then(function (response) {
                var overviewChart_start_date = moment().startOf('years');
                var overviewChart_end_date = moment().endOf('year');
                // console.log('coming here');
                // handle success
                // that_class.personaliseGreeting(response.data);
                console.log(response.data);
                dataset = response.data;
                var ndx = crossfilter(dataset),
                    pieChartDimension = ndx.dimension(function (d) {
                        // return moment(d.date).format('DD-' +
                        //     'M-YYYY');
                        return d.serviceMode;
                    }),
                    pieChartDimensionGroup = pieChartDimension.group().reduceSum(function (d) {
                        return +1;
                    }),
                    chartTimeDimension = ndx.dimension(function (d) {
                        return moment(d.date);
                    }),
                    chartTimeDimensionGroup = chartTimeDimension.group()
                        .reduceCount(function (d) {
                            return moment(d.date);
                        });

                var pieDateChart = dc.pieChart("#test");
                var overviewHistChart = dc.barChart("#time-overview");
                console.log(pieDateChart);
                pieDateChart
                    .width(300)
                    .height(300)
                    .externalLabels(50)
                    .externalRadiusPadding(50)
                    // .slicesCap(4)
                    .dimension(pieChartDimension)
                    .group(pieChartDimensionGroup)
                    .legend(dc.legend())
                    .innerRadius(50)
                    .controlsUseVisibility(true);

                overviewHistChart.width(1200) /* dc.barChart('#monthly-volume-chart', 'chartGroup'); */
                    .height(140)
                    // .margins({top:100,right: 50, left: 0})
                    // .margins({top: 0, right: 50, bottom: 20, left: 40})
                    .dimension(chartTimeDimension)
                    .group(chartTimeDimensionGroup)
                    // .centerBar(true)
                    // .mouseZoomable(true)
                    .gap(19)
                    .x(d3.scaleTime().domain([overviewChart_start_date, overviewChart_end_date]))
                    .round(d3.timeWeek.round)
                    .alwaysUseRounding(true)
                    .brushOn(true)
                    .elasticY(true)
                    .controlsUseVisibility(true)
                    .xUnits(d3.timeWeeks);

                dc.renderAll();
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .then(function () {
                // always executed
                // console.log('always coming here');
            });
    }

    render() {
        return (
            <div className='header-contents'>

                {/*<Hello name='Yahoo'/>*/}

                <Container>
                    <Row>
                        <Col md={12}>
                            <h1>React Dc.js Chart</h1>
                            <hr/>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            <Button color="info">
                                Say Hello!
                            </Button>
                            <div id="time-overview"></div>
                            <div id="test"></div>

                        </Col>
                    </Row>
                </Container>
            </div>

        );
    }
}