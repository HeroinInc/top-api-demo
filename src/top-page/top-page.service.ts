import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { TopPageModel } from './top-page.model/top-page.model';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { FindTopPageDto } from './dto/find-top-page.dto';

@Injectable()
export class TopPageService {
  constructor(
    @InjectModel(TopPageModel) private readonly topPageModel: ModelType<TopPageModel>,
  ) {
  }

  async createPage(dto: CreateTopPageDto) {
    return this.topPageModel.create(dto);
  }

  async findById(id: string) {
    return this.topPageModel.findById(id).exec();
  }

  async deletePageById(id: string) {
    return this.topPageModel.findByIdAndDelete(id).exec();
  }

  async updatePageById(id: string, dto: CreateTopPageDto) {
    return this.topPageModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async findByCategory({ firstCategory }: FindTopPageDto) {
    return this.topPageModel.aggregate([
      {
        $match: { firstCategory },
      },
      {
        $group: {
          _id: { secondCategory: '$secondCategory' },
          pages: { $push: { alias: '$alias', title: '$title' } },
        },
      },
    ]).exec();
  }

  async findByAlias(alias: string) {
    return this.topPageModel.findOne({ alias }).exec();
  }

  async findPageByText(text: string) {
    return this.topPageModel.find({
      $text: {
        $search: text,
        $caseSensitive: false,
        $diacriticSensitive: false,
      },
    }).exec();
  }
}
