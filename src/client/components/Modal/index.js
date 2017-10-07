import React from 'react'
import ReactDOM from 'react-dom'

class Modal extends React.Component {
  constructor(props) {
    super(props)
    this.el = null
  }

  componentDidMount() {
    this.el = window.document.createElement('div')
    this.root = window.document.getElementById('modal')
    this.root.appendChild(this.el)
    this.setState({});
  }

  componentWillUnmount() {
    this.root.removeChild(this.el)
  }

  render() {
    // or this.props.children instead:

    if (this.el) {
      return ReactDOM.createPortal(
        <button onClick={e => console.log('Click from child')}>Click...</button>,
        this.el,
      )
    } else {
      return ''
    }
  }
}

export default Modal
