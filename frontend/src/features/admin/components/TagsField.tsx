import React from 'react';
import { TagsInput } from '@mantine/core';

interface TagsFieldProps {
  label: string;
  placeholder?: string;
  description?: string;
  value: string[];
  onChange: (updatedTags: string[]) => void;
  error?: string;
}

export const TagsField: React.FC<TagsFieldProps> = ({
  label,
  placeholder = 'Type and press Enter',
  description,
  value,
  onChange,
  error,
}) => {
  return (
    <TagsInput
      label={label}
      placeholder={placeholder}
      description={description}
      value={value}
      onChange={onChange}
      error={error}
      clearable
      splitChars={[',', ' ']}
      size="sm"
    />
  );
};
