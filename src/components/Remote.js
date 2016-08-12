import React, {Component} from 'react';

import * as actions from '../actions';

export default class Remote extends Component {
    shouldComponentUpdate(nextProps) {
        return this.props.playbackState !== nextProps.playbackState;
    }
    render() {
        const stopButton = this.props.playbackState === actions.PlaybackStates.STOPPED ? '' : (
            <button onClick={this.props.onStopClick}>
                Stop
            </button>
        );
        return (
            <div >
                <h1>{this.props.playbackState}</h1>
                <button onClick={this.props.onPlayPauseClick}>
                    { this.props.playbackState === actions.PlaybackStates.PLAYING ? 'Pause' : 'Play'}
                </button>
                {stopButton}
            </div>
        );
    }
}
