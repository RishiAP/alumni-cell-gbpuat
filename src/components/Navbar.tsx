
"use client";
import { Avatar, Button, Dropdown, Navbar, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SigninModal } from "./SigninModal";
import Image from "next/image";
import { CurrentUser } from "@/types/CurrentUser";
import axios from "axios";
import { setUser } from "@/store/currentUserSlice";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/ReactToastify.min.css';
import Link from "next/link";

export function AppBar() {
  const [loading,setLoading]=useState(false);
  const dispatch=useDispatch();
  const currentUser:null|"guest"|CurrentUser=useSelector((state:any)=>state.currentUser.value);
  const [activePath,setActivePath]=useState('');
  function handleClickLoader(e: React.MouseEvent<HTMLElement>) {
    const target = e.target as HTMLElement; // Cast to HTMLElement to access tagName
    if (
      (window.location.pathname !== (target as HTMLAnchorElement).pathname)
    ) {
      setLoading(true);
    }
  }
  
  useEffect(() => {
    setActivePath(window.location.pathname);
    axios.get("/api/currentUser").then((res)=>{
      dispatch(setUser(res.data));
    }).catch((err)=>{
      dispatch(setUser("guest"));
      console.log(err);
    });
  },[]);

  function signOut(){
    const toastId=toast.loading("Signing out...",{theme:document.querySelector("html")?.classList.contains("dark")?"dark":"light"});
    axios.get("/api/logout").then(()=>{
      dispatch(setUser("guest"));
      toast.update(toastId,{render:"Signed out successfully",type:"success",theme:document.querySelector("html")?.classList.contains("dark")?"dark":"light",isLoading:false,autoClose:3000});
    }).catch((err)=>{
      console.log(err);
      toast.update(toastId,{render:"Failed to sign out",type:"error",theme:document.querySelector("html")?.classList.contains("dark")?"dark":"light",isLoading:false,autoClose:3000});
    });
  }

  return (
    <>
    <Navbar fluid rounded>
      <Navbar.Brand href="/">
        <img src="/favicon.ico" className="mr-3 h-6 sm:h-9" alt="Alumni Cell Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Alumni Cell</span>
      </Navbar.Brand>
      <div className="flex md:order-2">
        {
          currentUser!=null && (currentUser=="guest" || !currentUser.profile) && activePath!="/be-a-member" && <Link href="/be-a-member" onClick={handleClickLoader}><Button outline gradientDuoTone={"greenToBlue"} className="me-2" >Be a member</Button></Link>
        }
        {
          currentUser==null? 
          <div className="animate-pulse">
       <svg className="w-9 h-9 text-gray-200 dark:text-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
        </svg>
        </div>
          :currentUser=="guest"?<SigninModal/>:
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <Image src={currentUser.profile_pic} alt="User image" width={36} height={36} className="rounded-full" />
          }
        >
          <Dropdown.Header>
            <span className="block text-sm">{currentUser.name}</span>
            <span className="block truncate text-sm font-medium">{currentUser.email}</span>
          </Dropdown.Header>
          {
            currentUser.profile &&
            <> <Link href="/profile"><Dropdown.Item>Profile</Dropdown.Item></Link> 
          <Dropdown.Divider /></>
          }
          <Dropdown.Item onClick={signOut} className="text-red-600">Sign out</Dropdown.Item>
        </Dropdown>
        }
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link as={Link} href="/" active={activePath=="/"} onClick={handleClickLoader}>
          Home
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
    {
      loading && <div className="absolute flex w-full h-full top-0 z-10 justify-center items-center" style={{background:"#cdcdcd59"}}><Spinner aria-label="Extra large spinner example" size="xl" color={"purple"} /></div>
    }
    <ToastContainer draggablePercent={60} position="top-center" draggable />
    </>
  );
}
