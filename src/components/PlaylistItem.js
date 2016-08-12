import React, {Component} from 'react';

// import * as actions from '../actions';

export default class PlaylistItem extends Component {
    render() {
        return (
            <div >
                <span>{this.props.item.title}</span>
            </div>
        );
    }
}
