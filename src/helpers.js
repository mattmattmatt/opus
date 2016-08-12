// /* globals Promise */
import {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
// import * as actions from './actions';

import kodi from 'kodi-ws';

class Helpers extends Component {

    sendKodiCommand(method, params) {
        if (!ip) {
            return Promise.reject('IP not set');
        }

        if (!connection) {
            return kodi(ip, 9090).then(function(c) {
                connection = c;
                return sendKodiCommand(method, params);
            });
        }

        return connection.run(method, params);
    }

    render() {
        console.log(this.props.state);
        return null;
    }
}

Helpers.propTypes = {
    state: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
};

function mapStateToProps(state) {
    return {state};
}

export default connect(mapStateToProps)(Helpers);
