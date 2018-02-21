import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
// import registerServiceWorker from './registerServiceWorker';

import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { split } from 'apollo-client-preset'
// import { ApolloLink, split } from 'apollo-client-preset'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'

const wsLink = new WebSocketLink({
    
      uri: 'Your WebSocket URI',
      //Replace the uri
      options: {
        reconnect: true
      }
    })

const httpLink = new HttpLink({ uri: 'Your URI' })
//Replace the uri

const link = split(
    
      ({ query }) => {
        const { kind, operation } = getMainDefinition(query)
        return kind === 'OperationDefinition' && operation === 'subscription'
      },
      wsLink,
      httpLink,
    )

const client = new ApolloClient({
        
        link,
        cache: new InMemoryCache()
    })

    ReactDOM.render(
        
          <ApolloProvider client={client}>
            <App />
          </ApolloProvider>,
          document.getElementById('root')
        );
