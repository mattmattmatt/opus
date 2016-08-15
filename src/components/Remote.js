import React, {Component} from 'react';

import * as actions from '../actions';
import * as UI from 'material-ui';

export default class Remote extends Component {
    shouldComponentUpdate(nextProps) {
        return this.props.playbackState !== nextProps.playbackState;
    }
    render() {
        const stopButton = this.props.playbackState === actions.PlaybackStates.STOPPED ? '' : (
            <UI.RaisedButton
                onClick={this.props.onStopClick}
                label="Stop"
            />
        );
        return (
            <div >
                {this.props.playbackState} &nbsp;
                <UI.RaisedButton
                    onClick={this.props.onPlayPauseClick}
                    label={this.props.playbackState === actions.PlaybackStates.PLAYING ? 'Pause' : 'Play'}
                />

                {stopButton}
            </div>
        );
    }
}
