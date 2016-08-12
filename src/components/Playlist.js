import React, {Component} from 'react';

// import * as actions from '../actions';
import PlaylistItem from './PlaylistItem';

export default class Playlist extends Component {
    render() {
        const items = this.props.items.map((item) => {
            return (
                <li key={item.id}>
                    <PlaylistItem item={item} />
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
