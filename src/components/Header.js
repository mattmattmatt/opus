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

    onNavClick(event) {
        event.preventDefault();
        this.props.navigateTo(event.target.href);
    }

    render() {
        return (
            <Toolbar>
                <ToolbarGroup>
                    <ToolbarTitle text="Opus" />
                    <a href="/music" onClick={this.onNavClick.bind(this)}>Music</a>
                    <a href="/music/albums" onClick={this.onNavClick.bind(this)}>Albums</a>
                    <a href="/music/artists" onClick={this.onNavClick.bind(this)}>Artists</a>
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
                            onClick={this.props.onUpdateClick}
                        />
                        <MenuItem
                            primaryText="Clear playlist"
                            onClick={this.props.onPlaylistClearClick}
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
