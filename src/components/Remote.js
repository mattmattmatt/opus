import React, {Component} from 'react';

import * as actions from '../actions';
import * as UI from 'material-ui';

export default class Remote extends Component {
    shouldComponentUpdate(nextProps) {
        return this.props.playbackState !== nextProps.playbackState;
    }
    render() {
        let stopButton;
        let nextButton;
        let prevButton;
        if (this.props.playbackState !== actions.PlaybackStates.STOPPED) {
            stopButton = (
                <UI.RaisedButton
                    onClick={this.props.onStopClick}
                    label="Stop"
                />
            );
            nextButton = (
                <UI.RaisedButton
                    onClick={this.props.onNextClick}
                    label="Next"
                />
            );
            prevButton = (
                <UI.RaisedButton
                    onClick={this.props.onPreviousClick}
                    label="Previous"
                />
            );
        }

        return (
            <div >
                {this.props.playbackState} &nbsp;
                {prevButton}
                <UI.RaisedButton
                    onClick={this.props.onPlayPauseClick}
                    label={this.props.playbackState === actions.PlaybackStates.PLAYING ? 'Pause' : 'Play'}
                />

                {stopButton}
                
                {nextButton}

                <UI.RaisedButton
                    onClick={this.props.onVolumeIncrease}
                    label="Louder"
                />
                <UI.RaisedButton
                    onClick={this.props.onVolumeDecrease}
                    label="Less louder"
                />
            </div>
        );
    }
}
