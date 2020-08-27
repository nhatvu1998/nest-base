import {
  CreateDateColumn,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { Field, InterfaceType } from '@nestjs/graphql';

@InterfaceType()
export abstract class DefaultEntity {
  @Field()
  @Expose()
  @ObjectIdColumn()
  _id: number;

  @Field()
  @Exclude()
  @CreateDateColumn({ select: false, name: 'created_at' })
  createdAt: Date;

  @Field()
  @Exclude()
  @UpdateDateColumn({ select: false, name: 'updated_at' })
  updatedAt: Date;
}
