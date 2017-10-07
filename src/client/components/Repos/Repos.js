import React, { Component } from 'react';
import styles from './styles.styl';
import { Route, Link } from 'react-router-dom'
import { loadData } from './actions.js'
import { isNull, arrayHasValues } from 'shared/methods'
import img from 'assets/img/loader.gif';
import { fa, ion } from 'assets/js/iconfont'

class Repos extends Component {
  constructor(props) {
    super(props);
    this.state = props;
  }

  async componentDidMount() {
    if (!this.state.data.length) {
      try {
        const response = await loadData()
        this.setState({ data: response.body })
      } catch(error) {
        this.setState({ error: error.response.body })
      }
    }
  }

  renderError() {
    return (
      <div>
        <h1>{this.props.error.status}</h1>
        <h4>{this.props.error.response.text}</h4>
      </div>
    );
  }

  renderData() {
    return (
      <div>
        <Link to={'/'} className={styles.back}>
          <i className={`${fa('home')} ${styles.iconHome}`}></i>
          Go Home
        </Link>
        <h1 className={styles.title}>Repos + Code Splitting & Universal Request</h1>
        <ul className={styles.list}>
          {this.state.data.map((user, index) => (
            <li key={index} className={styles.repo}>
              <p className={styles.text}>
                {`${user.id} - `}
                <i className={styles.description}>{user.name}</i>
                {` - `}
                <i><a href={user.html_url}>{user.git_url}</a></i>
              </p>
              <br/>
            </li>
          ))}
          <br/>
        </ul>
      </div>
    );
  }

  render() {
    return (this.props.error || this.state.error)
      ? this.renderError()
      : (this.state.data.length)
        ? this.renderData()
        : (!this.props.error || !this.state.error)
          ? <img src={img} />
          : <h2>No data was found!</h2>
  }
}

Repos.defaultProps = { data: [], error: null }

export default Repos