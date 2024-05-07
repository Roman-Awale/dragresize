import React, { useEffect, useRef, useState } from "react";
import anime from "animejs";
import Draggable from "react-draggable";
import { Resizable } from "react-resizable";

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
  openText = "open",
  handleStyles,
  contentWrapperStyles,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [minWidth, setMinWidth] = useState<number>(200);
  const [minHeight, setMinHeight] = useState<number>(200);
  const [triggerBtnHeight, setTriggerBtnHeight] = useState<number>(0);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    const transformValue = containerRef.current?.style.transform || "";
    const [translateX, translateY] = transformValue
      .match(/translate\(([^,]+),([^)]+)\)/)
      ?.slice(1)
      .map(parseFloat) || [0, 0];

    anime({
      targets: ".my-component .el",
      translateX: -translateX,
      translateY: -translateY,

      overflow: "hidden",
      minWidth: 0,
      minHeight: 0,
      height: 20,
      width: 45,
      duration: 300,
      easing: "easeOutQuad",
      complete: () => {
        setIsOpen(false);
        const rect = triggerRef.current?.getBoundingClientRect();
        if (rect) setPosition({ x: rect.left, y: rect.top });
      },
    });
  };

  useEffect(() => {
    const buttonRect = triggerRef.current?.getBoundingClientRect();
    if (buttonRect) setTriggerBtnHeight(buttonRect.height);
  }, []);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const offsetLeft = 3;

  useEffect(() => {
    if (isOpen) {
      anime({
        targets: ".el",
        scale: [{ value: 1, easing: "easeOutQuad", duration: 200 }],
      });
    } else if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({ x: rect.left - offsetLeft, y: rect.bottom });

      anime({
        targets: ".el",
        scale: 0,
        duration: 0,
      });
    }
  }, [isOpen]);

  const containerStyles: React.CSSProperties = {
    border: "1px solid #ddd",
    resize: "both",
    overflow: "auto",
    transitionTimingFunction: "ease-out",
    left: position.x,
    minWidth: minWidth,
    minHeight: minHeight,
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
        {openText}
      </button>

      {isOpen && (
        <Draggable
          axis="both"
          handle=".handle"
          bounds="body"
          defaultPosition={{ x: -minWidth, y: -triggerBtnHeight }}
          nodeRef={containerRef}
        >
          <Resizable
            width={minWidth}
            height={minHeight}
            onResize={(e, { size }) => {
              setMinWidth(size.width);
              setMinHeight(size.height);
            }}
          >
            <div
              className="component-container el"
              id="myDiv"
              ref={containerRef}
              style={containerStyles}
            >
              <div className="handle" style={handleStyles}>
                <button onClick={handleClose}>close</button>
              </div>
              <div style={contentWrapperStyles}>{"content"}</div>
            </div>
          </Resizable>
        </Draggable>
      )}
    </div>
  );
};

export default MyComponent;
