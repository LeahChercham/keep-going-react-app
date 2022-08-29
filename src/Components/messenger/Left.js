import React from 'react'
import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { Sidebar, Search, Conversation, ConversationList, Avatar } from '@chatscope/chat-ui-kit-react';

const myStyles = {
    main: {
        // display: "flex",
        // flexFlow: "row",
        // justifyContent: "space-evenly",
        // alignContent: "center",
        width: "50%",
    },
}

function Left(props) {
    return (
        <div style={myStyles.main}><Sidebar position="left" scrollable={false}>
            <Search placeholder="Search..." />
            <ConversationList>
                {/* Map conversations here */}
                <Conversation name="Lilly" lastSenderName="Lilly" info="Yes i can do it for you">
                    {/* <Avatar src={lillyIco} name="Lilly" status="available" /> */}
                </Conversation>

                <Conversation name="Joe" lastSenderName="Joe" info="Yes i can do it for you">
                    {/* <Avatar src={joeIco} name="Joe" status="dnd" /> */}
                </Conversation>

                <Conversation name="Emily" lastSenderName="Emily" info="Yes i can do it for you" unreadCnt={3}>
                    {/* <Avatar src={emilyIco} name="Emily" status="available" /> */}
                </Conversation>

                <Conversation name="Kai" lastSenderName="Kai" info="Yes i can do it for you" unreadDot>
                    {/* <Avatar src={kaiIco} name="Kai" status="unavailable" /> */}
                </Conversation>

                <Conversation name="Akane" lastSenderName="Akane" info="Yes i can do it for you">
                    {/* <Avatar src={akaneIco} name="Akane" status="eager" /> */}
                </Conversation>

                <Conversation name="Eliot" lastSenderName="Eliot" info="Yes i can do it for you">
                    {/* <Avatar src={eliotIco} name="Eliot" status="away" /> */}
                </Conversation>

                <Conversation name="Zoe" lastSenderName="Zoe" info="Yes i can do it for you" active>
                    {/* <Avatar src={zoeIco} name="Zoe" status="dnd" /> */}
                </Conversation>

                <Conversation name="Patrik" lastSenderName="Patrik" info="Yes i can do it for you">
                    {/* <Avatar src={patrikIco} name="Patrik" status="invisible" /> */}
                </Conversation>

            </ConversationList>
        </Sidebar></div>
    )
}
export default Left;