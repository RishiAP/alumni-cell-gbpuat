import { NextRequest, NextResponse } from 'next/server';
import { getUserFromHeader } from '@/helpers/common_func';
export async function GET(req: NextRequest) {
    try {
        const user=await getUserFromHeader(req);
        if(user==null){
            return NextResponse.json({message:"Unauthorized"},{status:401});
        }
        const {email,name,profile_pic,profile}=user;
        return NextResponse.json({name,email,profile_pic,profile},{status:200});
    } catch (error) {
        console.log(error);
        return NextResponse.json({error}, { status: 500 });
    }
}