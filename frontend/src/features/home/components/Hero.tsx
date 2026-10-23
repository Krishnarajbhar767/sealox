import {
  Container,
  Grid,
  Box,
  Text,
  Title,
  Group,
  Stack,
  Image,
  Flex,
  SimpleGrid,
} from '@mantine/core';
import {
  IconArrowRight,
  IconSearch,
  IconHeadset,
  IconGauge,
  IconThermometer,
  IconSettings,
  IconCpu,
  IconPlayerPlayFilled,
  IconFileDescription,
  IconLayoutGrid,
  IconUsers,
  IconBriefcase,
} from '@tabler/icons-react';
import Button from '../../../components/ui/Button';
import { Link } from 'react-router-dom';

// Reusable DRY component for the right-side features
const FeatureItem = ({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) => (
  <Group wrap="nowrap" gap="lg">
    <Box
      w={64}
      h={64}
      style={{
        borderRadius: '50%',
        backgroundColor: 'white',
        boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {icon}
    </Box>
    <Box>
      <Text fw={700} size="lg" c="#111827" lh={1.2}>
        {title}
      </Text>
      <Text size="md" c="#6B7280" fw={500} mt={4}>
        {subtitle}
      </Text>
    </Box>
  </Group>
);

// Scaled down version for the bottom statistics bar
const StatItem = ({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) => (
  <Group wrap="nowrap" gap="md">
    <Box
      w={56}
      h={56}
      style={{
        borderRadius: '50%',
        backgroundColor: 'white',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {icon}
    </Box>
    <Box>
      <Text fw={700} size="md" c="#111827" lh={1.2}>
        {title}
      </Text>
      <Text size="sm" c="#6B7280" fw={500} mt={2}>
        {subtitle}
      </Text>
    </Box>
  </Group>
);

// Reusable DRY component for the bottom-right actions
const MediaAction = ({
  icon,
  title,
  subtitle,
  href,
  download,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  href?: string;
  download?: string | boolean;
}) => {
  const content = (
    <Group
      wrap="nowrap"
      gap="md"
      style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
    >
      <Box
        w={56}
        h={56}
        style={{
          borderRadius: '50%',
          backgroundColor: 'white',
          border: '1px solid #50B861',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box>
        <Text fw={700} size="sm" c="#111827" lh={1.2}>
          {title}
        </Text>
        <Text size="xs" c="#6B7280" fw={500} mt={2}>
          {subtitle}
        </Text>
      </Box>
    </Group>
  );

  if (href) {
    return (
      <Box
        component="a"
        href={href}
        download={download}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        {content}
      </Box>
    );
  }

  return content;
};

export function Hero() {
  return (
    <Box
      component="section"
      style={{ position: 'relative', overflow: 'hidden' }}
      pt={{ base: 36, sm: 56, md: 80, lg: 96 }}
      pb={{ base: 36, sm: 48 }}
    >
      <Container size="xl" px={{ base: 'md', sm: 'xl' }}>
        <Grid align="center" gap={{ base: 32, lg: 0 }}>
          {/* Left Text Box */}
          <Grid.Col span={{ base: 12, lg: 5 }} style={{ zIndex: 2, position: 'relative' }}>
            <Stack gap="xs">
              <Box>
                <Text
                  c="#50B861"
                  tt="uppercase"
                  style={{ letterSpacing: '1px' }}
                  size="xs"
                  fw={700}
                  mb="sm"
                >
                  <span>ENGINEERED TO SEAL.</span>{' '}
                  <span style={{ fontWeight: 500 }}>BUILT TO PERFORM.</span>
                </Text>
                <Title
                  order={1}
                  style={{
                    fontSize: 'clamp(2.1rem, 5.2vw, 3.3rem)',
                    lineHeight: 1.12,
                    fontWeight: 600,
                    color: '#111827',
                  }}
                >
                  PRECISION
                  <br />
                  THAT
                  <br />
                  <span style={{ color: '#50B861' }}>PERFORMS.</span>
                </Title>
                <Text
                  mt={16}
                  size="md"
                  c="#374151"
                  fw={500}
                  maw={{ base: '100%', sm: 440 }}
                  lh={1.5}
                >
                  High-performance sealing solutions engineered for extreme conditions and
                  mission-critical applications.
                </Text>
              </Box>
            </Stack>
          </Grid.Col>

          {/* Center Image */}
          <Grid.Col span={{ base: 12, lg: 4 }} style={{ zIndex: 1, position: 'relative' }}>
            <Box
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                pointerEvents: 'none',
              }}
            >
              {/* Desktop Scaled View */}
              <Box className="hidden lg:block w-full">
                <Image
                  src="/hero_image.png"
                  alt="Sealox Precision Seals"
                  style={{
                    width: '100%',
                    objectFit: 'contain',
                    transform: 'scale(1.85) translateX(-22%)',
                    maxWidth: 'none',
                  }}
                />
              </Box>
              {/* Mobile / Tablet Centered View */}
              <Box className="block lg:hidden my-2 max-w-65 sm:max-w-[320px] w-full mx-auto">
                <Image
                  src="/hero_image.png"
                  alt="Sealox Precision Seals"
                  style={{
                    width: '100%',
                    height: 'auto',
                    objectFit: 'contain',
                  }}
                />
              </Box>
            </Box>
          </Grid.Col>

          {/* Right Features Box */}
          <Grid.Col span={{ base: 12, lg: 3 }} style={{ zIndex: 2, position: 'relative' }}>
            <Stack gap={18} pl={{ base: 0, lg: 20 }}>
              <FeatureItem
                icon={<IconGauge color="#50B861" size={30} stroke={1.5} />}
                title="High Pressure"
                subtitle="Upto 1000 Bar"
              />
              <FeatureItem
                icon={<IconThermometer color="#50B861" size={30} stroke={1.5} />}
                title="Temperature"
                subtitle="-200° C to 280° C"
              />
              <FeatureItem
                icon={<IconSettings color="#50B861" size={30} stroke={1.5} />}
                title="Premium Materials"
                subtitle="Global Standard"
              />
              <FeatureItem
                icon={<IconCpu color="#50B861" size={30} stroke={1.5} />}
                title="Custom Solutions"
                subtitle="Tailor Made Seals"
              />
            </Stack>
          </Grid.Col>
        </Grid>

        {/* Bottom Actions Row */}
        <Flex
          justify="space-between"
          align={{ base: 'flex-start', md: 'flex-end' }}
          mt={{ base: 36, sm: 54, md: 80 }}
          wrap="wrap"
          gap={{ base: 24, md: 36 }}
        >
          <Group gap="sm" wrap="wrap" w={{ base: '100%', md: 'auto' }}>
            <Link to="/products" style={{ textDecoration: 'none' }} className="w-full sm:w-auto">
              <Button
                variant="green"
                rightSection={<IconArrowRight size={18} />}
                className="w-full sm:w-auto"
              >
                Explore Products
              </Button>
            </Link>
            <Link to="/products" style={{ textDecoration: 'none' }} className="w-full sm:w-auto">
              <Button
                variant="white"
                leftSection={<IconSearch color="#50B861" size={18} />}
                className="w-full sm:w-auto"
              >
                Seal Finder
              </Button>
            </Link>
            <Link to="/contact" style={{ textDecoration: 'none' }} className="w-full sm:w-auto">
              <Button
                variant="white"
                leftSection={<IconHeadset color="#50B861" size={18} />}
                className="w-full sm:w-auto"
              >
                Talk to Engineer
              </Button>
            </Link>
          </Group>

          <Group gap={28} wrap="wrap">
            <MediaAction
              icon={<IconPlayerPlayFilled color="#50B861" size={22} />}
              title="Watch Video"
              subtitle="Precision Manufacturing"
            />
            <MediaAction
              icon={<IconFileDescription color="#50B861" size={22} stroke={1.5} />}
              title="Download"
              subtitle="Product Catalogue"
              href="/SEALOX CATALOG 2026 PRINT.pdf"
              download="SEALOX CATALOG 2026 PRINT.pdf"
            />
          </Group>
        </Flex>

        {/* Statistics Bar */}
        <Box
          mt={{ base: 36, md: 54 }}
          px={{ base: 16, sm: 24, lg: 36 }}
          py={{ base: 16, lg: 20 }}
          w={{ base: '100%', md: 'fit-content' }}
          style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid #E5E7EB',
            boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <SimpleGrid
            cols={{ base: 2, sm: 4 }}
            spacing={{ base: 16, sm: 28, lg: 48 }}
            style={{ alignItems: 'center' }}
          >
            <StatItem
              icon={<IconLayoutGrid color="#50B861" size={26} stroke={1.5} />}
              title="500+"
              subtitle="Standard & Custom Tooling"
            />
            <StatItem
              icon={<IconUsers color="#50B861" size={26} stroke={1.5} />}
              title="25+"
              subtitle="Global Export Markets"
            />
            <StatItem
              icon={<IconBriefcase color="#50B861" size={26} stroke={1.5} />}
              title="100%"
              subtitle="Inspection Tested"
            />
            <StatItem
              icon={
                <Text fw={800} size="md" c="#50B861" style={{ letterSpacing: '-0.5px' }}>
                  ISO
                </Text>
              }
              title="ISO 9001:2015"
              subtitle="Certified Manufacturing"
            />
          </SimpleGrid>
        </Box>
      </Container>
    </Box>
  );
}
