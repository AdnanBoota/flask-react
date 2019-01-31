import React from "react";
import { Row, Col, Container } from 'reactstrap';
import crossfilter from 'crossfilter2';
import * as d3 from "d3";
import dc from 'dc/dc';
import 'dc/dc.min.css';
import moment from 'moment/src/moment';
import { ChartContainer, PieChart, BarChart, SelectDc } from 'dc-react';
import 'bootstrap-select/dist/css/bootstrap-select.min.css';
import 'bootstrap-select/dist/js/bootstrap-select.min.js';
import Select from 'react-select';
import DateTimeRangePicker from '@wojtekmaj/react-datetimerange-picker';

require('../css/fullstack.css');
const axios = require('axios');
var $ = require('jquery');

class CrossfilterContext {
    constructor(data) {
        // console.log('coming here');
        this.data = data;
        this.crossfilter = crossfilter(data);
        this.groupAll = this.crossfilter.groupAll();

        this.nameDim = this.crossfilter.dimension(function (d) {
            return d.deviceID;
        });

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
                // console.log(d.date);
                return moment(d.date);
            });
    }
}


const ClearIndicator = (props) => {
    const { children = CustomOption } = props;
    return (
        <div>
            <div style={{ padding: '0px 5px' }}>
                {children}
            </div>
        </div>
    );
};


const CustomOption = () => (<SelectDc
    dimension={ctx => ctx.pieChartDimension}
    group={ctx => ctx.pieChartDimensionGroup}
    multiple={true}
    promptText={'All Devices'}
    width={100}
/>)


export default class App3 extends React.Component {
    constructor(props) {
        super(props);
        this._crossfilterContext = {};
        this.overviewChart_start_date = moment().subtract(1, 'year').startOf('years');
        this.overviewChart_end_date = moment().subtract(1, 'year').endOf('year');

        this.crossfilterContext = this.crossfilterContext.bind(this);
        this.options = [];
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

                self._crossfilterContext.nameDim.group().all().forEach(function (item, key) {
                    // console.log(item);
                    const newobj = { value: item.value, label: item.key }
                    // console.log(newobj);
                    self.options.push(newobj);
                });
                console.log(self._crossfilterContext.nameDim.group().all());
                console.log(self.options);
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

    componentDidUpdate() {
        $.fn.selectpicker.Constructor.BootstrapVersion = '4';
        $('#deviceId').find('.dc-chart').find('.dc-select-menu').addClass('selectpicker');
        $('#deviceId').find('.dc-select-menu').selectpicker({
            style: 'btn-info',
            size: 10
        });
        // // $('#deviceId select').selectpicker();
        // $('#deviceId').find('select').on('postRender', function () {

        // }).on('postRedraw', function () {
        //     $('#deviceId').find('.dc-select-menu').selectpicker('refresh')
        // });

        // dc.renderAll();
    }


    state = {
        selectedOption: null,
        date: [new Date(), new Date()],
    }
    handleChange = (selectedOption) => {
        this.setState({ selectedOption });
        this._crossfilterContext.nameDim.filter(selectedOption[0].label);
        dc.redrawAll();
        dc.renderAll();
        console.log('Option selected:', selectedOption[0].label);
    }

    testHandle = (reference) => {
        console.log(reference, 'here');
    }
    onChange = date => this.setState({ date })

    render() {

        const selectionRange = {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection',
        }

        const { selectedOption } = this.state;
        return (
            <ChartContainer className="container" crossfilterContext={this.crossfilterContext}>
                <h2>Service Modes - React DC.js</h2>


                <Row>
                    <Col id="deviceId" xs="4">
                        <Select
                            value={selectedOption}
                            onChange={this.handleChange}
                            isMulti={true}
                            options={this.options}
                        />
                        <SelectDc
                            dimension={ctx => ctx.nameDim}
                            group={ctx => ctx.nameDim.group()}
                            multiple={true}
                            promptText={'All Devices'}
                            onlClick={this.testHandle}
                            width={100}
                        />

                    </Col>
                    <Col className="datePickerStyle">
                        <DateTimeRangePicker
                            onChange={this.onChange}
                            value={this.state.date}
                        />
                    </Col>
                    <Col id="timeOverviewChart" xs="12">
                        <BarChart
                            dimension={ctx => ctx.chartTimeDimension}
                            group={ctx => ctx.chartTimeDimensionGroup}
                            width={1050}
                            height={120}
                            elasticY={true}
                            gap={20}
                            round={d3.timeWeek.floor}
                            alwaysUseRounding={true}
                            controlsUseVisibility={true}
                            x={d3.scaleTime().domain([this.overviewChart_start_date, this.overviewChart_end_date])}
                        />
                    </Col>
                </Row>

                <Row>
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

            </ChartContainer>
        );
    }
}