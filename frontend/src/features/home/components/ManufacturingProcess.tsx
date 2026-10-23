import { Box, Container, Title, Text, Image, Group } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';

interface ProcessStep {
  number: string;
  title: string;
  description: string;
  image: string;
}

const processSteps: ProcessStep[] = [
  {
    number: '01',
    title: 'Polymer Influx',
    description: 'Virgin fluoroelastomer, silicone & PTFE stock',
    image:
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=400&h=280',
  },
  {
    number: '02',
    title: 'Compound Formulation',
    description: 'Controlled rheology batching & polymer QA',
    image:
      'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&q=80&w=400&h=280',
  },
  {
    number: '03',
    title: 'Tool & Die Design',
    description: 'Micro-tolerance CNC EDM steel mould cavities',
    image:
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=400&h=280',
  },
  {
    number: '04',
    title: 'Vulcanization',
    description: 'Programmable hydraulic press tonnage curing',
    image:
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400&h=280',
  },
  {
    number: '05',
    title: 'Deflashing & Prep',
    description: 'Cryogenic flash removal & surface profiling',
    image:
      'https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&q=80&w=400&h=280',
  },
  {
    number: '06',
    title: 'Metrology Testing',
    description: 'Optical flat helium & tensile load testing',
    image:
      'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=400&h=280',
  },
  {
    number: '07',
    title: 'Clean Packaging',
    description: 'Dust-free barrier bags with batch traceability',
    image:
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=400&h=280',
  },
  {
    number: '08',
    title: 'Global Logistics',
    description: 'On-schedule dispatch with EN 10204 3.1 MTRs',
    image:
      'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=400&h=280',
  },
];

export function ManufacturingProcess() {
  return (
    <Box component="section" pt={{ base: 20, md: 32 }} pb={{ base: 36, md: 52 }} bg="white">
      <Container size="xl" px={{ base: 'md', sm: 'xl' }}>
        {/* Section Title & Mobile Scroll Hint */}
        <Group justify="space-between" align="flex-end" mb={{ base: 16, md: 28 }} wrap="wrap">
          <Title
            order={2}
            style={{
              fontSize: '1.75rem',
              fontWeight: 900,
              color: '#111827',
              letterSpacing: '-0.02em',
            }}
          >
            OUR MANUFACTURING <span style={{ color: '#50B861', fontWeight: 800 }}>PROCESS</span>
          </Title>
          <Text hiddenFrom="sm" size="xs" c="#9CA3AF" fw={500}>
            Swipe horizontally to explore stages →
          </Text>
        </Group>

        {/* Process Steps Track */}
        <Box
          className="touch-scroll"
          style={{
            overflowX: 'auto',
            paddingBottom: 12,
            WebkitOverflowScrolling: 'touch',
          }}
        >
          <Box
            style={{
              minWidth: 960,
              display: 'grid',
              gridTemplateColumns: 'repeat(8, 1fr)',
              columnGap: 20,
              alignItems: 'start',
            }}
          >
            {processSteps.map((step, index) => (
              <Box key={step.number} style={{ display: 'flex', flexDirection: 'column' }}>
                {/* Image Container with connecting arrow */}
                <Box style={{ position: 'relative', width: '100%' }}>
                  <Box
                    style={{
                      borderRadius: 6,
                      overflow: 'hidden',
                      height: 92,
                      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
                      border: '1px solid #F3F4F6',
                      backgroundColor: '#F9FAFB',
                      transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
                    }}
                  >
                    <Image src={step.image} alt={step.title} height={92} fit="cover" />
                  </Box>

                  {/* Arrow connecting to next step */}
                  {index < processSteps.length - 1 && (
                    <Box
                      style={{
                        position: 'absolute',
                        right: -18,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 4,
                        pointerEvents: 'none',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <IconArrowRight size={14} color="#D1D5DB" stroke={1.5} />
                    </Box>
                  )}
                </Box>

                {/* Timeline Line & Pill Badge */}
                <Box
                  style={{
                    position: 'relative',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 22,
                    marginBottom: 16,
                  }}
                >
                  {/* Left connecting line */}
                  {index > 0 && (
                    <Box
                      style={{
                        position: 'absolute',
                        left: -12,
                        right: '50%',
                        height: 2,
                        backgroundColor: '#E5E7EB',
                        zIndex: 1,
                      }}
                    >
                      {/* Midpoint small dot */}
                      <Box
                        style={{
                          position: 'absolute',
                          left: '20%',
                          top: -2,
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          backgroundColor: '#D1D5DB',
                        }}
                      />
                    </Box>
                  )}

                  {/* Right connecting line */}
                  {index < processSteps.length - 1 && (
                    <Box
                      style={{
                        position: 'absolute',
                        left: '50%',
                        right: -12,
                        height: 2,
                        backgroundColor: '#E5E7EB',
                        zIndex: 1,
                      }}
                    >
                      {/* Midpoint small dot */}
                      <Box
                        style={{
                          position: 'absolute',
                          right: '20%',
                          top: -2,
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          backgroundColor: '#D1D5DB',
                        }}
                      />
                    </Box>
                  )}

                  {/* Green Pill Badge */}
                  <Box
                    style={{
                      position: 'relative',
                      zIndex: 2,
                      backgroundColor: '#50B861',
                      color: '#ffffff',
                      borderRadius: 9999,
                      padding: '2px 14px',
                      fontSize: '12px',
                      fontWeight: 700,
                      lineHeight: '20px',
                      boxShadow: '0 2px 6px rgba(80, 184, 97, 0.25)',
                    }}
                  >
                    {step.number}
                  </Box>
                </Box>

                {/* Title & Subtitle */}
                <Box style={{ textAlign: 'center' }}>
                  <Text
                    fw={700}
                    c="#111827"
                    style={{
                      fontSize: '13.5px',
                      lineHeight: 1.3,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {step.title}
                  </Text>
                  <Text
                    c="#6B7280"
                    style={{
                      fontSize: '11px',
                      lineHeight: 1.35,
                      marginTop: 4,
                      maxWidth: 125,
                      marginLeft: 'auto',
                      marginRight: 'auto',
                    }}
                  >
                    {step.description}
                  </Text>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
