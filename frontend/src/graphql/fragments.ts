import { gql } from "@apollo/client";

export const ADDRESS_FRAGMENT = gql`
  fragment AddressParts on Address {
    id
    createdAt
    name
    city
    address
    apartment
    country
    note
  }
`;

export const USER_FRAGMENT = gql`
  fragment UserParts on User {
    id
    username
    name
    email
    role
    bio
    addresses {
      ...AddressParts
    }
  }
  ${ADDRESS_FRAGMENT}
`;
