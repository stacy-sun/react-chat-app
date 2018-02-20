import React from 'react';
import './Chatbox.css'

    const Chatbox = ({message}) => (
        <ul>
        <li className="chat-message">
          <h5>{message.from}</h5>
          <p>
           {message.createdAt}
          </p>
          <span>
            {message.content}
          </span>
        </li>
        </ul>
    );
    export default Chatbox;