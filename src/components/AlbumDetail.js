import React, {Component} from 'react';

import '../styles/album-overview.css';

import * as helpers from '../helpers';

import IconButton from 'material-ui/IconButton';
import AvPlay from 'material-ui/svg-icons/av/play-arrow';


class AlbumOverview extends Component {

    onPlayClick() {
        this.props.onPlay(this.props.albumid);
    }

    onOpenArtistClick(event) {
        event.preventDefault();
        this.props.onOpenArtist(this.props.artistid);
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

        return (
            <div className="album-detail" >
                <div className="album-detail-info">
                    <p className="album-detail-title">
                        {this.props.title}<br />
                        <a href={'/music/artists/' + this.props.artistid} onClick={this.onOpenArtistClick.bind(this)}>{this.props.displayartist}</a>
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
