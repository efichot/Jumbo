import React, { Component, Fragment } from 'react';
import { db, auth } from 'helper/firebase';
import ContainerHeader from 'components/ContainerHeader/index';
import IntlMessages from 'util/IntlMessages';
import moment from 'moment';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { NotificationManager } from 'react-notifications';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import SweetAlert from 'react-bootstrap-sweetalert';

export default class Dashboard extends Component {
  state = {
    todos: null,
    open: false,
    selected: [],
    warning: false
  };

  componentDidMount = () => {
    db.collection('todos').onSnapshot(docs => {
      let todos = [];
      docs.forEach(doc => {
        todos = [
          ...todos,
          {
            ...doc.data(),
            id: doc.id
          }
        ];
      });
      const selected = todos.reduce(
        (acc, v) => (v.done ? [...acc, v.id] : acc),
        []
      );
      this.setState({ todos, selected });
    });
  };

  handleCheck = id => event => {
    db.doc(`todos/${id}`).update({
      done: !this.state.todos.find(todo => todo.id === id).done
    });
  };

  handleChange = ({ target: { name, value } }) => {
    this.setState({ [name]: value });
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  addTask = () => {
    db.collection('todos')
      .add({
        name: this.state.task,
        done: false,
        date: new Date()
      })
      .then(doc => console.log(NotificationManager.success('Task added')))
      .catch(e => NotificationManager.error(e));
    this.handleClose();
  };

  toggleWarning = () => {
    this.setState({ warning: !this.state.warning });
  };

  deleteTasks = () => {
    this.state.selected.forEach(id => {
      db.doc(`todos/${id}`)
        .delete()
        .then(() => console.log(`Document ${id} deleted`))
        .catch(e => console.log(e));
    });
    this.toggleWarning();
  };

  render() {
    const { todos, selected, warning } = this.state;

    return (
      <div className="app-wrapper">
        <div className="dashboard animated slideInUpTiny animation-duration-3">
          <ContainerHeader
            match={this.props.match}
            title={<IntlMessages id="sidebar.dashboard" />}
          />
          <Card style={{ width: '45%' }}>
            <CardContent>
              <ul>
                {todos &&
                  todos.map(({ name, date, done, id }) => (
                    <Fragment key={id}>
                      <li>
                        <Checkbox
                          checked={done}
                          onChange={this.handleCheck(id)}
                        />
                        {`${name} at ${moment
                          .unix(date.seconds)
                          .format('YYYY:MM:DD HH:mm:ss')}`}
                      </li>
                    </Fragment>
                  ))}
              </ul>
            </CardContent>
            {selected.length > 0 && (
              <Button onClick={this.toggleWarning} color="secondary">
                Delete a tasks
              </Button>
            )}
            <Button onClick={this.handleClickOpen} color="primary">
              Create a task
            </Button>
          </Card>

          <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">New Task</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Please fullfill the name of the task and submit.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="name"
                type="text"
                name="task"
                fullWidth
                onChange={this.handleChange}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                Cancel
              </Button>
              <Button onClick={this.addTask} color="primary">
                Submit
              </Button>
            </DialogActions>
          </Dialog>

          <SweetAlert
            show={warning}
            warning
            showCancel
            confirmBtnText={<IntlMessages id="sweetAlerts.yesDeleteIt" />}
            confirmBtnBsStyle="danger"
            cancelBtnBsStyle="default"
            title={<IntlMessages id="sweetAlerts.areYouSure" />}
            onConfirm={this.deleteTasks}
            onCancel={this.toggleWarning}
          >
            <IntlMessages id="sweetAlerts.youWillNotAble" />
          </SweetAlert>
        </div>
      </div>
    );
  }
}
