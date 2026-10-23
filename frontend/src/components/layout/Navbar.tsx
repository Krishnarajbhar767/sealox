import { Link, useLocation, type Location } from 'react-router-dom';
import {
  Box,
  Container,
  Group,
  Menu,
  Text,
  Image,
  UnstyledButton,
  Burger,
  Drawer,
  Stack,
  Divider,
  Collapse,
} from '@mantine/core';
import {
  IconArrowRight,
  IconChevronDown,
  IconChevronRight,
  IconPhone,
  IconMail,
  IconMapPin,
} from '@tabler/icons-react';
import Button from '../ui/Button';
import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';

function HoverMenuItem({
  child,
  location,
}: Readonly<{ child: { title: string; link: string }; location: Location }>) {
  const [hovered, setHovered] = useState(false);
  const isActive = location.pathname === child.link;

  return (
    <Menu.Item
      component={Link}
      to={child.link}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: '6px',
        padding: '10px 16px',
        marginTop: '2px',
        marginBottom: '2px',
        backgroundColor: hovered ? '#F3F4F6' : 'transparent',
        color: hovered || isActive ? '#50B861' : '#374151',
        fontWeight: isActive ? 600 : 500,
        transition: 'all 0.2s ease',
      }}
    >
      {child.title}
    </Menu.Item>
  );
}

