import { useState } from 'react';
import {
  Box,
  Container,
  Title,
  Text,
  SimpleGrid,
  Grid,
  Group,
  TextInput,
  Textarea,
  Select,
  Accordion,
  ThemeIcon,
  Image,
  Alert,
  Loader,
} from '@mantine/core';
import {
  IconMail,
  IconPhone,
  IconMapPin,
  IconCheck,
  IconClock,
  IconShieldLock,
  IconDownload,
  IconChevronRight,
  IconBuildingFactory2,
  IconHelpCircle,
  IconFileText,
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';

function SectionBadge({ label }: { label: string }) {
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

const inputStyles = {
  input: {
    borderRadius: 6,
    borderColor: '#E5E7EB',
    fontSize: '13.5px',
    '&:focus': {
      borderColor: '#50B861',
    },
  },
  label: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#374151',
    marginBottom: 5,
  },
};

export function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    company: '',
    email: '',
    phone: '',
    industry: '',
    sealType: '',
    operatingConditions: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('https://formsubmit.co/ajax/salessealox@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          'Full Name': formData.fullName,
          'Company Name': formData.company,
          'Work Email': formData.email,
          'Phone Number': formData.phone,
          'Target Industry': formData.industry,
          'Seal Type / Profile': formData.sealType,
          'Operating Conditions': formData.operatingConditions || 'N/A',
          'Project Requirements': formData.message,
          _subject: `New Engineering RFQ: ${formData.fullName} - ${formData.company}`,
          _template: 'table',
          _captcha: 'false',
        }),
      });

      const data = await response.json();

      if (
        response.ok &&
        (data.success === 'true' || data.success === true || response.status === 200)
      ) {
        setSubmitted(true);
      } else {
        setError(
          data.message ||
            'Unable to submit at this time. Please email us directly at salessealox@gmail.com',
        );
      }
    } catch {
      setError(
        'Network connection issue. Please contact us directly at salessealox@gmail.com or +91 96649 88493.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box bg="#FFFFFF" style={{ overflow: 'hidden' }}>
      {/* 1. HERO HEADER & BREADCRUMBS */}
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
          <PageBreadcrumbs current="Contact Us" />

          <Box style={{ maxWidth: 760 }}>
            <SectionBadge label="Direct Communication" />

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
              Connect Directly with Our{' '}
              <span style={{ color: '#50B861' }}>Engineering Specialists</span>
            </Title>

            <Text c="#4B5563" size="sm" lh={1.6} style={{ fontSize: '14px' }}>
              Whether you need custom tooling drawings, high-temperature material formulations, or a
              standard profile quote, our technical specialists are ready to collaborate directly
              with your engineering group.
            </Text>
          </Box>
        </Container>
      </Box>

      {/* 2. DIRECT CONTACT CHANNELS (3-CARD GRID) */}
      <Box component="section" py={{ base: 48, sm: 60, md: 72 }}>
        <Container size="xl" px={{ base: 'md', sm: 'xl' }}>
          <Box mb={{ base: 24, md: 36 }}>
            <SectionBadge label="Direct Channels" />
            <Title
              order={2}
              style={{
                fontSize: 'clamp(1.6rem, 2.4vw, 2rem)',
                fontWeight: 800,
                color: '#111827',
                letterSpacing: '-0.02em',
              }}
            >
              Fast Technical Assistance & Quotes
            </Title>
          </Box>

          <SimpleGrid cols={{ base: 1, md: 3 }} spacing={{ base: 16, sm: 20, md: 24 }}>
            {/* Channel 1: Technical Sales */}
            <Box
              p={{ base: 20, sm: 24 }}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 8,
                border: '1px solid #E5E7EB',
                boxShadow: '0 1px 4px rgba(0, 0, 0, 0.03)',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
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
              <Box>
                <Box
                  w={42}
                  h={42}
                  mb={14}
                  style={{
                    borderRadius: 6,
                    backgroundColor: '#EEF8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <IconMail size={22} color="#50B861" />
                </Box>
                <Text fw={700} c="#111827" mb={4} style={{ fontSize: '16px' }}>
                  Technical Inquiries & Quotes
                </Text>
                <Text c="#6B7280" size="xs" lh={1.5} mb={14} style={{ fontSize: '12.5px' }}>
                  For RFQs, CAD models, and technical specifications:
                </Text>
                <a href="mailto:salessealox@gmail.com" style={{ textDecoration: 'none' }}>
                  <Text
                    fw={700}
                    c="#50B861"
                    style={{
                      fontSize: '14px',
                      wordBreak: 'break-all',
                      transition: 'opacity 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                  >
                    salessealox@gmail.com
                  </Text>
                </a>
              </Box>
              <Group gap={6} mt={16}>
                <IconClock size={14} color="#9CA3AF" />
                <Text size="xs" c="#6B7280" style={{ fontSize: '11.5px' }}>
                  Response within 24 business hours
                </Text>
              </Group>
            </Box>

            {/* Channel 2: Phone */}
            <Box
              p={{ base: 20, sm: 24 }}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 8,
                border: '1px solid #E5E7EB',
                boxShadow: '0 1px 4px rgba(0, 0, 0, 0.03)',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
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
              <Box>
                <Box
                  w={42}
                  h={42}
                  mb={14}
                  style={{
                    borderRadius: 6,
                    backgroundColor: '#EEF8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <IconPhone size={22} color="#50B861" />
                </Box>
                <Text fw={700} c="#111827" mb={4} style={{ fontSize: '16px' }}>
                  Direct Phone Consultation
                </Text>
                <Text c="#6B7280" size="xs" lh={1.5} mb={14} style={{ fontSize: '12.5px' }}>
                  Talk directly to an engineering representative:
                </Text>
                <a href="tel:+919664988493" style={{ textDecoration: 'none' }}>
                  <Text
                    fw={700}
                    c="#50B861"
                    style={{
                      fontSize: '14px',
                      transition: 'opacity 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                  >
                    +91 96649 88493
                  </Text>
                </a>
              </Box>
              <Group gap={6} mt={16}>
                <IconClock size={14} color="#9CA3AF" />
                <Text size="xs" c="#6B7280" style={{ fontSize: '11.5px' }}>
                  Mon – Fri: 8:30 AM – 6:00 PM IST
                </Text>
              </Group>
            </Box>

            {/* Channel 3: Headquarters */}
            <Box
              p={{ base: 20, sm: 24 }}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 8,
                border: '1px solid #E5E7EB',
                boxShadow: '0 1px 4px rgba(0, 0, 0, 0.03)',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
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
              <Box>
                <Box
                  w={42}
                  h={42}
                  mb={14}
                  style={{
                    borderRadius: 6,
                    backgroundColor: '#EEF8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <IconMapPin size={22} color="#50B861" />
                </Box>
                <Text fw={700} c="#111827" mb={4} style={{ fontSize: '16px' }}>
                  Manufacturing Headquarters
                </Text>
                <Text c="#6B7280" size="xs" lh={1.5} mb={14} style={{ fontSize: '12.5px' }}>
                  Tooling, compression molding & quality lab:
                </Text>
                <Text fw={600} c="#111827" style={{ fontSize: '13px', lineHeight: 1.5 }}>
                  Gala No. 39, Real Estate Commercial Complex, Rajosana Approach Road, Chappi,
                  Gujarat, 385210
                </Text>
              </Box>
              <Group gap={6} mt={16}>
                <IconBuildingFactory2 size={14} color="#9CA3AF" />
                <Text size="xs" c="#6B7280" style={{ fontSize: '11.5px' }}>
                  Plant visits by appointment
                </Text>
              </Group>
            </Box>
          </SimpleGrid>
        </Container>
      </Box>

      {/* 3. SPLIT SECTION: ENGINEERING RFQ FORM & VALUE PROPOSITION */}
      <Box component="section" py={{ base: 48, sm: 60, md: 72 }} bg="#F9FAFB">
        <Container size="xl" px={{ base: 'md', sm: 'xl' }}>
          <Grid gap={{ base: 32, lg: 48 }} align="start">
            {/* LEFT COLUMN: RFQ FORM */}
            <Grid.Col span={{ base: 12, lg: 7 }}>
              <Box
                p={{ base: 20, sm: 28, md: 36 }}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 8,
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
                }}
              >
                <SectionBadge label="Request a Quote" />
                <Title
                  order={2}
                  style={{
                    fontSize: 'clamp(1.5rem, 2.2vw, 1.85rem)',
                    fontWeight: 800,
                    color: '#111827',
                    letterSpacing: '-0.02em',
                    marginBottom: 8,
                  }}
                >
                  Request an Engineering Quote
                </Title>
                <Text c="#6B7280" size="xs" lh={1.5} mb={28} style={{ fontSize: '13.5px' }}>
                  Fill out your application parameters and our polymer specialists will review
                  compatibility and provide a custom assessment.
                </Text>

                {submitted ? (
                  <Box>
                    <Alert
                      color="green"
                      radius="sm"
                      icon={<IconCheck size={20} />}
                      title="Engineering RFQ Received!"
                      style={{
                        backgroundColor: '#EEF8F0',
                        border: '1px solid #B8E3C1',
                        borderRadius: 6,
                        marginBottom: 18,
                      }}
                    >
                      <Text
                        size="sm"
                        c="#155C48"
                        lh={1.6}
                        style={{ fontSize: '14px', marginBottom: 6 }}
                      >
                        Thank you, <strong>{formData.fullName}</strong>. Your inquiry and technical
                        parameters have been routed directly to our engineering desk at{' '}
                        <strong>salessealox@gmail.com</strong>.
                      </Text>
                      <Text size="xs" c="#285C31" lh={1.5} style={{ fontSize: '12px' }}>
                        Our tooling and polymer specialists will review compatibility and respond
                        within 24 business hours.
                      </Text>
                    </Alert>
                    <Box
                      component="button"
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          fullName: '',
                          company: '',
                          email: '',
                          phone: '',
                          industry: '',
                          sealType: '',
                          operatingConditions: '',
                          message: '',
                        });
                      }}
                      style={{
                        padding: '9px 18px',
                        backgroundColor: '#FFFFFF',
                        color: '#155C48',
                        borderRadius: 6,
                        fontWeight: 600,
                        fontSize: '13px',
                        border: '1px solid #D3EED9',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        transition: 'background-color 0.2s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#EEF8F0')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
                    >
                      Send Another Inquiry →
                    </Box>
                  </Box>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    action="https://formsubmit.co/salessealox@gmail.com"
                    method="POST"
                  >
                    {error && (
                      <Alert
                        color="red"
                        radius="sm"
                        title="Submission Notice"
                        mb={16}
                        style={{ borderRadius: 6 }}
                      >
                        <Text size="xs" lh={1.5}>
                          {error}
                        </Text>
                      </Alert>
                    )}

                    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing={16} mb={16}>
                      <TextInput
                        name="Full Name"
                        label="Full Name"
                        placeholder="e.g. John Doe"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        styles={inputStyles}
                      />
                      <TextInput
                        name="Company Name"
                        label="Company Name"
                        placeholder="e.g. Acme Aerospace"
                        required
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        styles={inputStyles}
                      />
                    </SimpleGrid>

                    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing={16} mb={16}>
                      <TextInput
                        name="Work Email"
                        label="Work Email"
                        type="email"
                        placeholder="john@company.com"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        styles={inputStyles}
                      />
                      <TextInput
                        name="Phone Number"
                        label="Phone Number"
                        placeholder="+91 96649 88493"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        styles={inputStyles}
                      />
                    </SimpleGrid>

                    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing={16} mb={16}>
                      <Select
                        name="Target Industry"
                        label="Target Industry"
                        placeholder="Select Industry"
                        data={[
                          'Automotive',
                          'Aerospace',
                          'Oil & Gas',
                          'Chemical Processing',
                          'Marine',
                          'Pharmaceutical',
                          'Power Plant',
                          'Mining',
                          'General Manufacturing',
                        ]}
                        value={formData.industry}
                        onChange={(val) => setFormData({ ...formData, industry: val ?? '' })}
                        styles={inputStyles}
                      />
                      <Select
                        name="Seal Type / Profile"
                        label="Profile / Material of Interest"
                        placeholder="Select Seal Type"
                        data={[
                          'O-Rings',
                          'Oil Seals',
                          'Hydraulic & Pneumatic Seals',
                          'PTFE / Viton Components',
                          'Custom Molded Seals',
                          'Gaskets & Molded Rubber',
                        ]}
                        value={formData.sealType}
                        onChange={(val) => setFormData({ ...formData, sealType: val ?? '' })}
                        styles={inputStyles}
                      />
                    </SimpleGrid>

                    <TextInput
                      name="Operating Conditions"
                      label="Operating Conditions (Optional)"
                      placeholder="e.g. 150°C, 350 Bar, Hydraulic Oil, ID: 45mm"
                      mb={16}
                      value={formData.operatingConditions}
                      onChange={(e) =>
                        setFormData({ ...formData, operatingConditions: e.target.value })
                      }
                      styles={inputStyles}
                    />

                    <Textarea
                      name="Project Requirements"
                      label="Project Details & Requirements"
                      placeholder="Describe dimensions, operating medium, quantities, or specific drawing references..."
                      rows={4}
                      required
                      mb={24}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      styles={inputStyles}
                    />

                    <Box
                      component="button"
                      type="submit"
                      disabled={isSubmitting}
                      style={{
                        width: '100%',
                        padding: '13px 24px',
                        background: isSubmitting
                          ? '#9CA3AF'
                          : 'linear-gradient(135deg, #155C48 0%, #439951 100%)',
                        color: '#FFFFFF',
                        borderRadius: 6,
                        fontWeight: 700,
                        fontSize: '14px',
                        border: 'none',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        boxShadow: isSubmitting ? 'none' : '0 4px 14px rgba(21, 92, 72, 0.22)',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                      }}
                      onMouseEnter={(e) => {
                        if (!isSubmitting) {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 8px 24px rgba(21, 92, 72, 0.32)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSubmitting) {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 4px 14px rgba(21, 92, 72, 0.22)';
                        }
                      }}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader size={16} color="white" />
                          <span>Routing Inquiry to Engineering...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Engineering Inquiry</span>
                          <IconChevronRight size={16} />
                        </>
                      )}
                    </Box>
                  </form>
                )}
              </Box>
            </Grid.Col>

            {/* RIGHT COLUMN: VALUE PROPOSITIONS & FACILITY PHOTO */}
            <Grid.Col span={{ base: 12, lg: 5 }}>
              <Box
                style={{
                  borderRadius: 8,
                  overflow: 'hidden',
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 6px 18px rgba(0, 0, 0, 0.04)',
                  marginBottom: 24,
                }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800&h=600"
                  alt="Technical Consultation Session"
                  height={240}
                  fit="cover"
                />
              </Box>

              <Box
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 8,
                  border: '1px solid #E5E7EB',
                  padding: '24px 20px',
                  boxShadow: '0 1px 4px rgba(0, 0, 0, 0.03)',
                }}
              >
                <Text fw={700} c="#111827" mb={16} style={{ fontSize: '16px' }}>
                  Our Engineering Commitment
                </Text>

                <Box style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {[
                    {
                      title: '24-Hour Technical Response',
                      desc: 'Direct review by experienced tooling and polymer specialists.',
                      icon: <IconClock size={16} color="#50B861" />,
                    },
                    {
                      title: 'NDA & Drawing Confidentiality',
                      desc: 'Proprietary designs and CAD data remain strictly protected.',
                      icon: <IconShieldLock size={16} color="#50B861" />,
                    },
                    {
                      title: 'Prototyping & Sampling Support',
                      desc: 'Rapid compound testing to validate fit, elongation, and hardness.',
                      icon: <IconBuildingFactory2 size={16} color="#50B861" />,
                    },
                    {
                      title: 'Material Test Reports (MTR)',
                      desc: 'Certified batch documentation provided with production lots.',
                      icon: <IconFileText size={16} color="#50B861" />,
                    },
                  ].map((item) => (
                    <Group key={item.title} gap={12} align="flex-start" wrap="nowrap">
                      <ThemeIcon
                        size={28}
                        radius="sm"
                        style={{ backgroundColor: '#EEF8F0', flexShrink: 0 }}
                      >
                        {item.icon}
                      </ThemeIcon>
                      <Box>
                        <Text fw={700} c="#111827" style={{ fontSize: '13px' }}>
                          {item.title}
                        </Text>
                        <Text
                          c="#6B7280"
                          size="xs"
                          lh={1.4}
                          style={{ fontSize: '12px', marginTop: 2 }}
                        >
                          {item.desc}
                        </Text>
                      </Box>
                    </Group>
                  ))}
                </Box>
              </Box>
            </Grid.Col>
          </Grid>
        </Container>
      </Box>

      {/* 4. FREQUENTLY ASKED QUESTIONS */}
      <Box component="section" py={{ base: 48, sm: 60, md: 72 }}>
        <Container size="xl" px={{ base: 'md', sm: 'xl' }}>
          <Box style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 36px' }}>
            <SectionBadge label="Technical FAQ" />
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
              Frequently Asked Technical & Procurement Questions
            </Title>
            <Text c="#6B7280" size="xs" lh={1.6} style={{ fontSize: '14px' }}>
              Answers to common engineering questions regarding tolerances, custom tooling, and
              material compatibility.
            </Text>
          </Box>

          <Box style={{ maxWidth: 840, margin: '0 auto' }}>
            <Accordion variant="separated" radius="sm">
              {[
                {
                  q: 'What information is needed to quote a custom seal mold?',
                  a: 'To generate an accurate mold quote and unit price, we recommend providing a 2D/3D CAD drawing, operating media (oil, acid, gas, water), temperature range, maximum continuous pressure, and expected production volume.',
                },
                {
                  q: 'What elastomers and polymers do you work with for aggressive media?',
                  a: 'We formulate and mold a wide range of specialty compounds including FKM (Viton), PTFE (Teflon), NBR (Nitrile), EPDM, High-Consistency Silicone, and Polyurethane (PU), tailored for chemical resistance and thermal resilience.',
                },
                {
                  q: 'Can we execute an NDA prior to sharing proprietary engineering files?',
                  a: 'Yes, absolutely. We frequently execute mutual Non-Disclosure Agreements with automotive, aerospace, and industrial equipment manufacturers before receiving CAD or tool geometry files.',
                },
                {
                  q: 'Do you provide Material Test Reports (MTR) and batch certificates?',
                  a: 'Yes. Every batch manufactured is tested for hardness, tensile strength, and elongation at break, accompanied by full batch traceability and compliance certificates upon request.',
                },
              ].map((faq) => (
                <Accordion.Item
                  key={faq.q}
                  value={faq.q}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: 6,
                    marginBottom: 10,
                    overflow: 'hidden',
                  }}
                >
                  <Accordion.Control>
                    <Group gap={10}>
                      <IconHelpCircle size={18} color="#50B861" />
                      <Text fw={700} c="#111827" style={{ fontSize: '14.5px' }}>
                        {faq.q}
                      </Text>
                    </Group>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Text c="#4B5563" size="xs" lh={1.6} style={{ fontSize: '13.5px' }}>
                      {faq.a}
                    </Text>
                  </Accordion.Panel>
                </Accordion.Item>
              ))}
            </Accordion>
          </Box>
        </Container>
      </Box>

      {/* 5. QUICK CATALOG DOWNLOAD BANNER */}
      <Box component="section" py={{ base: 40, sm: 52, md: 64 }} bg="#F9FAFB">
        <Container size="xl" px={{ base: 'md', sm: 'xl' }}>
          <Box
            p={{ base: '24px 18px', sm: '32px 24px', md: '36px 32px' }}
            style={{
              background: 'linear-gradient(135deg, #155C48 0%, #285C31 50%, #439951 100%)',
              borderRadius: 8,
              color: '#FFFFFF',
              boxShadow: '0 8px 24px rgba(21, 92, 72, 0.18)',
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
                    marginBottom: 8,
                    color: '#FFFFFF',
                    lineHeight: 1.25,
                  }}
                >
                  Looking for Standard Dimensions & Profiles?
                </Title>
                <Text
                  size="sm"
                  style={{ color: 'rgba(255, 255, 255, 0.88)', maxWidth: 580, fontSize: '14px' }}
                  lh={1.6}
                >
                  Download the comprehensive Sealox product catalog containing cross-sections,
                  grooving guidelines, and material compatibility tables.
                </Text>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 4 }}>
                <Group justify="flex-start" gap={12} className="md:justify-end" wrap="wrap">
                  <Box
                    component="a"
                    href="/SEALOX CATALOG 2026 PRINT.pdf"
                    download="SEALOX CATALOG 2026 PRINT.pdf"
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
                    <IconDownload size={18} color="#155C48" />
                    Download Catalogue
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
