import React, { Component } from 'react';
import { connect } from 'react-redux';
import Drawer from '@material-ui/core/Drawer';
import IntlMessages from 'util/IntlMessages';
import CustomScrollbars from 'util/CustomScrollbars';
import Button from '@material-ui/core/Button';
export class Todo extends Component {
  state = {
    drawer: false
  };

  ToDoSidebar = () => (
    <div className="module-side">
      <div className="module-side-header">
        <div className="module-logo">
          <i className="zmdi zmdi-check-square mr-4" />
          <span>
            <IntlMessages id="sidebar.appModule.toDo" />
          </span>
        </div>
      </div>
      <div className="module-side-content">
        <CustomScrollbars
          className="module-side-scroll scrollbar"
          style={{
            height:
              this.props.width >= 1200
                ? 'calc(100vh - 200px)'
                : 'calc(100vh - 80px)'
          }}
        >
          <div className="module-add-task">
            <Button variant="contained" color="primary" className="btn-block">
              <IntlMessages id="todo.addTask" />
            </Button>
          </div>
          <ul className="module-nav">
            <li>
              <a href="javascript:void(0)">
                <i className="zmdi zmdi-menu" />
                <span>
                  <IntlMessages id="todo.all" />
                </span>
              </a>
            </li>

            <li className="module-nav-label">
              <IntlMessages id="todo.filters" />
            </li>

            {/* {this.getNavFilters()} */}

            <li className="module-nav-label">
              <IntlMessages id="todo.labels" />
            </li>

            {/* {this.getNavLabels()} */}
          </ul>
        </CustomScrollbars>
      </div>
    </div>
  );

  toggleDrawer = () => this.setState({ drawer: !this.state.drawer });

  render() {
    const { drawer } = this.state;
    return (
      <div className="app-wrapper">
        <div className="animated slideInUpTiny animation-duration-5">
          <div className="app-module">
            <div className="d-block d-xl-none">
              <Drawer open={drawer} onClose={this.toggleDrawer}>
                {this.ToDoSidebar()}
              </Drawer>
            </div>
            <div className="d-none d-xl-inline">{this.ToDoSidebar()}</div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ settings }) => {
  const { width } = settings;
  return { width };
};

export default connect(
  mapStateToProps,
  {}
)(Todo);
