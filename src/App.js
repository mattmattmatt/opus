import React, {Component} from 'react';
import {connect} from 'react-redux';
import moment from 'moment';

import './App.css';

import Remote from './components/Remote';
import Player from './components/Player';
import Playlist from './components/Playlist';
import Settings from './components/Settings';
import * as actions from './actions';
import * as helpers from './helpers';

class App extends Component {

    onUpdateClick() {
        this.props.dispatch(actions.fetchHostState());
    }

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

    componentWillMount() {
        this.onIpChange('192.168.1.140');
    }

    render() {
        const player = (this.props.hostState.playerInfo ?
            <Player
                title={this.props.hostState.playerInfo.title}
                artist={(this.props.hostState.playerInfo.artist || []).join(', ')}
                album={this.props.hostState.playerInfo.album}
                duration={moment.duration(this.props.hostState.playerInfo.totaltime).asSeconds()}
                position={moment.duration(this.props.hostState.playerInfo.time).asSeconds()}
                onSeek={this.onSeek.bind(this)}
            /> : ''
        );
        return (
            <div className="App">
                <Settings onIpChange={this.onIpChange.bind(this)} ip={this.props.settings.ip}/>
                <Remote playbackState={this.props.playbackState} onUpdateClick={this.onUpdateClick.bind(this)} onPlayPauseClick={this.onPlayPauseClick.bind(this)} onStopClick={this.onStopClick.bind(this)}/>
                {player}
                <Playlist items={this.props.hostState.playlistItems} />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return state;
}

export default connect(mapStateToProps)(App);
