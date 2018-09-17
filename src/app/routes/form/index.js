import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import asyncComponent from '../../../util/asyncComponent';


const Form = ({match}) => (
  <div className="app-wrapper">
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/components`}/>
      <Route path={`${match.url}/components`} component={asyncComponent(() => import('./routes/components'))}/>
      <Route path={`${match.url}/stepper`} component={asyncComponent(() => import('./routes/stepper'))}/>
      <Route component={asyncComponent(() => import('app/routes/extraPages/routes/404'))}/>
    </Switch>
  </div>
);

export default Form;