export function Navbar() {
  const location = useLocation();
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);

  const links = [
    { title: 'Home', link: '/' },
    {
      title: 'Products',
      link: '/products',
      children: [
        {
          title: 'Close / Stock Type Seal',
          link: '/products/close-stock-type-elastomer-unbalanced-seal',
        },
        {
          title: 'Open Type Elastomer Seal',
          link: '/products/open-type-elastomer-unbalanced-seal',
        },
        { title: 'All Products Overview', link: '/products' },
      ],
    },
    { title: 'About', link: '/about' },
  ];

  return (
    <Box
      component="header"
      p="sm"
      bg="white"
      style={{
        borderBottom: '1px solid #E5E7EB',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
      }}
    >
      <Container size="xl" px={{ base: 'md', sm: 'lg' }}>
        <Group justify="space-between" align="center" wrap="nowrap">
          {/* Brand Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center' }} onClick={closeDrawer}>
            <Image
              src="/logo.png"
              alt="Sealox Logo"
              h={{ base: 42, sm: 50 }}
              w="auto"
              fit="contain"
            />
          </Link>

          {/* Desktop Navigation and CTA (hidden below 1024px) */}
          <Group gap={28} align="center" visibleFrom="lg">
            <Group gap={32}>
              {links.map((itm) => {
                const isActive =
                  itm.link === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(itm.link);

                const activeColor = '#50B861';
                const inactiveColor = '#4B5563';

                if (itm.children) {
                  return (
                    <Menu
                      key={itm.link}
                      trigger="hover"
                      openDelay={50}
                      closeDelay={200}
                      shadow="xl"
                      radius="sm"
                      offset={14}
                      withArrow
                      arrowPosition="center"
                    >
                      <Menu.Target>
                        <UnstyledButton
                          component={Link}
                          to={itm.link}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            color: isActive ? activeColor : inactiveColor,
                            fontWeight: isActive ? 600 : 500,
                            transition: 'color 0.2s ease',
                          }}
                        >
                          <Text size="md" className="capitalize" inherit>
                            {itm.title}
                          </Text>
                          <IconChevronDown
                            size={14}
                            style={{
                              marginTop: '2px',
                              color: isActive ? activeColor : '#9CA3AF',
                            }}
                          />
                        </UnstyledButton>
                      </Menu.Target>

                      <Menu.Dropdown bg="white" bd="1px solid #F3F4F6" p="xs">
                        {itm.children.map((child) => (
                          <HoverMenuItem key={child.link} child={child} location={location} />
                        ))}
                      </Menu.Dropdown>
                    </Menu>
                  );
                }

                return (
                  <UnstyledButton
                    key={itm.link}
                    component={Link}
                    to={itm.link}
                    style={{
                      color: isActive ? activeColor : inactiveColor,
                      fontWeight: isActive ? 600 : 500,
                      transition: 'color 0.2s ease',
                    }}
                  >
                    <Text size="md" className="capitalize" inherit>
                      {itm.title}
                    </Text>
                  </UnstyledButton>
                );
              })}
            </Group>

            <Link to="/contact" style={{ textDecoration: 'none' }}>
              <Button varient="green">
                Contact Us <IconArrowRight size={20} />
              </Button>
            </Link>
          </Group>

          {/* Mobile Hamburger Button (hidden on desktop lg+) */}
          <Burger
            opened={drawerOpened}
            onClick={toggleDrawer}
            hiddenFrom="lg"
            size="sm"
            color="#111827"
            aria-label="Toggle mobile navigation menu"
          />
        </Group>
      </Container>

      {/* Mobile Slide-over Drawer */}
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        position="right"
        size="82%"
        padding="md"
        hiddenFrom="lg"
        title={
          <Group gap="xs">
            <Image src="/logo.png" alt="Sealox" h={38} w="auto" fit="contain" />
          </Group>
        }
        styles={{
          content: {
            display: 'flex',
            flexDirection: 'column',
          },
          body: {
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            paddingTop: 16,
          },
        }}
      >
        <Stack gap="xs" style={{ flex: 1 }}>
          {links.map((itm) => {
            const isActive =
              itm.link === '/' ? location.pathname === '/' : location.pathname.startsWith(itm.link);

            if (itm.children) {
              return (
                <Box key={itm.link}>
                  <UnstyledButton
                    onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: 8,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: isActive ? '#EEF8F0' : 'transparent',
                      color: isActive ? '#50B861' : '#1F2937',
                      fontWeight: 600,
                      fontSize: '15px',
                    }}
                  >
                    <Text inherit>{itm.title}</Text>
                    <IconChevronDown
                      size={16}
                      style={{
                        transform: mobileProductsOpen ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.2s ease',
                        color: '#6B7280',
                      }}
                    />
                  </UnstyledButton>

                  <Collapse expanded={mobileProductsOpen}>
                    <Stack gap={4} pl={16} pt={4} pb={4}>
                      {itm.children.map((child) => {
                        const isChildActive = location.pathname === child.link;
                        return (
                          <UnstyledButton
                            key={child.link}
                            component={Link}
                            to={child.link}
                            onClick={closeDrawer}
                            style={{
                              padding: '8px 12px',
                              borderRadius: 6,
                              fontSize: '13.5px',
                              fontWeight: isChildActive ? 600 : 500,
                              color: isChildActive ? '#50B861' : '#4B5563',
                              backgroundColor: isChildActive ? '#F0FDF4' : 'transparent',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                            }}
                          >
                            <IconChevronRight
                              size={13}
                              color={isChildActive ? '#50B861' : '#9CA3AF'}
                            />
                            {child.title}
                          </UnstyledButton>
                        );
                      })}
                    </Stack>
                  </Collapse>
                </Box>
              );
            }

            return (
              <UnstyledButton
                key={itm.link}
                component={Link}
                to={itm.link}
                onClick={closeDrawer}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 8,
                  fontSize: '15px',
                  fontWeight: isActive ? 600 : 500,
                  backgroundColor: isActive ? '#EEF8F0' : 'transparent',
                  color: isActive ? '#50B861' : '#1F2937',
                  transition: 'background-color 0.15s ease',
                }}
              >
                {itm.title}
              </UnstyledButton>
            );
          })}

          <UnstyledButton
            component={Link}
            to="/contact"
            onClick={closeDrawer}
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: 8,
              fontSize: '15px',
              fontWeight: location.pathname === '/contact' ? 600 : 500,
              backgroundColor: location.pathname === '/contact' ? '#EEF8F0' : 'transparent',
              color: location.pathname === '/contact' ? '#50B861' : '#1F2937',
            }}
          >
            Contact Us
          </UnstyledButton>
        </Stack>

        <Divider my="md" />

        {/* Mobile Drawer Bottom CTA & Quick Contacts */}
        <Box pt="xs">
          <Link
            to="/contact"
            onClick={closeDrawer}
            style={{ textDecoration: 'none', display: 'block', width: '100%' }}
          >
            <Button varient="green" style={{ width: '100%' }}>
              Request Engineering Quote <IconArrowRight size={18} />
            </Button>
          </Link>

          <Stack gap={10} mt="lg">
            <Group gap={8} wrap="nowrap">
              <IconPhone size={15} color="#50B861" />
              <a href="tel:+919664988493" style={{ textDecoration: 'none' }}>
                <Text size="xs" c="#4B5563" fw={500}>
                  +91 96649 88493
                </Text>
              </a>
            </Group>
            <Group gap={8} wrap="nowrap">
              <IconMail size={15} color="#50B861" />
              <a href="mailto:salessealox@gmail.com" style={{ textDecoration: 'none' }}>
                <Text size="xs" c="#4B5563" fw={500} style={{ wordBreak: 'break-all' }}>
                  salessealox@gmail.com
                </Text>
              </a>
            </Group>
            <Group gap={8} wrap="nowrap" align="flex-start">
              <IconMapPin size={15} color="#50B861" style={{ marginTop: 2, flexShrink: 0 }} />
              <Text size="xs" c="#6B7280" lh={1.4}>
                Gala No. 39, Real Estate Commercial Complex, Rajosana Approach Road, Chappi,
                Gujarat, 385210
              </Text>
            </Group>
          </Stack>
        </Box>
      </Drawer>
    </Box>
  );
}
