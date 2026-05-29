'use client';

import { useState, useMemo } from 'react';
import * as Icons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';

// Common icons for services
const POPULAR_ICONS = [
  'Monitor',
  'Building2',
  'ShoppingCart',
  'Cloud',
  'Cpu',
  'Palette',
  'GitBranch',
  'Server',
  'Smartphone',
  'Database',
  'Code',
  'Zap',
  'Globe',
  'Lock',
  'Settings',
  'Users',
  'Package',
  'Briefcase',
  'LineChart',
  'Heart',
  'Star',
  'Search',
  'Mail',
  'MessageSquare',
  'FileText',
  'Image',
  'Video',
  'Music',
  'Calendar',
  'Clock',
];

interface IconSelectorProps {
  value: string;
  onChange: (iconName: string) => void;
  placeholder?: string;
}

export function IconSelector({
  value,
  onChange,
  placeholder = 'Select an icon',
}: IconSelectorProps) {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Get the icon component
  const IconComponent = value
    ? (Icons as any)[value] || Icons.HelpCircle
    : Icons.HelpCircle;

  // Filter icons based on search
  const filteredIcons = useMemo(() => {
    const searchLower = search.toLowerCase();
    return POPULAR_ICONS.filter((iconName) =>
      iconName.toLowerCase().includes(searchLower)
    );
  }, [search]);

  const handleSelect = (iconName: string) => {
    onChange(iconName);
    setIsOpen(false);
    setSearch('');
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className="w-full justify-start gap-2 bg-cyber-dark/50 border-white/10 hover:bg-cyber-dark/70 hover:border-[#00F5FF]/30"
        >
          <IconComponent className="h-4 w-4 text-[#00F5FF]" />
          <span className="text-white/70">
            {value || placeholder}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[400px] p-0 bg-cyber-dark border-white/10"
        align="start"
      >
        <div className="p-3 border-b border-white/10">
          <Input
            placeholder="Search icons..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-cyber-dark/50 border-white/10 text-white placeholder:text-white/30"
          />
        </div>
        <ScrollArea className="h-[300px]">
          <div className="grid grid-cols-5 gap-2 p-3">
            {filteredIcons.map((iconName) => {
              const Icon = (Icons as any)[iconName];
              const isSelected = value === iconName;
              return (
                <button
                  key={iconName}
                  type="button"
                  onClick={() => handleSelect(iconName)}
                  className={`
                    flex flex-col items-center justify-center gap-1 p-3 rounded-lg
                    transition-all duration-200
                    ${
                      isSelected
                        ? 'bg-[#00F5FF]/20 border-2 border-[#00F5FF]'
                        : 'bg-cyber-dark/50 border-2 border-white/10 hover:bg-cyber-dark/70 hover:border-[#00F5FF]/30'
                    }
                  `}
                  title={iconName}
                >
                  <Icon
                    className={`h-5 w-5 ${
                      isSelected ? 'text-[#00F5FF]' : 'text-white/70'
                    }`}
                  />
                  <span
                    className={`text-[10px] truncate w-full text-center ${
                      isSelected ? 'text-[#00F5FF]' : 'text-white/50'
                    }`}
                  >
                    {iconName}
                  </span>
                </button>
              );
            })}
          </div>
          {filteredIcons.length === 0 && (
            <div className="p-6 text-center text-white/50">
              No icons found
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
