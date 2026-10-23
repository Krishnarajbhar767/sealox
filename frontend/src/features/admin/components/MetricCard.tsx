import React from 'react';
import { Paper, Group, Stack, Text, ThemeIcon } from '@mantine/core';

interface MetricCardProps {
  label: string;
  value: number | string;
  helperText?: string;
  icon: React.ReactNode;
  color?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  helperText,
  icon,
  color = 'teal',
}) => {
  return (
    <Paper withBorder p="md" radius="md" shadow="xs" bg="white">
      <Group justify="space-between" align="flex-start">
        <Stack gap={2}>
          <Text size="xs" c="dimmed" fw={700} tt="uppercase" lts="0.05em">
            {label}
          </Text>
          <Text size="xl" fw={800} c="dark.8">
            {value}
          </Text>
          {helperText && (
            <Text size="xs" c="dimmed">
              {helperText}
            </Text>
          )}
        </Stack>

        <ThemeIcon size={42} radius="md" variant="light" color={color}>
          {icon}
        </ThemeIcon>
      </Group>
    </Paper>
  );
};
