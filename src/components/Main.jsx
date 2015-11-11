import React from 'react';

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
