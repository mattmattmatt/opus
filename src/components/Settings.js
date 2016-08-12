import React, {Component} from 'react';

export default class Settings extends Component {
    onIpChange() {
        this.props.onIpChange(this.refs.inputIp.value);
    }
    render() {
        return (
            <div >
                <formfield>
                    <label>
                        IP Address<br />
                        <input type="text" onChange={this.onIpChange.bind(this)} ref="inputIp" value={this.props.ip}/>
                    </label>
                </formfield>
            </div>
        );
    }
}
