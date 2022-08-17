import React, { Component } from 'react';
import Result from './Result';
const util = require('util')
const styles = {

}


class Results extends Component {
    constructor() {
        super();
        this.state = {

        }
    }


    componentDidMount() {

    }

    render() {
        return (
            <div>
                <div>
                    {this.props ? this.props.location.state[0].map((result, index) => {
                        return (<div>
                            <Result result={result} key={index} />
                        </div>)
                    }) : null}
                </div>
            </div>
        )
    }

}

export default Results;