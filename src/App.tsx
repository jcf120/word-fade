import React, { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";

class Fader {
  constructor(private ref: React.RefObject<HTMLDivElement>) {}
  private task?: ReturnType<typeof setTimeout>;

  jog() {
    if (this.task) clearTimeout(this.task);
    this.ref.current?.classList.remove("fade");
    this.task = setTimeout(() => {
      this.ref.current?.classList.add("fade");
    }, 2000);
  }
}

const PAST_PEEK_COUNT = 2;

const sessionKey = `autosave ${new Date()}`;

function App() {
  const contentRef = useRef<HTMLDivElement>(null);
  const fader = useMemo(() => new Fader(contentRef), [contentRef]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [lines, setLines] = useState<string[]>([]);
  useEffect(() => {
    localStorage.setItem(sessionKey, lines.join("") + inputRef.current?.value);
  }, [lines]);

  return (
    <div
      className="root"
      onClick={() => {
        inputRef.current?.focus();
      }}
    >
      <div className="content" ref={contentRef}>
        {lines
          .slice(lines.length - PAST_PEEK_COUNT, lines.length)
          .map((line, idx) => (
            <div
              key={idx}
              style={{ opacity: (idx + 1) / (PAST_PEEK_COUNT + 1) }}
            >
              {line}
            </div>
          ))}
        <input
          ref={inputRef}
          autoFocus
          onKeyDown={(e) => {
            fader.jog();
            const target = e.target as HTMLInputElement;
            const line = target.value;
            if (line.length === 0 && e.key === "Backspace" && lines.length) {
              const last = lines[lines.length - 1];
              setLines(lines.slice(0, lines.length - 1));
              target.value = last;
            } else if (line.length > 40 && line[line.length - 1] === " ") {
              setLines([...lines, line]);
              target.value = "";
            }
          }}
        />
      </div>
      <button
        className="copy"
        onClick={() => {
          navigator.clipboard.writeText(
            lines.join("") + inputRef.current?.value
          );
        }}
      >
        📋
      </button>
    </div>
  );
}

export default App;
