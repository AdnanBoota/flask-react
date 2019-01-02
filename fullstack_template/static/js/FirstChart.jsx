import React from "react";
import { Button, Container, Row, Col } from "reactstrap";
import * as d3 from "d3";
import crossfilter from 'crossfilter2/crossfilter.min';
import dc from 'dc/dc';
import moment from 'moment/src/moment';
import 'dc/dc.min.css';
import select2 from 'select2/dist/js/select2';
import 'select2/dist/css/select2.min.css';
import 'daterangepicker/daterangepicker.css';
import daterangepicker from 'daterangepicker/daterangepicker';

const axios = require('axios');
var $ = require('jquery');

export default class FirstChart extends React.Component {
    constructor(props) {
        super(props);

        // this.state = {
        //     overviewHistChart: dc.barChart("#time-overview"),
        //     pieDateChart: dc.pieChart("#test")
        // };

        // this.dataset;
        // this.overviewHistChart = dc.barChart("#time-overview");
        // this.pieDateChart = dc.pieChart("#test");
        //
        // this.toggle = this.toggle.bind(this);
        // this.state = {
        //     isOpen: false
        // };

        this.handleReset.bind(this);
    }

    // toggle() {
    //     this.setState({
    //         isOpen: !this.state.isOpen
    //     });
    // }
    componentDidMount() {
        var self = this;
        var overviewHistChart = dc.barChart("#time-overview"),
            pieDateChart = dc.pieChart("#test"),
            deviceId = dc.selectMenu('#deviceId'),
            dateRangeId = $('#daterange'),
            sourceId = dc.selectMenu('#sourceId');
        axios.get('https://api.jsonbin.io/b/5c1247d3279ac6128f593123')
            .then(function (response) {
                var overviewChart_start_date = moment().startOf('years');
                var overviewChart_end_date = moment().endOf('year');
                // console.log('coming here');
                // console.log(overviewChart_start_date, overviewChart_end_date);
                // handle success
                // that_class.personaliseGreeting(response.data);
                console.log(response.data);
                // self.setState({dataset: response.data});
                // console.log(self.setState.dataset);
                var ndx = crossfilter(response.data),
                    nameDim = ndx.dimension(function (d) {
                        return d.deviceID;
                    }),
                    sourceDim = ndx.dimension(function (d) {
                        return d.logSource;
                    }),
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

                // console.log(pieDateChart);
                // self.pieDateChart
                pieDateChart
                    // .margins({top: 100, right: 50, left: 0})
                    .width(300)
                    .height(300)
                    .externalLabels(50)
                    .externalRadiusPadding(50)
                    .slicesCap(4)
                    // .drawPaths(true)
                    .dimension(pieChartDimension)
                    .group(pieChartDimensionGroup)
                    .legend(dc.legend())
                    .innerRadius(50)
                    .controlsUseVisibility(true);

                // self.overviewHistChart
                overviewHistChart
                    .width(1050) /* dc.barChart('#monthly-volume-chart', 'chartGroup'); */
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

                deviceId
                    .dimension(nameDim)
                    .group(nameDim.group())
                    .multiple(true)
                    .controlsUseVisibility(true)
                    .promptText('All Devices');

                deviceId.on('postRender', function () {
                    $('#deviceId').find('select').change(function () {
                        // console.log($(this).val());
                        if ($(this).val() && $(this).val() != "") {
                            deviceId.replaceFilter([$(this).val()]);
                        } else {
                            deviceId.filterAll();
                        }
                        dc.events.trigger(function () {
                            dc.redrawAll();
                        });
                    }).select2({ width: '100%' });
                });

                sourceId
                    .dimension(sourceDim)
                    .group(sourceDim.group())
                    .controlsUseVisibility(true)
                    .promptText('All Sources');

                sourceId.on('postRender', function () {
                    $('#sourceId').find('select').change(function () {
                        // console.log($(this).val());
                        if ($(this).val() && $(this).val() != "") {
                            sourceId.replaceFilter([$(this).val()]);
                        } else {
                            sourceId.filterAll();
                        }
                        dc.events.trigger(function () {
                            dc.redrawAll();
                        });
                    }).select2({ width: '100%' });
                });


                dateRangeId.daterangepicker({
                    // opens: 'left'
                    startDate: overviewChart_start_date,
                    endDate: overviewChart_end_date,
                    timePicker: true,
                    timePicker24Hour: true,
                    locale: { cancelLabel: 'Reset' }
                });

                dc.renderAll();
                // self.dc = dc;
                // self.dc.renderAll();

            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .then(function () {
                // always executed
                // console.log('always coming here');
            });

        // this.pieDateChart.render();
        // this.overviewHistChart.render();

    }
    // get dateRangeCallback
    dateRangeCallback() {

    }

    handleReset() {
        this.pieDateChart.filterAll();
        dc.redrawAll();
    }

    render() {
        return (
            <div className='header-contents'>

                {/*<Hello name='Yahoo'/>*/}
                <h2>Service Modes - React DC.js</h2>
                <Container>
                    <Row>
                        <Col md={12}>
                            <div id="deviceId">
                                <div>
                                    <a className='reset' href='javascript:deviceId.filterAll();dc.redrawAll();'>reset</a>
                                </div>
                            </div>
                            <div id="sourceId">
                                <div>
                                    <a className='reset' href='javascript:sourceId.filterAll();dc.redrawAll();' >reset</a>
                                </div>
                            </div>
                            <div className="datepickerDiv">
                                <input id="daterange" type="text" name="daterange" value="" />
                            </div>
                            <hr />
                        </Col>
                    </Row>
                    <Row>

                        <Col md={12}>

                            <div id="time-overview"></div>

                        </Col>

                    </Row>
                    <Row>
                        <Col md={{ size: 6, offset: 6 }}>
                            <div id="test" className="single_chart_type">
                                <div className="reset">selected:
                                    <span className="filter"></span>
                                    <a onClick={this.handleReset}
                                        href="#">reset</a>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>

        );
    }
}