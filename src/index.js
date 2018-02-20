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
    
      uri: 'wss://subscriptions.us-west-2.graph.cool/v1/cjdt5k3sx00jd0112x0658ffe',
      options: {
        reconnect: true
      }
    })

const httpLink = new HttpLink({ uri: 'https://api.graph.cool/simple/v1/cjdt5k3sx00jd0112x0658ffe' })

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
