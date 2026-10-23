import { Box, Container, Title, Text, SimpleGrid } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

// Custom Material Icon matching the 3 overlapping green rolls/rings from Figma
function MaterialIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Top ring */}
      <circle cx="13" cy="11" r="5" stroke="#50B861" strokeWidth="2.2" />
      <circle cx="13" cy="11" r="2" fill="#50B861" />
      <path d="M10 7L17 14" stroke="#50B861" strokeWidth="1.8" strokeLinecap="round" />
      {/* Bottom-left ring */}
      <circle cx="9" cy="22" r="5" stroke="#50B861" strokeWidth="2.2" />
      <circle cx="9" cy="22" r="2" fill="#50B861" />
      <path d="M6 18L13 25" stroke="#50B861" strokeWidth="1.8" strokeLinecap="round" />
      {/* Bottom-right ring */}
      <circle cx="23" cy="22" r="5" stroke="#50B861" strokeWidth="2.2" />
      <circle cx="23" cy="22" r="2" fill="#50B861" />
      <path d="M20 18L27 25" stroke="#50B861" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

const materialsData = [
  { name: 'NBR', desc: 'High Durability' },
  { name: 'FKM (Viton)', desc: 'High Temperature' },
  { name: 'EPDM', desc: 'Weather Resistant' },
  { name: 'PTFE', desc: 'Chemical Resistant' },
  { name: 'PU', desc: 'High Wear Resistance' },
  { name: 'Silicone', desc: 'Food Grade' },
];

export function TechAndGlobal() {
  return (
    <Box component="section" pt={{ base: 20, md: 36 }} pb={{ base: 36, md: 56 }} bg="white">
      <Container size="xl" px={{ base: 'md', sm: 'xl' }}>
        <SimpleGrid
          cols={{ base: 1, lg: 2 }}
          spacing={{ base: 32, lg: 48 }}
          style={{ alignItems: 'stretch' }}
        >
          {/* LEFT COLUMN: TECHNOLOGY & MATERIAL INNOVATION */}
          <Box style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Title
              order={2}
              style={{
                fontSize: '1.75rem',
                fontWeight: 900,
                color: '#111827',
                letterSpacing: '-0.02em',
                marginBottom: 8,
              }}
            >
              TECHNOLOGY & MATERIAL{' '}
              <span style={{ color: '#50B861', fontWeight: 800 }}>INNOVATION</span>
            </Title>

            <Text c="#4B5563" size="sm" lh={1.5} mb={24}>
              Advanced materials. Superior performance.
              <br />
              Engineered for critical industrial applications.
            </Text>

            {/* 6 Material Cards Grid */}
            <SimpleGrid cols={{ base: 1, xs: 2, sm: 2, md: 3 }} spacing={12}>
              {materialsData.map((item) => (
                <Box
                  key={item.name}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: 6,
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                    padding: '14px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.07)';
                    e.currentTarget.style.borderColor = '#50B861';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
                    e.currentTarget.style.borderColor = '#E5E7EB';
                  }}
                >
                  <Box style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                    <MaterialIcon />
                  </Box>
                  <Box>
                    <Text fw={700} c="#111827" style={{ fontSize: '14px', lineHeight: 1.25 }}>
                      {item.name}
                    </Text>
                    <Text c="#6B7280" style={{ fontSize: '11px', lineHeight: 1.3, marginTop: 2 }}>
                      {item.desc}
                    </Text>
                  </Box>
                </Box>
              ))}
            </SimpleGrid>

            {/* Button: Explore Materials */}
            <Box mt="auto" pt={28}>
              <Link to="/products" style={{ textDecoration: 'none' }}>
                <Box
                  component="button"
                  type="button"
                  style={{
                    padding: '11px 24px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #E5E7EB',
                    borderRadius: 6,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    outline: 'none',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#50B861';
                    e.currentTarget.style.backgroundColor = '#F9FAFB';
                    e.currentTarget.style.boxShadow = '0 4px 14px rgba(80, 184, 97, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#E5E7EB';
                    e.currentTarget.style.backgroundColor = '#ffffff';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
                  }}
                >
                  <Text fw={700} size="sm" c="#50B861">
                    Explore Materials
                  </Text>
                  <IconArrowRight size={17} color="#50B861" stroke={2.2} />
                </Box>
              </Link>
            </Box>
          </Box>

          {/* RIGHT COLUMN: GLOBAL PRESENCE */}
          <Box style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Title
              order={2}
              style={{
                fontSize: '1.75rem',
                fontWeight: 900,
                color: '#111827',
                letterSpacing: '-0.02em',
              }}
            >
              GLOBAL <span style={{ color: '#50B861', fontWeight: 800 }}>PRESENCE</span>
            </Title>

            {/* Full Width & Height Container with Image */}
            <Box
              mih={{ base: 260, sm: 300, md: 340 }}
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                flex: 1,
                borderRadius: 8,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '20px 0',
              }}
            >
              {/* Background Image element covering full width & height */}
              <Box
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  zIndex: 1,
                  pointerEvents: 'none',
                }}
              >
                <img
                  src="/global_presence.png"
                  alt="Global Presence"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center right',
                    display: 'block',
                  }}
                />
              </Box>

              {/* Content overlay at bottom left */}
              <Box style={{ maxWidth: 270, position: 'relative', zIndex: 2 }}>
                <Text
                  fw={700}
                  c="#111827"
                  style={{
                    fontSize: '15px',
                    lineHeight: 1.4,
                    marginBottom: 16,
                  }}
                >
                  Delivering sealing solutions
                  <br />
                  across the globe.
                </Text>

                <Link to="/contact" style={{ textDecoration: 'none' }}>
                  <Box
                    component="button"
                    type="button"
                    style={{
                      padding: '11px 24px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #E5E7EB',
                      borderRadius: 6,
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      outline: 'none',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#50B861';
                      e.currentTarget.style.backgroundColor = '#F9FAFB';
                      e.currentTarget.style.boxShadow = '0 4px 14px rgba(80, 184, 97, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#E5E7EB';
                      e.currentTarget.style.backgroundColor = '#ffffff';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
                    }}
                  >
                    <Text fw={700} size="sm" c="#50B861">
                      Our Global Network
                    </Text>
                    <IconArrowRight size={17} color="#50B861" stroke={2.2} />
                  </Box>
                </Link>
              </Box>
            </Box>
          </Box>
        </SimpleGrid>
      </Container>
    </Box>
  );
}
