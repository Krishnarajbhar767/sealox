import { Box, Container, Title, Text, SimpleGrid, Grid } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

// Custom SVG matching the double-sheet document icon with avatar badge from Figma
function ResourceDocIcon() {
  return (
    <svg width="38" height="44" viewBox="0 0 38 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Back sheet */}
      <rect
        x="3"
        y="2"
        width="26"
        height="36"
        rx="4"
        stroke="#50B861"
        strokeWidth="1.6"
        opacity="0.5"
      />
      {/* Front sheet */}
      <rect
        x="8"
        y="6"
        width="26"
        height="36"
        rx="4"
        fill="#ffffff"
        stroke="#50B861"
        strokeWidth="1.8"
      />
      {/* Profile Avatar */}
      <circle cx="21" cy="16" r="3.2" stroke="#50B861" strokeWidth="1.6" />
      <path
        d="M15 25C15 22.5 17.5 21 21 21C24.5 21 27 22.5 27 25"
        stroke="#50B861"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {/* Document Lines */}
      <path d="M14 29H28" stroke="#50B861" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M14 33H28" stroke="#50B861" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M14 37H23" stroke="#50B861" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const resourcesData = [
  {
    title: 'Technical Articles',
    description: 'Industry insights & best practices',
  },
  {
    title: 'CAD Downloads',
    description: '3D Models & 2D Drawings',
  },
  {
    title: 'Datasheets',
    description: 'Product & Material Datasheets',
    downloadUrl: '/SEALOX CATALOG 2026 PRINT.pdf',
  },
  {
    title: 'Installation Guides',
    description: 'Step-by-step Installation',
  },
  {
    title: 'Video Tutorials',
    description: 'Learn from experts',
  },
  {
    title: 'FAQs',
    description: 'Answers to common questions',
  },
];

export function ResourcesAndCta() {
  return (
    <Box component="section" pt={{ base: 20, md: 32 }} pb={{ base: 36, md: 56 }} bg="white">
      <Container size="xl" px={{ base: 'md', sm: 'xl' }}>
        <Grid gap={{ base: 32, lg: 36 }} align="center">
          {/* LEFT COLUMN: TECHNOLOGY RESOURCES HUB (6 Cards) */}
          <Grid.Col span={{ base: 12, lg: 8.5 }}>
            <Title
              order={2}
              mb={{ base: 16, md: 22 }}
              style={{
                fontSize: '1.75rem',
                fontWeight: 900,
                color: '#111827',
                letterSpacing: '-0.02em',
              }}
            >
              TECHNOLOGY <span style={{ color: '#50B861', fontWeight: 800 }}>RESOURCES HUB</span>
            </Title>

            <SimpleGrid cols={{ base: 1, xs: 2, sm: 3, md: 6 }} spacing={12}>
              {resourcesData.map((resource) => (
                <Box
                  component={resource.downloadUrl ? 'a' : 'div'}
                  href={resource.downloadUrl}
                  download={resource.downloadUrl ? 'SEALOX CATALOG 2026 PRINT.pdf' : undefined}
                  key={resource.title}
                  style={{
                    textDecoration: 'none',
                    color: 'inherit',
                    backgroundColor: '#ffffff',
                    borderRadius: 8,
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                    padding: '18px 10px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    minHeight: 165,
                  }}
                  onMouseEnter={(e: React.MouseEvent<HTMLElement>) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.07)';
                    e.currentTarget.style.borderColor = '#50B861';
                  }}
                  onMouseLeave={(e: React.MouseEvent<HTMLElement>) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
                    e.currentTarget.style.borderColor = '#E5E7EB';
                  }}
                >
                  {/* Icon */}
                  <Box style={{ marginBottom: 14 }}>
                    <ResourceDocIcon />
                  </Box>

                  {/* Title */}
                  <Text
                    fw={700}
                    c="#111827"
                    style={{
                      fontSize: '13px',
                      lineHeight: 1.25,
                      marginBottom: 6,
                    }}
                  >
                    {resource.title}
                  </Text>

                  {/* Description */}
                  <Text
                    c="#6B7280"
                    style={{
                      fontSize: '10.5px',
                      lineHeight: 1.35,
                    }}
                  >
                    {resource.description}
                  </Text>
                </Box>
              ))}
            </SimpleGrid>
          </Grid.Col>

          {/* RIGHT COLUMN: NEED AN ENGINEERING SOLUTION? */}
          <Grid.Col span={{ base: 12, lg: 3.5 }}>
            <Box pl={{ base: 0, lg: 8 }}>
              <Title
                order={2}
                style={{
                  fontSize: '1.45rem',
                  fontWeight: 900,
                  color: '#111827',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2,
                }}
              >
                NEED AN ENGINEERING
                <br />
                <span style={{ color: '#50B861', fontWeight: 800 }}>SOLUTION?</span>
              </Title>

              <Text c="#4B5563" size="sm" lh={1.45} mt={14} mb={22} style={{ maxWidth: 300 }}>
                Technical consultation for custom seal face pairings, fluid compatibility, and
                DIN/ISO dimensional standards.
              </Text>

              <Box
                component={Link}
                to="/contact"
                style={{
                  padding: '13px 26px',
                  background: 'linear-gradient(135deg, #155C48 0%, #439951 100%)',
                  border: 'none',
                  borderRadius: 6,
                  boxShadow: '0 4px 14px rgba(21, 92, 72, 0.22)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  outline: 'none',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(21, 92, 72, 0.35)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(21, 92, 72, 0.25)';
                }}
              >
                <Text fw={700} size="sm" c="#ffffff">
                  Talk to an Engineer
                </Text>
                <IconArrowRight size={18} color="#ffffff" stroke={2.2} />
              </Box>
            </Box>
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  );
}
