import React, {Component} from 'react';
import '../styles/player.css';

// import * as actions from '../actions';
import moment from 'moment';
import 'moment-duration-format';
import Draggable from 'react-draggable';

export default class Player extends Component {
    constructor(props) {
        super(props);
        this.state = {
            seekPos: undefined
        };
    }
    shouldComponentUpdate() {
        return true;
    }

    handleDragStart(event, position) {
        // console.log(event, position);
    }

    handleDrag(event, position) {
        // console.log(event, position);
        let newPercentage = (position.x / this.refs.seeker.clientWidth);
        newPercentage = Math.round(Math.max(Math.min(newPercentage, 1), 0) * 100);
        this.setState({
            seekPos: newPercentage
        });
    }

    handleDragStop(event, position) {
        let newPercentage = (position.x / this.refs.seeker.clientWidth);
        newPercentage = Math.round(Math.max(Math.min(newPercentage, 1), 0) * 100);
        this.setState({});
        this.props.onSeek(newPercentage);
    }

    render() {
        let pos = {
            x: 0,
            y: 0
        };
        if (this.refs.seeker && this.refs.seeker.clientWidth) {
            pos.x = this.props.position / this.props.duration * this.refs.seeker.clientWidth;
        }
        const currentTime = moment.duration(this.props.position, 'seconds');
        const totalTime = moment.duration(this.props.duration, 'seconds');
        return (
            <div className="player">
                <h2>Player</h2>
                <h1>{this.props.title}</h1>
                <h2>{this.props.artist}</h2>
                <h2>{this.props.album}</h2>
                <div className="seeker" ref="seeker">
                    <Draggable
                        // bounds="parent"
                        axis="x"
                        position={pos}
                        onStart={this.handleDragStart.bind(this)}
                        onDrag={this.handleDrag.bind(this)}
                        onStop={this.handleDragStop.bind(this)}
                    >
                        <div className="seeker__position" />
                    </Draggable>
                    <p className="seeker__time">
                        <span className="seeker__current-time">
                            {currentTime.format()}&nbsp;/&nbsp;
                        </span>
                        <span className="seeker__total-time">
                            {totalTime.format()}
                        </span>
                    </p>
                </div>
            </div>
        );
    }
}
