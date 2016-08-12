import React, {Component} from 'react';
import {connect} from 'react-redux';
import './App.css';

import Remote from './components/Remote';
import Player from './components/Player';
import Settings from './components/Settings';
import * as actions from './actions';
import * as helpers from './helpers';

class App extends Component {

    onPlayPauseClick() {
        if (!this.props.hostState.activePlayer) {
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
    onSeek(newPerc) {
        if (!this.props.hostState.activePlayer) {
            return;
        }
        helpers.sendKodiCommand(this.props.connection, 'Player.Seek', {
            playerid: this.props.hostState.activePlayer.playerid,
            value: newPerc
        });
    }
    onIpChange(ip) {
        this.props.dispatch(actions.setSettings({ip}));
    }

    componentDidUpdate() {
        // console.log('app update');
    }

    componentWillMount() {
        this.onIpChange('192.168.1.140');
    }

    componentDidMount() {
        // this.props.dispatch(actions.fetchHostState());
    }
    render() {
        return (
            <div className="App">
                <Settings onIpChange={this.onIpChange.bind(this)} ip={this.props.settings.ip}/>
                <Remote playbackState={this.props.playbackState} onPlayPauseClick={this.onPlayPauseClick.bind(this)} onStopClick={this.onStopClick.bind(this)}/>
                <Player title={'Shove it!'} artist={'Deftones'} album={'Around the Fur'} duration={305} position={111} onSeek={this.onSeek.bind(this)}/>
            </div>
        );
    }
}

function mapStateToBitches(state) {
    return state;
}

export default connect(mapStateToBitches)(App);
