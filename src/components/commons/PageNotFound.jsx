import React from "react";
import { Wrapper } from "../ui/Wrapper";
import Link from "next/link";

const PageNotFound = () => {
  return (
    <div>
      <Wrapper>
        <h2>This page does not exist</h2>
        <Link href="/">Go to Homepage</Link>
      </Wrapper>
    </div>
  );
};

export default PageNotFound;
