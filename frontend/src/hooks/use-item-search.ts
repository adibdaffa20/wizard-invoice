import { useEffect, useRef, useState } from "react";
import { AxiosError } from "axios";
import { api } from "@/lib/axios";
import type { Item } from "@/types/item";

export function useItemSearch(code: string) {
  const [item, setItem] = useState<Item | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!code.trim()) {
      controllerRef.current?.abort();
      setItem(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      controllerRef.current?.abort();
      const controller = new AbortController();
      controllerRef.current = controller;

      setIsLoading(true);
      setError(null);

      try {
        const response = await api.get<Item>(`/api/items?code=${encodeURIComponent(code)}`, {
          signal: controller.signal,
        });

        setItem(response.data);
      } catch (error: unknown) {
        const err = error as AxiosError;

        if (controller.signal.aborted || err.code === "ERR_CANCELED") {
          return;
        }

        setItem(null);
        setError("Barang tidak ditemukan");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }, 500);

    return () => {
      window.clearTimeout(timeoutId);
      controllerRef.current?.abort();
    };
  }, [code]);

  return {
    item,
    isLoading,
    error,
  };
}