import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { ProfileService } from "./profile.service";
import { Address } from "./entities/address.entity";
import {
  CreateAddressInput,
  CreateAddressOutput,
} from "./dto/create-address.dto";
import { AuthUser } from "src/auth/auth-user.decorator";
import { User } from "src/user/entities/user.entity";
import { AddressesOutput } from "./dto/get-address.dto";
import {
  DeleteAddressInput,
  DeleteAddressOutput,
} from "./dto/delete-address.dto";
import {
  UpdateAddressInput,
  UpdateAddressOutput,
} from "./dto/update-address.dto";
import {
  ToggleWishlistInput,
  ToggleWishlistOutput,
} from "./dto/toggle-wishlist.dto";
import { UseGuards } from "@nestjs/common";
import { UserGuard } from "src/auth/user.guard";

@UseGuards(UserGuard)
@Resolver(() => Address)
export class ProfileResolver {
  constructor(private readonly profileService: ProfileService) { }

  @Mutation(() => CreateAddressOutput)
  createAddress (
    @Args("createAddressInput") createAddressInput: CreateAddressInput,
    @AuthUser() user: User
  ): Promise<CreateAddressOutput> {
    return this.profileService.createAddress(user, createAddressInput);
  }

  @Query(() => AddressesOutput)
  getAddresses (@AuthUser() user: User): Promise<AddressesOutput> {
    return this.profileService.getAddresses(user);
  }

  @Mutation(() => DeleteAddressOutput)
  deleteAddress (
    @Args("deleteAddressInput") deleteAddressInput: DeleteAddressInput,
    @AuthUser() user: User
  ): Promise<DeleteAddressOutput> {
    return this.profileService.deleteAddress(user, deleteAddressInput);
  }

  @Mutation(() => UpdateAddressOutput)
  updateAddress (
    @Args("updateAddressInput") updateAddressInput: UpdateAddressInput,
    @AuthUser() user: User
  ) {
    return this.profileService.updateAddress(user, updateAddressInput);
  }

  // end of address

  @Mutation(() => ToggleWishlistOutput)
  toggleWishlist (
    @Args("toggleWishlistInput") toggleWishlistInput: ToggleWishlistInput,
    @AuthUser() user: User
  ): Promise<ToggleWishlistOutput> {
    return this.profileService.toggleWishlist(user, toggleWishlistInput);
  }
}
