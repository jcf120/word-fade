import React, { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";

const PAST_PEEK_COUNT = 2;

const sessionKey = `autosave ${new Date()}`;

function App() {
  const ref = useRef<HTMLInputElement>(null);
  const [lines, setLines] = useState<string[]>([]);
  useEffect(() => {
    localStorage.setItem(sessionKey, lines.join("") + ref.current?.value);
  }, [lines]);

  return (
    <div
      className="root"
      onClick={() => {
        ref.current?.focus();
      }}
    >
      <div className="content">
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
          ref={ref}
          autoFocus
          onKeyDown={(e) => {
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
          navigator.clipboard.writeText(lines.join("") + ref.current?.value);
        }}
      >
        📋
      </button>
    </div>
  );
}

export default App;
