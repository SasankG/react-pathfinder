import React, { Component } from 'react'
import './Node.css';

export default class PathNode extends Component {
    constructor(props){
        super(props)
        
        this.state = {
            hidden: 'hidden'
        }
        
    }

    componentWillMount() {
        var that = this;
        setTimeout(function() {
            that.show();
        }, that.props.wait);
    }

    show(){
        this.setState({hidden : ""});
    }


    render() {
        return (
            <div className = {`pathNode`}>
                <div className = {`${this.state.hidden}`}>
                    {this.props.testid}
                </div>
            </div>

        )
    }
}
