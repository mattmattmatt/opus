import React, {Component} from 'react';
import ui from 'redux-ui';
import Player from './Player';
import Playlist from './Playlist';
import * as helpers from '../helpers';
import * as actions from '../actions';

import '../styles/sidebar.css';

class Sidebar extends Component {

    onRequestTimeUpdate() {
        this.props.dispatch(actions.updateCurrentTime());
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

    render() {
        const player = (this.props.hostState.playerInfo.totaltime ?
            <Player
                title={this.props.hostState.playerInfo.title}
                artist={(this.props.hostState.playerInfo.artist || []).join(', ')}
                album={this.props.hostState.playerInfo.album}
                duration={this.props.hostState.playerInfo.totaltime}
                position={this.props.hostState.playerInfo.time + this.props.hostState.playerInfo.timedelta}
                onSeek={this.onSeek.bind(this)}
                onRequestTimeUpdate={this.onRequestTimeUpdate.bind(this)}
                playbackState={this.props.playbackState}
            /> : <span />);
        const playlist = (
            <Playlist
                items={this.props.hostState.playlistItems}
                onPlaylistItemPlay={this.playlistItemPlay.bind(this)}
                onPlaylistItemRemove={this.playlistItemRemove.bind(this)}
                activeItemIndex={this.props.hostState.playerInfo.position}
                playbackState={this.props.playbackState}
            />
        );
        return (
            <section className="sidebar">
                <div className="player-container">
                    {player}
                </div>
                <div className="playlist-container">
                    {playlist}
                </div>
            </section>
        );
    }
}

export default ui()(Sidebar);
