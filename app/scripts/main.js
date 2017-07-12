import React from 'react';
import {render} from 'react-dom';

import Basic from './Basic'

class App extends React.Component {
  render () {
    return (
      <div>
        <Basic />
      </div>
    )
  }
}

render(<App/>, document.getElementById('app'))

if (module.hot) {
  module.hot.accept()
}
