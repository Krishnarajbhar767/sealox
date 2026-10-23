import React from 'react';
import {
  Paper,
  Table,
  NumberInput,
  TextInput,
  Button,
  ActionIcon,
  Group,
  Stack,
  Title,
  Text,
  Tooltip,
} from '@mantine/core';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import type { AssemblyComponentRow } from '../types';

interface AssemblyCalloutsTableProps {
  rows: AssemblyComponentRow[];
  onAddRow: () => void;
  onUpdateRow: (rowIndex: number, columnKey: 'code' | 'name', value: string | number) => void;
  onRemoveRow: (rowIndex: number) => void;
}

export const AssemblyCalloutsTable: React.FC<AssemblyCalloutsTableProps> = ({
  rows,
  onAddRow,
  onUpdateRow,
  onRemoveRow,
}) => {
  return (
    <Paper withBorder p="md" radius="md" bg="white" shadow="xs">
      <Group justify="space-between" mb="sm" wrap="wrap">
        <Stack gap={1}>
          <Title order={4} size="h5" c="dark.8">
            Numbered Assembly Callouts
          </Title>
          <Text size="xs" c="dimmed">
            Numbered component callouts matching the technical cross-section schematic drawing.
          </Text>
        </Stack>
      </Group>

      <Paper withBorder radius="sm" className="overflow-x-auto mb-3">
        <Table withRowBorders verticalSpacing="xs">
          <Table.Thead bg="gray.0">
            <Table.Tr>
              <Table.Th w="15%" ta="center">
                Callout #
              </Table.Th>
              <Table.Th w="75%">Component Name (Matches Diagram Schematic)</Table.Th>
              <Table.Th w="10%" ta="center">
                Action
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.map((rowItem, rowIndex) => (
              <Table.Tr key={rowIndex}>
                <Table.Td ta="center">
                  <NumberInput
                    size="xs"
                    value={rowItem.code}
                    onChange={(val) => onUpdateRow(rowIndex, 'code', val || 0)}
                    min={1}
                    max={999}
                    w={70}
                    className="mx-auto"
                  />
                </Table.Td>
                <Table.Td>
                  <TextInput
                    size="xs"
                    value={rowItem.name}
                    onChange={(event) => onUpdateRow(rowIndex, 'name', event.currentTarget.value)}
                    placeholder="e.g. Elastomer Bellow, Stationary Seat, SS Spring"
                  />
                </Table.Td>
                <Table.Td ta="center">
                  <Tooltip label="Delete component callout">
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      size="sm"
                      onClick={() => onRemoveRow(rowIndex)}
                      aria-label="Remove component callout"
                    >
                      <IconTrash size={14} />
                    </ActionIcon>
                  </Tooltip>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>

      <Button
        variant="default"
        size="xs"
        leftSection={<IconPlus size={14} />}
        onClick={onAddRow}
      >
        Add Component Callout
      </Button>
    </Paper>
  );
};
