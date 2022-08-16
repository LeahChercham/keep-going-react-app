import React, { Component } from 'react';
import Result from './Result';

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
        console.log(this.props)
        return (
            <div>
                <div>
                    {this.props ? this.props.location.state.map((result, index) => {
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