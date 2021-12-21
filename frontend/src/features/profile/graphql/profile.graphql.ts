import gql from "graphql-tag";
import { USER_FRAGMENT } from "../../auth/graphql/fragments";

export const DELETE_ACCOUNT_MUTATION = gql`
  mutation DeleteAccountMutation {
    deleteAccount {
      error
      ok
    }
  }
`;

export const UPDATE_PROFILE_MUTATION = gql`
  mutation UpdateProfileMutation($updateUserInput: UpdateUserInput!) {
    updateProfile(updateUserInput: $updateUserInput) {
      error
      ok
      user {
        ...UserParts
      }
    }
  }
  ${USER_FRAGMENT}
`;

export const CHANGE_PASSWORD_MUTATION = gql`
  mutation ChangePasswordMutation(
    $changePasswordInput: ChangePasswordInput!
  ) {
    changePassword(
      changePasswordInput:$changePasswordInput
    ) {
      error
      ok
    }
  }
`;
