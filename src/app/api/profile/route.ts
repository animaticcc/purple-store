import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/auth";
import { User } from "@/models/user";
import { UserInfo } from "@/models/user-info";
import { mongoConnect } from "@/lib/utils";

export async function PUT(req: any) {
  mongoConnect();
  const data = await req.json();
  const { name, image, ...otherUserInfo } = data;
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  await User.updateOne({email}, { name, image });
  await UserInfo.findOneAndUpdate({email}, otherUserInfo, {upsert: true});
  return Response.json(true);
}

export async function GET() {
  mongoConnect();
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  const userData = await User.findOne({email}).lean();
  const userInfoData = await UserInfo.findOne({email}).lean();
  return Response.json({...userData, ...userInfoData});
}