import React, { useState, useEffect, useRef } from "react";

export const AutoHeightTextArea = ({ text, setText, rows, placeholder, height, setHeight }) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    // Calculate and set the initial height after component mounts
    if (textareaRef.current) {
      const style = window.getComputedStyle(textareaRef.current);
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.max(
        parseFloat(style.fontSize),
        textareaRef.current.scrollHeight
      )}px`;
      setHeight(textareaRef.current.style.height);
    }
  }, []);

  const handleTextAreaHeightChange = (event) => {
    const { value, style } = event.target;
    setText(value);
    style.height = "auto"; // Reset the height to auto to properly calculate the scrollHeight
    style.height = `${Math.max(
      parseFloat(window.getComputedStyle(event.target).fontSize),
      event.target.scrollHeight
    )}px`;
    setHeight(style.height);
  };

  return (
    <textarea
      ref={textareaRef}
      className="resize-none overflow-hidden placeholder:text-wrap focus:outline-none bg-transparent w-full "
      value={text}
      rows={rows}
      onChange={handleTextAreaHeightChange}
      style={{ height: height }}
      placeholder={placeholder}
    />
  );
};
