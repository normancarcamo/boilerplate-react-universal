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
  merge = props => Object.assign(props, this.props)
  render = () => [
    <h1 key={'a'} className={styles.title}>Boilerplate</h1>,
    <ul key={'b'}>
      <li><Link to={`/`}>Home</Link></li>
      <li><Link to={`/about`}>About</Link></li>
      <li><Link to={`/topics`}>Topics</Link></li>
      <li><Link to={`/repos`}>Repos</Link></li>
    </ul>,
    <hr key={'c'}/>,
    <Switch className={styles.content} key={'d'}>
      <Route exact path={`/`} render={props => <Home {...this.merge(props)} />}/>
      <Route path={`/about`} render={(props) => <About {...this.merge(props)} />}/>
      <Route path={`/topics`} render={props => <Topics {...this.merge(props)} />}/>
      <Route path={`/repos`} render={props => <Repos {...this.merge(props)} />}/>
      <Route component={NotFound}/>
    </Switch>
  ]
}

export default App
