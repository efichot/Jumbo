import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Drawer from '@material-ui/core/Drawer';
import SidenavContent from './SidenavContent';
import UserInfo from 'components/UserInfo';
import IconButton from '@material-ui/core/IconButton';
import {
  COLLAPSED_DRAWER,
  FIXED_DRAWER,
  HORIZONTAL_NAVIGATION
} from 'constants/ActionTypes';
import {
  toggleCollapsedNav,
  updateWindowWidth,
  setDrawerType
} from 'actions/Setting';

class SideNav extends React.PureComponent {
  onToggleCollapsedNav = e => {
    const val = !this.props.navCollapsed;
    this.props.toggleCollapsedNav(val);
  };

  setDrawerType = drawerType => e => {
    if (drawerType === 'mini_drawer') this.props.setDrawerType('fixed_drawer');
    else this.props.setDrawerType('mini_drawer');
  };

  componentDidMount() {
    window.addEventListener('resize', () => {
      this.props.updateWindowWidth(window.innerWidth);
    });
  }

  render() {
    const {
      navCollapsed,
      drawerType,
      width,
      navigationStyle,
      themeColor
    } = this.props;
    let drawerStyle = drawerType.includes(FIXED_DRAWER)
      ? 'd-xl-flex'
      : drawerType.includes(COLLAPSED_DRAWER)
        ? ''
        : 'd-flex';
    let type = 'permanent';
    if (
      drawerType.includes(COLLAPSED_DRAWER) ||
      (drawerType.includes(FIXED_DRAWER) && width < 1200)
    ) {
      type = 'temporary';
    }

    if (navigationStyle === HORIZONTAL_NAVIGATION) {
      drawerStyle = '';
      type = 'temporary';
    }
    const color = themeColor.startsWith('dark') ? '#161616' : 'white';

    return (
      <div className={`app-sidebar d-none ${drawerStyle}`}>
        <Drawer
          className="app-sidebar-content"
          variant={type}
          open={type.includes('temporary') ? navCollapsed : true}
          onClose={this.onToggleCollapsedNav}
          classes={{
            paper: 'side-nav'
          }}
        >
          <UserInfo />
          <SidenavContent drawerType={drawerType} />
          <div
            style={{ backgroundColor: color }}
            className="d-flex pointer"
            onClick={this.setDrawerType(drawerType)}
          >
            <IconButton className="ml-auto mr-4 mb-2 mt-1">
              {drawerType === 'mini_drawer' ? (
                <i className="zmdi zmdi-chevron-right text-grey" />
              ) : (
                <i className="zmdi zmdi-chevron-left text-grey" />
              )}
            </IconButton>
          </div>
        </Drawer>
      </div>
    );
  }
}

const mapStateToProps = ({ settings }) => {
  const {
    navCollapsed,
    drawerType,
    width,
    navigationStyle,
    themeColor
  } = settings;
  return { navCollapsed, drawerType, width, navigationStyle, themeColor };
};

export default withRouter(
  connect(
    mapStateToProps,
    { toggleCollapsedNav, updateWindowWidth, setDrawerType }
  )(SideNav)
);
