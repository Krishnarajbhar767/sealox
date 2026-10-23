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
import type { OperatingLimitRow } from '../types';

interface OperatingLimitsTableProps {
  rows: OperatingLimitRow[];
  onAddRow: () => void;
  onUpdateRow: (rowIndex: number, columnKey: 'label' | 'value', value: string) => void;
  onRemoveRow: (rowIndex: number) => void;
  onLoadTemplate: () => void;
}

export const OperatingLimitsTable: React.FC<OperatingLimitsTableProps> = ({
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
            Operating Limits & Parameters
          </Title>
          <Text size="xs" c="dimmed">
            Tabular parameters displayed on the technical specification grid of the storefront.
          </Text>
        </Stack>

        <Button
          variant="light"
          color="teal"
          size="xs"
          leftSection={<IconSparkles size={14} />}
          onClick={onLoadTemplate}
        >
          Load Standard Pump Limits
        </Button>
      </Group>

      <Paper withBorder radius="sm" className="overflow-x-auto mb-3">
        <Table withRowBorders verticalSpacing="xs">
          <Table.Thead bg="gray.0">
            <Table.Tr>
              <Table.Th w="38%">Parameter Name</Table.Th>
              <Table.Th w="52%">Catalog Specification Limit</Table.Th>
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
                    placeholder="e.g. Seal Size, Pressure, Speed, Temp"
                  />
                </Table.Td>
                <Table.Td>
                  <TextInput
                    size="xs"
                    value={rowItem.value}
                    onChange={(event) => onUpdateRow(rowIndex, 'value', event.currentTarget.value)}
                    placeholder="e.g. 12mm to 50mm, 8 kg/cm², 3000 RPM"
                  />
                </Table.Td>
                <Table.Td ta="center">
                  <Tooltip label="Delete row">
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      size="sm"
                      onClick={() => onRemoveRow(rowIndex)}
                      aria-label="Remove parameter row"
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
        Add Parameter Row
      </Button>
    </Paper>
  );
};
