# paseo-numbered-list

Paseo plugin that continues numbered lists in the chat composer.

- After a line like `1. answer`, Enter starts the next line with `2. `.
- Backspace right after that clears the inserted prefix.
- Enter on an empty item (`2. `) clears it and ends the list.

Desktop and web only.

## Install

```bash
paseo plugin install git:Sifawm/paseo-numbered-list
```

From a local checkout, pass a **relative** path (`cd .. && paseo plugin install ./paseo-numbered-list`):
the desktop binary treats an absolute directory argument as "open this project" and never runs the CLI.

## Check

```bash
node --experimental-strip-types test/numbered-list.check.ts
```
