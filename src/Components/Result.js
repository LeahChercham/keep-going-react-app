import React, { Component } from 'react';
const util = require('util')

const styles = {
    
}

class Result extends Component {
    constructor() {
        super();
        this.state = {
            
        }
    }
    
    render() {
        console.log(util.inspect(this.props.result,false, 7))
        console.log("in result component:" + this.props.result.username)
        return (
            <div>
                <div>
                    Result
                    {this.props.result.username}
                </div>

            </div>
        )
    }

}

export default Result;