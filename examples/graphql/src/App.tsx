/* eslint-disable jsx-a11y/accessible-emoji */
import React, {PropsWithChildren} from 'react';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
  useQuery,
} from '@apollo/client';

import {Devtools} from './Devtools';

export function App() {
  return (
    <GraphQLProvider>
      <GraphQLExample />
      <Devtools />
    </GraphQLProvider>
  );
}

const client = new ApolloClient({
  uri: 'https://flyby-router-demo.herokuapp.com/',
  cache: new InMemoryCache(),
  connectToDevTools: true,
});

function GraphQLProvider({children}: PropsWithChildren) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

const GET_LOCATIONS = gql`
  query GetLocations {
    locations {
      id
      name
      description
      photo
    }
  }
`;

function DisplayLocations() {
  const {loading, error, data} = useQuery(GET_LOCATIONS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  return data.locations.map(({id, name, description, photo}: any) => (
    <div key={id}>
      <h3>{name}</h3>
      <img width="400" height="250" alt="location-reference" src={`${photo}`} />
      <br />
      <b>About this location:</b>
      <p>{description}</p>
      <br />
    </div>
  ));
}

export function GraphQLExample() {
  return (
    <>
      <h2>My first Apollo app 🚀</h2>
      <br />
      <DisplayLocations />
    </>
  );
}
