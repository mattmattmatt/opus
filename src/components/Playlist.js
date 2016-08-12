import React, {Component} from 'react';

// import * as actions from '../actions';
import PlaylistItem from './PlaylistItem';

export default class Playlist extends Component {
    render() {
        const items = this.props.items.map((item, index) => {
            return (
                <li key={item.id}>
                    <PlaylistItem item={item} position={index} onPlaylistItemClick={this.props.onPlaylistItemClick} />
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
