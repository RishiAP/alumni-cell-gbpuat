import { initAdmin } from '@/config/firebase/firebaseAdmin';
import { NextRequest, NextResponse } from 'next/server';
import jwt from "jsonwebtoken";
import connect from '@/config/dbConfig';
import { serialize } from 'cookie';
connect();
export async function POST(req: NextRequest) {
  const { idToken } = await req.json();

  if (!idToken) {
    return NextResponse.json({ error: 'No token provided' }, { status: 400 });
  }

  try {
    const decodedToken = await (await initAdmin()).auth().verifyIdToken(idToken);
    if(decodedToken.email_verified==false){
        return NextResponse.json({error:"Email not verified"},{status:400});
    }
    const { email, name, picture, uid } = decodedToken;
    const [user]:any[]=await connect().query(`SELECT name,email,profile_pic FROM users WHERE email=?`,[email]);
    const token=jwt.sign({email,uid,name,profile_pic:user.length>0?user[0].profile_pic:picture,profile:user.length>0},String(process.env.JWT_SECRET));
    const serialized=serialize("jwtAccessToken",token,{
      httpOnly:true,
      secure:process.env.NODE_ENV=="production",
      sameSite:"strict",
      maxAge:60*60*24*30,
      path:"/"
  })
    return NextResponse.json(user.length>0?{...user[0],profile:true}:{email,name,profile_pic:picture,profile:false}, { status: 200,
      headers: {'Set-Cookie': serialized}
  });
  } catch (error:any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}