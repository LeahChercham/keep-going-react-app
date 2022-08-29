
import React from 'react'
import { useLocation } from 'react-router-dom';
import Main from './Main';
import Left from './Left';
import Right from './Right';
import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput } from '@chatscope/chat-ui-kit-react';
const myStyles = {
    main: {
        display: "flex",
        flexFlow: "row",
        justifyContent: "space-evenly",
        alignContent: "center",
        width: "100%",
        height: "100%",
    },
}

function Messenger(props) {
    const location = useLocation();
    const expert = location.state.expert;

    return (
        <div style={myStyles.main}>
            <MainContainer responsive>
                <Left />
                <Main />
                <Right />

            </MainContainer>
        </div>
    )
}
export default Messenger;
