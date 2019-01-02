import React from "react";
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import FirstChart from './FirstChart';
import SecondChart from './SecondChart';
import Navigation from "./Navigation";

require('../css/fullstack.css');

const App2 = () => (
    <Router>
        <div>
            <Navigation/>
            <div className="container">
                <Route path="/" exact component={Index}/>
                <Route path="/safe-states/" component={SafeState}/>
                <Route path="/service-modes/" component={ServiceMode}/>
                <Route path="/torque-offset/" component={TorqueOffset}/>
                <Route path="/step-response/" component={StepResponse}/>
            </div>
        </div>
    </Router>
);

const Index = () => <div className='header-contents'><h2>Dashboard</h2></div>;
const SafeState = () => <div className='header-contents'><h2>Safe State - In progress</h2></div>;
const ServiceMode = () => <FirstChart/>;
const TorqueOffset = () => <div className='header-contents'><h2>Torque Offset - In progress</h2></div>;
const StepResponse = () => <div className='header-contents'><h2>Step Response - In progress</h2></div>;

export default App2;