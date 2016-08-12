import React, {Component} from 'react';

// import * as actions from '../actions';

export default class PlaylistItem extends Component {
    onPlaylistItemPlay() {
        this.props.onPlaylistItemPlay(this.props.position);
    }

    onPlaylistItemRemove() {
        this.props.onPlaylistItemRemove(this.props.position);
    }

    render() {
        var buttons = !this.props.isPlaying ? (
            <div>
                <button onClick={this.onPlaylistItemPlay.bind(this)}>Play</button>
                <button onClick={this.onPlaylistItemRemove.bind(this)}>Remove</button>
            </div>
        ) : '';
        return (
            <div>
                <h4>
                    {this.props.item.title}
                    {buttons}
                </h4>
            </div>
        );
    }
}
