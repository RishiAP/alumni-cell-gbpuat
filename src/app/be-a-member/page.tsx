"use client";
import { MemberForm } from "@/components/MemberForm";
import { AppBar } from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Id, toast } from "react-toastify";

export default function Home() {
  const currentUser=useSelector((state:any)=>state.currentUser.value);
  const router=useRouter();
  const [toastPresent,setToastPresent]=useState<Id>();
  useEffect(()=>{
    if(currentUser!==null && currentUser!="guest" && currentUser.profile){
      if(toastPresent==undefined)
        toast.dismiss();
      setToastPresent(toast.error("You have been already registered. Redirecting to profile page..",{theme:document.querySelector("html")?.classList.contains("dark")?"dark":"light"}));
      setTimeout(() => {
        router.push("/profile");
      }, 5000);
    }
  },[currentUser]);
  return (
    <>
    <AppBar />
    {
      currentUser!=null && (currentUser=="guest" || !currentUser.profile) && <MemberForm data={false} />
    }
    </>
  );
}
