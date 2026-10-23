import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Group, Title, Text, ActionIcon, Paper } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  actions?: React.ReactNode;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  title,
  subtitle,
  backHref,
  actions,
}) => {
  return (
    <Paper
      withBorder
      radius={0}
      bg="white"
      py="md"
      px={{ base: 'md', sm: 'xl' }}
      className="border-t-0 border-x-0"
    >
      <Group justify="space-between" align="center" wrap="wrap" gap="md">
        <Group align="center" gap="sm">
          {backHref && (
            <ActionIcon
              component={Link}
              to={backHref}
              variant="default"
              size="lg"
              radius="md"
              aria-label="Return to catalog list"
            >
              <IconArrowLeft size={16} />
            </ActionIcon>
          )}
          <Box>
            <Title order={2} size="h3" fw={700} c="dark.9">
              {title}
            </Title>
            {subtitle && (
              <Text size="xs" c="dimmed" mt={2}>
                {subtitle}
              </Text>
            )}
          </Box>
        </Group>

        {actions && (
          <Group gap="xs" align="center">
            {actions}
          </Group>
        )}
      </Group>
    </Paper>
  );
};
