import { useState, useId } from 'react';
import { useParams, Link } from 'react-router-dom';
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
  TextInput,
  Textarea,
  Select,
  Alert,
  Loader,
  Stack,
  Badge,
  UnstyledButton,
} from '@mantine/core';
import {
  IconCheck,
  IconChevronRight,
  IconPhone,
  IconGauge,
  IconShieldCheck,
  IconTools,
  IconBuildingFactory2,
  IconListNumbers,
  IconMapPin,
  IconArrowNarrowRight,
} from '@tabler/icons-react';
import { useProduct, useProducts } from '../../api/productsApi';

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
        marginBottom: 10,
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

function getModelPillLabel(p: { id?: string; name: string; subtitle?: string }): string {
  if (p.subtitle && p.subtitle.length <= 32) return p.subtitle;
  const cleaned = p.name.replace(/ELASTOMER UNBALANCED SEAL|MECHANICAL SEAL/gi, '').trim();
  return cleaned || p.name;
}

export function ProductDetail() {
  const { slug } = useParams<{ slug?: string }>();
  const { product } = useProduct(slug);
  const { products: allProducts } = useProducts();

  // E-commerce Image Gallery state
  const [userSelectedImageIndex, setUserSelectedImageIndex] = useState<number | null>(null);
  const [prevSlug, setPrevSlug] = useState(slug);

  if (prevSlug !== slug) {
    setPrevSlug(slug);
    setUserSelectedImageIndex(null);
  }

  const selectedImageIndex = userSelectedImageIndex ?? 0;

  const activeImage =
    product.images && product.images[selectedImageIndex]
      ? product.images[selectedImageIndex]
      : product.image;

  // RFQ Form state
  const [formData, setFormData] = useState({
    fullName: '',
    company: '',
    email: '',
    phone: '',
    sealSize: '25mm',
    quantity: '10',
    faceMaterial: 'Carbon vs Silicon',
    applicationNotes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    const payload = {
      _subject: `New Mechanical Seal RFQ: ${product.name} - ${formData.fullName} (${formData.company || 'Direct'})`,
      _template: 'table',
      _captcha: 'false',
      Product: product.name,
      Category: product.category,
      'Seal Size': formData.sealSize,
      Quantity: formData.quantity,
      'Face Material Preferred': formData.faceMaterial,
      'Full Name': formData.fullName,
      Company: formData.company || 'Not Provided',
      'Work Email': formData.email,
      'Phone Number': formData.phone,
      'Operating Conditions & Notes':
        formData.applicationNotes || 'Standard parameters per catalog',
    };

    try {
      const response = await fetch('https://formsubmit.co/ajax/salessealox@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (response.ok && (result.success === 'true' || result.success === true)) {
        setSubmitted(true);
      } else {
        setSubmitError(
          result.message ||
            'Unable to submit at this time. Please email us directly at salessealox@gmail.com',
        );
      }
    } catch {
      setSubmitError(
        'Network connection issue. Please contact us directly at salessealox@gmail.com or +91 96649 88493.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const rfqFormId = useId();

  return (
    <Box bg="#FBFDFB" style={{ minHeight: '100vh' }}>
      {/* 1. TOP BREADCRUMB STRIP */}
      <Box
        py={14}
        bg="#FFFFFF"
        style={{
          borderBottom: '1px solid #E5E7EB',
        }}
      >
        <Container size="xl" px={{ base: 'md', sm: 'xl' }}>
          <Group justify="space-between" align="center" wrap="wrap" gap="md">
            {/* Breadcrumbs */}
            <Group gap={8}>
              <Link
                to="/"
                style={{
                  textDecoration: 'none',
                  color: '#6B7280',
                  fontSize: '13px',
                  fontWeight: 500,
                }}
              >
                Home
              </Link>
              <IconChevronRight size={12} color="#9CA3AF" />
              <Link
                to="/products"
                style={{
                  textDecoration: 'none',
                  color: '#6B7280',
                  fontSize: '13px',
                  fontWeight: 500,
                }}
              >
                Products
              </Link>
              <IconChevronRight size={12} color="#9CA3AF" />
              <Text size="xs" fw={600} c="#155C48" style={{ fontSize: '13px' }}>
                {product.name}
              </Text>
            </Group>

            {/* Model Selector Pills */}
            <Group gap={8}>
              <Text size="xs" c="#6B7280" fw={500}>
                Models:
              </Text>
              {allProducts.map((p) => {
                const isCurrent = p.slug === product.slug;
                return (
                  <Link
                    key={p.slug}
                    to={`/products/${p.slug}`}
                    style={{
                      textDecoration: 'none',
                      padding: '5px 12px',
                      borderRadius: 6,
                      fontSize: '12px',
                      fontWeight: isCurrent ? 700 : 500,
                      backgroundColor: isCurrent ? '#155C48' : '#F3F4F6',
                      color: isCurrent ? '#FFFFFF' : '#374151',
                      border: isCurrent ? '1px solid #155C48' : '1px solid #E5E7EB',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {getModelPillLabel(p)}
                  </Link>
                );
              })}
            </Group>
          </Group>
        </Container>
      </Box>

      {/* 2. E-COMMERCE PRODUCT HERO SECTION (GALLERY ON LEFT, DETAILS & CTA ON RIGHT) */}
      <Box py={{ base: 28, sm: 40 }} bg="#FFFFFF" style={{ borderBottom: '1px solid #E5E7EB' }}>
        <Container size="xl" px={{ base: 'md', sm: 'xl' }}>
          <Grid gap={{ base: 28, md: 36, lg: 48 }} align="start">
            {/* LEFT: E-COMMERCE PRODUCT IMAGE GALLERY */}
            <Grid.Col span={{ base: 12, md: 6, lg: 5.5 }}>
              <Box style={{ position: 'sticky', top: 90 }}>
                {/* Main Image Display */}
                <Box
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 8,
                    border: '1px solid #E5E7EB',
                    padding: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 360,
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
                    position: 'relative',
                  }}
                >
                  <Image
                    src={activeImage}
                    alt={product.name}
                    fit="contain"
                    h={{ base: 240, sm: 300, md: 320 }}
                    w="auto"
                    style={{
                      transition: 'opacity 0.2s ease',
                      filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.05))',
                    }}
                  />

                  {/* Image count badge */}
                  {product.images && product.images.length > 1 && (
                    <Box
                      style={{
                        position: 'absolute',
                        bottom: 12,
                        right: 14,
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid #E5E7EB',
                        borderRadius: 4,
                        padding: '2px 8px',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#6B7280',
                      }}
                    >
                      {selectedImageIndex + 1} / {product.images.length}
                    </Box>
                  )}
                </Box>

                {/* Thumbnails Row */}
                {product.images && product.images.length > 1 && (
                  <Group gap={10} mt={14}>
                    {product.images.map((imgUrl, idx) => {
                      const isSelected = selectedImageIndex === idx;
                      return (
                        <UnstyledButton
                          key={`${imgUrl}-${idx}`}
                          onClick={() => setUserSelectedImageIndex(idx)}
                          style={{
                            width: 74,
                            height: 74,
                            borderRadius: 6,
                            border: isSelected ? '2px solid #50B861' : '1px solid #E5E7EB',
                            backgroundColor: '#FFFFFF',
                            padding: 4,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            boxShadow: isSelected ? '0 2px 8px rgba(80, 184, 97, 0.22)' : 'none',
                            transition: 'all 0.15s ease',
                          }}
                          onMouseEnter={(e) => {
                            if (!isSelected) {
                              e.currentTarget.style.borderColor = '#9CA3AF';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected) {
                              e.currentTarget.style.borderColor = '#E5E7EB';
                            }
                          }}
                        >
                          <Image
                            src={imgUrl}
                            alt={`${product.name} view ${idx + 1}`}
                            fit="contain"
                            h={62}
                            w={62}
                          />
                        </UnstyledButton>
                      );
                    })}
                  </Group>
                )}
              </Box>
            </Grid.Col>

            {/* RIGHT: PRODUCT INFO, KEY SPECS & QUICK ACTIONS */}
            <Grid.Col span={{ base: 12, md: 6, lg: 6.5 }}>
              <Box>
                <SectionBadge label={product.category} />

                <Title
                  order={1}
                  style={{
                    color: '#111827',
                    fontSize: 'clamp(1.4rem, 2.4vw, 1.95rem)',
                    fontWeight: 800,
                    letterSpacing: '-0.02em',
                    textTransform: 'uppercase',
                    marginBottom: 6,
                    lineHeight: 1.25,
                  }}
                >
                  {product.name}
                </Title>

                <Text c="#155C48" fw={600} size="sm" mb={14} style={{ fontSize: '13.5px' }}>
                  {product.subtitle}
                </Text>

                {/* Stock Availability Badge */}
                <Group gap={8} mb={16}>
                  <Box
                    w={8}
                    h={8}
                    style={{
                      borderRadius: '50%',
                      backgroundColor: '#50B861',
                      boxShadow: '0 0 0 3px rgba(80, 184, 97, 0.2)',
                    }}
                  />
                  <Text
                    size="xs"
                    fw={700}
                    c="#155C48"
                    tt="uppercase"
                    style={{ letterSpacing: '0.04em' }}
                  >
                    Standard Stock • Factory Certified OEM
                  </Text>
                </Group>

                <Text c="#4B5563" size="sm" lh={1.6} mb={22} style={{ fontSize: '14px' }}>
                  {product.description}
                </Text>

                {/* Key Parameters at a glance */}
                <Box
                  p={16}
                  mb={22}
                  style={{
                    backgroundColor: '#FAFCFA',
                    borderRadius: 8,
                    border: '1px solid #E5E7EB',
                  }}
                >
                  <Text
                    fw={700}
                    c="#111827"
                    size="xs"
                    tt="uppercase"
                    mb={12}
                    style={{ letterSpacing: '0.04em' }}
                  >
                    Operating Parameters at a Glance
                  </Text>
                  <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="sm">
                    {(product.operatingLimits || []).map((item) => (
                      <Box key={item.label}>
                        <Text size="xs" c="#6B7280" fw={500} style={{ fontSize: '11px' }}>
                          {item.label}
                        </Text>
                        <Text size="sm" c="#111827" fw={700} style={{ fontSize: '13px' }}>
                          {item.value}
                        </Text>
                      </Box>
                    ))}
                  </SimpleGrid>
                </Box>

                {/* Primary CTA Action Buttons */}
                <Stack gap={12}>
                  <Group gap={14} wrap="wrap">
                    <Box
                      component="a"
                      href={`#${rfqFormId}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        padding: '12px 24px',
                        backgroundColor: '#155C48',
                        color: '#FFFFFF',
                        borderRadius: 6,
                        fontWeight: 700,
                        fontSize: '14px',
                        textDecoration: 'none',
                        boxShadow: '0 4px 14px rgba(21, 92, 72, 0.25)',
                        transition: 'all 0.15s ease',
                        flex: 1,
                        minWidth: 200,
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#104637')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#155C48')}
                    >
                      Request Technical Quote
                      <IconChevronRight size={16} />
                    </Box>

                    <Box
                      component="a"
                      href="tel:+919664988493"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        padding: '12px 20px',
                        backgroundColor: '#FFFFFF',
                        color: '#155C48',
                        borderRadius: 6,
                        fontWeight: 700,
                        fontSize: '13.5px',
                        textDecoration: 'none',
                        border: '1px solid #155C48',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#EEF8F0')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
                    >
                      <IconPhone size={16} color="#155C48" />
                      Call Engineering Desk
                    </Box>
                  </Group>

                  {/* Direct Contact Callout */}
                  <Group gap={14} wrap="wrap" pt={4}>
                    <Text size="xs" c="#6B7280">
                      Direct Phone:{' '}
                      <a
                        href="tel:+919664988493"
                        style={{ color: '#111827', fontWeight: 600, textDecoration: 'none' }}
                      >
                        +91 96649 88493
                      </a>
                    </Text>
                    <Text size="xs" c="#D1D5DB">
                      •
                    </Text>
                    <Text size="xs" c="#6B7280">
                      Email:{' '}
                      <a
                        href="mailto:salessealox@gmail.com"
                        style={{ color: '#111827', fontWeight: 600, textDecoration: 'none' }}
                      >
                        salessealox@gmail.com
                      </a>
                    </Text>
                  </Group>
                </Stack>
              </Box>
            </Grid.Col>
          </Grid>
        </Container>
      </Box>

      {/* 3. TECHNICAL SPECIFICATIONS GRID - EXACT CATALOG CATEGORIES */}
      <Box py={{ base: 36, sm: 48 }}>
        <Container size="xl" px={{ base: 'md', sm: 'xl' }}>
          <Box mb={22}>
            <SectionBadge label="Engineering Specifications" />
            <Title
              order={2}
              style={{
                fontSize: 'clamp(1.35rem, 2vw, 1.7rem)',
                fontWeight: 800,
                color: '#111827',
                letterSpacing: '-0.02em',
              }}
            >
              Technical Parameters & Material Breakdown
            </Title>
          </Box>

          <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
            {/* 1. OPERATING LIMIT */}
            <Box
              p={20}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 8,
                border: '1px solid #E5E7EB',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
              }}
            >
              <Group gap={8} mb={16}>
                <ThemeIcon size={30} radius="sm" style={{ backgroundColor: '#EEF8F0' }}>
                  <IconGauge size={16} color="#50B861" />
                </ThemeIcon>
                <Text
                  fw={800}
                  c="#155C48"
                  style={{
                    fontSize: '13px',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}
                >
                  Operating Limit
                </Text>
              </Group>

              <Stack gap={10}>
                {(product.operatingLimits || []).map((item) => (
                  <Box
                    key={item.label}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingBottom: 8,
                      borderBottom: '1px dashed #F3F4F6',
                    }}
                  >
                    <Text size="xs" c="#6B7280" fw={500}>
                      {item.label}
                    </Text>
                    <Text size="xs" c="#111827" fw={700}>
                      {item.value}
                    </Text>
                  </Box>
                ))}
              </Stack>
            </Box>

            {/* 2. FACE MATERIAL */}
            <Box
              p={20}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 8,
                border: '1px solid #E5E7EB',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
              }}
            >
              <Group gap={8} mb={16}>
                <ThemeIcon size={30} radius="sm" style={{ backgroundColor: '#EEF8F0' }}>
                  <IconShieldCheck size={16} color="#50B861" />
                </ThemeIcon>
                <Text
                  fw={800}
                  c="#155C48"
                  style={{
                    fontSize: '13px',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}
                >
                  Face Material
                </Text>
              </Group>

              <Stack gap={10}>
                {(product.faceMaterials || []).map((item) => (
                  <Box
                    key={item.label}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: 8,
                      paddingBottom: 8,
                      borderBottom: '1px dashed #F3F4F6',
                    }}
                  >
                    <Text size="xs" c="#6B7280" fw={500}>
                      {item.label}
                    </Text>
                    <Text size="xs" c="#111827" fw={700} ta="right" style={{ maxWidth: '65%' }}>
                      {item.value}
                    </Text>
                  </Box>
                ))}
              </Stack>
            </Box>

            {/* 3. MATERIALS OF CONSTRUCTION */}
            <Box
              p={20}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 8,
                border: '1px solid #E5E7EB',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
              }}
            >
              <Group gap={8} mb={16}>
                <ThemeIcon size={30} radius="sm" style={{ backgroundColor: '#EEF8F0' }}>
                  <IconTools size={16} color="#50B861" />
                </ThemeIcon>
                <Text
                  fw={800}
                  c="#155C48"
                  style={{
                    fontSize: '13px',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}
                >
                  Materials
                </Text>
              </Group>

              <Box mb={14}>
                <Text
                  size="xs"
                  c="#6B7280"
                  fw={600}
                  mb={6}
                  tt="uppercase"
                  style={{ fontSize: '11px' }}
                >
                  Secondary Seal Materials
                </Text>
                <Group gap={6}>
                  {(product.secondarySealMaterials || []).map((m) => (
                    <Box
                      key={m}
                      px={8}
                      py={3}
                      style={{
                        backgroundColor: '#EEF8F0',
                        border: '1px solid #D3EED9',
                        borderRadius: 4,
                        color: '#155C48',
                        fontSize: '11.5px',
                        fontWeight: 600,
                      }}
                    >
                      {m}
                    </Box>
                  ))}
                </Group>
              </Box>

              <Box>
                <Text
                  size="xs"
                  c="#6B7280"
                  fw={600}
                  mb={6}
                  tt="uppercase"
                  style={{ fontSize: '11px' }}
                >
                  Metal Parts
                </Text>
                <Group gap={6}>
                  {(product.metalParts || []).map((m) => (
                    <Box
                      key={m}
                      px={8}
                      py={3}
                      style={{
                        backgroundColor: '#F3F4F6',
                        border: '1px solid #E5E7EB',
                        borderRadius: 4,
                        color: '#1F2937',
                        fontSize: '11.5px',
                        fontWeight: 700,
                      }}
                    >
                      {m}
                    </Box>
                  ))}
                </Group>
              </Box>
            </Box>

            {/* 4. APPLICATIONS */}
            <Box
              p={20}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 8,
                border: '1px solid #E5E7EB',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
              }}
            >
              <Group gap={8} mb={16}>
                <ThemeIcon size={30} radius="sm" style={{ backgroundColor: '#EEF8F0' }}>
                  <IconBuildingFactory2 size={16} color="#50B861" />
                </ThemeIcon>
                <Text
                  fw={800}
                  c="#155C48"
                  style={{
                    fontSize: '13px',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}
                >
                  Application
                </Text>
              </Group>

              <Stack gap={10}>
                {(product.applications || []).map((app) => (
                  <Group
                    key={app}
                    gap={8}
                    align="center"
                    style={{
                      padding: '8px 10px',
                      backgroundColor: '#FAFCFA',
                      borderRadius: 6,
                      border: '1px solid #F3F4F6',
                    }}
                  >
                    <IconArrowNarrowRight size={14} color="#50B861" />
                    <Text size="xs" c="#111827" fw={700}>
                      {app}
                    </Text>
                  </Group>
                ))}
              </Stack>
            </Box>
          </SimpleGrid>

          {/* Optional Custom Specification Groups from Django Backend */}
          {product.customSpecGroups && product.customSpecGroups.length > 0 && (
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg" mt="lg">
              {product.customSpecGroups.map((group) => (
                <Box
                  key={group.groupTitle}
                  p={20}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 8,
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                  }}
                >
                  <Group gap={8} mb={16}>
                    <ThemeIcon size={30} radius="sm" style={{ backgroundColor: '#EEF8F0' }}>
                      <IconGauge size={16} color="#50B861" />
                    </ThemeIcon>
                    <Text
                      fw={800}
                      c="#155C48"
                      style={{
                        fontSize: '13px',
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {group.groupTitle}
                    </Text>
                  </Group>
                  <Stack gap={10}>
                    {(group.items || []).map((item) => (
                      <Box
                        key={item.label}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          paddingBottom: 8,
                          borderBottom: '1px dashed #F3F4F6',
                        }}
                      >
                        <Text size="xs" c="#6B7280" fw={500}>
                          {item.label}
                        </Text>
                        <Text size="xs" c="#111827" fw={700}>
                          {item.value}
                        </Text>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              ))}
            </SimpleGrid>
          )}
        </Container>
      </Box>

      {/* 4. SEAL COMPONENTS & PART CODES TABLE (Matches Schematic Numbers) */}
      {(product.sealComponents || []).length > 0 && (
        <Box py={{ base: 28, sm: 36 }}>
          <Container size="xl" px={{ base: 'md', sm: 'xl' }}>
            <Box
              p={{ base: 18, sm: 26 }}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 8,
                border: '1px solid #E5E7EB',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
              }}
            >
              <Group justify="space-between" align="center" mb={18} wrap="wrap" gap="sm">
                <Group gap={8}>
                  <ThemeIcon size={32} radius="sm" style={{ backgroundColor: '#EEF8F0' }}>
                    <IconListNumbers size={18} color="#50B861" />
                  </ThemeIcon>
                  <Box>
                    <Title
                      order={3}
                      style={{
                        fontSize: '16px',
                        fontWeight: 800,
                        color: '#111827',
                      }}
                    >
                      Seal Components & Part Number Codes
                    </Title>
                    <Text size="xs" c="#6B7280" style={{ fontSize: '12px' }}>
                      Part identification numbers correspond directly to the technical assembly
                      drawing in the gallery above
                    </Text>
                  </Box>
                </Group>

                <Badge color="green" variant="outline" size="sm" radius="xs">
                  {(product.sealComponents || []).length} Parts Breakdown
                </Badge>
              </Group>

              {/* Responsive 2-column parts grid / table */}
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                {(product.sealComponents || []).map((comp) => (
                  <Group
                    key={comp.code}
                    justify="space-between"
                    p="10px 14px"
                    style={{
                      backgroundColor: '#FAFCFA',
                      borderRadius: 6,
                      border: '1px solid #E5E7EB',
                    }}
                  >
                    <Text size="xs" fw={600} c="#111827" style={{ fontSize: '13px' }}>
                      {comp.name}
                    </Text>
                    <Box
                      style={{
                        minWidth: 26,
                        height: 26,
                        padding: '0 8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#155C48',
                        color: '#FFFFFF',
                        borderRadius: 4,
                        fontSize: '12px',
                        fontWeight: 800,
                      }}
                    >
                      Code {comp.code}
                    </Box>
                  </Group>
                ))}
              </SimpleGrid>
            </Box>
          </Container>
        </Box>
      )}

      {/* 5. ENGINEERING RFQ FORM & DIRECT HEADQUARTERS CONTACT */}
      <Box
        id={rfqFormId}
        py={{ base: 40, sm: 54 }}
        bg="#FFFFFF"
        style={{
          borderTop: '1px solid #E5E7EB',
        }}
      >
        <Container size="xl" px={{ base: 'md', sm: 'xl' }}>
          <Grid gap={{ base: 28, lg: 40 }} align="start">
            {/* LEFT: RFQ FORM */}
            <Grid.Col span={{ base: 12, lg: 7 }}>
              <Box
                p={{ base: 20, sm: 30 }}
                style={{
                  backgroundColor: '#FAFCFA',
                  borderRadius: 8,
                  border: '1px solid #E5E7EB',
                }}
              >
                <SectionBadge label="Fast Quote Desk" />
                <Title
                  order={2}
                  style={{
                    fontSize: 'clamp(1.35rem, 2vw, 1.7rem)',
                    fontWeight: 800,
                    color: '#111827',
                    marginBottom: 6,
                  }}
                >
                  Request Technical Quotation
                </Title>
                <Text c="#6B7280" size="xs" lh={1.5} mb={24} style={{ fontSize: '13px' }}>
                  Inquiring for: <strong>{product.name}</strong>. Submit your shaft size and
                  quantity below for factory-direct certified pricing.
                </Text>

                {submitted ? (
                  <Alert
                    color="green"
                    radius="sm"
                    icon={<IconCheck size={20} />}
                    title="Inquiry Forwarded Successfully!"
                    style={{
                      backgroundColor: '#EEF8F0',
                      border: '1px solid #B8E3C1',
                      borderRadius: 6,
                    }}
                  >
                    <Text size="sm" c="#155C48" lh={1.6} mb={8}>
                      Thank you, <strong>{formData.fullName}</strong>. Your quotation request for{' '}
                      <strong>{product.name}</strong> has been routed directly to{' '}
                      <strong>salessealox@gmail.com</strong>.
                    </Text>
                    <Text size="xs" c="#285C31" mb={14}>
                      Our engineering sales desk will review your shaft size and media parameters,
                      and reply within 24 business hours.
                    </Text>
                    <Box
                      component="button"
                      type="button"
                      onClick={() => setSubmitted(false)}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#FFFFFF',
                        color: '#155C48',
                        borderRadius: 6,
                        fontWeight: 600,
                        fontSize: '12px',
                        border: '1px solid #B8E3C1',
                        cursor: 'pointer',
                      }}
                    >
                      Submit Another Quotation
                    </Box>
                  </Alert>
                ) : (
                  <form onSubmit={handleFormSubmit}>
                    {submitError && (
                      <Alert color="red" radius="sm" mb={16} style={{ borderRadius: 6 }}>
                        {submitError}
                      </Alert>
                    )}

                    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" mb="md">
                      <TextInput
                        label="Full Name"
                        placeholder="e.g. Rajesh Patel"
                        required
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            fullName: e.target.value,
                          })
                        }
                        styles={{
                          input: { borderRadius: 6, fontSize: '13px' },
                          label: {
                            fontSize: '12.5px',
                            fontWeight: 600,
                            color: '#374151',
                            marginBottom: 4,
                          },
                        }}
                      />
                      <TextInput
                        label="Company Name"
                        placeholder="e.g. Acme Industries Ltd."
                        value={formData.company}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            company: e.target.value,
                          })
                        }
                        styles={{
                          input: { borderRadius: 6, fontSize: '13px' },
                          label: {
                            fontSize: '12.5px',
                            fontWeight: 600,
                            color: '#374151',
                            marginBottom: 4,
                          },
                        }}
                      />
                    </SimpleGrid>

                    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" mb="md">
                      <TextInput
                        label="Work Email"
                        type="email"
                        placeholder="name@company.com"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            email: e.target.value,
                          })
                        }
                        styles={{
                          input: { borderRadius: 6, fontSize: '13px' },
                          label: {
                            fontSize: '12.5px',
                            fontWeight: 600,
                            color: '#374151',
                            marginBottom: 4,
                          },
                        }}
                      />
                      <TextInput
                        label="Phone / Mobile Number"
                        placeholder="+91 96649 88493"
                        required
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            phone: e.target.value,
                          })
                        }
                        styles={{
                          input: { borderRadius: 6, fontSize: '13px' },
                          label: {
                            fontSize: '12.5px',
                            fontWeight: 600,
                            color: '#374151',
                            marginBottom: 4,
                          },
                        }}
                      />
                    </SimpleGrid>

                    <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md" mb="md">
                      <Select
                        label="Shaft / Seal Size"
                        data={[
                          '12mm',
                          '14mm',
                          '16mm',
                          '18mm',
                          '20mm',
                          '25mm',
                          '28mm',
                          '30mm',
                          '35mm',
                          '40mm',
                          '45mm',
                          '50mm',
                          'Custom Size',
                        ]}
                        value={formData.sealSize}
                        onChange={(val) =>
                          setFormData({
                            ...formData,
                            sealSize: val || '25mm',
                          })
                        }
                        styles={{
                          input: { borderRadius: 6, fontSize: '13px' },
                          label: {
                            fontSize: '12.5px',
                            fontWeight: 600,
                            color: '#374151',
                            marginBottom: 4,
                          },
                        }}
                      />
                      <TextInput
                        label="Required Quantity"
                        placeholder="e.g. 25 pcs"
                        value={formData.quantity}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            quantity: e.target.value,
                          })
                        }
                        styles={{
                          input: { borderRadius: 6, fontSize: '13px' },
                          label: {
                            fontSize: '12.5px',
                            fontWeight: 600,
                            color: '#374151',
                            marginBottom: 4,
                          },
                        }}
                      />
                      <Select
                        label="Face Material"
                        data={[
                          'Carbon vs Silicon',
                          'Silicon vs Silicon',
                          'TC vs TC',
                          'Ceramic vs Silicon',
                          'Standard Recommendation',
                        ]}
                        value={formData.faceMaterial}
                        onChange={(val) =>
                          setFormData({
                            ...formData,
                            faceMaterial: val || 'Carbon vs Silicon',
                          })
                        }
                        styles={{
                          input: { borderRadius: 6, fontSize: '13px' },
                          label: {
                            fontSize: '12.5px',
                            fontWeight: 600,
                            color: '#374151',
                            marginBottom: 4,
                          },
                        }}
                      />
                    </SimpleGrid>

                    <Textarea
                      label="Operating Media & Process Parameters (Optional)"
                      placeholder="Specify fluid, pressure, temperature, or pump model details..."
                      minRows={3}
                      mb="xl"
                      value={formData.applicationNotes}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          applicationNotes: e.target.value,
                        })
                      }
                      styles={{
                        input: { borderRadius: 6, fontSize: '13px' },
                        label: {
                          fontSize: '12.5px',
                          fontWeight: 600,
                          color: '#374151',
                          marginBottom: 4,
                        },
                      }}
                    />

                    <Box
                      component="button"
                      type="submit"
                      disabled={isSubmitting}
                      style={{
                        width: '100%',
                        padding: '13px 24px',
                        backgroundColor: '#155C48',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: 6,
                        fontSize: '14px',
                        fontWeight: 700,
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        boxShadow: '0 4px 12px rgba(21, 92, 72, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (!isSubmitting) e.currentTarget.style.backgroundColor = '#104637';
                      }}
                      onMouseLeave={(e) => {
                        if (!isSubmitting) e.currentTarget.style.backgroundColor = '#155C48';
                      }}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader size={16} color="white" />
                          <span>Submitting RFQ to Engineering...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Engineering RFQ</span>
                          <IconChevronRight size={16} />
                        </>
                      )}
                    </Box>
                  </form>
                )}
              </Box>
            </Grid.Col>

            {/* RIGHT: FACTORY ASSURANCE & CONTACT DESK */}
            <Grid.Col span={{ base: 12, lg: 5 }}>
              <Box
                p={{ base: 20, sm: 26 }}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 8,
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                }}
              >
                <Text fw={700} c="#111827" mb={14} style={{ fontSize: '15px' }}>
                  Factory Direct Verification
                </Text>

                <Stack gap={14} mb={22}>
                  {[
                    {
                      title: '100% Face Flatness & Pressure Inspection',
                      desc: 'Helium optical flat testing ensures light-band monochromatic face flatness before assembly.',
                    },
                    {
                      title: 'Elastomer Chemical Compatibility',
                      desc: 'Elastomer bellows cured in Viton, NBR, EPDM, or Silicon for media-specific corrosion resistance.',
                    },
                    {
                      title: 'Standard Shaft Interchangeability',
                      desc: 'Direct drop-in dimensional compatibility for leading industrial centrifugal pumps and mixers.',
                    },
                  ].map((item) => (
                    <Group key={item.title} gap={10} align="flex-start" wrap="nowrap">
                      <ThemeIcon
                        size={24}
                        radius="xs"
                        style={{ backgroundColor: '#EEF8F0', flexShrink: 0, marginTop: 2 }}
                      >
                        <IconCheck size={14} color="#50B861" />
                      </ThemeIcon>
                      <Box>
                        <Text fw={700} c="#111827" style={{ fontSize: '12.5px' }}>
                          {item.title}
                        </Text>
                        <Text
                          c="#6B7280"
                          size="xs"
                          lh={1.4}
                          style={{ fontSize: '11.5px', marginTop: 2 }}
                        >
                          {item.desc}
                        </Text>
                      </Box>
                    </Group>
                  ))}
                </Stack>

                <Box
                  pt={16}
                  style={{
                    borderTop: '1px solid #E5E7EB',
                  }}
                >
                  <Group gap={6} mb={6}>
                    <IconMapPin size={15} color="#50B861" />
                    <Text fw={700} c="#111827" style={{ fontSize: '13px' }}>
                      Sealox Manufacturing & Sales HQ
                    </Text>
                  </Group>
                  <Text
                    c="#4B5563"
                    size="xs"
                    lh={1.5}
                    style={{ fontSize: '12px', paddingLeft: 21 }}
                  >
                    Gala No. 39, Real Estate Commercial Complex,
                    <br />
                    Rajosana Approach Road, Chappi, Gujarat, 385210
                  </Text>

                  <Stack gap={6} mt={14} style={{ paddingLeft: 21 }}>
                    <Text size="xs" c="#6B7280">
                      Phone:{' '}
                      <a
                        href="tel:+919664988493"
                        style={{ color: '#155C48', fontWeight: 600, textDecoration: 'none' }}
                      >
                        +91 96649 88493
                      </a>
                    </Text>
                    <Text size="xs" c="#6B7280">
                      Email:{' '}
                      <a
                        href="mailto:salessealox@gmail.com"
                        style={{ color: '#155C48', fontWeight: 600, textDecoration: 'none' }}
                      >
                        salessealox@gmail.com
                      </a>
                    </Text>
                  </Stack>
                </Box>
              </Box>
            </Grid.Col>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
