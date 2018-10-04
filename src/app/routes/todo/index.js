import React, { Component } from 'react';
import { connect } from 'react-redux';
import Drawer from '@material-ui/core/Drawer';
import IntlMessages from 'util/IntlMessages';
import CustomScrollbars from 'util/CustomScrollbars';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import AppModuleHeader from 'components/AppModuleHeader';
import Checkbox from '@material-ui/core/Checkbox';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import CircularProgress from '@material-ui/core/CircularProgress';
import ToDoList from 'components/todo/ToDoList';
import { db } from 'helper/firebase';
import { arrayMove } from 'react-sortable-hoc';
export class Todo extends Component {
  state = {
    drawer: false,
    search: '',
    toDos: [],
    selectedToDos: 0,
    menuLabel: false,
    anchorEl: null,
    loader: true
  };

  componentDidMount = () => {
    db.collection('todos').onSnapshot(docs => {
      this.setState({ toDos: [] });
      docs.forEach(doc =>
        this.setState({
          toDos: [...this.state.toDos, { ...doc.data(), id: doc.id }]
        })
      );
      this.setState({ loader: false });
    });
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
            <li>
              <a href="javascript:void(0)">
                <i className="zmdi zmdi-star" />
                <span>Starred</span>
              </a>
            </li>
            <li>
              <a href="javascript:void(0)">
                <i className="zmdi zmdi-check" />
                <span>Done</span>
              </a>
            </li>
            <li>
              <a href="javascript:void(0)">
                <i className="zmdi zmdi-delete" />
                <span>Deleted</span>
              </a>
            </li>

            <li className="module-nav-label">
              <IntlMessages id="todo.labels" />
            </li>
            <li>
              <a href="javascript:void(0)">
                <i className="zmdi zmdi-circle text-red lighten-1 animated tada infinite" />
                <span>Important</span>
              </a>
            </li>
            <li>
              <a href="javascript:void(0)">
                <i className="zmdi zmdi-circle text-orange darken-2 animated tada infinite" />
                <span>Useless</span>
              </a>
            </li>
          </ul>
        </CustomScrollbars>
      </div>
    </div>
  );

  onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState({
      toDos: arrayMove(this.state.toDos, oldIndex, newIndex)
    });
  };

  handleDelete = (id, index) => e => {
    const docRef = db.collection('todos').doc(id);
    db.runTransaction(transaction => {
      return transaction.get(docRef).then(doc => {
        transaction.update(docRef, {
          labels: doc.data().labels.filter((label, i) => i !== index)
        });
      });
    });
  };

  toggleStar = id => e => {
    const docRef = db.collection('todos').doc(id);
    db.runTransaction(transaction => {
      return transaction.get(docRef).then(doc => {
        transaction.update(docRef, {
          starred: !doc.data().starred
        });
      });
    });
  };

  ShowToDos = () => {
    const { toDos } = this.state;
    return (
      <ToDoList
        toDos={toDos}
        width={this.props.width}
        onSortEnd={this.onSortEnd}
        useDragHandle={true} // only if you use a SortableHandle
        toggleStar={this.toggleStar}
        handleDelete={this.handleDelete}
      />
    );
  };

  toggleDrawer = () => this.setState({ drawer: !this.state.drawer });

  onLabelSelect = e =>
    this.setState({
      anchorEl: e.currentTarget,
      menuLabel: !this.state.menuLabel
    });

  onLabelMenuItemSelect = label => e => {
    console.log('ee');
  };

  handleRequestClose = () => this.setState({ menuLabel: false });

  render() {
    const {
      drawer,
      search,
      selectedToDos,
      toDos,
      anchorEl,
      menuLabel,
      loader
    } = this.state;
    const { authUser } = this.props;

    return (
      <div className="app-wrapper">
        <div className="animated lightSpeedIn animation-duration-5">
          <div className="app-module">
            <div className="d-block d-xl-none">
              <Drawer open={drawer} onClose={this.toggleDrawer}>
                {this.ToDoSidebar()}
              </Drawer>
            </div>
            <div className="d-none d-xl-inline">{this.ToDoSidebar()}</div>
            <div className="module-box">
              <div className="module-box-header">
                <IconButton
                  className="drawer-btn d-block d-xl-none"
                  aria-label="Menu"
                  onClick={this.toggleDrawer}
                >
                  <i className="zmdi zmdi-menu" />
                </IconButton>
                <AppModuleHeader
                  placeholder="Search To Do"
                  user={authUser}
                  onChange={e =>
                    this.setState({ [e.target.name]: e.target.value })
                  }
                  value={search}
                  notification={false}
                  apps={false}
                />
              </div>
              <div className="module-box-content">
                <div className="module-box-topbar module-box-topbar-todo d-flex flex-row align-items-end">
                  <Checkbox
                    color="primary"
                    indeterminate={
                      selectedToDos > 0 && selectedToDos < toDos.length
                    }
                    checked={selectedToDos > 0}
                    // onChange={this.onAllTodoSelect}
                    value="SelectTodos"
                  />

                  {selectedToDos > 0 && (
                    <IconButton onClick={this.onLabelSelect}>
                      <i className="zmdi zmdi-label-alt" />
                    </IconButton>
                  )}

                  {/* Menu label */}
                  <Menu
                    id="label-menu"
                    anchorEl={anchorEl}
                    open={menuLabel}
                    onClose={this.handleRequestClose}
                    MenuListProps={{
                      style: {
                        width: 150
                      }
                    }}
                  >
                    <MenuItem
                      key="1"
                      onClick={this.onLabelMenuItemSelect('important')}
                    >
                      Important
                    </MenuItem>
                    <MenuItem
                      key="2"
                      onClick={this.onLabelMenuItemSelect('useless')}
                    >
                      Useless
                    </MenuItem>
                  </Menu>
                </div>
                {loader ? (
                  <div
                    className="d-flex flex-row justify-content-center align-items-center"
                    style={{
                      height:
                        this.props.width >= 1200
                          ? 'calc(100vh - 265px)'
                          : 'calc(100vh - 245px)'
                    }}
                  >
                    <CircularProgress />
                  </div>
                ) : (
                  this.ShowToDos()
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ settings, auth }) => {
  const { width } = settings;
  const { authUser } = auth;
  return { width, authUser };
};

export default connect(
  mapStateToProps,
  {}
)(Todo);
