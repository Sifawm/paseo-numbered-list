/** Replace [start, caret) with text instead of a plain line break, or null to leave the break alone. */
export function continuation(value: string, caret: number): { start: number; text: string } | null {
  const lineStart = value.lastIndexOf("\n", caret - 1) + 1;
  const line = value.slice(lineStart, caret);
  // Empty item at the end of its line ("2. "): drop the prefix and stay on the now-empty line.
  if (/^\s*\d+\. $/.test(line) && (value[caret] ?? "\n") === "\n") return { start: lineStart, text: "" };
  const m = /^(\s*)(\d+)\.\s*\S/.exec(line);
  return m ? { start: caret, text: `\n${m[1]}${Number(m[2]) + 1}. ` } : null;
}

interface Auto {
  el: HTMLTextAreaElement;
  value: string;
  caret: number;
  start: number;
}

// The last prefix we inserted; Backspace clears it only while nothing has changed since.
let last: Auto | null = null;

function onBeforeInput(e: InputEvent): void {
  const el = e.target;
  if (!(el instanceof HTMLTextAreaElement) || e.isComposing) return;
  const { selectionStart: s, selectionEnd: end, value } = el;
  if (s !== end) return;

  if (e.inputType === "insertLineBreak" || e.inputType === "insertParagraph") {
    const edit = continuation(value, s);
    if (!edit) return;
    e.preventDefault();
    last = null;
    // execCommand keeps native undo and fires the input event the controlled TextInput listens to.
    if (!edit.text) {
      el.setSelectionRange(edit.start, s);
      document.execCommand("delete");
      return;
    }
    document.execCommand("insertText", false, edit.text);
    last = { el, value: el.value, caret: el.selectionStart, start: s + 1 };
    return;
  }

  if (e.inputType === "deleteContentBackward" && last?.el === el && last.value === value && last.caret === s) {
    e.preventDefault();
    el.setSelectionRange(last.start, s);
    last = null;
    document.execCommand("delete");
  }
}

export function installNumberedList(): () => void {
  if (typeof document === "undefined") return () => {}; // native: no DOM
  document.addEventListener("beforeinput", onBeforeInput, true);
  return () => document.removeEventListener("beforeinput", onBeforeInput, true);
}
