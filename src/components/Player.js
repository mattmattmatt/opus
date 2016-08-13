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
            let newPercentage = (position.x / this.refs.seeker.clientWidth);
            newPercentage = Math.round(Math.max(Math.min(newPercentage, 1), 0) * 100);
            this.setState({
                seekPos: newPercentage / 100
            });
            this.props.onSeek(newPercentage);
        }, 500);
    }
    shouldComponentUpdate() {
        return true;
    }

    handleDragStart() {
    }

    handleDragStop(event, position) {
        this.debouncedDrag(event, position);
        // only block seek position for another 1000ms
        setTimeout(() => {
            this.setState({
                seekPos: null
            });
        }, 1000);
    }

    componentDidUpdate() {
        if (this.props.playbackState === actions.PlaybackStates.PLAYING) {
            if (!this.timer) {
                this.timer = setInterval(() => {
                    this.props.onRequestTimeUpdate();
                }, 1000);
            }
        } else {
            clearInterval(this.timer);
            this.timer = null;
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
        if (this.refs.seeker && this.refs.seeker.clientWidth) {
            if (this.state.seekPos) {
                pos.x = this.state.seekPos * this.refs.seeker.clientWidth;
            } else {
                pos.x = this.props.position / this.props.duration * this.refs.seeker.clientWidth;
            }
        }
        const currentTime = moment.duration(this.props.position, 'seconds');
        const totalTime = moment.duration(this.props.duration, 'seconds');
        let timeFormat = 'h:mm:ss';
        if (totalTime.hours() < 1) {
            timeFormat = 'm:ss';
        }
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
                            <Draggable
                                // bounds="parent"
                                axis="x"
                                position={pos}
                                onStart={this.handleDragStart.bind(this)}
                                onDrag={this.debouncedDrag}
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
