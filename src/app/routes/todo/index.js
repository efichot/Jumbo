import React, { Component } from 'react';
import { db } from 'helper/firebase';
import ContainerHeader from 'components/ContainerHeader/index';
import IntlMessages from 'util/IntlMessages';

export default class Dashboard extends Component {
  state = {
    todos: []
  };

  componentDidMount = () => {
    db.collection('todos').onSnapshot(docs => {
      let todos = [];
      docs.forEach(doc => {
        todos = [...todos, doc.data()];
      });
      this.setState({ todos });
    });
  };

  render() {
    const { todos } = this.state;
    return (
      <div className="app-wrapper">
        <div className="dashboard animated slideInUpTiny animation-duration-3">
          <ContainerHeader
            match={this.props.match}
            title={<IntlMessages id="sidebar.dashboard" />}
          />
          {console.log(todos)}
        </div>
      </div>
    );
  }
}
