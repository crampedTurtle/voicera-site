import { Helmet } from "react-helmet-async";
import { SITE_URL } from "@/lib/routes";

interface JsonLdProps {
  title: string;
  description: string;
  path: string;
}

const JsonLd = ({ title, description, path }: JsonLdProps) => {
  const url = `${SITE_URL}${path === "/" ? "" : path}`;

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "Voicera",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/favicon.ico`,
      width: 512,
      height: 512,
    },
    description:
      "Voicera uses multimodal AI to analyze verbal and non-verbal cues in real time — the intelligence layer for human credibility.",
    foundingDate: "2024",
    knowsAbout: [
      "Artificial Intelligence",
      "Multimodal AI",
      "Credibility Intelligence",
      "Behavioral Analysis",
      "Non-verbal Communication",
      "Sales Intelligence",
      "HR Technology",
    ],
    sameAs: [],
  };

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: "Voicera",
    url: SITE_URL,
    description:
      "The intelligence layer for human credibility — multimodal AI that analyzes verbal and non-verbal cues in real time.",
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en-US",
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}/#webpage`,
    name: title,
    description,
    url,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en-US",
    dateModified: new Date().toISOString().split("T")[0],
    ...(path === "/" && {
      mainEntity: { "@id": `${SITE_URL}/#organization` },
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["h1", ".type-display", "[role='main'] p"],
      },
    }),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      ...(path !== "/"
        ? [
            {
              "@type": "ListItem",
              position: 2,
              name: title.split("—")[0].trim(),
              item: url,
            },
          ]
        : []),
    ],
  };

  // FAQ schema for pages that may have accordion/FAQ content (AEO optimization)
  // SoftwareApplication schema for AGO (AI/Generative Optimization)
  const softwareAppSchema =
    path === "/"
      ? {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Voicera Sincerity™",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          description:
            "Multimodal AI platform that analyzes verbal and non-verbal cues to measure human credibility in real time.",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
            description: "Free tier available",
          },
          provider: { "@id": `${SITE_URL}/#organization` },
        }
      : null;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Voicera" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(webSiteSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(webPageSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
      {softwareAppSchema && (
        <script type="application/ld+json">
          {JSON.stringify(softwareAppSchema)}
        </script>
      )}
    </Helmet>
  );
};

export default JsonLd;
