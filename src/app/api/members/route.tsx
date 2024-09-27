import cloudinary from "@/config/cludinaryConfig";
import connect from "@/config/dbConfig";
import { getFileSizeFromBase64 } from "@/helpers/common_func";
import FormData from "@/types/formData";
import { NextRequest, NextResponse } from "next/server";

export async function GET(){
    try{
        const [data]=await connect().query('SELECT users.id,users.name,users.batch,users.mobile_no,users.whatsapp_no,users.email,users.job_title,users.current_org,users.socials,departments.dept_name,users.city_name,users.profile_pic,cities.name as city,states.name as state,countries.name as country,countries.emoji FROM users INNER JOIN departments ON users.dept_id=departments.dept_id INNER JOIN cities ON users.city_id=cities.id INNER JOIN states ON users.state_id=states.id INNER JOIN countries ON users.country_id=countries.id ORDER BY users.created_at DESC LIMIT 10');
        return NextResponse.json(data, {status: 200});
    }
    catch(err){
        console.log(err);
        return NextResponse.json({error:"Something went wrong"}, {status: 500});
    }
}

export async function POST(req:NextRequest){
    try{
        const {id,name,dept_id,batch,email,mobile,whatsapp,currentLocation,jobTitle,organization,instagram,linkedin,profilePic}:FormData=await req.json();
        if(Math.ceil(getFileSizeFromBase64(profilePic)/1024)>250){
            throw Error("Image size should be less than 250KB");
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePic, {
            use_filename: true,
            unique_filename: false,
          });
          try{
              await connect().query('INSERT INTO users (`id`,`name`,`batch`,`dept_id`,`email`,`mobile_no`,`profile_pic`,`whatsapp_no`,`city_id`,`state_id`,`country_id`,`city_name`,`job_title`,`current_org`,`socials`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [id,name,batch,dept_id,email,mobile,uploadResponse.secure_url,whatsapp==""?null:whatsapp,typeof currentLocation.locality=="number"?currentLocation.locality:null,currentLocation.state_id,currentLocation.country_id,typeof currentLocation.locality=="string"?currentLocation.locality:null,jobTitle==""?null:jobTitle,organization==""?null:organization,JSON.stringify({instagram,linkedin})]);
          }
            catch(err){
                console.log(err);
                await cloudinary.uploader.destroy(uploadResponse.public_id);
                throw new Error("Something went wrong",{cause:err});
            }
        return NextResponse.json({message:"Success"}, {status: 200});
    }
    catch(err){
        console.log(err);
        if(err instanceof Error){
            return NextResponse.json({error:err,cause:err.cause}, {status: 500});
        }
    }
}