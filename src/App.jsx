import { useEffect, useMemo, useState } from "react";
import BackToTop from "./components/BackToTop.jsx";
import CartDrawer from "./components/CartDrawer.jsx";
import CatalogModal from "./components/CatalogModal.jsx";
import FloatingWhatsApp from "./components/FloatingWhatsApp.jsx";
import Footer from "./layout/Footer.jsx";
import Header from "./layout/Header.jsx";
import TopBar from "./layout/TopBar.jsx";
import { useBodyScrollLock } from "./hooks/useBodyScrollLock.js";
import { useScrollSpy } from "./hooks/useScrollSpy.js";
import { useStore } from "./context/StoreContext.jsx";
import {
  brands,
  clientLogos,
  categories,
  certifications,
  ratingSummary,
  seenIn,
  ugcPosts,
  enterpriseProof,
  miniCases,
  drops,
  faqs,
  highlights,
  industries,
  insights,
  navLinks,
  plans,
  products,
  productList,
  retailPitch,
  services,
  site,
  testimonials,
  whyUs
} from "./data/siteData.js";
import BrandsMarquee from "./sections/BrandsMarquee.jsx";
import EnterpriseProof from "./sections/EnterpriseProof.jsx";
import CaseStudy from "./sections/CaseStudy.jsx";
import Categories from "./sections/Categories.jsx";
import Certifications from "./sections/Certifications.jsx";
import Contact from "./sections/Contact.jsx";
import Drops from "./sections/Drops.jsx";
import Faq from "./sections/Faq.jsx";
import FeaturedKit from "./sections/FeaturedKit.jsx";
import Hero from "./sections/Hero.jsx";
import Highlights from "./sections/Highlights.jsx";
import Industries from "./sections/Industries.jsx";
import Insights from "./sections/Insights.jsx";
import Plans from "./sections/Plans.jsx";
import Products from "./sections/Products.jsx";
import Process from "./sections/Process.jsx";
import RetailPitch from "./sections/RetailPitch.jsx";
import Services from "./sections/Services.jsx";
import Testimonials from "./sections/Testimonials.jsx";
import SizeGuide from "./sections/SizeGuide.jsx";
import MiniCases from "./sections/MiniCases.jsx";
import WhyUs from "./sections/WhyUs.jsx";
import SocialProof from "./sections/SocialProof.jsx";
import StyleGuide from "./sections/StyleGuide.jsx";
import ProductSheetModal from "./components/ProductSheetModal.jsx";
import RFQModal from "./components/RFQModal.jsx";
import StickyQuoteCTA from "./components/StickyQuoteCTA.jsx";
import { LeadProvider } from "./context/LeadContext.jsx";
import SeoJsonLd from "./components/SeoJsonLd.jsx";
import FitFinderModal from "./components/FitFinderModal.jsx";

export default function App() {
  const showStyleGuide = useMemo(() => {
    if (typeof window === "undefined") return false;
    return new URLSearchParams(window.location.search).has("styleguide");
  }, []);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [rfqOpen, setRfqOpen] = useState(false);
  const activeHref = useScrollSpy(navLinks);
  const {
    catalogOpen,
    catalogInitialLine,
    catalogInitialDiscipline,
    openCatalog,
    closeCatalog,
    openFitFinder,
    fitFinderOpen,
    closeFitFinder,
    fitProfile,
    setFitProfile,
    openProductSheet
  } = useStore();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      const doc = document.documentElement;
      const max = Math.max(1, (doc?.scrollHeight || 1) - (window.innerHeight || 1));
      setHasScrolled(y > 10);
      setShowTop(y > 900);
      setScrollProgress(Math.max(0, Math.min(1, y / max)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMenuOpen]);

  useEffect(() => {
    const onKeyDown = (event) => {
      const key = String(event.key || "").toLowerCase();
      const isK = key === "k";
      if (!isK) return;
      if (!(event.ctrlKey || event.metaKey)) return;
      event.preventDefault();
      openCatalog?.("Todos");
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openCatalog]);

  useBodyScrollLock(isMenuOpen);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const openRfq = () => setRfqOpen(true);
  const closeRfq = () => setRfqOpen(false);

  return (
    <LeadProvider>
      <div className="min-h-screen text-ink-950">
        <SeoJsonLd site={site} faqs={faqs} products={products} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-[60] focus:rounded-2xl focus:bg-white focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-ink-950 focus:shadow-soft"
        >
          Saltar al contenido
        </a>

        <TopBar site={site} />

      <Header
        site={site}
        links={navLinks}
        activeHref={activeHref}
        hasScrolled={hasScrolled}
        scrollProgress={scrollProgress}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        onOpenRfq={openRfq}
      >
        <Hero products={products} proof={enterpriseProof} />
      </Header>

        <main id="main">
          {showStyleGuide ? <StyleGuide /> : null}
          <BrandsMarquee brands={brands} />
          <EnterpriseProof clientLogos={clientLogos} proof={enterpriseProof} site={site} />
          <Industries industries={industries} />
          <Products products={products} />
          <Categories categories={categories} />
          <Services services={services} />
          <WhyUs data={whyUs} />
          <Drops drops={drops} site={site} />
          <FeaturedKit productList={productList} />
          <Highlights highlights={highlights} />
          <SocialProof ratingSummary={ratingSummary} seenIn={seenIn} ugcPosts={ugcPosts} />
          <CaseStudy onOpenRfq={openRfq} />
          <MiniCases cases={miniCases} />
          <Certifications certifications={certifications} />
          <SizeGuide />
          <Plans plans={plans} />
          <RetailPitch data={retailPitch} onOpenRfq={openRfq} />
          <Testimonials testimonials={testimonials} />
          <Process onOpenRfq={openRfq} />
          <Insights insights={insights} />
          <Faq faqs={faqs} />
          <Contact site={site} onOpenRfq={openRfq} />
        </main>

        <CatalogModal
          open={catalogOpen}
          onClose={closeCatalog}
          products={products}
          initialLine={catalogInitialLine}
          initialDiscipline={catalogInitialDiscipline}
          onOpenProduct={openProductSheet}
        />
        <ProductSheetModal site={site} products={products} onOpenRfq={openRfq} />
        <CartDrawer site={site} />
        <RFQModal open={rfqOpen} onClose={closeRfq} site={site} />
        <FitFinderModal
          open={fitFinderOpen}
          onClose={closeFitFinder}
          profile={fitProfile}
          onSave={setFitProfile}
        />

        <BackToTop show={showTop} onClick={scrollToTop} />
        <StickyQuoteCTA onOpenFitFinder={openFitFinder} />
        <FloatingWhatsApp site={site} />
        <Footer site={site} />
      </div>
    </LeadProvider>
  );
}
