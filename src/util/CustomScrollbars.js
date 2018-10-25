import React, { Component } from 'react'
import { Scrollbars } from 'react-custom-scrollbars'

export default class CustomScrollbars extends Component {
  render () {
    return (
      <Scrollbars
        {...this.props}
        autoHide
        renderTrackHorizontal={props => (
          <div
            {...props}
            style={{ display: 'none' }}
            className='track-horizontal'
          />
        )}
        ref='scrollbars'
      />
    )
  }
}
