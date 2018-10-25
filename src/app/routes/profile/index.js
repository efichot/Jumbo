import React, { Component } from 'react'
import { connect } from 'react-redux'
import ContainerHeader from 'components/ContainerHeader/index'
import IntlMessages from 'util/IntlMessages'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'
import Foot from 'assets/images/products/football.jpeg'
import iPhone from 'assets/images/products/iPhone.jpeg'
import { functions } from 'helper/firebase'
import { NotificationManager } from 'react-notifications'
import {
  Area,
  AreaChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'

export class Profile extends Component {
  state = {
    topic: '',
    loader: false,
    chartData: [
      { name: 'Jan', Income: 10, Expanse: 22 },
      { name: 'Feb', Income: 5, Expanse: 20 },
      { name: 'March', Income: 15, Expanse: 26 },
      { name: 'April', Income: 13, Expanse: 22 },
      { name: 'May', Income: 35, Expanse: 26 },
      { name: 'June', Income: 25, Expanse: 20 },
      { name: 'July', Income: 20, Expanse: 32 },
      { name: 'Aug', Income: 25, Expanse: 35 }
    ]
  }

  render () {
    const { loader } = this.state
    const topics = [
      { name: 'Foot', decription: 'Topics on europeen leagues', photo: Foot },
      {
        name: 'iPhone',
        decription: 'Topics tech on last iPhone news',
        photo: iPhone
      }
    ]

    return (
      <div className='app-wrapper'>
        <div className='dashboard animated slideInUpTiny animation-duration-5'>
          <ContainerHeader
            match={this.props.match}
            title={<IntlMessages id='popup.profile' />}
          />
          <div className='row'>
            <div className='col-12 col-md-5 mb-3'>
              <Card>
                <CardContent className='border-bottom border-grey-lighten-2 pb-0'>
                  <h3 className='d-flex justify-content-center'>
                    Subscribe to topics
                  </h3>
                  <ul className='p-0'>
                    {topics.map((topic, index) => (
                      <li
                        className='d-flex align-items-center mb-1'
                        key={index}
                      >
                        <Avatar alt='' src={topic.photo} className='mr-3' />
                        <div>
                          <h4 className='m-0'>{topic.name}</h4>
                          <small>{topic.decription}</small>
                        </div>
                        <div className='ml-auto d-flex flex-column'>
                          <Button
                            variant='contained'
                            color='primary'
                            className='jr-btn jr-btn-xs m-1'
                            onClick={() => {
                              functions
                                .httpsCallable('subscribeToTopic')({
                                  topic: topic.name,
                                  token: this.props.authUser.tokenFCM
                                })
                                .then(res => {
                                  const { done, message } = res.data
                                  if (done) {
                                    NotificationManager.success(message)
                                  } else {
                                    NotificationManager.error(message)
                                  }
                                })
                                .catch(e => NotificationManager.error(e))
                            }}
                          >
                            Subscribe
                          </Button>
                          <Button
                            variant='outlined'
                            color='primary'
                            className='jr-btn jr-btn-xs m-1'
                            onClick={() => {
                              functions
                                .httpsCallable('unsubscribeFromTopic')({
                                  topic: topic.name,
                                  token: this.props.authUser.tokenFCM
                                })
                                .then(res => {
                                  const { done, message } = res.data
                                  if (done) {
                                    NotificationManager.success(message)
                                  } else {
                                    NotificationManager.error(message)
                                  }
                                })
                                .catch(e => NotificationManager.error(e))
                            }}
                          >
                            Unsubscribe
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardActions className='d-flex align-items-end mb-2'>
                  <TextField
                    select
                    label='Topics'
                    value={this.state.topic}
                    name='topic'
                    onChange={e =>
                      this.setState({ [e.target.name]: e.target.value })}
                    variant='outlined'
                    className='w-50 ml-5'
                  >
                    {topics.map((topic, index) => (
                      <MenuItem key={index} value={topic.name}>
                        {topic.name}
                      </MenuItem>
                    ))}
                  </TextField>
                  <Button
                    variant='contained'
                    color='secondary'
                    className='jr-btn jr-btn-xs ml-auto'
                    onClick={() => {
                      this.setState({ loader: true })
                      functions
                        .httpsCallable('sendPushMessageToTopic')({
                          topic: this.state.topic
                        })
                        .then(res => {
                          const { done, message } = res.data
                          if (done) {
                            NotificationManager.success(message)
                          } else {
                            NotificationManager.error(message)
                          }
                          this.setState({ loader: false })
                        })
                        .catch(e => NotificationManager.error(e))
                    }}
                  >
                    {loader
                      ? <i className='zmdi zmdi-spinner zmdi-hc-spin px-4' />
                      : 'Send Notification'}
                  </Button>
                </CardActions>
              </Card>
            </div>
            <div className='col-12 col-md-7 mb-3'>
              <Card>
                <CardContent>
                  <ResponsiveContainer width='100%' height={240}>
                    <AreaChart
                      data={this.state.chartData}
                      margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                    >
                      <Legend
                        layout='horizontal'
                        verticalAlign='top'
                        margin={{ left: 10 }}
                        wrapperStyle={{
                          top: 0,
                          left: 24,
                          lineHeight: '24px'
                        }}
                      />
                      <XAxis dataKey='name' />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type='monotone'
                        dataKey='Expanse'
                        stroke='#af8228'
                        fillOpacity={0.8}
                        fill='#f3b439'
                      />
                      <Area
                        type='monotone'
                        dataKey='Income'
                        stroke='#03275b'
                        fillOpacity={0.8}
                        fill='#3367d6'
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ auth }) => {
  const { authUser } = auth
  return { authUser }
}

export default connect(mapStateToProps, {})(Profile)
