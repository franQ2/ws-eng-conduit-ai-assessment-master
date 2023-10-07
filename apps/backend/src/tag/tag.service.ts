import { Injectable } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Tag } from './tag.entity';
import { ITagsRO } from './tag.interface';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: EntityRepository<Tag>,
  ) {}

  async findAll(): Promise<ITagsRO> {
    const tags = await this.tagRepository.findAll();
    return { tags: tags.map((tag) => tag.tag) };
  }

  async updateTags(articleTags: string[]) {
    for (const tagText of articleTags) {
      // Check if the tag already exists
      let tag = await this.tagRepository.findOne({ tag: tagText });

      if (!tag) {
        // If the tag doesn't exist, create a new Tag instance
        tag = new Tag();
        tag.tag = tagText;
        await this.tagRepository.persistAndFlush(tag);
      }
    }
  }
}
