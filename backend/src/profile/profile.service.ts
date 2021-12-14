import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "src/product/entities/product.entity";
import { CreateUserOutput } from "src/user/dto/create-user.dto";
import { User } from "src/user/entities/user.entity";
import { Repository } from "typeorm";
import {
  CreateAddressInput,
  CreateAddressOutput,
} from "./dto/create-address.dto";
import {
  DeleteAddressInput,
  DeleteAddressOutput,
} from "./dto/delete-address.dto";
import { AddressesOutput } from "./dto/get-address.dto";
import {
  ToggleWishlistInput,
  ToggleWishlistOutput,
} from "./dto/toggle-wishlist.dto";
import {
  UpdateAddressInput,
  UpdateAddressOutput,
} from "./dto/update-address.dto";
import { Address } from "./entities/address.entity";

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  async createAddress (
    user: User,
    createAddressInput: CreateAddressInput
  ): Promise<CreateAddressOutput> {
    try {
      const address = await this.addressRepository.create({
        user,
        ...createAddressInput,
      });
      await this.addressRepository.save(address);
      return {
        ok: true,
      };
    } catch (error) {
      if (error.name && error.name === "HttpException") {
        throw error;
      }
      return {
        ok: false,
        error: "Can't create address.",
      };
    }
  }

  async getAddresses (user: User): Promise<AddressesOutput> {
    try {
      const addresses = await this.addressRepository.find({ user });
      return {
        ok: true,
        addresses,
      };
    } catch (error) {
      if (error.name && error.name === "HttpException") {
        throw error;
      }
      return {
        ok: false,
        error: "Cannot get addresses.",
      };
    }
  }

  async deleteAddress (
    user: User,
    { id }: DeleteAddressInput
  ): Promise<DeleteAddressOutput> {
    try {
      const address = await this.addressRepository.findOne({
        where: { id },
        relations: ["user"],
      });
      if (!address) {
        throw new HttpException("Address not found.", HttpStatus.NOT_FOUND);
      }
      if (address.user.id !== user.id) {
        throw new HttpException("Permission denied.", HttpStatus.UNAUTHORIZED);
      }
      await this.addressRepository.delete({ id: address.id });
      return {
        ok: true,
      };
    } catch (error) {
      if (error.name && error.name === "HttpException") {
        throw error;
      }
      return {
        ok: false,
        error: "Cannot delete address.",
      };
    }
  }

  async updateAddress (
    user: User,
    updateAddressInput: UpdateAddressInput
  ): Promise<UpdateAddressOutput> {
    try {
      const address = await this.addressRepository.findOne({
        where: { id: updateAddressInput.id },
        relations: ["user"],
      });
      if (!address) {
        throw new HttpException("Address not found.", HttpStatus.NOT_FOUND);
      }
      if (address.user.id !== user.id) {
        throw new HttpException("Permission denied.", HttpStatus.UNAUTHORIZED);
      }
      await this.addressRepository.update(updateAddressInput.id, {
        ...updateAddressInput,
      });
      return {
        ok: true,
      };
    } catch (error) {
      if (error.name && error.name === "HttpException") {
        throw error;
      }
      return {
        ok: false,
        error: "Cannot update address.",
      };
    }
  }

  async toggleWishlist (
    user: User,
    { id }: ToggleWishlistInput
  ): Promise<ToggleWishlistOutput> {
    try {
      const product = await this.productRepository.findOne({ id });
      if (!product) {
        throw new HttpException("Product not found.", HttpStatus.NOT_FOUND);
      }
      user.wishlists.push(product);
      await this.userRepository.save(user);
      return {
        ok: true,
      };
    } catch (error) {
      if (error.name && error.name === "HttpException") {
        throw error;
      }
      return {
        ok: false,
        error: "Error whistlisting product.",
      };
    }
  }
}
