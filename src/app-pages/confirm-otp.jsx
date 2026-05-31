"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import authkey from "../assets/images/lockkey.svg";
import { Button } from "../components/ui/Button";
import { Heading } from "../components/Heading";
import { Wrapper } from "../components/ui/Wrapper";
import { useSearchParams } from "next/navigation";
import { Icon } from "@iconify/react";
import axios from "../utils/axios";
export const Component = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = decodeURIComponent(searchParams.get("email"));
  const [verificationCode, setVerificationCode] = useState(["", "", "", ""]);

  const [canSubmit, setCanSubmit] = useState(() =>
    verificationCode.every((letter) => letter !== "")
  );
  const onSubmit = async (e) => {
    setIsSubmitting(true);
    try {
      e.preventDefault();
      const response = await axios.post(
        `user/verify`,
        {
          email,
          verificationCode: verificationCode.join(""),
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response?.status === 200) {
        setIsSubmitting(false);
        router.push(`/account-creation-success`);
      }
    } catch (error) {
      setIsSubmitting(false);
      // console.log(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    setCanSubmit(() => verificationCode.every((letter) => letter !== ""));
  }, [verificationCode]);

  return (
    <>
      
      <Wrapper>
        <div className="py-12 grid items-center md:grid-cols-[45%,55%]">
          <div>
            <div className="max-w-[420px] mx-auto mb-5 md:mb-0">
              <img src={authkey} className="w-full" alt="Alt key icon image"/>
            </div>
          </div>

          <form onSubmit={onSubmit} className="flex flex-col items-center">
            <div className="text-center">
              <Heading className="text-[24px] sm:text-[30px] md:text-[36px] lg:text-[42px]">
                AUTHENTICATION
              </Heading>
              <p className="text-lg text-app-black sm:text-[18px] md:text-[20px] lg:text-[24px]">
                Enter the verification Code sent to
              </p>
              <span className="text-lg text-[#a40001] mt-2 font-medium">
                {email}
              </span>
            </div>

            <OTPInput verificationCode={verificationCode} setVerificationCode={setVerificationCode} canSubmit={canSubmit} />
            <Button
              className="w-36 md:w-48 md:py-3 flex justify-center rounded-none bg-app-red hover:bg-red-500 text-sm  text-white font-bold mt-4 sm:hover:bg-black disabled:bg-[#999999] hover:disabled:bg-[#999999] sm:bg-app-black"
              type="submit"
              disabled={!canSubmit}
            >
              {isSubmitting ? (
                <Icon
                  icon="svg-spinners:6-dots-rotate"
                  style={{ fontSize: 20 }}
                />
              ) : (
                "Verify Now"
              )}
            </Button>
          </form>
        </div>
      </Wrapper>
    </>
  );
};

const OTPInput = ({ verificationCode, setVerificationCode }) => {
  const boxes = [0, 1, 2, 3];
  const refs = [useRef(), useRef(), useRef(), useRef()];

  const onKeyUp = (index, refs) => {
    const keys = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    return (e) => {
      setVerificationCode((prev) => {
        const newArr = prev;
        if (keys.includes(e.key)) {
          newArr[index] = e.key;
          refs[index + 1]?.current.focus();
        }
        if (e.key === "Backspace") {
          if (newArr[index] === "") {
            refs[index - 1]?.current.focus();
          }
          newArr[index] = "";
        }
        return [...newArr];
      });
    };
  };

  const onPaste = (event) => {
    event.preventDefault();
    const keys = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    let paste = (event.clipboardData || window.clipboardData)
      .getData("text")
      .split("");
    if (paste.every((num) => keys.includes(num))) {
      setVerificationCode(paste.slice(0, 4));
      refs[refs.length - 1]?.current.focus();
    }
  };

  return (
    <>
      <div className="flex gap-1 py-4 sm:gap-2 md:gap-3 lg:gap-4 ">
        {boxes.map((box) => (
          <Box
            refs={refs}
            index={box}
            key={box}
            verificationCode={verificationCode}
            onKeyUp={onKeyUp}
            onPaste={onPaste}
          />
        ))}
      </div>
    </>
  );
};

const Box = ({ index, refs, onKeyUp, verificationCode, ...rest }) => {
  return (
    <input
      ref={refs[index]}
      type="number"
      value={verificationCode[index]}
      onChange={() => { }}
      onKeyUp={onKeyUp(index, refs)}
      className="w-10 aspect-square outline-none text-center overflow-hidden font-bold rounded-xl border-4 bg-transparent border-app-red sm:w-12 sm:text-lg md:text-2xl md:w-14 lg:text-4xl lg:w-16"
      {...rest}
    />
  );
};
