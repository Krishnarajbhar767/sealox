import { Button as MantineButton, type ButtonProps } from '@mantine/core';
import type React from 'react';

type Prop = {
  variant?: 'green' | 'white';
  varient?: 'green' | 'white'; // Backwards compatibility for existing usages
  children: React.ReactNode;
} & Omit<ButtonProps, 'variant'> &
  React.ComponentPropsWithoutRef<'button'>;

export default function Button({ variant, varient, children, style, ...props }: Readonly<Prop>) {
  const activeVariant = variant ?? varient ?? 'green';
  const isGreen = activeVariant === 'green';

  return (
    <MantineButton
      style={{
        borderRadius: 6,
        fontWeight: 600,
        fontSize: '14px',
        transition: 'all 0.15s ease',
        ...(isGreen
          ? {
              backgroundColor: '#155C48',
              backgroundImage: 'linear-gradient(135deg, #155C48 0%, #439951 100%)',
              border: 'none',
              color: '#FFFFFF',
              boxShadow: '0 2px 8px rgba(21, 92, 72, 0.2)',
            }
          : {
              backgroundColor: '#FFFFFF',
              color: '#1F2937',
              border: '1px solid #E5E7EB',
              boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04)',
            }),
        ...(style as Record<string, unknown>),
      }}
      miw={props.miw ?? { base: 'auto', sm: 140 }}
      mih={props.mih ?? 42}
      {...props}
    >
      {children}
    </MantineButton>
  );
}
