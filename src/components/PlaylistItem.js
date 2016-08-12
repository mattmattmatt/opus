import React, {Component} from 'react';

// import * as actions from '../actions';

export default class PlaylistItem extends Component {
    onPlaylistItemClick() {
        this.props.onPlaylistItemClick(this.props.position);
    }

    render() {
        return (
            <div>
                <span onClick={this.onPlaylistItemClick.bind(this)}>
                    {this.props.item.title}
                </span>
            </div>
        );
    }
}
