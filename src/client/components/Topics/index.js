import React from 'react'
import { Route, Link } from 'react-router-dom'
import { Topic, NotFound } from 'shared/Lazy'
import styles from './Topics.styl'

const Topics = ({ match }) => {
  const links = [
    { url: `${match.url}/rendering`, title: 'Rendering with React' },
    { url: `${match.url}/components`, title: 'Components' },
    { url: `${match.url}/props-v-state`, title: 'Props v. State' }
  ]

  return (
    <div>
      <h2 className={styles.title}>Topics (Code Splitting)</h2>
      <ul>
        {links.map(({url, title}, key) => <li key={key}><Link to={url}>{title}</Link></li>)}
      </ul>
      <Route path={`${match.url}/:topicId`} render={({ match }) => {
        let found = links.filter(({ url }) => match.url === url && url)[0]
        if (found) {
          return <Topic match={match} />
        } else {
          return <NotFound />
        }
      }}/>
    </div>
  )
}

export default Topics
