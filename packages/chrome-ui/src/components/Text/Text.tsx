import {TextProps} from '@aside/chrome-ui-remote';

export type {TextProps};

export function Text({children, align}: TextProps) {
  return (
    <p className="text-primary-foreground text-sm" style={{textAlign: align}}>
      {children}
    </p>
  );
}
