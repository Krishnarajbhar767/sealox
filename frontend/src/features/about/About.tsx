import {
  Box,
  Container,
  Title,
  Text,
  SimpleGrid,
  Grid,
  Group,
  ThemeIcon,
  Image,
} from '@mantine/core';
import {
  IconTarget,
  IconEye,
  IconHeartHandshake,
  IconCpu,
  IconFlask,
  IconSettings,
  IconCheckupList,
  IconCertificate,
  IconShieldCheck,
  IconCheck,
  IconDownload,
  IconHeadset,
  IconChevronRight,
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';

function SectionBadge({ label }: Readonly<{ label: string }>) {
  return (
    <Box
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 10px',
        borderRadius: 4,
        backgroundColor: '#EEF8F0',
        border: '1px solid #D3EED9',
        marginBottom: 12,
      }}
    >
      <Box
        w={5}
        h={5}
        style={{
          borderRadius: '50%',
          backgroundColor: '#50B861',
          flexShrink: 0,
        }}
      />
      <Text
        c="#155C48"
        size="xs"
        fw={700}
        tt="uppercase"
        style={{
          letterSpacing: '0.06em',
          fontSize: '11px',
          lineHeight: 1,
        }}
      >
        {label}
      </Text>
    </Box>
  );
}

function PageBreadcrumbs({ current }: { current: string }) {
  return (
    <Group gap={8} mb={{ base: 16, sm: 20 }}>
      <Link
        to="/"
        style={{
          textDecoration: 'none',
          color: '#6B7280',
          fontSize: '12.5px',
          fontWeight: 500,
          transition: 'color 0.15s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#50B861')}
        onMouseLeave={(e) => (e.currentTarget.style.color = '#6B7280')}
      >
        Home
      </Link>
      <IconChevronRight size={12} color="#9CA3AF" />
      <Text c="#155C48" fw={600} size="xs" style={{ fontSize: '12.5px' }}>
        {current}
      </Text>
    </Group>
  );
}

