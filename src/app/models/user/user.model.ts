import { uniqueStringGenerator } from '@src/common/utils/slugify';
import bcrypt from 'bcryptjs';
import mongoose, { Document } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { toJSON } from '../plugins';

export interface UserDocument extends Document {
  id: number;
  bossAppearsAt: Date;
  score: number;
  userName: string;
  password: string;
}

const UserSchema = new mongoose.Schema<UserDocument>(
  {
    id: { type: Number },
    userName: {
      type: String,
      required: true,
      unique: true,
      min: 10,
      max: 20,
    },
    password: {
      type: String,
      trim: true,
      private: true,
      min: 6,
      max: 20,
      select: false,
      required: true,
    },
    bossAppearsAt: {
      type: Date,
      default: null,
    },
    score: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

UserSchema.plugin(toJSON);
UserSchema.plugin(paginate);

UserSchema.pre('save', async function (next) {
  const doc = this;
  if (!doc.id) doc.id = await uniqueStringGenerator('iId', 'UserModel');
  if (doc.isModified('password'))
    doc.password = bcrypt.hashSync(doc.password, 8);
  next();
});

export const UserModel = mongoose.model<
  UserDocument,
  mongoose.PaginateModel<UserDocument>
>('users', UserSchema, 'users');
