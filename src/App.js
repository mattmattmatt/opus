import React, {Component} from 'react';
import {connect} from 'react-redux';

import './App.css';

import Remote from './components/Remote';
import Player from './components/Player';
import Playlist from './components/Playlist';
import Settings from './components/Settings';
import * as actions from './actions';
import * as helpers from './helpers';
import MenuItem from 'material-ui/MenuItem';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar';
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

    onSeek(newPerc) {
        if (!this.props.hostState.activePlayer) {
            return;
        }
        helpers.sendKodiCommand(this.props.connection, 'Player.Seek', {
            playerid: this.props.hostState.activePlayer.playerid,
            value: newPerc
        });
    }

    playlistItemPlay(position) {
        helpers.sendKodiCommand(this.props.connection, 'Player.Open', {
            item: {
                playlistid: 0,
                position
            }
        });
    }

    playlistItemRemove(position) {
        helpers.sendKodiCommand(this.props.connection, 'Playlist.Remove', {
            playlistid: 0,
            position
        }).then(() => {
            this.props.dispatch(actions.fetchHostState());
        });
    }

    onIpChange(ip) {
        this.props.dispatch(actions.setSettings({ip}));
    }

    showSettings() {
        this.props.updateUI({settingsActive: true});
    }

    onRequestTimeUpdate() {
        this.props.dispatch(actions.updateCurrentTime());
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
        const player = (this.props.hostState.playerInfo ?
            <Player
                title={this.props.hostState.playerInfo.title}
                artist={(this.props.hostState.playerInfo.artist || []).join(', ')}
                album={this.props.hostState.playerInfo.album}
                duration={this.props.hostState.playerInfo.totaltime}
                position={this.props.hostState.playerInfo.time + this.props.hostState.playerInfo.timedelta}
                onSeek={this.onSeek.bind(this)}
                onRequestTimeUpdate={this.onRequestTimeUpdate.bind(this)}
                playbackState={this.props.playbackState}
            /> : '');
        return (
            <div className="App">
                <Toolbar>
                    <ToolbarGroup>
                        <ToolbarTitle text="Opus" />
                    </ToolbarGroup>
                    <ToolbarGroup>
                        <IconMenu
                            anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                            targetOrigin={{horizontal: 'right', vertical: 'top'}}
                            iconButtonElement={
                                <IconButton
                                    touch={true}
                                >
                                    <MoreVertIcon />
                                </IconButton>
                            }
                        >
                            <MenuItem
                                primaryText="Settings"
                                onClick={this.showSettings.bind(this)}
                            />
                        </IconMenu>
                    </ToolbarGroup>
                </Toolbar>
                <Settings
                    onIpChange={this.onIpChange.bind(this)}
                    ip={this.props.settings.ip}
                />
                <Remote
                    playbackState={this.props.playbackState}
                    onUpdateClick={this.onUpdateClick.bind(this)}
                    onPlayPauseClick={this.onPlayPauseClick.bind(this)}
                    onStopClick={this.onStopClick.bind(this)}
                />
                {player}
                <Playlist
                    items={this.props.hostState.playlistItems}
                    onPlaylistItemPlay={this.playlistItemPlay.bind(this)}
                    onPlaylistItemRemove={this.playlistItemRemove.bind(this)}
                    activeItemIndex={this.props.hostState.playerInfo.position}
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
