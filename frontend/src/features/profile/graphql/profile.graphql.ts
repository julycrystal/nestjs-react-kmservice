import gql from "graphql-tag";
import { ADDRESS_FRAGMENT, USER_FRAGMENT } from "../../auth/graphql/fragments";

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
  mutation ChangePasswordMutation($changePasswordInput: ChangePasswordInput!) {
    changePassword(changePasswordInput: $changePasswordInput) {
      error
      ok
    }
  }
`;

export const GET_ADDRESSES = gql`
  query GetAddresses {
    getAddresses {
      ok
      error
      addresses {
        ...AddressParts
      }
    }
  }
  ${ADDRESS_FRAGMENT}
`;

export const CREATE_ADDRESS_MUTATION = gql`
  mutation CreateAddressMutation($createAddressInput: CreateAddressInput!) {
    createAddress(createAddressInput: $createAddressInput) {
      ok
      error
    }
  }
`;

export const UPDATE_ADDRESS_MUTATION = gql`
  mutation UpdateAddressMutation($updateAddressInput: UpdateAddressInput!) {
    updateAddress(updateAddressInput: $updateAddressInput) {
      error
      ok
    }
  }
`;

export const DELETE_ADDRESS_MUTATION = gql`
  mutation DeleteAddressMutation($deleteAddressInput: DeleteAddressInput!) {
    deleteAddress(deleteAddressInput: $deleteAddressInput) {
      ok
      error
    }
  }
`;
