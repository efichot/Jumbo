import React from 'react'
import Chip from '@material-ui/core/Chip'
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
          <Chip
            label={<IntlMessages id='popup.clearData' />}
            onClick={clearData}
          />}
      </div>
    )
  }
}

export default CardHeader
