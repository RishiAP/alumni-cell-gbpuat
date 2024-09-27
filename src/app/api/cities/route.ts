import connect from "@/config/dbConfig";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest){
    try{
        const state_id=new URL(req.url).searchParams.get('state_id');
        if(state_id===null){
            return NextResponse.json({message: "State ID is required"}, {status: 400});
        }
        const [data]=await connect().query('SELECT id,name FROM cities WHERE state_id=?', [state_id]);
        return NextResponse.json(data, {status: 200});
    }
    catch(err){
        console.log(err);
        return NextResponse.json({message: "Something went wrong"}, {status: 500});
    }
}