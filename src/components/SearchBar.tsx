import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  className?: string;
}

export const SearchBar = ({ 
  placeholder = "Search...", 
  onSearch,
  className = "" 
}: SearchBarProps) => {
  const [query, setQuery] = useState('');

  const handleChange = (value: string) => {
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        className="pl-10 rounded-consistent transition-smooth focus:ring-2 focus:ring-primary"
      />
    </div>
  );
};
