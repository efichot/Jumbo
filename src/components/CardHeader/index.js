import React from 'react'
import IntlMessages from 'util/IntlMessages'

class CardHeader extends React.Component {
  render () {
    const { heading, subHeading, clearData } = this.props
    let { styleName } = this.props
    return (
      <div className={`jr-card-header d-flex ${styleName}`}>
        <div className='mr-auto'>
          <h3 className='card-heading'>{heading}</h3>
          {subHeading && <p className='sub-heading'>{subHeading}</p>}
        </div>
        {clearData &&
          <span className='badge badge-primary p-1 pointer' onClick={clearData}>
            <IntlMessages id='popup.clearData' />
          </span>}
      </div>
    )
  }
}

export default CardHeader
