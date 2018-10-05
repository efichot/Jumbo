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
import { db, firebase } from 'helper/firebase';
import { arrayMove } from 'react-sortable-hoc';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Chip from '@material-ui/core/Chip';
import { NotificationManager } from 'react-notifications';
export class Todo extends Component {
  state = {
    drawer: false,
    search: '',
    toDos: [],
    selectedToDos: [],
    menuLabel: false,
    anchorEl: null,
    loader: true,
    open: false,
    name: '',
    labelsSelected: []
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
    <div className="module-side border-right">
      <div className="module-side-header">
        <div className="module-logo">
          <i className="zmdi zmdi-check-square mr-4" />
          <span>
            <IntlMessages id="sidebar.appModule.toDo" />
          </span>
        </div>
      </div>
      <div className="module-side-content bg-white">
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
            <Button
              variant="contained"
              color="primary"
              className="btn-block"
              onClick={this.toggleDialog}
            >
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
    const batch = db.batch();
    arrayMove(this.state.toDos, oldIndex, newIndex).forEach((todo, index) => {
      const docRef = db.collection('todos').doc(todo.id);
      batch.update(docRef, {
        ...todo,
        order: index
      });
    });
    batch
      .commit()
      .then(() => NotificationManager.success('Order updated'))
      .catch(e => NotificationManager.error(e));
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

  selectToDos = id => e => {
    const { selectedToDos } = this.state;
    if (selectedToDos.indexOf(id) === -1) {
      this.setState({ selectedToDos: [...this.state.selectedToDos, id] });
    } else {
      this.setState({
        selectedToDos: selectedToDos.filter(todo => todo !== id)
      });
    }
  };

  ShowToDos = () => {
    const { toDos, selectedToDos } = this.state;
    return (
      <ToDoList
        toDos={toDos}
        width={this.props.width}
        onSortEnd={this.onSortEnd}
        useDragHandle={true} // only if you use a SortableHandle
        toggleStar={this.toggleStar}
        handleDelete={this.handleDelete}
        selectToDos={this.selectToDos}
        selectedToDos={selectedToDos}
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
    const { selectedToDos } = this.state;
    const batch = db.batch();
    selectedToDos.forEach(id => {
      let docRef = db.collection('todos').doc(id);
      batch.update(docRef, {
        labels: firebase.firestore.FieldValue.arrayUnion(label)
      });
    });
    batch
      .commit()
      .then(() => NotificationManager.success('Todos updated'))
      .catch(e => NotificationManager.error(e));
    this.setState({ selectedToDos: [] });

    //****** Read and Write multiple documents with a single transaction *****/
    // db.runTransaction(transaction => {
    //   return Promise.all(
    //     selectedToDos.map(id => {
    //       const docRef = db.collection('todos').doc(id);
    //       return transaction.get(docRef).then(doc => {
    //         transaction.update(docRef, {
    //           labels: firebase.firestore.FieldValue.arrayUnion(
    //             doc.data().labels.length
    //           )
    //         });
    //       });
    //     })
    //   );
    // });
  };

  handleRequestClose = () => this.setState({ menuLabel: false });

  toggleDialog = () =>
    this.setState({ open: !this.state.open, name: '', labelsSelected: [] });

  addTodo = () => {
    const { name, labelsSelected } = this.state;
    const { photoURL } = this.props.authUser;

    db.collection('todos').add({
      name,
      labels: labelsSelected,
      time: new Date(),
      photoURL
    });
    this.toggleDialog();
  };

  selectAllToDos = e => {
    const { toDos, selectedToDos } = this.state;
    if (selectedToDos.length !== toDos.length) {
      this.setState({ selectedToDos: toDos.map(todo => todo.id) });
    } else {
      this.setState({ selectedToDos: [] });
    }
  };

  deleteTodos = () => {
    const batch = db.batch();
    this.state.selectedToDos.forEach(id => {
      const docRef = db.collection('todos').doc(id);
      batch.delete(docRef);
    });
    batch
      .commit()
      .then(() => NotificationManager.success('Todos deleted'))
      .catch(e => NotificationManager.error(e));
    this.setState({ selectedToDos: [] });
  };

  render() {
    const {
      drawer,
      search,
      selectedToDos,
      toDos,
      anchorEl,
      menuLabel,
      loader,
      open,
      name,
      labelsSelected
    } = this.state;
    const { authUser } = this.props;

    const labels = ['Important', 'Useless'];

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
                <div className="module-box-topbar module-box-topbar-todo d-flex flex-row">
                  <Checkbox
                    color="primary"
                    indeterminate={
                      selectedToDos.length > 0 &&
                      selectedToDos.length < toDos.length
                    }
                    checked={selectedToDos.length > 0}
                    onChange={this.selectAllToDos}
                    value="SelectTodos"
                  />

                  {selectedToDos.length > 0 && (
                    <IconButton onClick={this.onLabelSelect}>
                      <i className="zmdi zmdi-label-alt" />
                    </IconButton>
                  )}

                  {selectedToDos.length > 0 && (
                    <IconButton onClick={this.deleteTodos}>
                      <i className="zmdi zmdi-delete" />
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
                    {labels.map((label, index) => (
                      <MenuItem
                        key={index}
                        onClick={this.onLabelMenuItemSelect(label)}
                      >
                        {label}
                      </MenuItem>
                    ))}
                  </Menu>

                  {/* Dialog add Task */}
                  <Dialog
                    open={open}
                    onClose={this.toggleDialog}
                    aria-labelledby="form-dialog-title"
                  >
                    <DialogTitle id="form-dialog-title">Add Todo</DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        You can add a Todo you just need to fill the field for
                        given a name to your new todo.
                      </DialogContentText>
                      <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Name"
                        name="name"
                        value={name}
                        type="text"
                        onChange={e =>
                          this.setState({ [e.target.name]: e.target.value })
                        }
                        fullWidth
                      />
                      <div className="d-flex justify-content-center">
                        <FormControl className="w-50">
                          <InputLabel htmlFor="select-multiple-chip">
                            Labels
                          </InputLabel>
                          <Select
                            multiple
                            value={labelsSelected}
                            onChange={e =>
                              this.setState({ labelsSelected: e.target.value })
                            }
                            renderValue={selected => (
                              <div>
                                {selected.map(value => (
                                  <Chip key={value} label={value} />
                                ))}
                              </div>
                            )}
                          >
                            {labels.map(label => (
                              <MenuItem key={label} value={label}>
                                {label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={this.toggleDialog} color="secondary">
                        Cancel
                      </Button>
                      <Button onClick={this.addTodo} color="primary">
                        Add
                      </Button>
                    </DialogActions>
                  </Dialog>
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
                {/* Snackbar */}
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
