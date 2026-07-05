"use client";

import { useMemo, useState } from "react";
import { Check, ChevronsUpDown, MapPin } from "lucide-react";
import { searchMunicipalities } from "@/lib/eligibility";
import type { Municipality } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type Props = {
  label: string;
  placeholder: string;
  value: Municipality | null;
  onChange: (m: Municipality | null) => void;
  municipalities: Municipality[];
  accent?: "from" | "to";
};

export function MunicipalityCombobox({
  label,
  placeholder,
  value,
  onChange,
  municipalities,
  accent = "from",
}: Props) {
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

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-bold text-brand-dark">
        <span className={`flex size-7 shrink-0 items-center justify-center rounded-full ${pinBg}`}>
          <MapPin className={`size-4 ${pinColor}`} />
        </span>
        {label}
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          className={cn(
            "field-select",
            borderAccent,
            value ? "text-brand-dark" : "text-muted-foreground",
          )}
        >
          {value ? (
            <span className="truncate font-medium">
              {value.pref} {value.name}
            </span>
          ) : (
            <span>{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-40" />
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] overflow-hidden rounded-xl border-brand-muted p-0 shadow-lg"
          align="start"
        >
          <Command shouldFilter={false}>
            <CommandInput
              className="h-12"
              placeholder="都道府県名・市区町村名で検索"
              value={query}
              onValueChange={setQuery}
            />
            <CommandList className="max-h-64">
              <CommandEmpty className="py-6 text-sm text-muted-foreground">
                該当する自治体が見つかりません
              </CommandEmpty>
              <CommandGroup>
                {filtered.map((m) => (
                  <CommandItem
                    key={m.id}
                    value={m.id}
                    className="cursor-pointer rounded-lg py-3"
                    onSelect={() => {
                      onChange(m);
                      setOpen(false);
                      setQuery("");
                    }}
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
        </PopoverContent>
      </Popover>
    </div>
  );
}
