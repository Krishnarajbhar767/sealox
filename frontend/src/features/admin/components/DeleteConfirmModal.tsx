import React from 'react';
import {
  Modal,
  Group,
  Stack,
  Text,
  Button,
  Image,
  Paper,
  Badge,
  ThemeIcon,
} from '@mantine/core';
import { IconAlertTriangle, IconTrash } from '@tabler/icons-react';
import type { CatalogProductRecord } from '../types';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  product: CatalogProductRecord | null;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  product,
  isDeleting,
  onClose,
  onConfirm,
}) => {
  if (!product) return null;

  const displayImage =
    product.primaryImageUrl || product.static_image_path || '/hero_image.png';

  return (
    <Modal
      opened={isOpen}
      onClose={isDeleting ? () => {} : onClose}
      title={
        <Group gap="xs">
          <ThemeIcon color="red" variant="light" size="md" radius="md">
            <IconAlertTriangle size={18} />
          </ThemeIcon>
          <Text fw={700} size="sm">
            Confirm Product Deletion
          </Text>
        </Group>
      }
      centered
      radius="md"
      padding="lg"
      shadow="lg"
    >
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          Are you sure you want to permanently delete this mechanical seal model? This action
          cannot be reversed.
        </Text>

        <Paper withBorder p="sm" radius="md" bg="gray.0">
          <Group gap="sm" wrap="nowrap">
            <Image
              src={displayImage}
              w={52}
              h={52}
              fit="contain"
              radius="sm"
              className="border border-slate-200 bg-white p-1 shrink-0"
              fallbackSrc="/hero_image.png"
            />
            <Stack gap={2} className="min-w-0">
              <Text size="xs" fw={700} c="dark.8" className="line-clamp-1">
                {product.name}
              </Text>
              <Group gap={6}>
                <Badge size="xs" variant="light" color="gray">
                  {product.category}
                </Badge>
                <Text size="xs" c="dimmed" ff="monospace">
                  /{product.slug}
                </Text>
              </Group>
            </Stack>
          </Group>
        </Paper>

        <Paper withBorder p="xs" radius="sm" bg="red.0" className="border-red-200">
          <Text size="xs" c="red.9" fw={500}>
            Notice: Deleting will remove this model from the public website, product catalog, and
            client RFQ forms immediately.
          </Text>
        </Paper>

        <Group justify="flex-end" gap="xs" mt="xs">
          <Button variant="default" size="xs" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            color="red"
            size="xs"
            leftSection={<IconTrash size={14} />}
            loading={isDeleting}
            onClick={onConfirm}
          >
            Permanently Delete
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};
