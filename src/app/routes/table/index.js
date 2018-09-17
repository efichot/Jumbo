import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import asyncComponent from '../../../util/asyncComponent';


const Table = ({match}) => (
  <div className="app-wrapper">
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/basic`}/>
      <Route path={`${match.url}/basic`} component={asyncComponent(() => import('./routes/basic/index'))}/>
      <Route path={`${match.url}/data`} component={asyncComponent(() => import('./routes/data/index'))}/>
      <Route component={asyncComponent(() => import('app/routes/extraPages/routes/404'))}/>
    </Switch>
  </div>
);

export default Table;
