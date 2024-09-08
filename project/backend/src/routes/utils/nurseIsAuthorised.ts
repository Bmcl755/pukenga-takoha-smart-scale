import { Context } from "../../context";

export default async function nurseIsAuthorised(
  ctx: Context,
  nurse_id: string,
  child_id: string
) {
  const child = await ctx.mongo.Children.findOne({
    _id: child_id,
  });

  if (child === null) {
    return false;
  }

  const nurse = await ctx.mongo.Nurse.findOne({ _id: nurse_id });

  if (nurse === null) {
    return false;
  }

  return child.assigned_nurses.includes(nurse_id);
}
