import React, {Component} from 'react';

import './App.css';

import Remote from './components/Remote';
import Player from './components/Player';
import Settings from './components/Settings';
import * as actions from './actions';

class App extends Component {
    onPlayerChanged() {
        this.props.store.dispatch(actions.fetchHostState());
    }

    onPlayPauseClick() {
        actions.sendKodiCommand('Player.PlayPause', [0]);
    }
    onStopClick() {
        actions.sendKodiCommand('Player.Stop', [0]);
    }
    onSeek(newPerc) {
        actions.sendKodiCommand('Player.Seek', {
            playerid: 0,
            value: newPerc
        });
    }
    onIpChange(ip) {
        this.props.store.dispatch(actions.setSettings({ip}));
        this.props.store.dispatch(actions.refreshConnection(this.props.store.getState().settings.ip, this.onPlayerChanged.bind(this)));
    }
    componentDidUpdate() {
        // console.log('app update');
    }

    componentWillMount() {
        this.onIpChange('192.168.1.140');
    }

    componentDidMount() {
        this.props.store.dispatch(actions.fetchHostState());
        this.props.store.subscribe(() => {
            this.forceUpdate();
        });
    }
    render() {
        return (
            <div className="App">
                <Settings onIpChange={this.onIpChange.bind(this)} ip={this.props.store.getState().settings.ip}/>
                <Remote playbackState={this.props.store.getState().playbackState} onPlayPauseClick={this.onPlayPauseClick.bind(this)} onStopClick={this.onStopClick.bind(this)}/>
                <Player title={'Shove it!'} artist={'Deftones'} album={'Around the Fur'} duration={305} position={111} onSeek={this.onSeek.bind(this)}/>
            </div>
        );
    }
}

export default App;
