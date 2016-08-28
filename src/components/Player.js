import React, {Component} from 'react';
import '../styles/player.css';

// import * as actions from '../actions';
import moment from 'moment';
import 'moment-duration-format';
import throttle from 'lodash.throttle';
import * as actions from '../actions';
import Slider from 'material-ui/Slider';

export default class Player extends Component {
    constructor(props) {
        super(props);
        this.state = {
            seekPos: undefined
        };
        this.debouncedDrag = throttle((event, position) => {
            this.setState({
                seekPos: position
            });
        }, 50);
    }

    shouldComponentUpdate() {
        return true;
    }

    handleDragStart() {
        this.stopTimeTimer();
    }

    handleDragStop() {
        this.props.onSeek(Math.round(this.state.seekPos / this.props.duration * 100));
        // only block seek position for another 1000ms
        setTimeout(() => {
            this.setState({
                seekPos: null
            });
            this.startTimeTimer();
        }, 1000);
    }

    startTimeTimer() {
        if (!this.timer) {
            this.timer = setInterval(() => {
                this.props.onRequestTimeUpdate();
            }, 1000);
        }
    }

    stopTimeTimer() {
        clearInterval(this.timer);
        this.timer = null;
    }

    componentDidUpdate() {
        if (this.props.playbackState === actions.PlaybackStates.PLAYING) {
            this.startTimeTimer();
        } else {
            this.stopTimeTimer();
        }
    }

    getStyle() {
        return {
            blur: {
                backgroundImage: 'url("' + this.props.cover + '")'
            },
            cover: {
                backgroundImage: 'url("' + this.props.cover + '"), radial-gradient(ellipse at center, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.4) 100%)'
            }
        };
    }

    render() {
        let pos = 0;
        const totalTime = moment.duration(this.props.duration, 'seconds');
        const currentTime = moment.duration(this.props.position, 'seconds');
        let seekTime;
        if (this.state.seekPos) {
            seekTime = moment.duration(this.state.seekPos, 'seconds');
            pos = this.state.seekPos;
        } else {
            pos = this.props.position;
        }
        let timeFormat = 'h:mm:ss';
        if (totalTime.hours() < 1) {
            timeFormat = 'm:ss';
        }
        const seekTimeComp = seekTime ? (
            <span
                className="seeker__time seeker__time--seek-time"
                style={{left: (pos / this.props.duration * 100) + '%'}}
            >
                {seekTime.format(timeFormat, { trim: false })}
            </span>
        ) : null;
        return (
            <div className="player">
                <div className="player__bg player__bg--blur" style={this.getStyle().cover} />
                <div className="player__bg" style={this.getStyle().cover} />
                <div className="player__content player__content--bg" />
                <div className="player__content">
                    <p className="playerinfo">
                        <span className="playerinfo__element playerinfo__element--title">{this.props.title}</span>
                        <span className="playerinfo__element playerinfo__element--artist">{this.props.artist}</span>
                        <span className="playerinfo__element playerinfo__element--album">{this.props.album}</span>
                    </p>
                    <div className="seeker-container">
                        <span className="seeker__time seeker__time--current-time">
                            {currentTime.format(timeFormat, { trim: false })}
                        </span>
                        <div className="seeker" ref="seeker">
                            {seekTimeComp}
                            <Slider
                                axis="x"
                                min={0}
                                max={this.props.duration}
                                step={1}
                                value={pos}
                                onChange={this.debouncedDrag.bind(this)}
                                onDragStart={this.handleDragStart.bind(this)}
                                onDragStop={this.handleDragStop.bind(this)}
                                sliderStyle={{margin: 0}}
                            />
                        </div>
                        <span className="seeker__time seeker__time--total-time">
                            {totalTime.format(timeFormat, { trim: false })}
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}
