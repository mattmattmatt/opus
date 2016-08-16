import React, {Component} from 'react';
import {ListItem} from 'material-ui/List';
import ActionDelete from 'material-ui/svg-icons/action/delete';
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
                onDoubleClick={this.onPlaylistItemPlay.bind(this)}
                primaryText={this.props.primaryText}
                secondaryText={this.props.secondaryText}
                insetChildren={true}
                rightIcon={!this.props.isPlaying ? <ActionDelete onClick={this.onPlaylistItemRemove.bind(this)} /> : <span />}
                leftIcon={
                    !this.props.isPlaying ?
                    undefined :
                    <img src={NowPlaying} alt="Playing" />
                }
            >
            </ListItem>
        );
    }
}
