import React from 'react';
import { connect } from 'react-redux';
import  * as actions from '../actions';


import { Status } from './Status';

var Opus = React.createClass({
  render: function() {
    return (
        <Status
            status='paused'
        />
    );
  }
});

export { Opus };

export default connect(select)(Opus);
