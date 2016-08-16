import React, {Component} from 'react';

import * as actions from '../actions';
import PlaylistItem from './PlaylistItem';
import {List} from 'material-ui/List';
import _ from 'lodash/core';

export default class Playlist extends Component {
    shouldComponentUpdate(nextProps) {
        const picks = ['items', 'activeItemIndex', 'playbackState'];
        const newProps = _.pick(nextProps, picks);
        const oldProps = _.pick(this.props, picks);
       return !_.isEqual(newProps, oldProps);
    }

    render() {
        if (!this.props.items || !this.props.items.length) {
            return <span />;
        }
        const items = this.props.items.map((item, index) => {
            return (
                <PlaylistItem
                    key={item.id + '-' + index}
                    primaryText={item.primaryText}
                    secondaryText={item.secondaryText}
                    position={index}
                    onPlaylistItemPlay={this.props.onPlaylistItemPlay}
                    onPlaylistItemRemove={this.props.onPlaylistItemRemove}
                    isPlaying={this.props.isActive && this.props.activeItemIndex === index && this.props.playbackState !== actions.PlaybackStates.STOPPED}
                />
            );
        });

        return (
            <List>
                {items}
            </List>
        );
    }
}
