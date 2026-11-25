import type { PluginClientContext } from "@getpaseo/plugin/client";
import { installNumberedList } from "./client/numbered-list";

export default function contribute(_client: PluginClientContext) {
  return installNumberedList();
}
