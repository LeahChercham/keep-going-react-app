import React, { Component } from 'react';
import Result from './Result';
const util = require('util')
const styles = {

    main: {
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flexFlow: "row",
        height: "100%",
    }
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
            <div style={styles.main}>
                {this.props ? this.props.location.state[0].map((result, index) => {
                    return (<div key={index}>
                        <Result result={result} key={index} />
                    </div>)
                }) : null}
            </div>
        )
    }

}

export default Results;