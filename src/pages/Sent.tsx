import { Link } from 'react-router-dom';
import { Seo } from '../components/seo/Seo';
import { Dagger } from '../components/brand/Dagger';

/** Where the forms land when sent without JavaScript (the form's action). */
export default function Sent() {
  return (
    <>
      <Seo title="Sent" description="Your message has been sent to The Southern Rebellion." path="/sent" noindex />
      <section className="shell pt-16 md:pt-24">
        <Dagger className="h-24 w-auto text-ash" />
        <h1 className="mt-8 max-w-[14ch] font-display text-h1">Sent to the studio</h1>
        <p className="measure mt-6 text-lead">The studio has your message and will pass it to the right artist.</p>
        <p className="mt-8 flex flex-wrap gap-6">
          <Link className="link" to="/artists">
            Back to the artists
          </Link>
          <Link className="link" to="/aftercare">
            Aftercare notes
          </Link>
        </p>
      </section>
    </>
  );
}
