import type { ComponentPropsWithoutRef } from "react";
import type {
  FormatDateOptions,
  TarikhDateInput,
  TarikhLocale
} from "./index";

export interface TarikhDateProps
  extends Omit<ComponentPropsWithoutRef<"time">, "children">,
    Omit<FormatDateOptions, "locale"> {
  value: TarikhDateInput;
  locale?: TarikhLocale;
  srLabel?: string;
}

export interface TarikhRelativeProps
  extends Omit<ComponentPropsWithoutRef<"time">, "children"> {
  value: TarikhDateInput;
  locale?: TarikhLocale;
  srLabel?: string;
}

export interface TarikhCalendarProps
  extends Omit<ComponentPropsWithoutRef<"time">, "children"> {
  value: TarikhDateInput;
  locale?: TarikhLocale;
  srLabel?: string;
}
