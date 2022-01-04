import gql from "graphql-tag";
import { ADDRESS_FRAGMENT, USER_FRAGMENT } from "./fragments";

export const GET_USERS = gql`
  query GetUsers($getUsersInput: PaginationInput!) {
    getUsers(getUsersInput: $getUsersInput) {
      ok
      error
      data {
        totalItems
        limit
        totalPages
        currentPage
        currentPageItems
        users {
          id
          name
          email
          username
          role
          verified
          disabled
          orders {
            id
          }
        }
      }
    }
  }
`;

export const GET_USER = gql`
  query GetUser($getUserInput: GetUserInput!) {
    getUser(getUserInput: $getUserInput) {
      ok
      error
      user {
        ...UserParts
        disabled
        verified
        addresses {
          ...AddressParts
        }
        orders {
          id
          totalAmount
          updatedAt
          status
          paymentMethod
        }
      }
    }
  }
  ${ADDRESS_FRAGMENT}
  ${USER_FRAGMENT}
`;

export const GET_ENTRIES_BY_USER = gql`
  query GetProductEntriesByUser(
    $getProductEntriesInput: GetProductEntriesInput!
  ) {
    getProductEntriesByUser(getProductEntriesInput: $getProductEntriesInput) {
      ok
      error
      data {
        totalPages
        totalItems
        limit
        currentPage
        currentPageItems
        productEntries {
          id
          amount
          entryDate
          product {
            title
          }
        }
      }
    }
  }
`;

export const ENABLE_ACCOUNT = gql`
  mutation EnableAccount($toggleDisableInput: ToggleDisableInput!) {
    enableAccount(toggleDisableInput: $toggleDisableInput) {
      ok
      error
    }
  }
`;

export const DISABLE_ACCOUNT = gql`
  mutation DisableAccount($toggleDisableInput: ToggleDisableInput!) {
    disableAccount(toggleDisableInput: $toggleDisableInput) {
      ok
      error
    }
  }
`;

export const UPDATE_USER_ROLE = gql`
  mutation UpdateUserRole($updateUserRoleInput: UpdateUserRoleInput!) {
    updateUserRole(updateUserRoleInput: $updateUserRoleInput) {
      ok
      error
    }
  }
`;

export const ADMIN_PRODUCT_ENTRY_LIST_QUERY = gql`
  query GetProductEntriesByProduct(
    $getProductEntriesByProductInput: GetProductEntriesByProductInput!
  ) {
    getProductEntriesByProduct(
      getProductEntriesByProductInput: $getProductEntriesByProductInput
    ) {
      ok
      data {
        totalPages
        totalItems
        limit
        currentPage
        currentPageItems
        productEntries {
          id
          amount
          entryDate
          user {
            name
          }
          product {
            title
          }
        }
      }
    }
  }
`;

export const ADMIN_CREATE_PRODUCT = gql`
  mutation CreateProduct($createProductInput: CreateProductInput!) {
    createProduct(createProductInput: $createProductInput) {
      ok
      error
      productId
    }
  }
`;

export const ADMIN_CREATE_PRODUCT_ENTRY = gql`
  mutation CreateProductEntry(
    $createProductEntryInput: CreateProductEntryInput!
  ) {
    createProductEntry(createProductEntryInput: $createProductEntryInput) {
      ok
    }
  }
`;

export const ADMIN_UPDATE_PRODUCT_ENTRY = gql`
  mutation UpdateProductEntry(
    $updateProductEntryInput: UpdateProductEntryInput!
  ) {
    updateProductEntry(updateProductEntryInput: $updateProductEntryInput) {
      ok
      error
    }
  }
`;

export const ADMIN_DELETE_PRODUCT_ENTRY = gql`
  mutation DeleteProductEntry(
    $productEntryDeleteInput: ProductEntryDeleteInput!
  ) {
    deleteProductEntry(productEntryDeleteInput: $productEntryDeleteInput) {
      error
      ok
    }
  }
`;

export const ADMIN_DELETE_PRODUCT = gql`
  mutation ProductDelete($productDeleteInput: ProductDeleteInput!) {
    deleteProduct(productDeleteInput: $productDeleteInput) {
      ok
      error
    }
  }
`;

export const ADMIN_UPDATE_PRODUCT = gql`
  mutation ProductUpdate($updateProductInput: UpdateProductInput!) {
    updateProduct(updateProductInput: $updateProductInput) {
      ok
      error
    }
  }
`;
