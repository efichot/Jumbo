import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import asyncComponent from '../../../util/asyncComponent';

const Extensions = ({match}) => (
  <div className="app-wrapper">
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/dnd`}/>
      <Route path={`${match.url}/dnd`} component={asyncComponent(() => import('./routes/dragnDrop'))}/>
      <Route path={`${match.url}/sweet-alert`} component={asyncComponent(() => import('./routes/sweetAlert'))}/>
      <Route path={`${match.url}/notification`}
             component={asyncComponent(() => import('./routes/notification'))}/>
      <Route path={`${match.url}/dropzone`}
             component={asyncComponent(() => import('./routes/dropzone'))}/>
      <Route component={asyncComponent(() => import('app/routes/extraPages/routes/404'))}/>
    </Switch>
  </div>
);

export default Extensions;
