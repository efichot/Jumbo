import React, { Component } from 'react';
import { connect } from 'react-redux';

export class Dashboard extends Component {
  render() {
    return <div />;
  }
}

const mapStateToProps = state => ({});

export default connect(
  mapStateToProps,
  {}
)(Dashboard);
