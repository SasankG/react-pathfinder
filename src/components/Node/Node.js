import React, { Component } from 'react'
import './Node.css';

export default class Node extends Component {

    render() {
        return (
            <div className = "basicNode" onMouseUp={e => this.props.handleClick(this)}>
                <p id = "nodeText">{this.props.testid}</p>
            </div>
        )
    }
}
