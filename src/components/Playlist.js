import React, {Component} from 'react';

import * as actions from '../actions';
import PlaylistItem from './PlaylistItem';
import {List} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';

export default class Playlist extends Component {
    render() {
        if (!this.props.items || !this.props.items.length) {
            return <span />;
        }
        const items = this.props.items.map((item, index) => {
            return (
                <PlaylistItem
                    key={item.id}
                    item={item}
                    position={index}
                    onPlaylistItemPlay={this.props.onPlaylistItemPlay}
                    onPlaylistItemRemove={this.props.onPlaylistItemRemove}
                    isPlaying={this.props.activeItemIndex === index && this.props.playbackState !== actions.PlaybackStates.STOPPED}
                />
            );
        });

        return (
            <List>
                 <Subheader>Playlist</Subheader>
                {items}
            </List>
        );
    }
}
