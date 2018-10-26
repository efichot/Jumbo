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
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/about-us`} />
      <Route
        path={`${match.url}/about-us`}
        render={() => (
          <Suspense fallback={<LinearProgress color='secondary' />}>
            <AboutUs />
          </Suspense>
        )}
      />
      <Route
        path={`${match.url}/contact-us`}
        render={() => (
          <Suspense fallback={<LinearProgress color='secondary' />}>
            <ContactUs />
          </Suspense>
        )}
      />
      <Route
        path={`${match.url}/blog`}
        render={() => (
          <Suspense fallback={<LinearProgress color='secondary' />}>
            <Blog />
          </Suspense>
        )}
      />
      <Route
        path={`${match.url}/faq`}
        render={() => (
          <Suspense fallback={<LinearProgress color='secondary' />}>
            <Faq />
          </Suspense>
        )}
      />
      <Route
        path={`${match.url}/portfolio`}
        render={() => (
          <Suspense fallback={<LinearProgress color='secondary' />}>
            <Portfolio />
          </Suspense>
        )}
      />
      <Route
        path={`${match.url}/error-404`}
        render={() => (
          <Suspense fallback={<LinearProgress color='secondary' />}>
            <NotFound />
          </Suspense>
        )}
      />
      <Route
        path={`${match.url}/error-500`}
        render={() => (
          <Suspense fallback={<LinearProgress color='secondary' />}>
            <ServerError />
          </Suspense>
        )}
      />
      <Route
        render={() => (
          <Suspense fallback={<LinearProgress color='secondary' />}>
            <NotFound />
          </Suspense>
        )}
      />
    </Switch>
  </div>
)

export default Pages
