/* eslint-disable @typescript-eslint/naming-convention */
import {clsx, type ClassValue} from 'clsx';
import {twMerge} from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type VariantsFromProps<
  Props,
  AnyVariantKey extends keyof Props,
> = Required<{
  [VariantKey in AnyVariantKey]: {
    [key in Extract<Props[VariantKey], string>]: string;
  };
}>;
