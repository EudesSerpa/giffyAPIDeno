/**
 * Get fav gifs related to the user
 */

import { Bson, Collection } from "../deps.ts";
import { UserSchema } from "../schema/user.ts";

export async function findUserFavs({
  userId,
  collection,
}: {
  userId: Bson.ObjectId;
  collection: Collection<UserSchema>;
}) {
  const result: any = await collection
    .aggregate([
      { $match: { _id: userId } },
      {
        $lookup: {
          from: "favs",
          localField: "_id",
          foreignField: "userId",
          as: "favs",
        },
      },
      {
        $project: {
          _id: false,
          favs: "$favs",
        },
      },
    ])
    .toArray();

  const userFavs = await result[0]["favs"];

  return userFavs;
}
