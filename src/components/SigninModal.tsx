
"use client";

import { signInWithGoogle } from "@/helpers/signin";
import { setUser } from "@/store/currentUserSlice";
import { setSignInModal } from "@/store/signinModalSlice";
import { Button, Checkbox, Label, Modal, Spinner, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

export function SigninModal() {
  const [googleSignInLoader,setGoogleSignInLoader]=useState(false);
  const signInModal=useSelector((state:any)=>state.signInModal.value);
  const dispatch=useDispatch();
  useEffect(()=>{
    setSignInModal(false);
  },[]);
  async function handleGoogleSignIn(){
    setGoogleSignInLoader(true);
    dispatch(setUser(await signInWithGoogle()));
    dispatch(setSignInModal(false));
    toast.dismiss();
    toast.success("Signed in successfully",{theme:document.querySelector("html")?.classList.contains("dark")?"dark":"light"});
    setGoogleSignInLoader(false);
  }
  return (
    <>
      <Button onClick={()=>dispatch(setSignInModal(true))} outline gradientDuoTone={"purpleToPink"} className="md:me-0 me-2" >SignIn</Button>
      <Modal dismissible show={signInModal} size="md" onClose={()=>dispatch(setSignInModal(false))}>
        <Modal.Header>Sign In</Modal.Header>
        <Modal.Body>
          <div className="space-y-2">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email" value="Your email" />
              </div>
              <TextInput id="email" placeholder="name@company.com" required />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password" value="Your password" />
              </div>
              <TextInput id="password" type="password" required />
            </div>
            <div className="flex justify-between" style={{margin:"12px 0px"}}>
              <div className="flex items-center gap-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember">Remember me</Label>
              </div>
              <a href="#" className="text-sm text-cyan-700 hover:underline dark:text-cyan-500">
                Lost Password?
              </a>
            </div>
            <div className="w-full">
              <Button>Log in to your account</Button>
            </div>
            <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-300" style={{marginTop:"12px"}}>
              Not registered?&nbsp;
              <a href="#" className="text-cyan-700 hover:underline dark:text-cyan-500">
                Create account
              </a>
            </div>
          </div>
          <hr className="mt-2" />
          <div className="signInProviders mt-4 flex justify-center gap-2">
            <Button outline color={"light"} size={"sm"} onClick={handleGoogleSignIn} disabled={googleSignInLoader}> {googleSignInLoader?<Spinner color="purple" size={"lg"} aria-label="Purple spinner example" />:<FcGoogle size={32}/>} </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
