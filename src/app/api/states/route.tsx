import connect from "@/config/dbConfig";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest){
    try{
        const country_id=new URL(req.url).searchParams.get('country_id');
        if(country_id===null){
            return NextResponse.json({message: "Country ID is required"}, {status: 400});
        }
        const [data]=await connect().query('SELECT id,name FROM states WHERE country_id=?', [country_id]);
        return NextResponse.json(data, {status: 200});
    }
    catch(err){
        console.log(err);
        return NextResponse.json({message: "Something went wrong"}, {status: 500});
    }
}