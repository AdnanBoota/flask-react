import React from "react";
import { Row, Col, Container } from 'reactstrap';
import crossfilter from 'crossfilter2';
import * as d3 from "d3";
import dc from 'dc/dc';
import 'dc/dc.min.css';
import moment from 'moment/src/moment';
import { ChartContainer, PieChart, BarChart, SelectDc } from 'dc-react';

require('../css/fullstack.css');
const axios = require('axios');

class CrossfilterContext {
    constructor(data) {
        // console.log('coming here');
        this.data = data;
        this.crossfilter = crossfilter(data);
        this.groupAll = this.crossfilter.groupAll();

        this.pieChartDimension = this.crossfilter.dimension(function (d) {
            return d.serviceMode;
        });
        this.pieChartDimensionGroup = this.pieChartDimension.group().reduceSum(function (d) {
            return +1;
        });

        this.chartTimeDimension = this.crossfilter.dimension(function (d) {
            // console.log(moment(d.date));
            return moment(d.date);
        });
        this.chartTimeDimensionGroup = this.chartTimeDimension.group()
            .reduceCount(function (d) {
                console.log(d.date);
                return moment(d.date);
            });
    }
}

export default class App3 extends React.Component {
    constructor(props) {
        super(props);
        this._crossfilterContext = {};
        this.overviewChart_start_date = moment().subtract(1, 'year').startOf('years');
        this.overviewChart_end_date = moment().subtract(1, 'year').endOf('year');
        // this.crossfilterContext = this.crossfilterContext.bind(this);
    }

    crossfilterContext = (callback) => {
        const self = this;
        if (!callback) {
            return this._crossfilterContext;
        }
        axios.get('https://api.jsonbin.io/b/5c1247d3279ac6128f593123')
            .then(function (response) {
                console.log(response.data);
                self._crossfilterContext = new CrossfilterContext(response.data);
                callback(self._crossfilterContext);
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

    componentDidMount() {
        // $('.dc-select-menu').select2();
        // $('select').change(function () {
        // console.log($(this).val());
        // if ($(this).val() && $(this).val() != "") {
        //     deviceId.replaceFilter([$(this).val()]);
        // } else {
        //     deviceId.filterAll();
        // }
        // dc.events.trigger(function () {
        //     dc.redrawAll();
        // });
        // }).select2({ width: '100%' });
    }

    render() {
        return (
            <ChartContainer className="container" crossfilterContext={this.crossfilterContext}>
                <h2>Service Modes - React DC.js</h2>

                <div className="row">
                    <Row>
                        <Col id="deviceId" xs="6">
                            <SelectDc

                                dimension={ctx => ctx.pieChartDimension}
                                group={ctx => ctx.pieChartDimensionGroup}
                                multiple={true}
                                promptText={'All Devices'}
                            />
                        </Col>

                        <Col id="pieChart" xs="6">
                            <PieChart
                                dimension={ctx => ctx.pieChartDimension}
                                group={ctx => ctx.pieChartDimensionGroup} externalLabels={50}
                                externalRadiusPadding={50} slicesCap={4} innerRadius={50}
                                controlsUseVisibility={true}
                                width={300} height={300} legend={dc.legend().x(0).y(0).gap(5).itemHeight(15)}
                            />
                        </Col>
                    </Row>

                </div>
                <Row>
                    <BarChart
                        dimension={ctx => ctx.chartTimeDimension}
                        group={ctx => ctx.chartTimeDimensionGroup}
                        width={1050}
                        height={140}
                        elasticY={true}
                        gap={20}
                        round={d3.timeWeek.floor}
                        alwaysUseRounding={true}
                        controlsUseVisibility={true}
                        x={d3.scaleTime().domain([this.overviewChart_start_date, this.overviewChart_end_date])}

                        renderHorizontalGridLines={true}
                    />
                </Row>


            </ChartContainer>
        );
    }
}
