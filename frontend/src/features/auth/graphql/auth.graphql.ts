import gql from "graphql-tag";
import { USER_FRAGMENT } from "./fragments";

export const LOGIN = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(loginInput: { password: $password, email: $email }) {
      ok
      error
      user {
        ...UserParts
      }
      token
    }
  }
  ${USER_FRAGMENT}
`;

export const MY_PROFILE = gql`
  query MyProfile {
    myProfile {
      error
      ok
      user {
        ...UserParts
      }
    }
  }
  ${USER_FRAGMENT}
`;
