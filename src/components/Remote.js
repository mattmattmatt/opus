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
                <h1>{this.props.playbackState}</h1>
                <UI.RaisedButton
                    onClick={this.props.onPlayPauseClick}
                    label={this.props.playbackState === actions.PlaybackStates.PLAYING ? 'Pause' : 'Play'}
                />

                {stopButton}
                <UI.RaisedButton
                    label="Update state"
                    onClick={this.props.onUpdateClick}
                />
            </div>
        );
    }
}
