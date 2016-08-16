import React, {Component} from 'react';

import '../styles/album-overview.css';

import * as helpers from '../helpers';

import IconButton from 'material-ui/IconButton';
import AvPlay from 'material-ui/svg-icons/av/play-arrow';


class AlbumOverview extends Component {

    onPlayClick() {
        this.props.onPlay(this.props.albumid);
    }

    getStyle() {
        const fallbackImgPath = helpers.getFallbackImage(this.props.title + '\n' + this.props.displayalbum);
        return {
            bg: {
                backgroundImage: 'url("' + (this.props.thumbnail || this.props.fanart || fallbackImgPath) + '")'
            },
            bgBlur: {
                backgroundImage: 'url("' + (this.props.fanart || this.props.thumbnail || fallbackImgPath) + '")'
            }
        };
    }

    render() {
        const songs = this.props.items.map((song) => {
            return (
                <li key={'albumoverview'+song.songid}>
                    {song.label}
                </li>
            );
        });
        // <div className="album-bg album-bg--blur" style={this.getStyle().bgBlur} />
        // <div className="album-bg" style={this.getStyle().bg} />

        return (
            <div className="album-overview" >
                <div className="album-overview-info">
                    <p className="album-overview-title">
                        {this.props.title}<br />
                        {this.props.displayartist}
                        </p>
                    <IconButton onClick={this.onPlayClick.bind(this)} className="">
                        <AvPlay />
                    </IconButton>
                </div>
                <div className="song-list">
                    <ul>
                        {songs}
                    </ul>
                </div>
            </div>
        );
    }
}

export default AlbumOverview;
