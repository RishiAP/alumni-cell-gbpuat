import connect from "@/config/dbConfig";
import { NextResponse } from "next/server";

export async function GET(){
    try{

        const [data]=await connect().query('SELECT * FROM departments');
        return NextResponse.json(data, {status: 200});
    }
    catch(err){
        console.log(err);
        return NextResponse.json({message: "Something went wrong"}, {status: 500});
    }
}