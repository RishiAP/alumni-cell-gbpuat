import cloudinary from "@/config/cludinaryConfig";
import connect from "@/config/dbConfig";
import { getFileSizeFromBase64, getUserFromHeader } from "@/helpers/common_func";
import FormData from "@/types/formData";
import { serialize } from "cookie";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(){
    try{
        const [data]=await connect().query('SELECT users.id,users.name,users.batch,users.mobile_no,users.whatsapp_no,users.email,users.job_title,users.current_org,users.socials,departments.dept_name,COALESCE(cities.name,users.city_name) AS city,states.name AS state,countries.name AS country,countries.emoji,users.profile_pic FROM users INNER JOIN departments ON users.dept_id=departments.dept_id LEFT JOIN cities ON users.city_id=cities.id LEFT JOIN states ON users.state_id=states.id LEFT JOIN countries ON users.country_id=countries.id ORDER BY users.created_at DESC LIMIT 10');
        return NextResponse.json(data, {status: 200});
    }
    catch(err){
        console.log(err);
        return NextResponse.json({error:"Something went wrong"}, {status: 500});
    }
}

export async function POST(req:NextRequest){
    try{
        const user=await getUserFromHeader(req);
        if(user==null)
        return NextResponse.json({message:"Unauthorized"},{status:401});
        const {id,name,dept_id,batch,mobile,whatsapp,currentLocation,jobTitle,organization,instagram,linkedin,profile_pic}:FormData=await req.json();
        let uploadResponse=null;
        if(profile_pic.includes("data:image")){
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
              await connect().query('INSERT INTO users (`id`,`name`,`batch`,`dept_id`,`email`,`mobile_no`,`profile_pic`,`whatsapp_no`,`city_id`,`state_id`,`country_id`,`city_name`,`job_title`,`current_org`,`socials`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [id,name,batch,dept_id,user.email,mobile,uploadResponse==null?user.profile_pic:uploadResponse.secure_url,whatsapp==""?null:whatsapp,typeof currentLocation.locality=="number"?currentLocation.locality:null,currentLocation.state_id,currentLocation.country_id,typeof currentLocation.locality=="string"?currentLocation.locality:null,jobTitle==""?null:jobTitle,organization==""?null:organization,JSON.stringify({instagram,linkedin})]);
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