/**
 * Delete fav gif related to the user
 */

import { Bson, Collection } from "../deps.ts";
import { UserSchema } from "../schema/user.ts";
import { FavSchema } from "../schema/fav.ts";
import { findUserFavs } from "./findUserFavs.ts";

export async function deleteUserFav({
  userId,
  favId,
  collection,
  collectionFromDelete,
}: {
  userId: Bson.ObjectId;
  favId: string;
  collection: Collection<UserSchema>;
  collectionFromDelete: Collection<FavSchema>;
}) {
  const result = await findUserFavs({ userId, collection });

  const data = result.filter((fav: any) => fav.favId === favId);
  const favToDelete = data[0];

  if (!favToDelete) {
    return null;
  }

  return await collectionFromDelete.deleteOne(favToDelete);
}
