import type { ComponentPropsWithoutRef } from "react";
import type {
  FormatDateOptions,
  TarikhDateInput,
  TarikhLocale
} from "./index";

export type TarikhReactSpanProps = ComponentPropsWithoutRef<"span">;
export type TarikhReactTimeProps = ComponentPropsWithoutRef<"time">;

export interface TarikhDateProps
  extends Omit<TarikhReactTimeProps, "children">,
    Omit<FormatDateOptions, "locale"> {
  value: TarikhDateInput;
  locale?: TarikhLocale;
  srLabel?: string;
}

export interface TarikhRelativeProps
  extends Omit<TarikhReactTimeProps, "children"> {
  value: TarikhDateInput;
  locale?: TarikhLocale;
  srLabel?: string;
}

export interface TarikhCalendarProps
  extends Omit<TarikhReactTimeProps, "children"> {
  value: TarikhDateInput;
  locale?: TarikhLocale;
  srLabel?: string;
}
