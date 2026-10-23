import React from 'react';
import {
  Paper,
  Table,
  TextInput,
  Button,
  ActionIcon,
  Group,
  Stack,
  Title,
  Text,
  Tooltip,
} from '@mantine/core';
import { IconPlus, IconTrash, IconSparkles } from '@tabler/icons-react';
import type { FaceMaterialRow } from '../types';

interface FaceMaterialsTableProps {
  rows: FaceMaterialRow[];
  onAddRow: () => void;
  onUpdateRow: (rowIndex: number, columnKey: 'label' | 'value', value: string) => void;
  onRemoveRow: (rowIndex: number) => void;
  onLoadTemplate: () => void;
}

export const FaceMaterialsTable: React.FC<FaceMaterialsTableProps> = ({
  rows,
  onAddRow,
  onUpdateRow,
  onRemoveRow,
  onLoadTemplate,
}) => {
  return (
    <Paper withBorder p="md" radius="md" bg="white" shadow="xs">
      <Group justify="space-between" mb="sm" wrap="wrap">
        <Stack gap={1}>
          <Title order={4} size="h5" c="dark.8">
            Face Materials & Stationary Seats
          </Title>
          <Text size="xs" c="dimmed">
            Material pairings for rotary faces and stationary seat rings.
          </Text>
        </Stack>

        <Button
          variant="light"
          color="teal"
          size="xs"
          leftSection={<IconSparkles size={14} />}
          onClick={onLoadTemplate}
        >
          Load Standard Face Materials
        </Button>
      </Group>

      <Paper withBorder radius="sm" className="overflow-x-auto mb-3">
        <Table withRowBorders verticalSpacing="xs">
          <Table.Thead bg="gray.0">
            <Table.Tr>
              <Table.Th w="38%">Seal Face Component</Table.Th>
              <Table.Th w="52%">Available Material Grades</Table.Th>
              <Table.Th w="10%" ta="center">
                Action
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.map((rowItem, rowIndex) => (
              <Table.Tr key={rowIndex}>
                <Table.Td>
                  <TextInput
                    size="xs"
                    value={rowItem.label}
                    onChange={(event) => onUpdateRow(rowIndex, 'label', event.currentTarget.value)}
                    placeholder="e.g. Rotary Face, Stationary Seats, Type"
                  />
                </Table.Td>
                <Table.Td>
                  <TextInput
                    size="xs"
                    value={rowItem.value}
                    onChange={(event) => onUpdateRow(rowIndex, 'value', event.currentTarget.value)}
                    placeholder="e.g. Carbon, Silicon Carbide, TC, SS"
                  />
                </Table.Td>
                <Table.Td ta="center">
                  <Tooltip label="Delete row">
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      size="sm"
                      onClick={() => onRemoveRow(rowIndex)}
                      aria-label="Remove material row"
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
        Add Face Component Row
      </Button>
    </Paper>
  );
};
