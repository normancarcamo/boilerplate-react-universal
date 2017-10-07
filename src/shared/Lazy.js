// Dependencies:
import React, { Component } from 'react';
import img from 'assets/img/loader.gif';

// Components:
import App_      from 'bundle-loader?lazy&chunks/[name].[chunkhash]!components/App.js';
import About_    from 'bundle-loader?lazy&chunks/[name].[chunkhash]!components/About';
import Home_     from 'bundle-loader?lazy&chunks/[name].[chunkhash]!components/Home';
import NotFound_ from 'bundle-loader?lazy&chunks/[name].[chunkhash]!components/NotFound';
import Topics_   from 'bundle-loader?lazy&chunks/[name].[chunkhash]!components/Topics';
import Topic_    from 'bundle-loader?lazy&chunks/[name].[chunkhash]!components/Topics/Topic';
import Repos_    from 'bundle-loader?lazy&chunks/[name].[chunkhash]!components/Repos/Repos.js';

class Bundle extends Component {
  constructor(props) {
    super(props);
    this.state = { mod: null };
  }

  isUndefined(x) {
    return !!(x === undefined)
  }

  componentWillMount() {
    this.load(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.load !== this.props.load) {
      this.load(nextProps);
    }
  }

  load(props) {
    this.setState({ mod: null }, () => {
      props.load(mod => this.setState({
        mod: mod.default ? mod.default : mod
      }));
    });
  }

  render() {
    return this.state.mod
      ? this.props.children(this.state.mod)
      : this.isUndefined(this.props.default)
      ? <img src={img} />
      : this.props.default || null;
  }
}

const Split = (Index, props) => (
  <Bundle load={Index}>
    {Component => <Component {...props} />}
  </Bundle>
);

export const App      = props => Split(App_,      props);
export const About    = props => Split(About_,    props);
export const Home     = props => Split(Home_,     props);
export const Topics   = props => Split(Topics_,   props);
export const Topic    = props => Split(Topic_,    props);
export const NotFound = props => Split(NotFound_, props);
export const Repos    = props => Split(Repos_,    props);
