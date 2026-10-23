import React from 'react';
import { Link } from 'react-router-dom';
import {
  Paper,
  Table,
  Badge,
  ActionIcon,
  Group,
  Text,
  Tooltip,
  Code,
  Image,
  Stack,
  Loader,
  Alert,
  Button,
} from '@mantine/core';
import {
  IconEdit,
  IconCopy,
  IconTrash,
  IconExternalLink,
  IconAlertCircle,
  IconPlus,
} from '@tabler/icons-react';
import type { CatalogProductRecord } from '../types';

interface CatalogTableProps {
  products: CatalogProductRecord[];
  isLoading: boolean;
  errorMessage: string | null;
  actionInProgressId: number | null;
  onToggleActive: (productRecord: CatalogProductRecord) => void;
  onDuplicate: (productRecord: CatalogProductRecord) => void;
  onDelete: (productRecord: CatalogProductRecord) => void;
  onRetry: () => void;
}

export const CatalogTable: React.FC<CatalogTableProps> = ({
  products,
  isLoading,
  errorMessage,
  actionInProgressId,
  onToggleActive,
  onDuplicate,
  onDelete,
  onRetry,
}) => {
  if (isLoading) {
    return (
      <Paper withBorder p="xl" radius="md" bg="white" shadow="xs">
        <Stack align="center" justify="center" py={40}>
          <Loader color="teal" size="md" />
          <Text size="sm" c="dimmed">
            Loading mechanical seals catalog...
          </Text>
        </Stack>
      </Paper>
    );
  }

  if (errorMessage) {
    return (
      <Paper withBorder p="xl" radius="md" bg="white" shadow="xs">
        <Stack align="center" justify="center" py={30}>
          <Alert icon={<IconAlertCircle size={20} />} title="Connection Error" color="red" radius="md">
            {errorMessage}
          </Alert>
          <Button variant="default" size="xs" onClick={onRetry} mt="sm">
            Retry Connection
          </Button>
        </Stack>
      </Paper>
    );
  }

  if (products.length === 0) {
    return (
      <Paper withBorder p="xl" radius="md" bg="white" shadow="xs">
        <Stack align="center" justify="center" py={40}>
          <Text size="lg" fw={700} c="dark.7">
            No matching products found
          </Text>
          <Text size="sm" c="dimmed" ta="center">
            Try adjusting your search criteria or create a new mechanical seal model.
          </Text>
          <Button
            component={Link}
            to="/admin/products/new"
            color="teal"
            size="xs"
            leftSection={<IconPlus size={14} />}
            mt="xs"
          >
            Add New Mechanical Seal
          </Button>
        </Stack>
      </Paper>
    );
  }

  return (
    <Paper withBorder radius="md" bg="white" shadow="xs" className="overflow-x-auto">
      <Table verticalSpacing="sm" highlightOnHover>
        <Table.Thead bg="gray.0">
          <Table.Tr>
            <Table.Th w={70} ta="center">
              Photo
            </Table.Th>
            <Table.Th>Product Identification</Table.Th>
            <Table.Th w={200}>Category</Table.Th>
            <Table.Th w={160} ta="center">
              Storefront Status
            </Table.Th>
            <Table.Th w={90} ta="center">
              Order Rank
            </Table.Th>
            <Table.Th w={160} ta="right">
              Actions
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {products.map((productRecord) => {
            const displayImageUrl =
              productRecord.primaryImageUrl ||
              productRecord.static_image_path ||
              '/hero_image.png';
            const isRowBusy = actionInProgressId === productRecord.id;

            return (
              <Table.Tr key={productRecord.id}>
                {/* Photo Thumbnail */}
                <Table.Td ta="center">
                  <Image
                    src={displayImageUrl}
                    w={44}
                    h={44}
                    fit="contain"
                    radius="sm"
                    className="border border-slate-200 bg-white p-1 shadow-2xs mx-auto"
                    fallbackSrc="/hero_image.png"
                  />
                </Table.Td>

                {/* Identification */}
                <Table.Td>
                  <Text
                    component={Link}
                    to={`/admin/products/${productRecord.slug}/edit`}
                    fw={700}
                    size="sm"
                    c="dark.8"
                    className="hover:text-emerald-700 transition-colors block line-clamp-1"
                  >
                    {productRecord.name}
                  </Text>
                  <Group gap="xs" mt={2}>
                    <Code c="dimmed" fz={11}>
                      /{productRecord.slug}
                    </Code>
                    {productRecord.subtitle && (
                      <Text size="xs" c="dimmed" className="line-clamp-1">
                        • {productRecord.subtitle}
                      </Text>
                    )}
                  </Group>
                </Table.Td>

                {/* Category */}
                <Table.Td>
                  <Badge variant="light" color="gray" size="sm" radius="sm">
                    {productRecord.category}
                  </Badge>
                </Table.Td>

                {/* Status Toggle */}
                <Table.Td ta="center">
                  <Tooltip label="Click to toggle active visibility on public storefront">
                    <Button
                      variant={productRecord.is_active ? 'light' : 'subtle'}
                      color={productRecord.is_active ? 'teal' : 'gray'}
                      size="compact-xs"
                      radius="xl"
                      onClick={() => onToggleActive(productRecord)}
                      loading={isRowBusy}
                    >
                      {productRecord.is_active ? 'Active on Site' : 'Draft / Hidden'}
                    </Button>
                  </Tooltip>
                </Table.Td>

                {/* Order */}
                <Table.Td ta="center">
                  <Code fz={12}>{productRecord.order}</Code>
                </Table.Td>

                {/* Actions */}
                <Table.Td ta="right">
                  <Group gap={4} justify="flex-end" wrap="nowrap">
                    <Tooltip label="Edit Product">
                      <ActionIcon
                        component={Link}
                        to={`/admin/products/${productRecord.slug}/edit`}
                        variant="subtle"
                        color="gray"
                        size="sm"
                        aria-label="Edit"
                      >
                        <IconEdit size={16} stroke={1.5} />
                      </ActionIcon>
                    </Tooltip>

                    <Tooltip label="Duplicate as Draft Template">
                      <ActionIcon
                        variant="subtle"
                        color="blue"
                        size="sm"
                        onClick={() => onDuplicate(productRecord)}
                        loading={isRowBusy}
                        aria-label="Duplicate"
                      >
                        <IconCopy size={16} stroke={1.5} />
                      </ActionIcon>
                    </Tooltip>

                    <Tooltip label="View Public Storefront Page">
                      <ActionIcon
                        component={Link}
                        to={`/products/${productRecord.slug}`}
                        target="_blank"
                        variant="subtle"
                        color="teal"
                        size="sm"
                        aria-label="View Storefront"
                      >
                        <IconExternalLink size={16} stroke={1.5} />
                      </ActionIcon>
                    </Tooltip>

                    <Tooltip label="Delete Product">
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        size="sm"
                        onClick={() => onDelete(productRecord)}
                        loading={isRowBusy}
                        aria-label="Delete"
                      >
                        <IconTrash size={16} stroke={1.5} />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                </Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
    </Paper>
  );
};
