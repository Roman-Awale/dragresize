import React, { useEffect, useRef, useState } from "react";
import anime from "animejs";
import Draggable from "react-draggable";

import tabler_bulb from "./tabler_bulb.svg";
import { FiX } from "vyaguta-icons/fi";

interface MyComponentProps {
  wrapperStyles?: React.CSSProperties;
  triggerStyles?: React.CSSProperties;
  openText?: string;
  handleStyles?: React.CSSProperties;
  contentWrapperStyles?: React.CSSProperties;
}

const MyComponent: React.FC<MyComponentProps> = ({
  wrapperStyles,
  triggerStyles,
  handleStyles,
  contentWrapperStyles,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [size, setSize] = useState<{ width: number; height: number }>({
    width: 200,
    height: 200,
  });
  const [triggerBtnHeight, setTriggerBtnHeight] = useState<number>(0);

  const initialSize = useRef({ width: 200, height: 200 });

  // this is to trigger the open button

  const handleOpen = () => {
    setIsOpen(true);
  };

  // this is to trigger close button

  const handleClose = () => {
    const transformValue = containerRef.current?.style.transform || "";

    const [translateX, translateY] = transformValue
      .match(/translate\(([^,]+),([^)]+)\)/)
      ?.slice(1)
      .map(parseFloat) || [0, 0];

    let newTranslateX = translateX;
    let newTranslateY = translateY;

    const buttonWidth = triggerRef?.current?.clientWidth || 0;
    const buttonHeight = triggerRef?.current?.clientHeight || 0;
    const buttonOffsetLeft = triggerRef?.current?.offsetLeft || 0;
    const buttonRect = triggerRef.current?.getBoundingClientRect();

    const buttonOffsetHeight = buttonRect
      ? window.innerHeight - buttonRect.bottom
      : 0;

    const draggableContainerWidth = initialSize.current.width;
    const draggableContainerHeight = initialSize.current.height;

    // this are the condition to return the initial position of component onclicking close button which is placed on different places in viewport.

    if (
      buttonOffsetLeft < draggableContainerWidth &&
      buttonOffsetHeight < draggableContainerHeight
    ) {
      newTranslateX = translateX + draggableContainerWidth + buttonWidth;
      newTranslateY =
        translateY - draggableContainerHeight + buttonHeight / 2 + buttonHeight;
    } else if (buttonOffsetLeft < draggableContainerWidth) {
      newTranslateX = translateX + buttonWidth / 2 + draggableContainerWidth;
      newTranslateY = translateY + buttonHeight / 2;
    } else if (buttonOffsetHeight < draggableContainerHeight) {
      newTranslateX = translateX;
      newTranslateY =
        translateY - draggableContainerHeight + buttonHeight + buttonHeight / 2;
    } else {
      newTranslateX = translateX;
      newTranslateY = translateY + buttonHeight / 2;
    }

    // component closing animation on click close button

    anime({
      targets: ".my-component .el",
      translateX: -newTranslateX,
      translateY: -newTranslateY,
      overflow: "hidden",
      minWidth: 0,
      minHeight: 0,
      height: 34,
      width: 34,
      borderRadius: "50%",
      duration: 300,
      easing: "easeOutQuad",
      opacity: "0.1",

      complete: () => {
        setIsOpen(false);
      },
    });
  };

  useEffect(() => {
    const buttonRect = triggerRef.current?.getBoundingClientRect();
    if (buttonRect) setTriggerBtnHeight(buttonRect.height);
  }, []);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      const buttonWidth = triggerRef?.current?.clientWidth || 0;
      const buttonHeight = triggerRef?.current?.clientHeight || 0;
      const buttonOffsetLeft = triggerRef?.current?.offsetLeft || 0;
      const buttonRect = triggerRef.current?.getBoundingClientRect();
      const rect = triggerRef?.current?.getBoundingClientRect();
      const buttonOffsetHeight = buttonRect
        ? window.innerHeight - buttonRect.bottom
        : 0;

      const draggableContainerWidth = initialSize.current.width;
      const draggableContainerHeight = initialSize.current.height;

      // this are the condition to setting initial position of component while placing open button through different places.

      if (
        buttonOffsetLeft < draggableContainerWidth &&
        buttonOffsetHeight < draggableContainerHeight
      ) {
        setPosition({
          x: buttonOffsetLeft + draggableContainerWidth + buttonWidth,
          y:
            window.innerHeight -
            buttonOffsetHeight -
            draggableContainerHeight +
            buttonHeight,
        });
      } else if (buttonOffsetLeft < draggableContainerWidth) {
        setPosition({
          x: buttonOffsetLeft + draggableContainerWidth + buttonWidth,
          y: rect?.bottom || 0,
        });
      } else if (buttonOffsetHeight < draggableContainerHeight) {
        setPosition((prevPosition) => ({
          ...prevPosition,
          y:
            window.innerHeight -
            buttonOffsetHeight -
            draggableContainerHeight +
            buttonHeight,
        }));
      }

      anime({
        targets: ".el",
        scale: [{ value: 1, easing: "easeOutQuad", duration: 200 }],
      });
    } else if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const borderOffset = 5;
      setPosition({ x: rect.left - borderOffset, y: rect.bottom });

      anime({
        targets: ".el",
        scale: 0,
        duration: 0,
      });
    }
  }, [isOpen]);

  // styling of component container goes here...

  const containerStyles: React.CSSProperties = {
    border: "2px solid #102b7b",
    background: "#f4f7f9",
    borderRadius: "8px",
    resize: "both",
    overflow: "auto",
    transitionTimingFunction: "ease-out",
    left: position.x,
    width: size.width,
    height: size.height,
    top: position.y,
  };

  return (
    <div className="my-component" style={wrapperStyles}>
      <button
        onClick={handleOpen}
        ref={triggerRef}
        style={triggerStyles}
        className="open-btn"
      >
        <div className="inner-ellipse">
          <img src={tabler_bulb} alt="tabler bulb" />
        </div>
      </button>

      {isOpen && (
        <Draggable
          axis="both"
          handle=".handle"
          bounds="body"
          defaultPosition={{ x: -size.width, y: -triggerBtnHeight }}
        >
          <div
            className="component-container el"
            id="myDiv"
            ref={containerRef}
            style={containerStyles}
          >
            <div className="handle" style={handleStyles}>
              Feedback Guidelines
              <button onClick={handleClose}>
                <FiX />
              </button>
            </div>
            <div
              style={{
                ...contentWrapperStyles,
                padding: "12px",
                overflowWrap: "break-word",
              }}
            >
              {"content"}
            </div>
          </div>
        </Draggable>
      )}
    </div>
  );
};

export default MyComponent;
