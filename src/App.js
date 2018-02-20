import React, { Component } from 'react';
import * as ReactDOM from 'react-dom';

// Import GraphQL helpers
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

//import components
import Chatbox from './components/Chatbox';

// App component styles
import './App.css';


class App extends Component {

  state = {
    from: 'anonymous',
    content: '',
    createdAt: '',
    color_black: true,
  };
  

  componentDidMount() {
    // Get username form prompt
    // when page loads
    const from = window.prompt('Type your name to start chatting!');
    from && this.setState({ from });
    this._subscribeToNewChats();
  }

  _subscribeToNewChats = () => {
    this.props.allChatsQuery.subscribeToMore({
        document: gql`
          subscription {
            Chat(filter: { mutation_in: [CREATED] }) {
              node {
                id
                from
                content
                createdAt
              }
            }
          }
        `,
        updateQuery: (previous, { subscriptionData }) => {
          const newChatLinks = [
            ...previous.allChats,
            subscriptionData.data.Chat.node
          ];
          const result = {
            ...previous,
            allChats: newChatLinks
          };
          return result;
        }
      });
    };

  _createChat = async e => {
    if (e.key === 'Enter' && this.state.content !== '' ) {
      e.preventDefault();
      const { content, from, createdAt } = this.state;
       await this.props.createChatMutation({
         variables: { content, from, createdAt }
       });
       this.setState({ content: '' });
     }
   };

   handleClick = () => {
     if(this.state.content !== '') {
        const { content, from, createdAt } = this.state;
         this.props.createChatMutation({
           variables: { content, from, createdAt }
         });
         this.setState({ content: '' });
      }
   }

   submit(e) {
    e.preventDefault();
  }


    scrollToBottom = () => {
      const { messageList } = this.refs;
      const scrollHeight = messageList.scrollHeight;
      const height = messageList.clientHeight;
      const maxScrollTop = scrollHeight - height;
      ReactDOM.findDOMNode(messageList).scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
      }  

      componentDidUpdate() {
        this.scrollToBottom();
    }

    changeColor = () => {
      this.setState({color_black: !this.state.color_black})
  }

  render() {
    const allChats = this.props.allChatsQuery.allChats || [];
    const blue = {
      backgroundColor: "#E8CBC0",  
      background: "-webkit-linear-gradient(to bottom, #636FA4, #E8CBC0)", 
      background: "linear-gradient(to bottom, #636FA4, #E8CBC0)" 
    }

    const black = {background:"#2E2E2E"}

    let colorTheme = this.state.color_black ? black : blue;
    let colorButton = this.state.color_black ? "#2E2E2E" : "#48599c";

    return (
      <div id="container">
        <aside id="sidebar" style={colorTheme}>
          <h1>React Chat App</h1>
          <hr />
          <h2>{this.state.from}</h2>
          <div>
            <button className="themeButtom" onClick={this.changeColor.bind(this)}>Change Theme</button>
          </div>
        </aside>
        <section id="main">
              <div className="messageList" ref="messageList" onScroll={this.onScroll}>
                {allChats.map(message => (
                  <Chatbox key={message.id} message={message} />
                ))}
              </div>
                  <div className="inputForm">
                    <form onSubmit={this.submit}>
                    <input
                      autoFocus
                      value={this.state.content}
                      onChange={e => this.setState({ content: e.target.value })}
                      type="text"
                      placeholder="Type your message"
                      onKeyPress={this._createChat}
                    />
                    <button type="submit" onClick={this.handleClick} style={{backgroundColor:colorButton}}>
                    Send
                    </button>
                    </form>
                  </div>
          </section>
      </div>
    );          
  }
}


const ALL_CHATS_QUERY = gql`
  query AllChatsQuery {
    allChats {
      id
      createdAt
      from
      content
    }
  }
`;

// Mutation for Create Mutation - CUD
const CREATE_CHAT_MUTATION = gql`
mutation CreateChatMutation($content: String!, $from: String!) {
  createChat(content: $content, from: $from) {
    id
    createdAt
    from
    content
  }
}
`;

export default compose(
graphql(ALL_CHATS_QUERY, { name: 'allChatsQuery' }),
graphql(CREATE_CHAT_MUTATION, { name: 'createChatMutation' })
)(App);