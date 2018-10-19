import React, { Component } from 'react';
import { connect } from 'react-redux';
import ContainerHeader from 'components/ContainerHeader/index';
import IntlMessages from 'util/IntlMessages';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import CircularProgress from '@material-ui/core/CircularProgress';
import { NotificationManager } from 'react-notifications';
import client from 'helper/graphql';

const GET_AUTEUR_AND_BOOKS = gql`
  query($auteurName: String!) {
    auteur(name: $auteurName) {
      id
      name
      books {
        title
      }
    }
  }
`;
export class Dashboard extends Component {
  state = {
    auteur: '',
    buttonClicked: false
  };

  componentDidMount = async () => {
    const { data } = await client.query({
      query: gql`
        {
          key @client
        }
      `
    });

    console.log(data);
  };

  andleClick = () => {
    this.setState({ open: true });
  };

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ open: false });
  };

  render() {
    const { buttonClicked } = this.state;
    return (
      <div className="app-wrapper">
        <div className="dashboard animated slideInUpTiny animation-duration-5">
          <ContainerHeader
            match={this.props.match}
            title={<IntlMessages id="sidebar.dashboard" />}
          />
          <div className="row">
            <div className="col-12 col-md-5 mb-3">
              <Card>
                <CardContent>
                  <h4>Retrieve a Book by writer on the Graphql end point</h4>
                  <div className="d-flex align-items-center">
                    <TextField
                      id="outlined-name"
                      label="Auteur"
                      value={this.state.auteur}
                      onChange={e =>
                        this.setState({
                          auteur: e.target.value,
                          buttonClicked: false
                        })
                      }
                      margin="normal"
                      variant="outlined"
                    />
                    <Button
                      className="jr-btn ml-auto"
                      color="primary"
                      variant="contained"
                      onClick={() => this.setState({ buttonClicked: true })}
                    >
                      <i className="zmdi zmdi-search zmdi-hc-fw" />
                      <span>Search</span>
                    </Button>
                    <Button
                      className="jr-btn"
                      color="secondary"
                      variant="contained"
                      onClick={() => {
                        client.writeData({
                          data: { key: this.state.auteur }
                        });
                      }}
                    >
                      <i className="zmdi zmdi-format-valign-bottom" />
                      <span>Change Cache</span>
                    </Button>
                  </div>
                  {buttonClicked && (
                    <Query
                      query={GET_AUTEUR_AND_BOOKS}
                      variables={{ auteurName: this.state.auteur }}
                    >
                      {({ loading, error, data }) => {
                        if (loading)
                          return (
                            <div className="d-flex justify-content-center">
                              <CircularProgress />
                            </div>
                          );
                        if (error) NotificationManager.error(error);
                        if (data.auteur) {
                          return (
                            <div>
                              <h1>{data.auteur.name}</h1>
                              <p className="text-grey">{data.auteur.id}</p>
                              <div className="d-flex flex-column">
                                {data.auteur.books.map((book, index) => (
                                  <small key={index} className="text-grey">
                                    {book.title}
                                  </small>
                                ))}
                              </div>
                            </div>
                          );
                        } else {
                          NotificationManager.error(
                            'No writer find with this name'
                          );
                          return <h1> </h1>;
                        }
                      }}
                    </Query>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({});

export default connect(
  mapStateToProps,
  {}
)(Dashboard);
