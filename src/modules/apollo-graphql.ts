import {
  ApolloClient,
  ApolloLink,
  FetchResult,
  Observable,
  Operation,
  fromPromise,
  split,
} from '@apollo/client/core'
import { InMemoryCache } from '@apollo/client/cache'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { createUploadLink } from 'apollo-upload-client'
import { Client, ClientOptions, createClient } from 'graphql-ws'
import { print } from 'graphql'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { getMainDefinition } from '@apollo/client/utilities'
import { createPersistedQueryLink } from '@apollo/client/link/persisted-queries'
import sha256 from 'crypto-js/sha256'

const uri = import.meta.env.VITE_GRAPHQL_ENDPOINT
const socket = import.meta.env.VITE_GRAPHQL_ENDPOINT_WS
const ip = import.meta.env.VITE_SERVER_URL
const dev = import.meta.env.dev

class WebSocketLink extends ApolloLink {
  private client: Client

  constructor(options: ClientOptions) {
    super()
    this.client = createClient(options)
  }

  public request(operation: Operation): Observable<FetchResult> {
    return new Observable((sink) => {
      return this.client.subscribe<FetchResult>(
        { ...operation, query: print(operation.query) },
        {
          next: sink.next.bind(sink),
          complete: sink.complete.bind(sink),
          error: (err) => {
            if (Array.isArray(err))
            // GraphQLError[]
            {
              return sink.error(
                new Error(err.map(({ message }) => message).join(', ')),
              )
            }

            if (err instanceof CloseEvent) {
              return sink.error(
                new Error(
                  `Socket closed with event ${err.code} ${err.reason || ''}`, // reason will be available on clean closes only
                ),
              )
            }

            return sink.error(err)
          },
        },
      )
    })
  }
}

const wsLink = (): WebSocketLink => {
  return new WebSocketLink({
    url: socket || `ws://${ip}:4000/subscriptions`,
    // connectionParams: () => {
    //   if (token) {
    //     return {
    //       token: token,
    //     };
    //   }
    // },
  })
}

const httpLink = () => {
  return createUploadLink({
    uri: uri || `http://${ip}:4000/graphql`,
    credentials: 'same-origin',
  })
}

// Cache implementation
const cache = () => {
  return new InMemoryCache({
    addTypename: false,
  })
}

const apqLink = createPersistedQueryLink({
  sha256: i => sha256(i).toString(),
})

const splitLink = () => {
  return split(
    ({ query }) => {
      const definition = getMainDefinition(query)
      return (
        definition.kind === 'OperationDefinition'
        && definition.operation === 'subscription'
      )
    },
    apqLink.concat(wsLink()),
    apqLink.concat(httpLink()),
  )
}

const errorHandler = () => {
  return onError(({ graphQLErrors, networkError, operation, forward }): any => {
    if (networkError) {
      // eslint-disable-next-line no-console
      console.log(`[Network error]: ${networkError}`)
    }
    return null
  })
}

const authLink = setContext(async (_, { headers }) => {
  // const {token} = useAuth()
  // if (token) {
  //   return {
  //     headers: {
  //       ...headers,
  //       Authorization: token ? `Bearer ${token}` : '',
  //       'x-custom-lang': 'tr-TR',
  //     },
  //   }
  // }
})

const apolloClient = new ApolloClient({
  link: ApolloLink.from([errorHandler(), authLink, splitLink()]),
  cache: cache(),
  connectToDevTools: !!dev,
})
export { apolloClient }

export const install = ({ app }) => {
  app.provide(DefaultApolloClient, apolloClient)
}
