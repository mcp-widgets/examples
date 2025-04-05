'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { tools } from '@/lib/ai/tools';
import { cn } from '@/lib/utils';
import { useTools } from '@/hooks/use-tools';
import { CheckCircleFillIcon, ChevronDownIcon } from './icons';

export function ToolSelector({
  className,
}: React.ComponentProps<typeof Button>) {
  const [open, setOpen] = useState(false);
  const { selectedTools, setSelectedTools } = useTools();
  const [localSelectedTools, setLocalSelectedTools] = useState<string[]>(selectedTools);

  const selectedToolsCount = localSelectedTools.length;

  const toggleTool = (toolId: string) => {
    const newSelectedTools = localSelectedTools.includes(toolId)
      ? localSelectedTools.filter(id => id !== toolId)
      : [...localSelectedTools, toolId];
    
    setLocalSelectedTools(newSelectedTools);
  };

  const handleOpenChange = (isOpen: boolean) => {
    // Only update the global context when closing the dropdown
    if (open && !isOpen) {
      setSelectedTools(localSelectedTools);
    } else if (!open && isOpen) {
      // Reset local state when opening the dropdown
      setLocalSelectedTools(selectedTools);
    }
    setOpen(isOpen);
  };

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger
        asChild
        className={cn(
          'w-fit data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
          className,
        )}
      >
        <Button
          data-testid="tool-selector"
          variant="outline"
          className="md:px-2 md:h-[34px]"
        >
          Tools {selectedToolsCount > 0 && `(${selectedToolsCount})`}
          <ChevronDownIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[300px]">
        <DropdownMenuLabel>Select Tools</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {tools.map((tool) => {
          const { id, name, description } = tool;
          const isSelected = localSelectedTools.includes(id);

          return (
            <DropdownMenuItem
              data-testid={`tool-selector-item-${id}`}
              key={id}
              onSelect={(e) => {
                e.preventDefault();
                toggleTool(id);
              }}
              asChild
            >
              <button
                type="button"
                className="gap-4 group/item flex flex-row justify-between items-center w-full"
              >
                <div className="flex flex-col gap-1 items-start">
                  <div>{name}</div>
                  <div className="text-xs text-muted-foreground">
                    {description}
                  </div>
                </div>

                <div className={cn(
                  "text-foreground dark:text-foreground",
                  isSelected ? "opacity-100" : "opacity-0"
                )}>
                  <CheckCircleFillIcon />
                </div>
              </button>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
