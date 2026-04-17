import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { api } from "@/lib/axios";
import type { Item } from "@/types/item";

async function fetchItemByCode(code: string, signal?: AbortSignal) {
  const response = await api.get<Item>(
    `/api/items?code=${encodeURIComponent(code)}`,
    { signal }
  );

  return response.data;
}

export function useItemSearch(code: string) {
  const normalizedCode = code.trim().toUpperCase();
  const [debouncedCode, setDebouncedCode] = useState("");

  useEffect(() => {
    if (!normalizedCode) {
      setDebouncedCode("");
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setDebouncedCode(normalizedCode);
    }, 500);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [normalizedCode]);

  const query = useQuery({
    queryKey: ["item-search", debouncedCode],
    enabled: debouncedCode.length > 0,
    retry: false,
    staleTime: 0,
    queryFn: async ({ signal }) => {
      return fetchItemByCode(debouncedCode, signal);
    },
  });

  const error = useMemo(() => {
    if (!query.error) return null;

    const err = query.error as AxiosError;
    if (err.code === "ERR_CANCELED") return null;

    return "Barang tidak ditemukan";
  }, [query.error]);

  return {
    item: query.data ?? null,
    isLoading: query.isFetching,
    error,
    debouncedCode,
  };
}