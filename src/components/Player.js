import React, {Component} from 'react';
import '../styles/player.css';

// import * as actions from '../actions';
import moment from 'moment';
import 'moment-duration-format';
import Draggable from 'react-draggable';
import throttle from 'lodash.throttle';
import * as actions from '../actions';

export default class Player extends Component {
    constructor(props) {
        super(props);
        this.state = {
            seekPos: undefined
        };
        this.debouncedDrag = throttle((event, position) => {
            const newPercentage = this.getPercentageForPosition(position);
            this.setState({
                seekPos: newPercentage / 100
            });
        }, 50);
    }

    shouldComponentUpdate() {
        return true;
    }

    getPercentageForPosition(position) {
        let newPercentage = (position.x / this.refs.seeker.clientWidth);
        newPercentage = Math.round(Math.max(Math.min(newPercentage, 1), 0) * 100);
        return newPercentage;
    }

    handleDragStart() {
        this.stopTimeTimer();
    }

    handleDragStop(event, position) {
        const newPercentage = this.getPercentageForPosition(position);
        this.setState({
            seekPos: newPercentage / 100
        });
        this.props.onSeek(newPercentage);
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
        let pos = {
            x: 0,
            y: 0
        };
        const totalTime = moment.duration(this.props.duration, 'seconds');
        const currentTime = moment.duration(this.props.position, 'seconds');
        let seekTime;
        if (this.refs.seeker && this.refs.seeker.clientWidth) {
            if (this.state.seekPos) {
                pos.x = this.state.seekPos * this.refs.seeker.clientWidth;
                seekTime = moment.duration(this.props.duration * this.state.seekPos, 'seconds');
            } else {
                pos.x = this.props.position / this.props.duration * this.refs.seeker.clientWidth;
            }
        }
        let timeFormat = 'h:mm:ss';
        if (totalTime.hours() < 1) {
            timeFormat = 'm:ss';
        }
        const seekTimeComp = seekTime ? (
            <span
                className="seeker__time seeker__time--seek-time"
                style={{left: pos.x + 'px'}}
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
                            <Draggable
                                // bounds="parent"
                                axis="x"
                                position={pos}
                                onStart={this.handleDragStart.bind(this)}
                                onDrag={this.debouncedDrag.bind(this)}
                                onStop={this.handleDragStop.bind(this)}
                                zindex={100}
                                >
                                <div className="seeker__position" />
                            </Draggable>
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
