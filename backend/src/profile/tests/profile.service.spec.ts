import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../../product/entities/product.entity';
import { MockProductRepoitory } from '../../product/__mocks__/product.repository';
import { User } from '../../user/entities/user.entity';
import { MockUserRepoitory } from '../../user/__mocks__/user.repository';
import { Repository } from 'typeorm';
import { Address } from '../entities/address.entity';
import { ProfileService } from '../profile.service';
import { MockAddressRepoitory } from '../__mocks__/address.repository';
import { CreateAddressInput, CreateAddressOutput } from '../dto/create-address.dto';
import { getUserStub } from '../../user/test/stubs/user.stub';
import { AddressesOutput } from '../dto/get-address.dto';
import { addressStub } from './stub/address.stub';
import { DeleteAddressInput, DeleteAddressOutput } from '../dto/delete-address.dto';
import { UpdateAddressInput, UpdateAddressOutput } from '../dto/update-address.dto';
import { ToggleWishlistInput, ToggleWishlistOutput } from '../dto/toggle-wishlist.dto';

type MockRepoitory<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('ProfileService', () => {
  let service: ProfileService;
  let userRepository: MockRepoitory<User>;
  let productRepository: MockRepoitory<Product>;
  let addressRepository: MockRepoitory<Address>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: getRepositoryToken(User),
          useValue: MockUserRepoitory,
        },
        {
          provide: getRepositoryToken(Address),
          useValue: MockAddressRepoitory,
        },
        {
          provide: getRepositoryToken(Product),
          useValue: MockProductRepoitory,
        },
      ]
    }).compile();
    service = module.get<ProfileService>(ProfileService);
    userRepository = module.get(getRepositoryToken(User));
    addressRepository = module.get(getRepositoryToken(Address));
    productRepository = module.get(getRepositoryToken(Product));
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe("createAddress()", () => {
    let createAddressOutput: CreateAddressOutput;
    let createAddressInput: CreateAddressInput = {
      address: "address",
      name: "name",
      apartment: "apartment",
      region: "region",
      phone: "phone",
      country: "country",
      company: "company"
    };
    const user: User = getUserStub();

    describe('when createAddress is called', () => {
      it("should create a new address", async () => {
        createAddressOutput = await service.createAddress(user, createAddressInput);

        expect(addressRepository.create).toBeCalled();
        expect(addressRepository.create).toBeCalledTimes(1);

        expect(addressRepository.save).toBeCalled();
        expect(addressRepository.save).toBeCalledTimes(1);

        expect(createAddressOutput.ok).toBe(true);
        expect(createAddressOutput.error).toBeUndefined();
      })
      it("should fail on error", async () => {
        addressRepository.create.mockRejectedValueOnce(new Error());
        createAddressOutput = await service.createAddress(user, createAddressInput);
        expect(createAddressOutput.ok).toBe(false);
        expect(createAddressOutput.error).toBeDefined();
        expect(createAddressOutput.error).toEqual("Can't create address.");
      })
    })
  });

  describe("getAddresses()", () => {
    let addressesOutput: AddressesOutput;
    const user: User = getUserStub();

    beforeEach(() => {
      addressesOutput = null;
      jest.clearAllMocks();
    })

    describe('when getAddresses is called', () => {
      it("it should return addresses", async () => {
        addressRepository.find.mockResolvedValueOnce([addressStub])
        addressesOutput = await service.getAddresses(user);
        expect(addressesOutput.ok).toBe(true);
        expect(addressesOutput.error).toBeUndefined();
        expect(addressesOutput.addresses).toEqual([addressStub]);
        expect(addressesOutput.addresses).toHaveLength(1);
      })
      it("should fail on error", async () => {
        addressRepository.find.mockRejectedValueOnce(new Error());
        addressesOutput = await service.getAddresses(user);
        expect(addressesOutput.ok).toBe(false);
        expect(addressesOutput.error).toBeDefined();
        expect(addressesOutput.error).toEqual("Cannot get addresses.");
      })
    })
  });

  describe("deleteAddress()", () => {
    let deleteAddressOutput: DeleteAddressOutput;
    const deleteAddressInput: DeleteAddressInput = {
      id: 1,
    }
    const user: User = getUserStub();

    beforeEach(() => {
      jest.clearAllMocks();
      deleteAddressOutput = null;
    })

    describe('when deleteAddress is called', () => {
      it("it should delete address successfully.", async () => {
        addressRepository.findOne.mockResolvedValueOnce({ ...addressStub, user })
        deleteAddressOutput = await service.deleteAddress(user, deleteAddressInput);

        expect(addressRepository.findOne).toBeCalled();
        expect(addressRepository.findOne).toBeCalledTimes(1);

        expect(addressRepository.delete).toBeCalled();
        expect(addressRepository.delete).toBeCalledTimes(1);
        expect(addressRepository.delete).toBeCalledWith(deleteAddressInput);

        expect(deleteAddressOutput.ok).toBe(true);
        expect(deleteAddressOutput.error).toBeUndefined();
      })
      it("it should fail on error", async () => {
        addressRepository.findOne.mockRejectedValueOnce(new Error());
        deleteAddressOutput = await service.deleteAddress(user, deleteAddressInput);
        expect(addressRepository.findOne).toBeCalledTimes(1);
        expect(addressRepository.delete).toBeCalledTimes(0);
        expect(deleteAddressOutput.ok).toBe(false);
        expect(deleteAddressOutput.error).toBeDefined();
        expect(deleteAddressOutput.error).toEqual("Cannot delete address.");
      })

      it("it should fail on address not found", async () => {
        addressRepository.findOne.mockResolvedValueOnce(null);
        try {
          deleteAddressOutput = await service.deleteAddress(user, deleteAddressInput);
        } catch (error) {
          expect(addressRepository.findOne).toBeCalledTimes(1);
          expect(error).toBeDefined();
          expect(error.name).toEqual("HttpException");
          expect(error.message).toEqual("Address not found.");
          expect(error.status).toEqual(404);
        }
      })

      it("it should fail when delet by another user", async () => {
        addressRepository.findOne.mockResolvedValueOnce({ ...addressStub, user });
        try {
          deleteAddressOutput = await service.deleteAddress({ ...user, id: 3 } as User, deleteAddressInput);
        } catch (error) {
          expect(addressRepository.findOne).toBeCalledTimes(1);
          expect(error).toBeDefined();
          expect(error.name).toEqual("HttpException");
          expect(error.message).toEqual("Permission denied.");
          expect(error.status).toEqual(401);
        }
      })
    })
  });

  describe("updateAddress()", () => {
    let updateAddressOutput: UpdateAddressOutput;
    const updateAddressInput: UpdateAddressInput = {
      id: 1,
      address: "asdf",
    }
    const user: User = getUserStub();

    beforeEach(() => {
      jest.clearAllMocks();
      updateAddressOutput = null;
    })

    describe('when updateAddress is called', () => {
      it("it should delete address successfully.", async () => {
        addressRepository.findOne.mockResolvedValueOnce({ ...addressStub, user })
        updateAddressOutput = await service.updateAddress(user, updateAddressInput);

        expect(addressRepository.findOne).toBeCalled();
        expect(addressRepository.findOne).toBeCalledTimes(1);

        expect(addressRepository.update).toBeCalled();
        expect(addressRepository.update).toBeCalledTimes(1);
        expect(addressRepository.update).toBeCalledWith(1, updateAddressInput);

        expect(updateAddressOutput.ok).toBe(true);
        expect(updateAddressOutput.error).toBeUndefined();
      })
      it("it should fail on error", async () => {
        addressRepository.findOne.mockRejectedValueOnce(new Error());
        updateAddressOutput = await service.updateAddress(user, updateAddressInput);
        expect(addressRepository.findOne).toBeCalledTimes(1);
        expect(addressRepository.update).toBeCalledTimes(0);
        expect(updateAddressOutput.ok).toBe(false);
        expect(updateAddressOutput.error).toBeDefined();
        expect(updateAddressOutput.error).toEqual("Cannot update address.");
      })

      it("it should fail on address not found", async () => {
        addressRepository.findOne.mockResolvedValueOnce(null);
        try {
          updateAddressOutput = await service.updateAddress(user, updateAddressInput);
        } catch (error) {
          expect(addressRepository.findOne).toBeCalledTimes(1);
          expect(error).toBeDefined();
          expect(error.name).toEqual("HttpException");
          expect(error.message).toEqual("Address not found.");
          expect(error.status).toEqual(404);
        }
      })

      it("it should fail when delete by another user", async () => {
        addressRepository.findOne.mockResolvedValueOnce({ ...addressStub, user });
        try {
          updateAddressOutput = await service.updateAddress({ ...user, id: 3 } as User, updateAddressInput);
        } catch (error) {
          expect(addressRepository.findOne).toBeCalledTimes(1);
          expect(error).toBeDefined();
          expect(error.name).toEqual("HttpException");
          expect(error.message).toEqual("Permission denied.");
          expect(error.status).toEqual(401);
        }
      })
    })
  });

  describe("toggleWishlist()", () => {
    let toggleWishlistOutput: ToggleWishlistOutput;
    let toggleWishlistInput: ToggleWishlistInput = {
      id: 1,
    };

    const user: User = { ...getUserStub(), wishlists: [] } as User;

    describe('when toggleWishlist is called', () => {
      it("should add whistlist product.", async () => {
        productRepository.findOne.mockResolvedValueOnce({ id: 1, } as Product)
        toggleWishlistOutput = await service.toggleWishlist(user, toggleWishlistInput);
        expect(productRepository.findOne).toBeCalled();
        expect(productRepository.findOne).toBeCalledTimes(1);

        expect(userRepository.save).toBeCalled();
        expect(userRepository.save).toBeCalledTimes(1);

        expect(toggleWishlistOutput.ok).toBe(true);
        expect(toggleWishlistOutput.error).toBeUndefined();
      })
      it("should fail on error", async () => {
        productRepository.findOne.mockRejectedValueOnce(new Error());
        toggleWishlistOutput = await service.toggleWishlist(user, toggleWishlistInput);
        expect(toggleWishlistOutput.ok).toBe(false);
        expect(toggleWishlistOutput.error).toBeDefined();
        expect(toggleWishlistOutput.error).toEqual("Error whistlisting product.");
      })
      it("should fail on product not found", async () => {
        productRepository.findOne.mockResolvedValueOnce(null);
        try {
          toggleWishlistOutput = await service.toggleWishlist(user, toggleWishlistInput);
        } catch (error) {
          expect(error).toBeDefined();
          expect(error.message).toEqual("Product not found.");
          expect(error.status).toEqual(404);
          expect(error.name).toEqual("HttpException");
        }
      })
    })
  });
});
