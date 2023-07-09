'use client';

import React from 'react';

export interface Props {
  children: React.ReactNode;
}

/**
 *
 * Wrapper component used to wrap app code passed to an <AsideSandbox />
 * This has to be provided as a client component to satisfy Next.js
 */
export function Wrapper({children}: Props) {
  return <div className="flex items-center justify-center">{children}</div>;
}

export function withWrapper(WrappedComponent: React.ComponentType<any>) {
  const displayName =
    WrappedComponent.displayName ?? WrappedComponent.name ?? 'Component';

  const ComponentWithWrapper = (props: any) => {
    // props comes afterwards so the can override the default ones.
    return (
      <Wrapper>
        <WrappedComponent />
      </Wrapper>
    );
  };

  ComponentWithWrapper.displayName = `withWrapper(${displayName})`;

  return ComponentWithWrapper;
}
