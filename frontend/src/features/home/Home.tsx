import { Hero } from './components/Hero';
import { Products } from './components/Products';
import { Industries } from './components/Industries';
import { ManufacturingProcess } from './components/ManufacturingProcess';
import { TechAndGlobal } from './components/TechAndGlobal';
import { ResourcesAndCta } from './components/ResourcesAndCta';

export function Home() {
  return (
    <div>
      <Hero />
      <Products />
      <Industries />
      <ManufacturingProcess />
      <TechAndGlobal />
      <ResourcesAndCta />
    </div>
  );
}
