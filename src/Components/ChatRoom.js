import { Button, TextField } from '@mui/material';
import React, { Component } from 'react';
import ChatMessage from './ChatMessage';

const styles = {
    main: {
        display: 'flex',
        flexFlow: 'row',
    },
    box: {
        display: 'flex',
        flexflow: "column",
    },
    messagesBox: {
        display: 'flex',
        maxHeight: "80%",
        backgroundColor: 'green',
    }
}

class ChatRoom extends Component {
    constructor() {
        super()
        this.state = {
            messages: [{ message: "Hi there", user: "B" }, { message: "ello", user: "A" }, { message: "Book", user: "B" }],

        }
    }

    render() {

        return (
            <div style={styles.main}>
                <div style={styles.messagesBox}>

                    {this.state.messages.map((m, i) => {
                        return <ChatMessage key={i} message={m.message} user={m.user} />
                    })}
                </div>
                <div style={styles.box}>
                    <TextField id="outlined-basic" label="Outlined" variant="outlined" />
                    <Button>Send</Button>
                </div>

            </div >
        )

    }
}

export default ChatRoom;