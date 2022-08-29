import React, { Component } from 'react';
import { useLocation } from 'react-router-dom';
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


function Results(props) {

    const location = useLocation();


    return (
        <div style={styles.main}>
            {location ? location.state.results[0].map((result, index) => {
                return (<div key={index}>
                    <Result result={result} key={index} />
                </div>)
            }) : null}
        </div>
    )
}
export default Results;