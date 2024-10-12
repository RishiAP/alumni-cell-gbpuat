import { initAdmin } from '@/config/firebase/firebaseAdmin';
import { NextRequest, NextResponse } from 'next/server';
import jwt from "jsonwebtoken";
import connect from '@/config/dbConfig';
import { serialize } from 'cookie';
import { getFileSizeFromBase64, getUserFromHeader } from '@/helpers/common_func';
import FormData from '@/types/formData';
import cloudinary from '@/config/cludinaryConfig';
connect();
export async function GET(req: NextRequest) {
    try{
        const user=await getUserFromHeader(req);
        if(user==null){
            return NextResponse.json({error:"Unauthorized"},{status:401});
        }
        const [currentUser]:any[]=await connect().query(`SELECT * FROM users WHERE email=?`,[user.email]);
        if(currentUser.length==0){
            return NextResponse.json({error:"User not found"},{status:404});
        }
        return NextResponse.json(currentUser[0], { status: 200 });
    }
    catch(error){
        console.log(error);
        return NextResponse.json({error},{status:500});
    }
}

export async function PUT(req:NextRequest){
    try{
        const user=await getUserFromHeader(req);
        if(user==null)
        return NextResponse.json({message:"Unauthorized"},{status:401});
        const {id,name,dept_id,batch,mobile,whatsapp,currentLocation,jobTitle,organization,instagram,linkedin,profile_pic}:FormData=await req.json();
        let uploadResponse=null;
        if(profile_pic.startsWith("data:image")){
            if(Math.ceil(getFileSizeFromBase64(profile_pic)/1024)>250){
                throw Error("Image size should be less than 250KB");
            }
            uploadResponse = await cloudinary.uploader.upload(profile_pic, {
                use_filename: true,
                unique_filename: false,
                folder:"alumni_profile_pics"
            });
        }
          try{
              await connect().query('UPDATE users SET `id`=?,`name`=?,`batch`=?,`dept_id`=?,`mobile_no`=?,`profile_pic`=?,`whatsapp_no`=?,`city_id`=?,`state_id`=?,`country_id`=?,`city_name`=?,`job_title`=?,`current_org`=?,`socials`=? WHERE `email`=?', [id,name,batch,dept_id,mobile,uploadResponse==null?user.profile_pic:uploadResponse.secure_url,whatsapp==""?null:whatsapp,typeof currentLocation.locality=="number"?currentLocation.locality:null,currentLocation.state_id,currentLocation.country_id,typeof currentLocation.locality=="string"?currentLocation.locality:null,jobTitle==""?null:jobTitle,organization==""?null:organization,JSON.stringify({instagram,linkedin}),user.email]);
          }
            catch(err){
                console.log(err);
                if(uploadResponse!=null)
                await cloudinary.uploader.destroy(uploadResponse.public_id);
                throw new Error("Something went wrong",{cause:err});
            }
            if(user.profile_pic!=null && profile_pic.startsWith("data:image") && user.profile_pic.startsWith("https://res.cloudinary.com")){
                const coludinaryUrlParts=user.profile_pic.split("/");
                await cloudinary.uploader.destroy(coludinaryUrlParts[7]+"/"+coludinaryUrlParts[8].split(".")[0]);
            }
            const token=jwt.sign({email:user.email,uid:user.uid,name,profile_pic:uploadResponse==null?profile_pic:uploadResponse.secure_url,profile:true},String(process.env.JWT_SECRET));
            const serialized=serialize("jwtAccessToken",token,{
                httpOnly:true,
                secure:process.env.NODE_ENV=="production",
                sameSite:"strict",
                maxAge:60*60*24*30,
                path:"/"
            })
        return NextResponse.json({name,email:user.email,profile_pic:uploadResponse==null?profile_pic:uploadResponse.secure_url,profile:true}, {status: 200,
            headers: {'Set-Cookie': serialized}
        });
    }
    catch(err){
        console.log(err);
        if(err instanceof Error){
            return NextResponse.json({error:err,cause:err.cause}, {status: 500});
        }
    }
}