import { Heading } from "@chakra-ui/react";
import useSearchStore from "global-store/useSearchStore";
import React, { Fragment } from "react";
import HeadingWithCustomFont from "./headingWithCustomFont";

type Props = {
  username: string;
};

const WelcomeSection = (props: Props) => {
  return (
    <Fragment>
      <HeadingWithCustomFont fontSize={"4xl"}>
        Welcome, {props.username}{" "}
      </HeadingWithCustomFont>
      <HeadingWithCustomFont fontSize={"xl"}>
        Today is{" "}
        {new Date().toLocaleDateString("en-US", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })}{" "}
        {"\n"}
        {new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "numeric",
          hour12: false,
        })}
      </HeadingWithCustomFont>
    </Fragment>
  );
};

export default React.memo(WelcomeSection);
