import { Bson } from "../deps.ts";

export interface UserSchema {
  _id: Bson.ObjectId;
  username: string;
  password: string;
}
