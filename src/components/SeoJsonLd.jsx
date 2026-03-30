function parsePrice(price) {
  const s = String(price || "").replace(/[^\d]/g, "");
  const n = Number(s || 0);
  return Number.isFinite(n) ? n : 0;
}

export default function SeoJsonLd({ site, faqs = [], products = [], baseUrl = "https://voltwear.com" }) {
  const org = {
    "@type": "Organization",
    name: site?.brand || "VoltWear",
    url: baseUrl,
    email: site?.email,
    telephone: site?.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: site?.addressLine1,
      addressLocality: site?.city,
      addressCountry: "AR"
    }
  };

  const local = {
    "@type": "SportingGoodsStore",
    name: site?.brand || "VoltWear",
    url: baseUrl,
    telephone: site?.phone,
    email: site?.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: site?.addressLine1,
      addressLocality: site?.city,
      addressCountry: "AR"
    }
  };

  const faqItems = (faqs || [])
    .filter((f) => f?.question && f?.answer)
    .slice(0, 10)
    .map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer }
    }));

  const graph = [org, local];
  if (faqItems.length) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: faqItems
    });
  }

  const featured = (products || []).slice(0, 6).filter((p) => p?.name && p?.image);
  for (const p of featured) {
    const price = parsePrice(p.price);
    graph.push({
      "@type": "Product",
      name: p.name,
      image: [`${baseUrl}${p.image}`],
      brand: { "@type": "Brand", name: p.brand || site?.brand || "VoltWear" },
      category: p.line,
      sku: p.sku,
      offers: price
        ? {
            "@type": "Offer",
            priceCurrency: "ARS",
            price,
            availability: Number(p.stock || 0) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            url: baseUrl
          }
        : undefined,
      aggregateRating:
        p.rating && p.reviewsCount
          ? {
              "@type": "AggregateRating",
              ratingValue: Number(p.rating),
              reviewCount: Number(p.reviewsCount)
            }
          : undefined
    });
  }

  const jsonLd = { "@context": "https://schema.org", "@graph": graph };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