export function About() {
  return (
    <Box bg="#FFFFFF" style={{ overflow: 'hidden' }}>
      {/* 1. HERO & QUICK STATS */}
      <Box
        component="section"
        pt={{ base: 36, sm: 48, md: 64 }}
        pb={{ base: 40, sm: 52, md: 68 }}
        style={{
          background: 'linear-gradient(180deg, #F9FAFB 0%, #FFFFFF 100%)',
          borderBottom: '1px solid #F3F4F6',
        }}
      >
        <Container size="xl" px={{ base: 'md', sm: 'xl' }}>
          <PageBreadcrumbs current="About Us" />

          <Grid gap={{ base: 32, lg: 48 }} align="center">
            <Grid.Col span={{ base: 12, lg: 7 }}>
              <SectionBadge label="About Sealox" />

              <Title
                order={1}
                style={{
                  fontSize: 'clamp(2rem, 3.6vw, 2.75rem)',
                  fontWeight: 800,
                  color: '#111827',
                  lineHeight: 1.18,
                  letterSpacing: '-0.025em',
                  marginBottom: 16,
                }}
              >
                Pioneering Precision <span style={{ color: '#50B861' }}>Sealing Solutions</span> for
                Critical Industries
              </Title>

              <Text
                c="#4B5563"
                size="sm"
                lh={1.6}
                mb={32}
                style={{ fontSize: '14px', maxWidth: 580 }}
              >
                Sealox Engineering designs and manufactures high-performance industrial seals,
                gaskets, and customized elastomer components capable of withstanding extreme
                pressures, corrosive chemicals, and severe temperatures.
              </Text>

              {/* Stat Pills */}
              <SimpleGrid cols={{ base: 2, sm: 4 }} spacing={14}>
                {[
                  { number: '100%', label: 'Quality Tested' },
                  { number: '500+', label: 'Engineered Profiles' },
                  { number: '1000+', label: 'Global Clients' },
                  { number: 'ISO', label: 'Certified Quality' },
                ].map((stat) => (
                  <Box
                    key={stat.label}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: 8,
                      border: '1px solid #E5E7EB',
                      padding: '16px 14px',
                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)',
                    }}
                  >
                    <Text fw={800} c="#50B861" style={{ fontSize: '24px', lineHeight: 1 }}>
                      {stat.number}
                    </Text>
                    <Text c="#6B7280" fw={600} size="xs" mt={6} style={{ fontSize: '12px' }}>
                      {stat.label}
                    </Text>
                  </Box>
                ))}
              </SimpleGrid>
            </Grid.Col>

            <Grid.Col span={{ base: 12, lg: 5 }}>
              <Box
                style={{
                  position: 'relative',
                  borderRadius: 8,
                  overflow: 'hidden',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
                  border: '1px solid #E5E7EB',
                }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800&h=600"
                  alt="Sealox Advanced Facility"
                  h={{ base: 220, sm: 280, md: 360 }}
                  fit="cover"
                />
                <Box
                  style={{
                    position: 'absolute',
                    bottom: 12,
                    left: 12,
                    right: 12,
                    backgroundColor: 'rgba(255, 255, 255, 0.96)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: 6,
                    padding: '10px 14px',
                    border: '1px solid rgba(229, 231, 235, 0.9)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box>
                    <Text fw={700} size="sm" c="#111827" style={{ fontSize: '13px' }}>
                      Automated Tooling Cell
                    </Text>
                    <Text size="xs" c="#6B7280" style={{ fontSize: '11px', marginTop: 2 }}>
                      Precision ±0.01 mm tolerance standard
                    </Text>
                  </Box>
                  <ThemeIcon radius="sm" size={28} style={{ backgroundColor: '#50B861' }}>
                    <IconShieldCheck size={15} color="#FFFFFF" />
                  </ThemeIcon>
                </Box>
              </Box>
            </Grid.Col>
          </Grid>
        </Container>
      </Box>

      {/* 2. OUR STORY & HERITAGE */}
      <Box component="section" py={{ base: 48, sm: 60, md: 72 }}>
        <Container size="xl" px={{ base: 'md', sm: 'xl' }}>
          <Grid gap={{ base: 32, lg: 48 }} align="center">
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <Box
                style={{
                  borderRadius: 8,
                  overflow: 'hidden',
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 6px 18px rgba(0, 0, 0, 0.04)',
                }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800&h=600"
                  alt="Precision Engineering Tooling"
                  h={{ base: 220, sm: 280, md: 340 }}
                  fit="cover"
                />
              </Box>
            </Grid.Col>

            <Grid.Col span={{ base: 12, lg: 6 }}>
              <SectionBadge label="Our Heritage" />

              <Title
                order={2}
                style={{
                  fontSize: 'clamp(1.6rem, 2.4vw, 2rem)',
                  fontWeight: 800,
                  color: '#111827',
                  letterSpacing: '-0.02em',
                  marginBottom: 16,
                }}
              >
                Engineered to Eliminate Downtime Across Harsh Environments
              </Title>

              <Text c="#4B5563" size="sm" lh={1.6} mb={14} style={{ fontSize: '14px' }}>
                Founded with an unwavering commitment to eliminate industrial downtime caused by
                joint failures, Sealox Engineering has grown into a leading technology-driven
                partner for critical sealing applications worldwide.
              </Text>

              <Text c="#4B5563" size="sm" lh={1.6} mb={24} style={{ fontSize: '14px' }}>
                By combining deep expertise in polymer formulation with modern 5-axis CNC mold
                manufacturing, we develop custom sealing geometries that outperform conventional
                solutions under high velocity, intense pressures, and aggressive media.
              </Text>

              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing={14}>
                {[
                  'Zero Leakage Philosophy',
                  'Proprietary Rubber Compounds',
                  '100% In-house Tooling',
                  'Fast-track Prototyping',
                ].map((item) => (
                  <Group key={item} gap={10} wrap="nowrap">
                    <ThemeIcon size={20} radius="sm" style={{ backgroundColor: '#EEF8F0' }}>
                      <IconCheck size={12} color="#50B861" stroke={3} />
                    </ThemeIcon>
                    <Text fw={600} size="xs" c="#111827" style={{ fontSize: '13px' }}>
                      {item}
                    </Text>
                  </Group>
                ))}
              </SimpleGrid>
            </Grid.Col>
          </Grid>
        </Container>
      </Box>

      {/* 3. MISSION, VISION & CORE VALUES */}
      <Box component="section" py={{ base: 48, sm: 60, md: 72 }} bg="#F9FAFB">
        <Container size="xl" px={{ base: 'md', sm: 'xl' }}>
          <Box style={{ textAlign: 'center', maxWidth: 620, margin: '0 auto 36px' }}>
            <SectionBadge label="Core Principles" />
            <Title
              order={2}
              style={{
                fontSize: 'clamp(1.6rem, 2.4vw, 2rem)',
                fontWeight: 800,
                color: '#111827',
                letterSpacing: '-0.02em',
                marginBottom: 10,
              }}
            >
              Guiding Principles Behind Every Seal We Mold
            </Title>
            <Text c="#6B7280" size="xs" lh={1.6} style={{ fontSize: '14px' }}>
              Guided by strong principles of engineering excellence and customer success across
              every seal we manufacture.
            </Text>
          </Box>

          <SimpleGrid cols={{ base: 1, md: 3 }} spacing={{ base: 16, sm: 20, md: 24 }}>
            {[
              {
                icon: <IconTarget size={22} color="#50B861" />,
                title: 'Our Mission',
                description:
                  'To deliver leak-free, high-reliability sealing solutions engineered for the most rigorous mechanical, chemical, and thermal operating environments.',
              },
              {
                icon: <IconEye size={22} color="#50B861" />,
                title: 'Our Vision',
                description:
                  'To set the global benchmark for technical innovation in custom elastomer and thermoplastic engineering, driving safety and efficiency.',
              },
              {
                icon: <IconHeartHandshake size={22} color="#50B861" />,
                title: 'Our Core Values',
                description:
                  'Relentless quality standards, transparent engineering collaboration, integrity in every batch, and continuous technological investment.',
              },
            ].map((card) => (
              <Box
                key={card.title}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 8,
                  border: '1px solid #E5E7EB',
                  padding: '24px 20px',
                  boxShadow: '0 1px 4px rgba(0, 0, 0, 0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 18px rgba(80, 184, 97, 0.08)';
                  e.currentTarget.style.borderColor = '#50B861';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 4px rgba(0, 0, 0, 0.03)';
                  e.currentTarget.style.borderColor = '#E5E7EB';
                }}
              >
                <Box
                  w={40}
                  h={40}
                  mb={14}
                  style={{
                    borderRadius: 6,
                    backgroundColor: '#EEF8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {card.icon}
                </Box>
                <Text fw={700} c="#111827" mb={8} style={{ fontSize: '16px' }}>
                  {card.title}
                </Text>
                <Text c="#4B5563" size="xs" lh={1.6} style={{ fontSize: '13px' }}>
                  {card.description}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* 4. ENGINEERING CAPABILITIES */}
      <Box component="section" py={{ base: 48, sm: 60, md: 72 }}>
        <Container size="xl" px={{ base: 'md', sm: 'xl' }}>
          <Box mb={{ base: 24, md: 36 }}>
            <SectionBadge label="Engineering Capabilities" />
            <Title
              order={2}
              style={{
                fontSize: 'clamp(1.6rem, 2.4vw, 2rem)',
                fontWeight: 800,
                color: '#111827',
                letterSpacing: '-0.02em',
              }}
            >
              Comprehensive Tooling, Compounding & Testing
            </Title>
          </Box>

          <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing={{ base: 16, sm: 20, md: 24 }}>
            {[
              {
                icon: <IconCpu size={20} color="#50B861" />,
                title: 'Precision Tooling',
                desc: 'High-speed 5-axis CNC machining, wire EDM cutting, and mirror-finish tool polishing for tight tolerances.',
              },
              {
                icon: <IconFlask size={20} color="#50B861" />,
                title: 'Polymer Formulation',
                desc: 'Custom compounding of FKM (Viton), PTFE, NBR, EPDM, Silicone, and PU to match exact media resistance.',
              },
              {
                icon: <IconSettings size={20} color="#50B861" />,
                title: 'Compression & Injection',
                desc: 'Advanced hydraulic vacuum molding presses preventing micro-porosity and ensuring homogeneous density.',
              },
              {
                icon: <IconCheckupList size={20} color="#50B861" />,
                title: 'Rigorous Testing',
                desc: 'Tensile endurance, cryogenic testing, laser optical measurement, and accelerated heat aging verification.',
              },
            ].map((cap) => (
              <Box
                key={cap.title}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 8,
                  border: '1px solid #E5E7EB',
                  padding: '22px 18px',
                  boxShadow: '0 1px 4px rgba(0, 0, 0, 0.03)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.borderColor = '#50B861';
                  e.currentTarget.style.boxShadow = '0 6px 18px rgba(80, 184, 97, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#E5E7EB';
                  e.currentTarget.style.boxShadow = '0 1px 4px rgba(0, 0, 0, 0.03)';
                }}
              >
                <Box
                  w={38}
                  h={38}
                  mb={12}
                  style={{
                    borderRadius: 6,
                    backgroundColor: '#EEF8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {cap.icon}
                </Box>
                <Text fw={700} c="#111827" mb={6} style={{ fontSize: '15px' }}>
                  {cap.title}
                </Text>
                <Text c="#6B7280" size="xs" lh={1.5} style={{ fontSize: '12.5px' }}>
                  {cap.desc}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* 5. QUALITY ASSURANCE & CERTIFICATIONS */}
      <Box component="section" py={{ base: 48, sm: 60, md: 72 }} bg="#F9FAFB">
        <Container size="xl" px={{ base: 'md', sm: 'xl' }}>
          <Grid gap={{ base: 32, lg: 48 }} align="center">
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <SectionBadge label="Quality Assurance" />

              <Title
                order={2}
                style={{
                  fontSize: 'clamp(1.6rem, 2.4vw, 2rem)',
                  fontWeight: 800,
                  color: '#111827',
                  letterSpacing: '-0.02em',
                  marginBottom: 14,
                }}
              >
                Certified Traceability & Zero-Tolerance Testing
              </Title>
              <Text c="#4B5563" size="sm" lh={1.6} mb={22} style={{ fontSize: '14px' }}>
                Every batch produced at Sealox undergoes systematic dimensional inspection and
                physical property testing. We adhere strictly to international standards, providing
                full batch traceability from polymer raw material to final packaging.
              </Text>

              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing={14}>
                {[
                  {
                    title: 'ISO Certified',
                    sub: 'Standard Quality Management System',
                  },
                  {
                    title: '100% Inspection',
                    sub: 'Automated optical and laser dimensional checks',
                  },
                  {
                    title: 'RoHS & REACH',
                    sub: 'Eco-compliant global standard materials',
                  },
                  {
                    title: 'Batch Traceability',
                    sub: 'Full certificate of compliance with every lot',
                  },
                ].map((cert) => (
                  <Box
                    key={cert.title}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: 6,
                      border: '1px solid #E5E7EB',
                      padding: '14px 16px',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
                    }}
                  >
                    <Group gap={8} mb={4}>
                      <IconCertificate size={17} color="#50B861" />
                      <Text fw={700} c="#111827" style={{ fontSize: '13px' }}>
                        {cert.title}
                      </Text>
                    </Group>
                    <Text c="#6B7280" size="xs" lh={1.4} style={{ fontSize: '11px' }}>
                      {cert.sub}
                    </Text>
                  </Box>
                ))}
              </SimpleGrid>
            </Grid.Col>

            <Grid.Col span={{ base: 12, lg: 6 }}>
              <Box
                style={{
                  borderRadius: 8,
                  overflow: 'hidden',
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 6px 18px rgba(0, 0, 0, 0.04)',
                }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&q=80&w=800&h=600"
                  alt="Sealox Quality Inspection Laboratory"
                  h={{ base: 220, sm: 280, md: 340 }}
                  fit="cover"
                />
              </Box>
            </Grid.Col>
          </Grid>
        </Container>
      </Box>

      {/* 6. CTA BANNER & CATALOG DOWNLOAD */}
      <Box component="section" py={{ base: 40, sm: 52, md: 64 }}>
        <Container size="xl" px={{ base: 'md', sm: 'xl' }}>
          <Box
            p={{ base: '24px 18px', sm: '32px 24px', md: '36px 32px' }}
            style={{
              background: 'linear-gradient(135deg, #155C48 0%, #285C31 50%, #439951 100%)',
              borderRadius: 8,
              color: '#FFFFFF',
              boxShadow: '0 8px 24px rgba(21, 92, 72, 0.18)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Grid gap={28} align="center">
              <Grid.Col span={{ base: 12, md: 8 }}>
                <Title
                  order={2}
                  style={{
                    fontSize: 'clamp(1.35rem, 2.5vw, 1.85rem)',
                    fontWeight: 800,
                    letterSpacing: '-0.02em',
                    marginBottom: 10,
                    color: '#FFFFFF',
                    lineHeight: 1.25,
                  }}
                >
                  Need a Custom Sealing Solution for Your Application?
                </Title>
                <Text
                  size="sm"
                  style={{ color: 'rgba(255, 255, 255, 0.88)', maxWidth: 580, fontSize: '14px' }}
                  lh={1.6}
                >
                  Speak directly with our technical team to discuss material compatibility, CAD
                  dimensions, or request a custom mold quote.
                </Text>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 4 }}>
                <Group justify="flex-start" gap={12} className="md:justify-end" wrap="wrap">
                  <Box
                    component={Link}
                    to="/contact"
                    style={{
                      padding: '11px 22px',
                      backgroundColor: '#FFFFFF',
                      color: '#155C48',
                      borderRadius: 6,
                      fontWeight: 700,
                      fontSize: '13.5px',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      textDecoration: 'none',
                      boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08)',
                      transition: 'transform 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                  >
                    <IconHeadset size={17} color="#155C48" />
                    Talk to Engineer
                  </Box>

                  <Box
                    component="a"
                    href="/SEALOX CATALOG 2026 PRINT.pdf"
                    download="SEALOX CATALOG 2026 PRINT.pdf"
                    style={{
                      padding: '11px 22px',
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                      color: '#FFFFFF',
                      borderRadius: 6,
                      fontWeight: 700,
                      fontSize: '13.5px',
                      border: '1px solid rgba(255, 255, 255, 0.35)',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      textDecoration: 'none',
                      transition: 'background-color 0.2s ease',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)')
                    }
                  >
                    <IconDownload size={17} color="#FFFFFF" />
                    Catalogue
                  </Box>
                </Group>
              </Grid.Col>
            </Grid>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
