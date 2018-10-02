import React, { Component } from 'react';
import { connect } from 'react-redux';

export class Todo extends Component {
  render() {
    return <div />;
  }
}

const mapStateToProps = state => ({});

export default connect(
  mapStateToProps,
  {}
)(Todo);
