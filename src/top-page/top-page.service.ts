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
    return this.topPageModel.find({ firstCategory }).exec();
  }

  async findByAlias(alias: string) {
    return this.topPageModel.findOne({ alias }).exec();
  }

  async findPageByText(word: string) {
    const regex = new RegExp(word);
    return this.topPageModel.find({
      $or: [
        { seoText: { $regex: regex } },
        { tags: { $in: [regex] } },
      ],
    }).exec();
  }
}
