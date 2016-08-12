import React, {Component} from 'react';
import '../styles/player.css';

// import * as actions from '../actions';
import moment from 'moment';
import 'moment-duration-format';
import Draggable from 'react-draggable';
import throttle from 'lodash.throttle';

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
                <h2>Player</h2>
                <h1>{this.props.title}</h1>
                <h2>{this.props.artist}</h2>
                <h2>{this.props.album}</h2>
                <div className="seeker" ref="seeker">
                    <p className="seeker__time">
                        <span className="seeker__current-time">
                            {currentTime.format(timeFormat, { trim: false })}&nbsp;/&nbsp;
                        </span>
                        <span className="seeker__total-time">
                            {totalTime.format(timeFormat, { trim: false })}
                        </span>
                    </p>
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
            </div>
        );
    }
}
