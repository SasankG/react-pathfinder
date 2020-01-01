import React, { Component } from 'react'
import './Node.css';

export default class VisitedNode extends Component {
    constructor(props){
        super(props)
        
        this.state = {
            hiddentwo: 'hiddentwo'
        }
        
    }

    componentWillMount() {
        var that = this;
        setTimeout(function() {
            that.show();
        }, that.props.wait);
    }

    show(){
        this.setState({hiddentwo : ""});
    }


    render() {
        return (
            <div className = {`visitedNode`}>
                <div className = {`${this.state.hiddentwo}`}>
                    {this.props.testid}
                </div>
            </div>

        )
    }
}
