import React from 'react';
import {
  Paper,
  Group,
  Image,
  FileInput,
  TextInput,
  Stack,
  Title,
  Text,
} from '@mantine/core';
import { IconUpload } from '@tabler/icons-react';

interface MediaUploadCardProps {
  displayImageUrl: string;
  staticImagePath: string;
  fileError?: string;
  onStaticPathChange: (newPath: string) => void;
  onFileSelected: (selectedFile: File | null) => void;
}

export const MediaUploadCard: React.FC<MediaUploadCardProps> = ({
  displayImageUrl,
  staticImagePath,
  fileError,
  onStaticPathChange,
  onFileSelected,
}) => {
  return (
    <Paper withBorder p="md" radius="md" bg="white" shadow="xs">
      <Stack gap={1} mb="md">
        <Title order={4} size="h5" c="dark.8">
          Primary Product Photograph & Media
        </Title>
        <Text size="xs" c="dimmed">
          Upload product photo directly to Cloudinary / media storage, or supply a static asset path.
        </Text>
      </Stack>

      <Group align="flex-start" gap="lg" wrap="wrap">
        {/* Preview box */}
        <Paper
          withBorder
          p="xs"
          radius="md"
          bg="gray.0"
          w={130}
          h={130}
          className="flex items-center justify-center shrink-0 overflow-hidden"
        >
          <Image
            src={displayImageUrl}
            w="100%"
            h="100%"
            fit="contain"
            fallbackSrc="/hero_image.png"
            radius="sm"
          />
        </Paper>

        <Stack gap="sm" className="flex-1 min-w-65">
          <FileInput
            label="Upload Direct Image File"
            placeholder="Choose product photo..."
            leftSection={<IconUpload size={16} />}
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            onChange={onFileSelected}
            error={fileError}
            clearable
            size="sm"
            description="Max 10MB. Supports PNG, JPG, WebP. Persisted to Cloudinary / storage."
          />

          <TextInput
            label="Fallback Static Image Path"
            placeholder="/products/close-seal-photo.png"
            value={staticImagePath}
            onChange={(event) => onStaticPathChange(event.currentTarget.value)}
            size="sm"
            description="Used when no uploaded media file is attached."
          />
        </Stack>
      </Group>
    </Paper>
  );
};
