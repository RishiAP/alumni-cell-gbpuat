"use client";
import { MemberForm } from '@/components/MemberForm';
import { AppBar } from '@/components/Navbar';
import { CurrentUser } from '@/types/CurrentUser';
import FormData from '@/types/formData';
import axios from 'axios'
import React, { useEffect, useState } from 'react'

export default function ProfilePage(){
    const [currentUser,setCurrentUser]=useState<FormData|null>(null);
    function convertToFormData(user:CurrentUser):FormData{
        const socials:{instagram:string,linkedin:string}=JSON.parse(user.socials);
        return {
            name:user.name,
            email:user.email,
            mobile:user.mobile_no,
            dept_id:user.dept_id,
            batch:user.batch,
            linkedin:socials.linkedin||"",
            instagram:socials.instagram||"",
            profile_pic:user.profile_pic||"",
            id:user.id,
            jobTitle:user.job_title||"",
            organization:user.current_org||"",
            whatsapp:user.whatsapp_no||"",
            currentLocation:{locality:user.city_id || user.city_name || "",state_id:user.state_id,country_id:user.country_id}
        }
    }
    useEffect(() => {
        axios.get("/api/user").then((res) => {
            setCurrentUser(convertToFormData(res.data));
        }).catch((err) => {
            console.log(err);
        });
    },[]);
  return (
    <>
    <AppBar />
    <MemberForm data={true} />
    </>
  )
}