import { Box, Container, Title, Text, Group, Card, Image } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import { IconArrowRight } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../../api/productsApi';
import '@mantine/carousel/styles.css';

const defaultCategoryTiles = [
  {
    title: 'O-Rings',
    description: 'Versatile sealing for static & dynamic applications.',
    image: '/hero_image.png',
    slug: 'close-stock-type-elastomer-unbalanced-seal',
  },
  {
    title: 'Oil Seals',
    description: 'Prevent leakage and protect rotary components.',
    image: '/hero_image.png',
    slug: 'open-type-elastomer-unbalanced-seal',
  },
  {
    title: 'Hydraulic Seals',
    description: 'Engineered for high-pressure hydraulic systems.',
    image: '/hero_image.png',
    slug: 'close-stock-type-elastomer-unbalanced-seal',
  },
  {
    title: 'PTFE Seals',
    description: 'Chemical resistant for extreme industrial environments.',
    image: '/hero_image.png',
    slug: 'open-type-elastomer-unbalanced-seal',
  },
  {
    title: 'Custom Seals',
    description: 'Tailor-made sealing solutions as per engineering drawings.',
    image: '/hero_image.png',
    slug: 'close-stock-type-elastomer-unbalanced-seal',
  },
];

export function Products() {
  const { products: apiProducts } = useProducts();

  const displayProducts = [
    ...apiProducts.map((p) => ({
      title: p.name,
      description: p.description.length > 90 ? p.description.slice(0, 88) + '...' : p.description,
      image: p.image,
      slug: p.slug,
    })),
    ...defaultCategoryTiles.filter((tile) => !apiProducts.some((p) => p.slug === tile.slug)),
  ];

  return (
    <Box component="section" pt={{ base: 24, md: 36 }} pb={{ base: 36, md: 48 }} bg="white">
      <Container size="xl" px={{ base: 'md', sm: 'xl' }}>
        {/* Section Header */}
        <Group
          justify="space-between"
          align="center"
          mb={{ base: 20, md: 28 }}
          wrap="wrap"
          gap="xs"
        >
          <Title
            order={2}
            style={{
              fontSize: '1.75rem',
              fontWeight: 900,
              color: '#111827',
              letterSpacing: '-0.02em',
            }}
          >
            OUR <span style={{ color: '#50B861', fontWeight: 800 }}>PRODUCT RANGE</span>
          </Title>
          <Link to="/products" style={{ textDecoration: 'none' }}>
            <Group gap={6} style={{ cursor: 'pointer' }}>
              <Text c="#50B861" fw={700} size="sm">
                View All Products
              </Text>
              <IconArrowRight size={18} color="#50B861" />
            </Group>
          </Link>
        </Group>

        {/* Products Grid / Carousel */}
        <Box>
          <Carousel
            slideSize={{ base: '85%', xs: '65%', sm: '48%', md: '30%', lg: '20%', xl: '14.2857%' }}
            slideGap="md"
            withControls={false}
            styles={{
              viewport: {
                padding: '8px 0',
              },
            }}
          >
            {displayProducts.map((product) => (
              <Carousel.Slide key={product.title}>
                <Link
                  to={`/products/${product.slug}`}
                  style={{ textDecoration: 'none', display: 'block', height: '100%' }}
                >
                  <Card
                    padding="md"
                    radius="sm"
                    bg="white"
                    style={{
                      backgroundColor: '#ffffff',
                      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
                      border: '1px solid #E5E7EB',
                      height: '100%',
                      minHeight: '270px',
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer',
                      transition: 'all 0.25s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 10px 24px rgba(0, 0, 0, 0.08)';
                      e.currentTarget.style.borderColor = '#50B861';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.04)';
                      e.currentTarget.style.borderColor = '#E5E7EB';
                    }}
                  >
                    <Box
                      style={{
                        height: 110,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                      }}
                    >
                      <Image src={product.image} height={100} alt={product.title} fit="contain" />
                    </Box>
                    <Box style={{ flex: 1, marginTop: 12 }}>
                      <Text fw={700} size="sm" c="#111827" mb={4} style={{ fontSize: '15px' }}>
                        {product.title}
                      </Text>
                      <Text size="xs" c="#6B7280" lh={1.4} fw={400} style={{ fontSize: '11.5px' }}>
                        {product.description}
                      </Text>
                    </Box>
                    <Group justify="flex-end" mt="md">
                      <Box
                        w={28}
                        h={28}
                        style={{
                          borderRadius: '50%',
                          border: '1px solid #E5E7EB',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#ffffff',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#50B861';
                          e.currentTarget.style.borderColor = '#50B861';
                          const icon = e.currentTarget.querySelector('svg');
                          if (icon) (icon as unknown as HTMLElement).style.stroke = '#ffffff';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#ffffff';
                          e.currentTarget.style.borderColor = '#E5E7EB';
                          const icon = e.currentTarget.querySelector('svg');
                          if (icon) (icon as unknown as HTMLElement).style.stroke = '#50B861';
                        }}
                      >
                        <IconArrowRight size={14} stroke={2} color="#50B861" />
                      </Box>
                    </Group>
                  </Card>
                </Link>
              </Carousel.Slide>
            ))}
          </Carousel>
        </Box>
      </Container>
    </Box>
  );
}
