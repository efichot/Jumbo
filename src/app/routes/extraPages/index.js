import React, { Suspense } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import LinearProgress from '@material-ui/core/LinearProgress'

const AboutUs = React.lazy(() => import('./routes/aboutUs'))
const ContactUs = React.lazy(() => import('./routes/contactUs'))
const Blog = React.lazy(() => import('./routes/blog'))
const Faq = React.lazy(() => import('./routes/faq'))
const Portfolio = React.lazy(() => import('./routes/portfolio'))
const NotFound = React.lazy(() => import('./routes/404'))
const ServerError = React.lazy(() => import('./routes/500'))

const Pages = ({ match }) => (
  <div className='app-wrapper'>
    <Suspense fallback={<LinearProgress color='secondary' />}>
      <Switch>
        <Redirect exact from={`${match.url}/`} to={`${match.url}/about-us`} />
        <Route path={`${match.url}/about-us`} render={() => <AboutUs />} />
        <Route path={`${match.url}/contact-us`} render={() => <ContactUs />} />
        <Route path={`${match.url}/blog`} render={() => <Blog />} />
        <Route path={`${match.url}/faq`} render={() => <Faq />} />
        <Route path={`${match.url}/portfolio`} render={() => <Portfolio />} />
        <Route path={`${match.url}/error-404`} render={() => <NotFound />} />
        <Route path={`${match.url}/error-500`} render={() => <ServerError />} />
        <Route render={() => <NotFound />} />
      </Switch>
    </Suspense>
  </div>
)

export default Pages
