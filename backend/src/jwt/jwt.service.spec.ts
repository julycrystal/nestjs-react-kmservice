import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from './jwt.service';
import * as jwt from "jsonwebtoken";
import { CONFIG_OPTIONS } from '../common/constants';

const TEST_KEY = 'test'
const USER_ID = 1;
jest.mock('jsonwebtoken', () => {
  return {
    sign: jest.fn(() => 'token'),
    verify: jest.fn(() => ({ id: USER_ID }))
  }
})

describe('JwtService', () => {
  let service: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtService, {
        provide: CONFIG_OPTIONS,
        useValue: { privateKey: TEST_KEY }
      }],
    }).compile();

    service = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sign', () => {
    it("should return a signed token", () => {
      const token = service.sign(USER_ID);
      expect(jwt.sign).toHaveBeenCalledTimes(USER_ID);
      expect(jwt.sign).toHaveBeenCalledWith({ id: USER_ID }, TEST_KEY);
      expect(typeof token).toBe('string');
    })
  });

  describe('verify', () => {
    it("should return the decoded token", () => {
      const TOKEN = "TOKEN";
      const decodedToken = service.verify("TOKEN");
      expect(jwt.verify).toHaveBeenCalledTimes(1);
      expect(jwt.verify).toHaveBeenCalledWith(TOKEN, TEST_KEY);
      expect(decodedToken).toEqual({ id: USER_ID });
    })
  });
});
