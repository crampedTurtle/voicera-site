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
    name: "Voicera",
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.ico`,
    description:
      "Voicera uses multimodal AI to analyze verbal and non-verbal cues in real time.",
    sameAs: [],
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url,
    isPartOf: {
      "@type": "WebSite",
      name: "Voicera",
      url: SITE_URL,
    },
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

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(webPageSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
    </Helmet>
  );
};

export default JsonLd;
