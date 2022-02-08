import { Bson } from "../deps.ts";

export interface FavSchema {
  _id: Bson.ObjectId;
  favId: string;
  userId: Bson.ObjectId;
}
