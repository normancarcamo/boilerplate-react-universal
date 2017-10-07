import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'
import { Switch } from 'react-router'
import { Repos } from 'shared/Lazy'
import styles from './App.styl'
import Home from './Home'
import Topics from './Topics'
import About from './About'
import NotFound from './NotFound'
import routes from 'shared/routes'

class App extends Component {
  merge = (props) => Object.assign(props, this.props)

  render() {
    return (
      <div>
        <ul>
          <li><Link to={`/`}>Home</Link></li>
          <li><Link to={`/about`}>About</Link></li>
          <li><Link to={`/topics`}>Topics</Link></li>
          <li><Link to={`/repos`}>Repos</Link></li>
        </ul>
        <hr/>
        <h1 className={styles.title}>Boilerplate</h1>
        <div>
          <Switch>
            <Route exact path={`/`} render={props => <Home {...this.merge(props)} />}/>
            <Route path={`/about`} render={(props) => <About {...this.merge(props)} />}/>
            <Route path={`/topics`} render={props => <Topics {...this.merge(props)} />}/>
            <Route path={`/repos`} render={props => <Repos {...this.merge(props)} />}/>
            <Route render={props => <NotFound {...this.merge(props)} />}/>
          </Switch>
        </div>
      </div>
    )
  }
}

export default App
