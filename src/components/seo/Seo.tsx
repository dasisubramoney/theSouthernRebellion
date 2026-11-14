import { Helmet } from 'react-helmet-async';
import { studio } from '../../content/studio';

type Props = {
  title: string;
  description: string;
  path: string;
  image?: string;
  noindex?: boolean;
  jsonLd?: object;
};

const defaultImage = '/og/studio.png';

export function Seo({ title, description, path, image = defaultImage, noindex, jsonLd }: Props) {
  const url = path === '/' ? `${studio.origin}/` : `${studio.origin}${path}`;
  const fullTitle = path === '/' ? title : `${title} | ${studio.name}`;
  return (
    <Helmet prioritizeSeoTags>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex ? <meta name="robots" content="noindex" /> : null}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={studio.name} />
      <meta property="og:locale" content="en_ZA" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={`${studio.origin}${image}`} />
      <meta name="twitter:card" content="summary_large_image" />
      {jsonLd ? <script type="application/ld+json">{JSON.stringify(jsonLd)}</script> : null}
    </Helmet>
  );
}
