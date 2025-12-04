import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';

interface BookFiltersProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    conditionFilter: string;
    onConditionChange: (value: string) => void;
    sortOption: string;
    onSortChange: (value: string) => void;
    showSoldBooked: boolean;
    onShowSoldBookedChange: (value: boolean) => void;
    onClearFilters: () => void;
    hasActiveFilters: boolean;
}

export function BookFilters({
    searchQuery,
    onSearchChange,
    conditionFilter,
    onConditionChange,
    sortOption,
    onSortChange,
    showSoldBooked,
    onShowSoldBookedChange,
    onClearFilters,
    hasActiveFilters,
}: BookFiltersProps) {
    const [showFilters, setShowFilters] = useState(false);

    return (
        <div className="space-y-4 border-b pb-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                {/* Search Bar */}
                <div className="relative flex-1 md:max-w-sm">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search books..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="h-10 pl-9"
                    />
                </div>

                {/* Filter Toggle (Mobile) */}
                <Button
                    variant="outline"
                    className="md:hidden"
                    onClick={() => setShowFilters(!showFilters)}
                >
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Filters
                </Button>

                {/* Desktop Filters */}
                <div className="hidden flex-1 items-center justify-end gap-3 md:flex">
                    <Select
                        value={conditionFilter}
                        onValueChange={onConditionChange}
                    >
                        <SelectTrigger className="h-10 w-[160px]">
                            <SelectValue placeholder="Condition" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Conditions</SelectItem>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="like_new">Like New</SelectItem>
                            <SelectItem value="good">Good</SelectItem>
                            <SelectItem value="fair">Fair</SelectItem>
                            <SelectItem value="poor">Poor</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={sortOption} onValueChange={onSortChange}>
                        <SelectTrigger className="h-10 w-[160px]">
                            <SelectValue placeholder="Sort By" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Newest</SelectItem>
                            <SelectItem value="price_asc">
                                Price: Low to High
                            </SelectItem>
                            <SelectItem value="price_desc">
                                Price: High to Low
                            </SelectItem>
                            <SelectItem value="title_asc">
                                Title: A to Z
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Show Sold/Booked Checkbox */}
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="show_sold_booked"
                            checked={showSoldBooked}
                            onCheckedChange={onShowSoldBookedChange}
                        />
                        <label
                            htmlFor="show_sold_booked"
                            className="cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Show sold & booked
                        </label>
                    </div>

                    {/* Clear Filters Button */}
                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClearFilters}
                            className="gap-1.5 text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-4 w-4" />
                            Clear
                        </Button>
                    )}
                </div>
            </div>

            {/* Mobile Filters Expandable */}
            {showFilters && (
                <div className="grid grid-cols-1 gap-4 pt-4 md:hidden">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Condition</label>
                        <Select
                            value={conditionFilter}
                            onValueChange={onConditionChange}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Condition" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    All Conditions
                                </SelectItem>
                                <SelectItem value="new">New</SelectItem>
                                <SelectItem value="like_new">
                                    Like New
                                </SelectItem>
                                <SelectItem value="good">Good</SelectItem>
                                <SelectItem value="fair">Fair</SelectItem>
                                <SelectItem value="poor">Poor</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Sort By</label>
                        <Select value={sortOption} onValueChange={onSortChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Sort By" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="newest">Newest</SelectItem>
                                <SelectItem value="price_asc">
                                    Price: Low to High
                                </SelectItem>
                                <SelectItem value="price_desc">
                                    Price: High to Low
                                </SelectItem>
                                <SelectItem value="title_asc">
                                    Title: A to Z
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Show Sold/Booked Checkbox (Mobile) */}
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="show_sold_booked_mobile"
                                checked={showSoldBooked}
                                onCheckedChange={onShowSoldBookedChange}
                            />
                            <label
                                htmlFor="show_sold_booked_mobile"
                                className="cursor-pointer text-sm leading-none font-medium"
                            >
                                Show sold & booked books
                            </label>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
