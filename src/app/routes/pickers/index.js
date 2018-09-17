import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import asyncComponent from '../../../util/asyncComponent';


const Pickers = ({match}) => (
  <div className="app-wrapper">
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/date-time`}/>
      <Route path={`${match.url}/date-time`} component={asyncComponent(() => import('./routes/DateTime'))}/>
      <Route path={`${match.url}/color`} component={asyncComponent(() => import('./routes/Color'))}/>
      <Route component={asyncComponent(() => import('app/routes/extraPages/routes/404'))}/>
    </Switch>
  </div>
);

export default Pickers;
