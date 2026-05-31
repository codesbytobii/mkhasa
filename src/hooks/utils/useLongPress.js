"use client";

import { useRef, useState } from "react";
import { handleHorizantalScroll } from "../../utils/horizontalScroll";

export default function useLongPress() {
  const [element, setElement] = useState();
  const timerRef = useRef();
  const isLongPress = useRef();
  const scrollRef = useRef();

  function startPressTimer(direction) {
    isLongPress.current = false;
    timerRef.current = setTimeout(() => {
      isLongPress.current = true;
      scrollRef.current = setInterval(() => {
        if (direction === "forward") {
          handleHorizantalScroll(element, 180); 
        } else {
          handleHorizantalScroll(element, -180);  
        }
      }, 5);
    }, 500);
  }

  function handleOnClick(direction) {
    if (isLongPress.current) {
      clearInterval(scrollRef.current);
      return;
    }
    // move element by 100px
    if (direction === "forward") {
      handleHorizantalScroll(element, 100);  // Increased increment
    } else {
      handleHorizantalScroll(element, -100);  // Increased increment
    }
  }

  function handleOnMouseDown(direction) {
    startPressTimer(direction);
  }

  function handleOnTouchStart(direction) {
    startPressTimer(direction);
  }

  function handleOnMouseUp() {
    if (isLongPress.current) {
      // terminate scroll
      clearInterval(scrollRef.current);
      return;
    }
    clearTimeout(timerRef.current);
  }

  function handleOnTouchEnd() {
    if (isLongPress.current) {
      // terminate scroll
      clearInterval(scrollRef.current);
      return;
    }
    clearTimeout(timerRef.current);
  }

  function handleOnTouchCancel() {
    if (isLongPress.current) {
      clearInterval(scrollRef.current);
      return;
    }
    clearTimeout(timerRef.current);
  }

  const getHandlers = (direction) => {
    return {
      onClick: () => handleOnClick(direction),
      onMouseDown: () => handleOnMouseDown(direction),
      onMouseUp: handleOnMouseUp,
      onTouchStart: () => handleOnTouchStart(direction),
      onTouchEnd: handleOnTouchEnd,
      onTouchCancel: handleOnTouchCancel,
    };
  };
function className(){
  return `${className}`
}
  return {
    getHandlers,
    setElement,
    className,
  };
}