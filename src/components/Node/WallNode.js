import React, { Component } from 'react'
import './Node.css';

export default class WallNode extends Component {

    render() {
        return (
            <div className = "wallNode">
                {this.props.testid}
            </div>
        )
    }
}
