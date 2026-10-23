import React from 'react';
import { Paper, Group, TextInput, Select, ActionIcon, Tooltip } from '@mantine/core';
import { IconSearch, IconRefresh } from '@tabler/icons-react';

interface FilterBarProps {
  searchKeyword: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  categories: string[];
  totalProductCount: number;
  onRefresh: () => void;
  isLoading: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchKeyword,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  totalProductCount,
  onRefresh,
  isLoading,
}) => {
  const categoryOptions = [
    { value: 'ALL', label: `All Categories (${totalProductCount})` },
    ...categories.map((categoryName) => ({
      value: categoryName,
      label: categoryName,
    })),
  ];

  return (
    <Paper withBorder p="sm" radius="md" bg="white" shadow="xs">
      <Group justify="space-between" wrap="wrap">
        <TextInput
          placeholder="Search by model name, slug, specification..."
          value={searchKeyword}
          onChange={(event) => onSearchChange(event.currentTarget.value)}
          leftSection={<IconSearch size={16} stroke={1.5} />}
          size="sm"
          className="flex-1 min-w-70"
        />

        <Group gap="xs">
          <Select
            data={categoryOptions}
            value={selectedCategory}
            onChange={(val) => onCategoryChange(val || 'ALL')}
            size="sm"
            w={260}
            allowDeselect={false}
          />

          <Tooltip label="Refresh catalog list">
            <ActionIcon
              variant="default"
              size="lg"
              onClick={onRefresh}
              loading={isLoading}
              aria-label="Refresh catalog"
            >
              <IconRefresh size={16} stroke={1.5} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>
    </Paper>
  );
};
