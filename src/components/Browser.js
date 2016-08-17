import React, {Component} from 'react';

// import * as actions from '../actions';
// import * as UI from 'material-ui';
import ui from 'redux-ui';
import Artist from './ItemArtist';
import Album from './ItemAlbum';
import AlbumOverview from './AlbumOverview';
import _ from 'lodash/core';
import Subheader from 'material-ui/Subheader';

import '../styles/browser.css';

class Browser extends Component {
    shouldComponentUpdate(nextProps) {
        const picks = ['sectionData'];
        const newProps = _.pick(nextProps, picks);
        const oldProps = _.pick(this.props, picks);
       return !_.isEqual(newProps, oldProps);
    }

    render() {
        let artists;
        if (this.props.sectionData.artists) {
            artists = this.props.sectionData.artists.result.map((artistId, index) => {
                const artistData = this.props.sectionData.artists.entities.artists[artistId];
                if (index===0) console.log(artistData);
                return (
                    <li key={artistData.artistid} className='browser-list__item browser-list__item--artist'>
                        <Artist
                            title={artistData.label}
                            thumbnail={artistData.thumbnail}
                            fanart={artistData.fanart}
                            artistid={artistData.artistid}
                            onPlay={this.props.onPlayArtist}
                            onOpen={this.props.onOpenArtist}
                        />
                    </li>
                );
            });
            artists = (
                <div>
                    <Subheader>Artists</Subheader>
                    <ul className='browser-list'>
                        {artists}
                    </ul>
                </div>
            );
        }

        let albums;
        if (this.props.sectionData.albums) {
            albums = this.props.sectionData.albums.result.map((albumId, index) => {
                const albumData = this.props.sectionData.albums.entities.albums[albumId];
                if (index===0) console.log(albumData);
                return (
                    <li key={albumData.albumid} className='browser-list__item browser-list__item--album'>
                        <Album
                            title={albumData.label}
                            thumbnail={albumData.thumbnail}
                            displayartist={albumData.displayartist}
                            artistid={albumData.artists[0]}
                            fanart={albumData.fanart}
                            albumid={albumData.albumid}
                            onPlay={this.props.onPlayAlbum}
                            onOpenAlbum={this.props.onOpenAlbum}
                            onOpenArtist={this.props.onOpenArtist}
                        />
                    </li>
                );
            });
            albums = (
                <div>
                    <Subheader>Albums</Subheader>
                    <ul className='browser-list'>
                        {albums}
                    </ul>
                </div>
            );
        }

        let songs;
        if (this.props.sectionData.songs) {
            songs = this.props.sectionData.songs.data.albums.map((album, index) => {
                if (index===0) console.log(album);
                return (
                    <li key={album.albumid} className='browser-list__item browser-list__item--album-overview'>
                        <AlbumOverview
                            title={album.album}
                            albumid={album.albumid}
                            items={album.songs}
                            onPlay={this.props.onPlayAlbum}
                            onOpenAlbum={this.props.onOpenAlbum}
                            onOpenArtist={this.props.onOpenArtist}
                        />
                    </li>
                );
            });
            /*thumbnail={songData.thumbnail}
            displayartist={songData.displayartist}
            fanart={songData.fanart}
            onPlay={this.props.onPlayAlbum}*/
            songs = (
                <div>
                    <Subheader>Albums</Subheader>
                    <ul className='browser-list'>
                        {songs}
                    </ul>
                </div>
            );
        }

        return (
            <div className="browser-list-wrapper">
                {songs}
                {albums}
                {artists}
            </div>
        );
    }
}

export default ui({key: 'browser', state: {}})(Browser);
