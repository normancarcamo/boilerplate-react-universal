import React     from 'react'
import styles    from './styles'
import { Route } from 'react-router-dom'

const Status = ({ code, children }) => (
  <Route render={({ staticContext }) => {
    if (staticContext) {
      staticContext.status = code
    }
    return children
  }}/>
);

export default () => (
  <Status code={404}>
    <div className={styles.container}>
      <h2 className={styles.title}> Sorry, cannot find this page</h2>
    </div>
  </Status>
)
