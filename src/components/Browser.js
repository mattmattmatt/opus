import React, {Component} from 'react';

// import * as actions from '../actions';
// import * as UI from 'material-ui';
import ui from 'redux-ui';
import Artist from './Artist';
import _ from 'lodash/core';

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
                    <li key={artistData.artistid} className='browser-list__item'>
                        <Artist
                            title={artistData.label}
                            thumbnail={artistData.thumbnail}
                            fanart={artistData.fanart}
                            artistid={artistData.artistid}
                            onPlay={this.props.onPlayArtist}
                        />
                    </li>
                );
            });
        }

        return (
            <ul className='browser-list'>
                {artists}
            </ul>
        );
    }
}

export default ui({key: 'browser', state: {}})(Browser);
