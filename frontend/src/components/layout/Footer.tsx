import React from 'react';
import { Container, Text, Group, Box, Title, UnstyledButton } from '@mantine/core';
import {
  IconBrandFacebook,
  IconBrandYoutube,
  IconBrandLinkedin,
  IconMail,
  IconMapPin,
  IconPhone,
  IconWorld,
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <Box className="bg-white pt-10 md:pt-16 pb-6 md:pb-8 border-t border-gray-200">
      <Container size="xl" px={{ base: 'md', sm: 'xl' }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-12 md:mb-16">
          {/* Logo & About */}
          <div className="sm:col-span-2 md:col-span-1 lg:col-span-1 pr-0 md:pr-4">
            <Link to="/" className="no-underline">
              <Group gap="xs" className="mb-4">
                <div className="w-8 h-8 bg-sealox-green rounded flex items-center justify-center text-white font-bold">
                  S
                </div>
                <div className="flex flex-col justify-center leading-none">
                  <Text className="text-sealox-green font-bold text-xl tracking-wider m-0 p-0 leading-tight">
                    SEALOX
                  </Text>
                  <Text className="text-gray-400 text-[10px] tracking-widest uppercase m-0 p-0 leading-tight">
                    Engineering
                  </Text>
                </div>
              </Group>
            </Link>
            <Text className="text-gray-500 text-xs leading-relaxed mb-6">
              Delivering precision-engineered mechanical and elastomer sealing solutions that ensure
              zero-leakage performance in mission-critical applications.
            </Text>
            <Group gap="sm">
              <SocialIcon icon={<IconBrandFacebook size={16} />} href="https://facebook.com" />
              <SocialIcon icon={<IconBrandYoutube size={16} />} href="https://youtube.com" />
              <SocialIcon icon={<IconBrandLinkedin size={16} />} href="https://linkedin.com" />
              <SocialIcon icon={<IconMail size={16} />} href="mailto:salessealox@gmail.com" />
            </Group>
          </div>

          {/* Products */}
          <div>
            <Title order={4} className="text-sm font-bold text-black uppercase mb-4 tracking-wider">
              Products
            </Title>
            <div className="flex flex-col gap-2">
              <FooterLink
                label="Close Stock Type Seal"
                href="/products/close-stock-type-elastomer-unbalanced-seal"
              />
              <FooterLink
                label="Open Type Elastomer Seal"
                href="/products/open-type-elastomer-unbalanced-seal"
              />
              <FooterLink label="Mechanical Seals" href="/products" />
              <FooterLink label="O-Rings" href="/products" />
              <FooterLink label="Oil Seals" href="/products" />
              <FooterLink label="Hydraulic Seals" href="/products" />
              <FooterLink label="PTFE Seals" href="/products" />
              <FooterLink label="Custom Engineered Seals" href="/products" />
            </div>
          </div>

          {/* Industries */}
          <div>
            <Title order={4} className="text-sm font-bold text-black uppercase mb-4 tracking-wider">
              Industries
            </Title>
            <div className="flex flex-col gap-2">
              <FooterLink label="Chemical Processing" href="/about" />
              <FooterLink label="Oil & Gas Refineries" href="/about" />
              <FooterLink label="Water & Wastewater" href="/about" />
              <FooterLink label="Pharmaceutical" href="/about" />
              <FooterLink label="Power Generation" href="/about" />
              <FooterLink label="Automotive" href="/about" />
              <FooterLink label="Marine & Offshore" href="/about" />
              <FooterLink label="Food & Beverage" href="/about" />
            </div>
          </div>

          {/* Resources & Company */}
          <div className="grid grid-cols-2 gap-4 lg:gap-8 sm:col-span-2 md:col-span-1 lg:col-span-1">
            <div>
              <Title
                order={4}
                className="text-sm font-bold text-black uppercase mb-4 tracking-wider"
              >
                Resources
              </Title>
              <div className="flex flex-col gap-2">
                <FooterLink label="Product Catalogue" href="/SEALOX CATALOG 2026 PRINT.pdf" />
                <FooterLink label="Material Guide" href="/about" />
                <FooterLink label="All Products" href="/products" />
                <FooterLink label="Technical Specs" href="/products" />
                <FooterLink label="FAQs" href="/contact" />
              </div>
            </div>
            <div>
              <Title
                order={4}
                className="text-sm font-bold text-black uppercase mb-4 tracking-wider"
              >
                Company
              </Title>
              <div className="flex flex-col gap-2">
                <FooterLink label="About Us" href="/about" />
                <FooterLink label="Manufacturing Facility" href="/about" />
                <FooterLink label="Quality Testing Lab" href="/about" />
                <FooterLink label="Certifications" href="/about" />
                <FooterLink label="Contact Us" href="/contact" />
              </div>
            </div>
          </div>

          {/* Contact Us */}
          <div>
            <Title order={4} className="text-sm font-bold text-black uppercase mb-4 tracking-wider">
              Contact Us
            </Title>
            <div className="flex flex-col gap-4">
              <Group gap="sm" wrap="nowrap" align="flex-start">
                <IconMapPin size={16} className="text-sealox-green shrink-0 mt-1" />
                <Text className="text-xs text-gray-500 leading-relaxed">
                  Gala No. 39, Real Estate Commercial Complex,
                  <br />
                  Rajosana Approach Road, Chappi,
                  <br />
                  Gujarat, 385210
                </Text>
              </Group>
              <Group gap="sm" wrap="nowrap">
                <IconPhone size={16} className="text-sealox-green shrink-0" />
                <a
                  href="tel:+919664988493"
                  className="text-xs text-gray-500 hover:text-sealox-green transition-colors no-underline"
                >
                  +91 96649 88493
                </a>
              </Group>
              <Group gap="sm" wrap="nowrap">
                <IconMail size={16} className="text-sealox-green shrink-0" />
                <a
                  href="mailto:salessealox@gmail.com"
                  className="text-xs text-gray-500 hover:text-sealox-green transition-colors no-underline break-all"
                >
                  salessealox@gmail.com
                </a>
              </Group>
              <Group gap="sm" wrap="nowrap">
                <IconWorld size={16} className="text-sealox-green shrink-0" />
                <Link
                  to="/"
                  className="text-xs text-gray-500 hover:text-sealox-green transition-colors no-underline"
                >
                  www.sealox.com
                </Link>
              </Group>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <Text className="text-xs text-gray-500">
            © 2026 Sealox Engineering. All Rights Reserved.
          </Text>
          <Group gap="lg">
            <Link
              to="/about"
              className="text-xs text-gray-500 hover:text-sealox-green transition-colors no-underline"
            >
              Privacy Policy
            </Link>
            <span className="text-gray-300">|</span>
            <Link
              to="/about"
              className="text-xs text-gray-500 hover:text-sealox-green transition-colors no-underline"
            >
              Terms & Conditions
            </Link>
            <span className="text-gray-300">|</span>
            <Link
              to="/admin"
              className="text-xs text-slate-400 hover:text-sealox-green transition-colors no-underline flex items-center gap-1"
              title="Staff Catalog Console"
            >
              <span>⚙️</span>
              <span>Catalog Admin</span>
            </Link>
          </Group>
        </div>
      </Container>
    </Box>
  );
}

function SocialIcon({ icon, href }: Readonly<{ icon: React.ReactNode; href?: string }>) {
  return (
    <UnstyledButton
      component="a"
      href={href || '#'}
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      className="w-8 h-8 rounded border border-gray-200 flex items-center justify-center text-sealox-green hover:bg-sealox-green hover:text-white hover:border-sealox-green transition-colors"
    >
      {icon}
    </UnstyledButton>
  );
}

function FooterLink({ label, href }: Readonly<{ label: string; href: string }>) {
  const isCatalogue = href.endsWith('.pdf');

  if (isCatalogue) {
    return (
      <a
        href={href}
        download="SEALOX CATALOG 2026 PRINT.pdf"
        className="text-xs text-gray-500 hover:text-sealox-green transition-colors no-underline"
      >
        {label}
      </a>
    );
  }

  return (
    <Link
      to={href}
      className="text-xs text-gray-500 hover:text-sealox-green transition-colors no-underline"
    >
      {label}
    </Link>
  );
}
