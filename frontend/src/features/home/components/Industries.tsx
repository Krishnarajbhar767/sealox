import { Box, Container, Title, Text, Group, Card, Image } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import { IconArrowRight } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import '@mantine/carousel/styles.css';

const industriesData = [
  { title: 'Automotive', image: '/industry/automobile.png' },
  { title: 'Oil & Gas', image: '/industry/oil.png' },
  { title: 'Chemical', image: '/industry/chemical.png' },
  { title: 'Marine', image: '/industry/marine.png' },
  { title: 'Aerospace', image: '/industry/airospace.png' },
  { title: 'Pharmaceutical', image: '/industry/pharmacitical.png' },
  { title: 'Power Plant', image: '/industry/power_plant.png' },
  { title: 'Mining', image: '/industry/mining.png' },
];

export function Industries() {
  return (
    <Box component="section" pt={{ base: 20, md: 30 }} pb={{ base: 36, md: 60 }} bg="white">
      <Container size="xl" px={{ base: 'md', sm: 'xl' }}>
        {/* Section Header */}
        <Group
          justify="space-between"
          align="center"
          mb={{ base: 20, md: 32 }}
          wrap="wrap"
          gap="xs"
        >
          <Title order={2} style={{ fontSize: '1.8rem', fontWeight: 900, color: '#111827' }}>
            INDUSTRIES <span style={{ color: '#50B861', fontWeight: 700 }}>WE SERVE</span>
          </Title>
          <Link to="/about" style={{ textDecoration: 'none' }}>
            <Group gap={8} style={{ cursor: 'pointer' }}>
              <Text c="#50B861" fw={700} size="sm">
                View All Industries
              </Text>
              <IconArrowRight size={18} color="#50B861" />
            </Group>
          </Link>
        </Group>

        {/* Carousel */}
        <Box>
          <Carousel
            slideSize={{
              base: '85%',
              xs: '65%',
              sm: '48%',
              md: '25%',
              lg: '16.666667%',
              xl: '12.5%',
            }}
            slideGap="md"
            controlSize={38}
            styles={{
              control: {
                backgroundColor: 'white',
                color: '#50B861',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                border: '1px solid #F3F4F6',
                opacity: 1,
              },
              viewport: {
                padding: '10px 0',
              },
            }}
          >
            {industriesData.map((industry) => (
              <Carousel.Slide key={industry.title}>
                <Card
                  padding="none"
                  radius="sm"
                  bg="white"
                  style={{
                    backgroundColor: '#ffffff',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                    border: '1px solid #F3F4F6',
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)';
                  }}
                >
                  <Image
                    src={industry.image}
                    height={180}
                    alt={industry.title}
                    style={{ borderBottom: '1px solid #F3F4F6' }}
                  />
                  <Box py="sm" px="xs" style={{ textAlign: 'center', backgroundColor: 'white' }}>
                    <Text fw={700} size="sm" c="#111827">
                      {industry.title}
                    </Text>
                  </Box>
                </Card>
              </Carousel.Slide>
            ))}
          </Carousel>
        </Box>
      </Container>
    </Box>
  );
}
