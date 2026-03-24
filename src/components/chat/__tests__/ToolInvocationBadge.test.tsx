import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

afterEach(() => cleanup());
import { ToolInvocationBadge } from "../ToolInvocationBadge";

test("str_replace_editor create shows Creating label", () => {
  render(<ToolInvocationBadge toolName="str_replace_editor" args={{ command: "create", path: "/components/Card.jsx" }} isPending={false} />);
  expect(screen.getByText("Creating /components/Card.jsx")).toBeDefined();
});

test("str_replace_editor str_replace shows Editing label", () => {
  render(<ToolInvocationBadge toolName="str_replace_editor" args={{ command: "str_replace", path: "/App.jsx" }} isPending={false} />);
  expect(screen.getByText("Editing /App.jsx")).toBeDefined();
});

test("str_replace_editor insert shows Editing label", () => {
  render(<ToolInvocationBadge toolName="str_replace_editor" args={{ command: "insert", path: "/App.jsx" }} isPending={false} />);
  expect(screen.getByText("Editing /App.jsx")).toBeDefined();
});

test("str_replace_editor view shows Viewing label", () => {
  render(<ToolInvocationBadge toolName="str_replace_editor" args={{ command: "view", path: "/App.jsx" }} isPending={false} />);
  expect(screen.getByText("Viewing /App.jsx")).toBeDefined();
});

test("file_manager rename shows Renaming label", () => {
  render(<ToolInvocationBadge toolName="file_manager" args={{ command: "rename", path: "/old.jsx", new_path: "/new.jsx" }} isPending={false} />);
  expect(screen.getByText("Renaming /old.jsx → /new.jsx")).toBeDefined();
});

test("file_manager delete shows Deleting label", () => {
  render(<ToolInvocationBadge toolName="file_manager" args={{ command: "delete", path: "/App.jsx" }} isPending={false} />);
  expect(screen.getByText("Deleting /App.jsx")).toBeDefined();
});

test("unknown tool falls back to tool name", () => {
  render(<ToolInvocationBadge toolName="some_unknown_tool" args={{}} isPending={false} />);
  expect(screen.getByText("some_unknown_tool")).toBeDefined();
});

test("known tool with no path falls back to tool name", () => {
  render(<ToolInvocationBadge toolName="str_replace_editor" args={{ command: "create" }} isPending={false} />);
  expect(screen.getByText("str_replace_editor")).toBeDefined();
});
