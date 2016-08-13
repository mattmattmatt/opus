import React, {Component} from 'react';
import MenuItem from 'material-ui/MenuItem';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar';
import ui from 'redux-ui';

class Header extends Component {
    showSettings() {
        this.props.updateUI({settingsActive: true});
    }

    onUpdateClick() {
        this.props.onUpdateClick();
    }

    render() {
        return (
            <Toolbar>
                <ToolbarGroup>
                    <ToolbarTitle text="Opus" />
                </ToolbarGroup>
                <ToolbarGroup>
                    <IconMenu
                        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                        targetOrigin={{horizontal: 'right', vertical: 'top'}}
                        iconButtonElement={
                            <IconButton
                                touch={true}
                            >
                                <MoreVertIcon />
                            </IconButton>
                        }
                    >
                        <MenuItem
                            primaryText="Refresh state"
                            onClick={this.onUpdateClick.bind(this)}
                        />
                        <MenuItem
                            primaryText="Settings"
                            onClick={this.showSettings.bind(this)}
                        />
                    </IconMenu>
                </ToolbarGroup>
            </Toolbar>
        );
    }
}

export default ui()(Header);
