
"use client";

import Link from "next/link";
import { Button, Navbar, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";

export function AppBar() {
  const [loading,setLoading]=useState(false);
  const [activePath,setActivePath]=useState('');
  function handleClickLoader(e:any){
    if(e.target.tagName==="A" && window.location.pathname!==e.target.pathname || e.target.tagName==="BUTTON" && e.target.children[0].tagName==="A" && window.location.pathname!==e.target.children[0].pathname)
    setLoading(true);
  }
  useEffect(() => {
    setActivePath(window.location.pathname);
  },[]);

  return (
    <>
    <Navbar fluid rounded>
      <Navbar.Brand href="/">
        <img src="/favicon.ico" className="mr-3 h-6 sm:h-9" alt="Alumni Cell Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Alumni Cell</span>
      </Navbar.Brand>
      <div className="flex md:order-2">
        <Button onClick={handleClickLoader}> <Link href="/be-a-member">Be a member</Link> </Button>
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link as={Link} href="/" onClick={handleClickLoader} active={activePath=="/"}>
          Home
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
    {
      loading && <div className="absolute flex w-full h-full top-0 z-10 justify-center items-center" style={{background:"#cdcdcd59"}}><Spinner aria-label="Extra large spinner example" size="xl" color={"purple"} /></div>
    }
    </>
  );
}
