
"use client";

import Link from "next/link";
import { Button, Navbar } from "flowbite-react";

export function AppBar() {
  return (
    <Navbar fluid rounded>
      <Navbar.Brand href="/">
        <img src="/favicon.ico" className="mr-3 h-6 sm:h-9" alt="Alumni Cell Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Alumni Cell</span>
      </Navbar.Brand>
      <div className="flex md:order-2">
        <Button> <Link href="/be-a-member">Be a member</Link> </Button>
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link href="#" active>
          Home
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
