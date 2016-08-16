import React, {Component} from 'react';
import ui from 'redux-ui';
import Player from './Player';
import Playlist from './Playlist';
import * as helpers from '../helpers';
import * as actions from '../actions';
import {Tabs, Tab} from 'material-ui/Tabs';
import VideoIcon from 'material-ui/svg-icons/av/video-library';
import AudioIcon from 'material-ui/svg-icons/av/library-music';



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
                playlistid: this.props.ui.activePlaylist,
                position
            }
        });
    }

    playlistItemRemove(position) {
        helpers.sendKodiCommand(this.props.connection, 'Playlist.Remove', {
            playlistid: this.props.ui.activePlaylist,
            position
        }).then(() => {
            this.props.dispatch(actions.fetchHostState());
        });
    }

    onChangeActivePlaylist(activePlaylist) {
        this.props.updateUI({
            activePlaylist
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
                cover={helpers.getHostImage(this.props.settings.ip, this.props.hostState.playerInfo.thumbnail)}
            /> : <span />);
        const playlist = (
            <Tabs
                value={this.props.ui.activePlaylist}
                onChange={this.onChangeActivePlaylist.bind(this)}
            >
                <Tab icon={<AudioIcon />} value={0} >
                    <Playlist
                        items={this.props.hostState.playlistItemsAudio}
                        onPlaylistItemPlay={this.playlistItemPlay.bind(this)}
                        onPlaylistItemRemove={this.playlistItemRemove.bind(this)}
                        activeItemIndex={this.props.hostState.playerInfo.position}
                        playbackState={this.props.playbackState}
                        isActive={this.props.hostState.playerInfo.playlistid === 0}
                    />
                </Tab>
                <Tab icon={<VideoIcon />} value={1} >
                    <Playlist
                        items={this.props.hostState.playlistItemsVideo}
                        onPlaylistItemPlay={this.playlistItemPlay.bind(this)}
                        onPlaylistItemRemove={this.playlistItemRemove.bind(this)}
                        activeItemIndex={this.props.hostState.playerInfo.position}
                        playbackState={this.props.playbackState}
                        isActive={this.props.hostState.playerInfo.playlistid === 1}
                    />
                </Tab>
            </Tabs>
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

export default ui({key: 'sidebar', state: {
    activePlaylist: 0
}})(Sidebar);
