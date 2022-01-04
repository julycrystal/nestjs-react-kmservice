import { gql } from "@apollo/client";

export const CREATE_ORDER = gql`
  mutation CreateOrder($createOrderInput: CreateOrderInput!) {
    createOrder(createOrderInput: $createOrderInput) {
      error
      ok
    }
  }
`;
