import React, {Component} from 'react';

// import * as actions from '../actions';
import PlaylistItem from './PlaylistItem';

export default class Playlist extends Component {
    render() {
        if (!this.props.items || !this.props.items.length) {
            return <span />;
        }
        const items = this.props.items.map((item, index) => {
            return (
                <li key={item.id}>
                    <PlaylistItem
                        item={item}
                        position={index}
                        onPlaylistItemPlay={this.props.onPlaylistItemPlay}
                        onPlaylistItemRemove={this.props.onPlaylistItemRemove}
                        isPlaying={this.props.activeItemIndex === index}
                    />
                </li>
            );
        });

        return (
            <ul >
                {items}
            </ul>
        );
    }
}
