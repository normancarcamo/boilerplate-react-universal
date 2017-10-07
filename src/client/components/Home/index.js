import React, { Component } from 'react';

class Home extends Component {
  render() {
    return (
      <div>
        <h1>Welcome to this boilerplate</h1>
        <h3>It was built with the following libraries:</h3>
        <ul>
          <li>React.js</li>
          <li>React router V4</li>
          <li>Babel 6</li>
          <li>Webpack 2 + HMR</li>
          <li>Node.js</li>
          <li>Immutable.js</li>
          <li>Superagent</li>
          <li>Stylus</li>
          <li>Css Modules</li>
          <li>SSR</li>
          <li>And more...</li>
        </ul>
      </div>
    )
  }
}

export default Home