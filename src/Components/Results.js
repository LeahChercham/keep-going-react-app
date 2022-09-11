import React, { Component, useEffect } from 'react';
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
            {location && location.state.results.length > 0 ? location.state.results.map((result, index) => {
                return (<div key={index}>
                    <Result result={result} key={index} />
                </div>)
            }) : <div>No results</div>}
        </div>
    )
}
export default Results;