import React, {Component} from 'react';

import '../styles/artist.css';

import * as helpers from '../helpers';

import IconButton from 'material-ui/IconButton';
import AvPlay from 'material-ui/svg-icons/av/play-arrow';


class Artist extends Component {

    onPlayClick() {
        this.props.onPlay(this.props.artistid);
    }

    getStyle() {
        const fallbackImgPath = helpers.getFallbackImage(this.props.title);
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
            <div className="artist" >
                <div className="artist-bg artist-bg--blur" style={this.getStyle().bgBlur} />
                <div className="artist-bg" style={this.getStyle().bg} />
                <div className="artist-info">
                    <p className="artist-title">{this.props.title}</p>
                    <IconButton  onClick={this.onPlayClick.bind(this)} className="list-item-button list-item-button--play">
                        <AvPlay />
                    </IconButton>
                </div>
            </div>
        );
    }
}

export default Artist;
