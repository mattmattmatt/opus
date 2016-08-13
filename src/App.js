import React, {Component} from 'react';
import {connect} from 'react-redux';

import './styles/app.css';

import Remote from './components/Remote';
import Settings from './components/Settings';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import * as actions from './actions';
import * as helpers from './helpers';

import ui from 'redux-ui';

const defaultUiState = {
    settingsActive: false
};

class App extends Component {

    onUpdateClick() {
        this.props.dispatch(actions.fetchHostState());
    }

    onPlayPauseClick() {
        if (!this.props.hostState.activePlayer) {
            if (this.props.hostState.playlistItems.length > 0) {
                this.playlistItemPlay(0);
            }
            return;
        }
        helpers.sendKodiCommand(this.props.connection, 'Player.PlayPause', {playerid: this.props.hostState.activePlayer.playerid});
    }

    onStopClick() {
        if (!this.props.hostState.activePlayer) {
            return;
        }
        helpers.sendKodiCommand(this.props.connection, 'Player.Stop', {playerid: this.props.hostState.activePlayer.playerid});
    }

    onIpChange(ip) {
        this.props.dispatch(actions.setSettings({ip}));
    }

    componentWillMount() {
        this.onIpChange('192.168.1.140');
    }

    componentDidMount() {
        this.updateInterval = setInterval(() => {
            // this.props.dispatch(actions.fetchHostState());
        }, 1000 * 1);
    }

    componentWillUnmount() {
        clearInterval(this.updateInterval);
    }

    render() {
        return (
            <div className="app">
                <div className="header-container">
                    <Header />
                </div>
                <div className="meat">
                    <div className="remote-container">
                        <Remote
                            playbackState={this.props.playbackState}
                            onUpdateClick={this.onUpdateClick.bind(this)}
                            onPlayPauseClick={this.onPlayPauseClick.bind(this)}
                            onStopClick={this.onStopClick.bind(this)}
                        />
                    </div>
                    <div className="sidebar-container">
                        <Sidebar
                            {...this.props}
                            />
                    </div>
                </div>
                <Settings
                    onIpChange={this.onIpChange.bind(this)}
                    ip={this.props.settings.ip}
                />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return state;
}
let connectedApp = App;
connectedApp = ui({key: 'main', state: defaultUiState})(connectedApp);
connectedApp = connect(mapStateToProps)(connectedApp);
export default connectedApp;
