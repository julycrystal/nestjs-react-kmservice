import { gql } from "@apollo/client";

export const ADDRESS_FRAGMENT = gql`
  fragment AddressParts on Address {
      id
      updatedAt
      name
      company
      address
      apartment
      region
      country
      phone
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
    picture
    addresses {
     ...AddressParts
    }
  }
  ${ADDRESS_FRAGMENT}
`;
