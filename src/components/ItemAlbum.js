import React, {Component} from 'react';

import '../styles/album.css';

import * as helpers from '../helpers';

import IconButton from 'material-ui/IconButton';
import AvPlay from 'material-ui/svg-icons/av/play-arrow';


class Album extends Component {

    onPlayClick() {
        this.props.onPlay(this.props.albumid);
    }

    onOpenArtistClick(event) {
        event.preventDefault();
        this.props.onOpenArtist(this.props.artistid);
    }

    onOpenAlbumClick(event) {
        event.preventDefault();
        this.props.onOpenAlbum(this.props.albumid);
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
        return (
            <div className="album" >
                <div className="album-bg album-bg--blur" style={this.getStyle().bgBlur} />
                <div className="album-bg" style={this.getStyle().bg} onClick={this.onOpenAlbumClick.bind(this)} />
                <div className="album-info">
                    <p className="album-title">
                        <a href={'/music/albums/' + this.props.albumid} onClick={this.onOpenAlbumClick.bind(this)}>{this.props.title}</a><br />
                        <a href={'/music/artists/' + this.props.artistid} onClick={this.onOpenArtistClick.bind(this)}>{this.props.displayartist}</a>
                    </p>
                    <IconButton  onClick={this.onPlayClick.bind(this)} className="list-item-button list-item-button--play">
                        <AvPlay />
                    </IconButton>
                </div>
            </div>
        );
    }
}

export default Album;
