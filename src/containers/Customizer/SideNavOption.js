import React from 'react'
import { withRouter } from 'react-router-dom'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import {
  ABOVE_THE_HEADER,
  BELOW_THE_HEADER,
  COLLAPSED_DRAWER,
  FIXED_DRAWER,
  HORIZONTAL_NAVIGATION,
  INSIDE_THE_HEADER,
  MINI_DRAWER,
  VERTICAL_NAVIGATION
} from 'constants/ActionTypes'
import { Button, ButtonGroup } from 'reactstrap'
import Context from 'context'

class Customizer extends React.Component {
  static contextType = Context

  setFixedDrawer = () => {
    this.context.settings.setDrawerType(FIXED_DRAWER)
  }
  setCollapsedDrawer = () => {
    this.context.settings.setDrawerType(COLLAPSED_DRAWER)
  }
  setMiniDrawer = () => {
    this.context.settings.setDrawerType(MINI_DRAWER)
  }

  render () {
    const {
      settings: {
        drawerType,
        navigationStyle,
        horizontalNavPosition,
        changeNavigationStyle,
        setHorizontalMenuPosition
      }
    } = this.context

    return (
      <div className='side-nav-option'>

        <div className='mb-1'>
          <h3 className='mb-1 mt-4'>Navigation Style</h3>
          <div className='text-left py-3'>
            <FormControl className='d-block' component='fieldset' required>
              <RadioGroup
                className='sidenav-dir'
                aria-label='nav-style'
                name='navStyle'
                value={navigationStyle}
                onChange={event => {
                  changeNavigationStyle(event.target.value)
                }}
              >
                <FormControlLabel
                  control={<Radio />}
                  value={HORIZONTAL_NAVIGATION}
                  label='Horizontal'
                />
                <FormControlLabel
                  control={<Radio />}
                  value={VERTICAL_NAVIGATION}
                  label='Vertical'
                />

              </RadioGroup>
            </FormControl>
          </div>
        </div>
        {navigationStyle === HORIZONTAL_NAVIGATION
          ? <ButtonGroup>
            <Button
              color='default'
              className={`jr-btn  ${horizontalNavPosition === INSIDE_THE_HEADER && 'active'} `}
              onClick={() => {
                setHorizontalMenuPosition(INSIDE_THE_HEADER)
              }}
              >
                Inside
              </Button>
            <Button
              color='default'
              className={`jr-btn ${horizontalNavPosition === ABOVE_THE_HEADER && 'active'} `}
              onClick={() => {
                setHorizontalMenuPosition(ABOVE_THE_HEADER)
              }}
              >
                Top
              </Button>
            <Button
              color='default'
              className={`jr-btn ${horizontalNavPosition === BELOW_THE_HEADER && 'active'} `}
              onClick={() => {
                setHorizontalMenuPosition(BELOW_THE_HEADER)
              }}
              >
                Below
              </Button>
          </ButtonGroup>
          : <ButtonGroup>
            <Button
              color='default'
              className={`jr-btn  ${drawerType === FIXED_DRAWER && 'active'} `}
              onClick={this.setFixedDrawer}
              >
                Fixed
              </Button>
            <Button
              color='default'
              className={`jr-btn ${drawerType === COLLAPSED_DRAWER && 'active'} `}
              onClick={this.setCollapsedDrawer}
              >
                Collapsed
              </Button>
            <Button
              color='default'
              className={`jr-btn ${drawerType === MINI_DRAWER && 'active'} `}
              onClick={this.setMiniDrawer}
              >
                Mini
              </Button>
          </ButtonGroup>}

      </div>
    )
  }
}

export default withRouter(Customizer)
