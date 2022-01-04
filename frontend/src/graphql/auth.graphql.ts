import gql from "graphql-tag";
import { USER_FRAGMENT } from "./fragments";

export const LOGIN = gql`
  mutation LoginMutation($loginInput:LoginInput!) {
    login(loginInput: $loginInput) {
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

export const REGISTER_MUTATION = gql`
  mutation RegisterMutation(
    $createUserInput:CreateUserInput!
  ) {
    register(
      createUserInput: $createUserInput,
    ) {
      ok
      error
    }
  }
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
