import React, { useEffect, useRef } from "react";
import { findDOMNode } from "react-dom";
import styles from "./index.module.scss";
import { cn } from "@nextui-org/react";

const speedDeg = 0.01;
const r = 0.5;

const RotateBgButton = ({
  text,
  href,
  isExternal,
  className,
}: {
  text: string;
  href: string;
  isExternal: boolean;
  className?: string;
}) => {
  const buttonRef = useRef(null);
  const frameId = useRef(0);

  const rotateBg = () => {
    if (buttonRef.current) {
      // eslint-disable-next-line react/no-find-dom-node
      const nativeNode = findDOMNode(buttonRef.current) as HTMLButtonElement;
      if (nativeNode) {
        const bgPos = nativeNode.style.backgroundPosition;
        if (!bgPos) {
          nativeNode.style.backgroundPosition = "0% 50%";
        } else {
          const arr = bgPos.split(" ");
          let x = Number(arr[0].substring(0, arr[0].length - 1)) / 100 - r;
          let y = Number(arr[1].substring(0, arr[1].length - 1)) / 100 - r;

          x = x * Math.cos(speedDeg) - y * Math.sin(speedDeg);
          y = y * Math.cos(speedDeg) + x * Math.sin(speedDeg);

          nativeNode.style.backgroundPosition = `${(x + r) * 100}% ${(y + r) * 100}%`;
        }

        frameId.current = requestAnimationFrame(rotateBg);
      }
    }
  };

  useEffect(() => {
    if (buttonRef.current) {
      frameId.current = requestAnimationFrame(rotateBg);
    }
    return () => {
      if (frameId.current) {
        cancelAnimationFrame(frameId.current);
      }
    };
  }, []);

  return (
    <a href={href} target={isExternal ? "_blank" : "_self"}>
      <div className={cn(styles.container, className)} ref={buttonRef}>
        {text}
      </div>
    </a>
  );
};

export default RotateBgButton;
