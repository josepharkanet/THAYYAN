import { Helmet } from 'react-helmet-async';

export default function SEO({ 
  title, 
  description, 
  keywords,
  image,
  url,
  type = 'website',
  product = null 
}) {
  const siteName = 'Stonic Export';
  const defaultDescription = 'Premium Indian Natural Stones - Marble, Granite, Paving Stones, Cobbles, and Handicrafts. 8+ years of excellence in global stone exports.';
  const defaultImage = 'https://static.prod-images.emergentagent.com/jobs/d7be1953-c1b2-4391-b4cf-169457290853/images/3eda6b8e24809bd6028cb07fecfdd62dc519881e7e26072e0318301ceb793ef5.png';
  const siteUrl = 'https://www.stonicexport.com';

  const seoTitle = title ? `${title} | ${siteName}` : `${siteName} - Premium Indian Natural Stones`;
  const seoDescription = description || defaultDescription;
  const seoImage = image || defaultImage;
  const seoUrl = url || siteUrl;

  // Structured data for products (JSON-LD)
  const productSchema = product ? {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.image_url,
    "brand": {
      "@type": "Brand",
      "name": "Stonic Export"
    },
    "manufacturer": {
      "@type": "Organization",
      "name": "Stonic Marble & Granite"
    },
    "category": product.category,
    "material": product.category.includes('marble') ? 'Marble' : product.category.includes('granite') ? 'Granite' : 'Natural Stone',
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InStock",
      "priceCurrency": "USD",
      "seller": {
        "@type": "Organization",
        "name": "Stonic Export"
      }
    }
  } : null;

  // Organization schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Stonic Export",
    "alternateName": "Stonic Marble & Granite",
    "url": siteUrl,
    "logo": defaultImage,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-9544982471",
      "contactType": "sales",
      "areaServed": ["IN", "US", "EU"],
      "availableLanguage": ["English", "Hindi"]
    },
    "sameAs": [
      "https://wa.me/919544982471"
    ]
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content="Stonic Export" />
      <link rel="canonical" href={seoUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={seoUrl} />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />

      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="geo.region" content="IN" />
      <meta name="geo.placename" content="India" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      {productSchema && (
        <script type="application/ld+json">
          {JSON.stringify(productSchema)}
        </script>
      )}
    </Helmet>
  );
}
