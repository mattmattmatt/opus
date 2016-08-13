import React, {Component} from 'react';
import * as UI from 'material-ui';
import ui from 'redux-ui';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';

class Settings extends Component {
    onIpChange(event) {
        this.props.onIpChange(event.target.value);
    }

    handleClose() {
        this.props.updateUI({settingsActive: false});
    }

    render() {
        return (
            <Dialog
                title="Settings"
                actions={
                    <RaisedButton
                        label="Close"
                        primary={true}
                        onTouchTap={this.handleClose.bind(this)}
                    />
                }
                modal={false}
                open={this.props.ui.settingsActive}
                onRequestClose={this.handleClose.bind(this)}
            >
                <div>
                    <formfield>
                        <UI.TextField
                            value={this.props.ip || ''}
                            onChange={this.onIpChange.bind(this)}
                            hintText="192.168.1.140"
                            floatingLabelText="IP Address"
                            floatingLabelFixed={true}
                            ref={(node) => {
                                // needs a timeout before node is focusable :(
                                setTimeout(() => {if (node) node.focus();}, 200);
                            }}
                        />
                    </formfield>
                </div>
            </Dialog>
        );
    }
}



export default ui({key: 'settings', state: {}})(Settings);
