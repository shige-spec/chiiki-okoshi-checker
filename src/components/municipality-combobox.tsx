"use client";

import { useMemo, useState } from "react";
import { Check, ChevronsUpDown, MapPin } from "lucide-react";
import { searchMunicipalities } from "@/lib/eligibility";
import type { Municipality } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-is-mobile";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type Props = {
  label: string;
  placeholder: string;
  value: Municipality | null;
  onChange: (m: Municipality | null) => void;
  municipalities: Municipality[];
  accent?: "from" | "to";
};

function MunicipalitySearch({
  value,
  query,
  filtered,
  onQueryChange,
  onSelect,
  listClassName,
}: {
  value: Municipality | null;
  query: string;
  filtered: Municipality[];
  onQueryChange: (query: string) => void;
  onSelect: (municipality: Municipality) => void;
  listClassName?: string;
}) {
  return (
    <Command shouldFilter={false}>
      <CommandInput
        className="h-12 text-base"
        placeholder="都道府県名・市区町村名で検索"
        value={query}
        onValueChange={onQueryChange}
        inputMode="search"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
      />
      <CommandList className={cn("max-h-64", listClassName)}>
        <CommandEmpty className="py-6 text-sm text-muted-foreground">
          該当する自治体が見つかりません
        </CommandEmpty>
        <CommandGroup>
          {filtered.map((m) => (
            <CommandItem
              key={m.id}
              value={m.id}
              className="cursor-pointer rounded-lg py-3"
              onSelect={() => onSelect(m)}
            >
              <Check
                className={cn(
                  "mr-2 size-4 text-brand",
                  value?.id === m.id ? "opacity-100" : "opacity-0",
                )}
              />
              <div className="flex flex-col gap-0.5">
                <span className="font-medium text-brand-dark">
                  {m.pref} {m.name}
                </span>
                <span className="text-xs text-muted-foreground">{m.categoryLabel}</span>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

export function MunicipalityCombobox({
  label,
  placeholder,
  value,
  onChange,
  municipalities,
  accent = "from",
}: Props) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () => searchMunicipalities(municipalities, query, 30),
    [municipalities, query],
  );

  const borderAccent =
    accent === "from" ? "focus-visible:ring-accent-blue/30" : "focus-visible:ring-brand/30";
  const pinBg = accent === "from" ? "bg-accent-blue-light" : "bg-brand-light";
  const pinColor = accent === "from" ? "text-accent-blue" : "text-brand";

  const triggerClassName = cn(
    "field-select",
    borderAccent,
    value ? "text-brand-dark" : "text-muted-foreground",
  );

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) setQuery("");
  };

  const handleSelect = (municipality: Municipality) => {
    onChange(municipality);
    setOpen(false);
    setQuery("");
  };

  const triggerLabel = value ? (
    <span className="truncate font-medium">
      {value.pref} {value.name}
    </span>
  ) : (
    <span>{placeholder}</span>
  );

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-bold text-brand-dark">
        <span className={`flex size-7 shrink-0 items-center justify-center rounded-full ${pinBg}`}>
          <MapPin className={`size-4 ${pinColor}`} />
        </span>
        {label}
      </label>

      {isMobile ? (
        <>
          <button
            type="button"
            className={triggerClassName}
            aria-expanded={open}
            aria-haspopup="dialog"
            onClick={() => setOpen(true)}
          >
            {triggerLabel}
            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-40" />
          </button>
          <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent
              className="top-[max(0.75rem,env(safe-area-inset-top,0px))]! left-1/2 max-h-[min(78dvh,calc(100dvh-env(safe-area-inset-top,0px)-env(safe-area-inset-bottom,0px)-1.5rem))] w-[calc(100%-1.5rem)] max-w-none! -translate-x-1/2! translate-y-0! gap-0 overflow-hidden p-0 sm:max-w-lg"
              showCloseButton
            >
              <DialogHeader className="border-b border-brand-muted/30 px-4 py-4 text-left">
                <DialogTitle className="text-base font-bold text-brand-dark">
                  {label}を選択
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  都道府県名・市区町村名で検索してください
                </DialogDescription>
              </DialogHeader>
              <div className="px-1 pb-2">
                <MunicipalitySearch
                  value={value}
                  query={query}
                  filtered={filtered}
                  onQueryChange={setQuery}
                  onSelect={handleSelect}
                  listClassName="max-h-[min(52dvh,calc(100dvh-12rem))]"
                />
              </div>
            </DialogContent>
          </Dialog>
        </>
      ) : (
        <Popover open={open} onOpenChange={handleOpenChange}>
          <PopoverTrigger className={triggerClassName}>
            {triggerLabel}
            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-40" />
          </PopoverTrigger>
          <PopoverContent
            className="w-[var(--radix-popover-trigger-width)] overflow-hidden rounded-xl border-brand-muted p-0 shadow-lg"
            align="start"
          >
            <MunicipalitySearch
              value={value}
              query={query}
              filtered={filtered}
              onQueryChange={setQuery}
              onSelect={handleSelect}
            />
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
