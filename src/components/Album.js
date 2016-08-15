import React, {Component} from 'react';

import '../styles/album.css';

import * as helpers from '../helpers';

import IconButton from 'material-ui/IconButton';
import AvPlay from 'material-ui/svg-icons/av/play-arrow';


class Album extends Component {

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
        return (
            <div className="album" >
                <div className="album-bg album-bg--blur" style={this.getStyle().bgBlur} />
                <div className="album-bg" style={this.getStyle().bg} />
                <div className="album-info">
                    <p className="album-title">
                        {this.props.title}<br />
                        {this.props.displayartist}
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
