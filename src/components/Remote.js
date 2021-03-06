import React, {Component} from 'react';

import * as actions from '../actions';
import * as UI from 'material-ui';
import debounce from 'lodash.debounce';
export default class Remote extends Component {
    constructor(props) {
        super(props);
        this.debouncedDrag = debounce((event, volume) => {
            this.props.onVolumeSet(Math.round(volume));
        }, 600);
        this.onDragStop = () => {
            this.props.onVolumeSet(Math.round(this.slider.state.value));
        };
    }

    shouldComponentUpdate(nextProps) {
        return this.props.playbackState !== nextProps.playbackState || this.props.volume !== nextProps.volume;
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

            <UI.Slider
                style={{height: 100}}
                axis="y"
                min={0}
                max={100}
                step={1}
                value={this.props.volume}
                onChange={this.debouncedDrag.bind(this)}
                onDragStop={this.onDragStop.bind(this)}
                ref={(node) => { this.slider = node; }}
            />
            </div>
        );
    }
}
