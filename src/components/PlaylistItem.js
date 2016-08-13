import React, {Component} from 'react';
import {ListItem} from 'material-ui/List';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import ActionPlayArrow from 'material-ui/svg-icons/av/play-arrow';
import NowPlaying from '../assets/now-playing.gif';

export default class PlaylistItem extends Component {
    onPlaylistItemPlay() {
        this.props.onPlaylistItemPlay(this.props.position);
    }

    onPlaylistItemRemove() {
        this.props.onPlaylistItemRemove(this.props.position);
    }

    render() {
        return (
            <ListItem
                primaryText={this.props.item.title}
                secondaryText={this.props.item.artist || ''}
                rightIcon={!this.props.isPlaying ? <ActionDelete onClick={this.onPlaylistItemRemove.bind(this)} /> : <span />}
                leftIcon={
                    !this.props.isPlaying ?
                    <ActionPlayArrow onClick={this.onPlaylistItemPlay.bind(this)} /> :
                    <img src={NowPlaying} alt="Playing" />
                }
            >
            </ListItem>
        );
    }
}
