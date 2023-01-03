import { CreateReviewDto } from '../src/review/dto/create-review.dto';
import { Types } from 'mongoose';
import { AuthDto } from '../src/auth/dto/auth.dto';

export const testReviewDto: CreateReviewDto = {
  name: 'test',
  title: 'title',
  description: 'description',
  rating: 5,
  productId: new Types.ObjectId().toHexString(),
};

export const testLoginDto: AuthDto = {
  login: 'artmeko@gmail.com',
  password: '12341234',
};