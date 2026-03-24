interface ToolInvocationBadgeProps {
  toolName: string;
  args: Record<string, any>;
  isPending: boolean;
}

function getLabel(toolName: string, args: Record<string, any>): string {
  if (toolName === "str_replace_editor" && args?.path) {
    switch (args.command) {
      case "create": return `Creating ${args.path}`;
      case "str_replace": return `Editing ${args.path}`;
      case "insert": return `Editing ${args.path}`;
      case "view": return `Viewing ${args.path}`;
    }
  }

  if (toolName === "file_manager" && args?.path) {
    switch (args.command) {
      case "rename": return `Renaming ${args.path} → ${args.new_path}`;
      case "delete": return `Deleting ${args.path}`;
    }
  }

  return toolName;
}

export function ToolInvocationBadge({ toolName, args, isPending }: ToolInvocationBadgeProps) {
  return (
    <span className="text-neutral-700">{getLabel(toolName, args)}</span>
  );
}
