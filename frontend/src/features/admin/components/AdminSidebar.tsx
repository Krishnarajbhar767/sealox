import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  Stack,
  Group,
  Text,
  Badge,
  UnstyledButton,
  ThemeIcon,
  Paper,
} from '@mantine/core';
import {
  IconPackage,
  IconPlus,
  IconExternalLink,
  IconDatabase,
  IconServer2,
} from '@tabler/icons-react';

export const AdminSidebar: React.FC = () => {
  const currentPath = useLocation().pathname;

  return (
    <Box
      component="aside"
      w={260}
      bg="#0f172a"
      c="gray.3"
      className="flex flex-col shrink-0 border-r border-slate-800 select-none min-h-screen"
    >
      {/* Brand Header */}
      <Paper
        radius={0}
        bg="transparent"
        h={64}
        px="lg"
        className="border-b border-slate-800 flex items-center"
      >
        <UnstyledButton
          component={Link}
          to="/admin"
          className="no-underline group"
        >
          <Group gap="sm">
            <ThemeIcon
              size={34}
              radius="sm"
              color="teal.8"
              variant="filled"
              className="shadow-xs"
            >
              <Text fw={900} fz={13} c="white" lts="0.1em">
                SX
              </Text>
            </ThemeIcon>
            <Stack gap={1}>
              <Text
                fw={900}
                fz={14}
                c="white"
                lts="0.08em"
                className="group-hover:text-emerald-400 transition-colors leading-none"
              >
                SEALOX
              </Text>
              <Text
                fz={10}
                c="dimmed"
                ff="monospace"
                tt="uppercase"
                lts="0.12em"
                className="leading-none mt-1"
              >
                CATALOG CONSOLE
              </Text>
            </Stack>
          </Group>
        </UnstyledButton>
      </Paper>

      {/* Main Navigation */}
      <Stack flex={1} py="lg" px="sm" gap={4}>
        <Text
          fz={10}
          fw={700}
          tt="uppercase"
          lts="0.08em"
          c="slate.5"
          px="sm"
          pb={4}
        >
          Catalog Management
        </Text>

        <UnstyledButton
          component={Link}
          to="/admin"
          px="sm"
          py={10}
          className={`rounded-lg transition-colors ${
            currentPath === '/admin'
              ? 'bg-[#155c48] text-white shadow-xs'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Group gap="sm" wrap="nowrap">
            <IconPackage size={18} />
            <Text size="xs" fw={600}>
              All Mechanical Seals
            </Text>
          </Group>
        </UnstyledButton>

        <UnstyledButton
          component={Link}
          to="/admin/products/new"
          px="sm"
          py={10}
          className={`rounded-lg transition-colors ${
            currentPath === '/admin/products/new'
              ? 'bg-[#155c48] text-white shadow-xs'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Group gap="sm" wrap="nowrap">
            <IconPlus size={18} />
            <Text size="xs" fw={600}>
              Add New Product
            </Text>
          </Group>
        </UnstyledButton>

        <Text
          fz={10}
          fw={700}
          tt="uppercase"
          lts="0.08em"
          c="slate.5"
          px="sm"
          pt="xl"
          pb={4}
        >
          External Quick Links
        </Text>

        <UnstyledButton
          component={Link}
          to="/products"
          target="_blank"
          rel="noopener noreferrer"
          px="sm"
          py={10}
          className="rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
        >
          <Group justify="space-between" align="center" wrap="nowrap">
            <Group gap="sm" wrap="nowrap">
              <IconExternalLink size={16} />
              <Text size="xs" fw={600}>
                Live Storefront
              </Text>
            </Group>
            <Badge variant="filled" color="dark.6" size="xs" radius="xs" ff="monospace">
              :5173
            </Badge>
          </Group>
        </UnstyledButton>

        <UnstyledButton
          component="a"
          href="http://localhost:8000/admin/"
          target="_blank"
          rel="noopener noreferrer"
          px="sm"
          py={10}
          className="rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
        >
          <Group justify="space-between" align="center" wrap="nowrap">
            <Group gap="sm" wrap="nowrap">
              <IconDatabase size={16} />
              <Text size="xs" fw={600}>
                Django Site Admin
              </Text>
            </Group>
            <Badge variant="filled" color="dark.6" size="xs" radius="xs" ff="monospace">
              :8000
            </Badge>
          </Group>
        </UnstyledButton>
      </Stack>

      {/* Footer System Status */}
      <Stack p="md" gap={8} className="border-t border-slate-800">
        <Group justify="space-between" align="center">
          <Group gap={8} align="center">
            <Box w={8} h={8} className="rounded-full bg-emerald-400 animate-pulse" />
            <Text size="xs" fw={500} c="gray.3">
              Backend API
            </Text>
          </Group>
          <Badge color="teal" variant="light" size="xs">
            CONNECTED
          </Badge>
        </Group>
        <Group gap={6} align="center">
          <IconServer2 size={12} className="text-slate-500" />
          <Text fz={10} c="dimmed">
            Django REST • SQLite / Cloudinary
          </Text>
        </Group>
      </Stack>
    </Box>
  );
};
