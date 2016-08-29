import React, {Component} from 'react';
import {connect} from 'react-redux';

import './styles/app.css';

import Remote from './components/Remote';
import Settings from './components/Settings';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Browser from './components/Browser';
import * as actions from './actions';
import * as helpers from './helpers';
import Uri from 'jsuri';

import ui from 'redux-ui';

const defaultUiState = {
    settingsActive: false,
    activeSection: undefined
};

class App extends Component {

    onUpdateClick() {
        this.props.dispatch(actions.fetchHostState());
    }

    onPlaylistClearClick() {
        helpers.sendKodiCommand(this.props.connection, 'Playlist.Clear', {playlistid: this.props.hostState.playerInfo.playlistid || 0});
    }

    navigateTo(path) {
        const uri = new Uri(path);
        this.props.dispatch(actions.navigateTo(uri.path(), this.props.updateUI));
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

    onNextClick() {
        if (!this.props.hostState.activePlayer) {
            return;
        }
        helpers.sendKodiCommand(this.props.connection, 'Player.GoTo', {playerid: this.props.hostState.activePlayer.playerid, to: 'next'});
    }

    onPreviousClick() {
        if (!this.props.hostState.activePlayer) {
            return;
        }
        helpers.sendKodiCommand(this.props.connection, 'Player.GoTo', {playerid: this.props.hostState.activePlayer.playerid, to: 'previous'});
    }

    onVolumeIncrease() {
        helpers.sendKodiCommand(this.props.connection, 'Input.ExecuteAction', {action: 'volumeup'});
    }

    onVolumeDecrease() {
        helpers.sendKodiCommand(this.props.connection, 'Input.ExecuteAction', {action: 'volumedown'});
    }

    onVolumeSet(volume) {
        helpers.sendKodiCommand(this.props.connection, 'Application.SetVolume', {volume});
        this.props.dispatch(actions.setPlayerInfo({
            appProperties: {
                volume
            }
        }));
    }

    onOpenArtist(artistid) {
        this.navigateTo('/music/artists/' + artistid);
    }

    onOpenAlbum(albumid) {
        this.navigateTo('/music/albums/' + albumid);
    }

    onPlayArtist(artistid) {
        let nextPlaylistPosition = this.props.hostState.playerInfo.position;
        if (typeof nextPlaylistPosition === 'undefined' || this.props.hostState.playlistItemsAudio.length === 0) {
            nextPlaylistPosition = -1;
        }
        nextPlaylistPosition++;
        const playlistToInsertTo = this.props.hostState.playerInfo.playlistid || 0;
        helpers.sendKodiCommand(this.props.connection, 'Playlist.Insert', {
            playlistid: playlistToInsertTo,
            position: nextPlaylistPosition,
            item: {artistid}
        }).then(() => {
            helpers.sendKodiCommand(this.props.connection, 'Player.Open', {
                item: {
                    playlistid: playlistToInsertTo,
                    position: nextPlaylistPosition
                }
            });
        });
    }

    onPlayAlbum(albumid) {
        let nextPlaylistPosition = this.props.hostState.playerInfo.position;
        if (typeof nextPlaylistPosition === 'undefined' || this.props.hostState.playlistItemsAudio.length === 0) {
            nextPlaylistPosition = -1;
        }
        nextPlaylistPosition++;
        const playlistToInsertTo = this.props.hostState.playerInfo.playlistid || 0;
        helpers.sendKodiCommand(this.props.connection, 'Playlist.Insert', {
            playlistid: playlistToInsertTo,
            position: nextPlaylistPosition,
            item: {albumid}
        }).then(() => {
            helpers.sendKodiCommand(this.props.connection, 'Player.Open', {
                item: {
                    playlistid: playlistToInsertTo,
                    position: nextPlaylistPosition
                }
            });
        });
    }

    onIpChange(ip) {
        this.props.dispatch(actions.setSettings({ip}));
    }

    componentWillMount() {
        // this.onIpChange('192.168.1.140');
        this.onIpChange('192.168.1.10');
        // this.onIpChange('172.19.248.43');
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
                    <Header
                        onUpdateClick={this.onUpdateClick.bind(this)}
                        onPlaylistClearClick={this.onPlaylistClearClick.bind(this)}
                        navigateTo={this.navigateTo.bind(this)}
                    />
                </div>
                <div className="meat">
                    <div className="browser-container">
                        <Browser
                            sectionData={this.props.section.sectionData}
                            sectionPath={this.props.section.sectionPath}
                            onPlayArtist={this.onPlayArtist.bind(this)}
                            onPlayAlbum={this.onPlayAlbum.bind(this)}
                            onOpenArtist={this.onOpenArtist.bind(this)}
                            onOpenAlbum={this.onOpenAlbum.bind(this)}
                        />
                    </div>
                    <div className="sidebar-container">
                        <div className="remote-container">
                            <Remote
                                playbackState={this.props.playbackState}
                                onPlayPauseClick={this.onPlayPauseClick.bind(this)}
                                onStopClick={this.onStopClick.bind(this)}
                                onNextClick={this.onNextClick.bind(this)}
                                onPreviousClick={this.onPreviousClick.bind(this)}
                                onVolumeIncrease={this.onVolumeIncrease.bind(this)}
                                onVolumeDecrease={this.onVolumeDecrease.bind(this)}
                                onVolumeSet={this.onVolumeSet.bind(this)}
                                volume={this.props.hostState.volume}
                                muted={this.props.hostState.muted}
                            />
                        </div>
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
