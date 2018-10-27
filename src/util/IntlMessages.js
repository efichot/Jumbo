import React from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'

const InjectMessage = props => <FormattedMessage {...props} />
export default injectIntl(InjectMessage, {
  withRef: false
})
