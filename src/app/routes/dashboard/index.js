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
import StripeCheckout from 'react-stripe-checkout';
import { CardActions } from '@material-ui/core';
import { functions } from 'helper/firebase';
import CustomScrollbars from 'util/CustomScrollbars';

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
    buttonClicked: false,
    loading: false,
    store: null
  };

  onToken = async token => {
    try {
      const res = await functions.httpsCallable(
        'saveStripeTokenAndCreateStripeUser'
      )({ token });
      const { done, message } = res.data;
      if (!done) {
        NotificationManager.error(message);
      } else {
        console.log(message);
      }
    } catch (e) {
      NotificationManager.error(e);
    }
  };

  handleClickRandomPosition = () => {
    const { scrollbars } = this.refs.scrollbars.refs;
    scrollbars.view.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  };

  displayStore = async () => {
    this.setState({ loading: true });
    const { data } = await client.query({
      query: gql`
        {
          key @client
        }
      `
    });
    setTimeout(() => {
      this.setState({ data, loading: false });
    }, 500);
  };

  render() {
    const { buttonClicked, loading, data } = this.state;
    return (
      <div className="app-wrapper">
        <div className="dashboard animated slideInUpTiny animation-duration-5">
          <ContainerHeader
            match={this.props.match}
            title={<IntlMessages id="sidebar.dashboard" />}
          />
          <div className="row">
            <div className="col-12 col-md-7 mb-3">
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
                      {({ loading, data }) => {
                        if (loading)
                          return (
                            <div className="d-flex justify-content-center">
                              <CircularProgress />
                            </div>
                          );
                        if (data && data.auteur) {
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
            <div className="col-12 col-md-5 mb-3">
              <Card>
                <CardContent className="d-flex justify-content-center">
                  <h4>
                    Payment with STRIPE{' '}
                    <span role="img" aria-label="card">
                      💳
                    </span>
                  </h4>
                </CardContent>
                <CardActions className="d-flex justify-content-center">
                  <StripeCheckout
                    token={this.onToken}
                    className="d-flex justify-content-center"
                    stripeKey={process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY}
                  />
                </CardActions>
              </Card>
            </div>

            <div className="col-12 col-md-5">
              <Card>
                <CardContent>
                  <CustomScrollbars
                    className="scrollbar"
                    style={{
                      height: '400px'
                    }}
                    ref="scrollbars"
                  >
                    ke <br />
                    ke <br />
                    ke <br />
                    ke <br />
                    ke <br />
                    ke <br />
                    ke <br />
                    ke <br />
                    ke <br />
                    ke <br />
                    ke <br />
                    ke <br />
                    ke <br />
                    ke <br />
                    ke <br />
                    ke <br />
                    ke <br />
                    ke <br />
                    ke <br />
                    ke <br />
                    ke <br />
                    ke <br />
                    ke <br />
                    ke <br />
                    ke <br />
                    ke <br />
                    ke <br />
                    ke <br />
                    ke <br />
                    ke <br />
                    ke <br />
                    ke <br />
                    ke <br />
                    ke <br />
                    ke <br />
                    <button onClick={this.handleClickRandomPosition}>
                      Scroll to top
                    </button>
                  </CustomScrollbars>
                </CardContent>
              </Card>
            </div>
            <div className="col-12 col-md-7">
              <Card>
                <CardContent>
                  <h3>
                    Mutation with graphql and access to store of apollo client
                  </h3>
                  <Button
                    variant="contained"
                    color="primary"
                    className="jr-btn-xs"
                    disabled={loading}
                    onClick={this.displayStore}
                  >
                    Display store
                    {loading && (
                      <CircularProgress
                        size={24}
                        className="text-green position-absolute"
                      />
                    )}
                  </Button>
                </CardContent>
                {data && <h1>{data.key}</h1>}
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
