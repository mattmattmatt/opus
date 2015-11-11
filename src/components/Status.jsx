import React from 'react';

var Status = React.createClass({
  render: function() {
    return (
        <p>{this.props.status}</p>
    );
  }
});

export { Status };
