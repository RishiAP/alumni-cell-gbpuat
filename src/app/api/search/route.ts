import connect from "@/config/dbConfig";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest){
    try{
        const params=new URL(req.url).searchParams;
        const country=parseInt(params.get("country")||"0");
        const state=parseInt(params.get("state")||"0");
        const offset=parseInt(params.get("offset")||"0");
        let city:string|number=params.get("city") || "0";
        const city_name:string=params.get("city_name") || "";
        try{
            city=parseInt(city);
        }
        catch(error){
            console.log(error);
        }
        const batch=parseInt(params.get("batch")||"0");
        const branch=parseInt(params.get("branch")||"0");
        let query=`SELECT users.id,users.name,users.batch,users.mobile_no,users.whatsapp_no,users.email,users.job_title,users.current_org,users.socials,departments.dept_name,COALESCE(cities.name,users.city_name) AS city,states.name AS state,countries.name AS country,countries.emoji,users.profile_pic FROM users INNER JOIN departments ON users.dept_id=departments.dept_id LEFT JOIN cities ON users.city_id=cities.id LEFT JOIN states ON users.state_id=states.id LEFT JOIN countries ON users.country_id=countries.id WHERE 1=1`;
        const queryParam:(number|string)[]=[];
        if(city!=0){
            if(typeof city==="number"){
                query+=" AND (users.city_id=? OR LOWER(users.city_name) = LOWER(?))";
                queryParam.push(city);
                queryParam.push(city_name);
            }
            else{
                query+=" AND users.city_name=? AND users.state_id=?";
                queryParam.push(city,state);
            }
        }
        else if(state!=0){
            query+=" AND users.state_id=?";
            queryParam.push(state);
        }
        else if(country!=0){
            query+=" AND users.country_id=?";
            queryParam.push(country);
        }
        if(batch!=0){
            query+=" AND users.batch=?";
            queryParam.push(batch);
        }
        if(branch!=0){
            query+=" AND users.dept_id=?";
            queryParam.push(branch);
        }
        query+=` ORDER BY users.created_at DESC LIMIT 10 OFFSET ${offset}`;
        const [data]=await connect().execute(query,queryParam);
        return NextResponse.json(data,{status:200});
    }
    catch(err){
        console.log(err);
        return NextResponse.json({error:err},{status:500});
    }
}