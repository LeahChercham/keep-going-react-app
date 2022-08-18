import React, { Component } from 'react';

const styles = {
    main: {
        display: 'flex',
        flexFlow: 'row',
    },
    box: {
        display: 'flex',
        flexflow: "column",
    }
}

class ChatMessage extends Component {
    constructor() {
        super()
        this.state = {
            

        }
    }

    render() {

        return (
            <div style={styles.main}>
                chat messages
            </div>

        )
    }

}

export default ChatMessage;