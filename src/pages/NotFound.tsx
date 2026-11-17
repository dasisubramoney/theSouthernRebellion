import { Link } from 'react-router-dom';
import { Seo } from '../components/seo/Seo';
import { Dagger } from '../components/brand/Dagger';

export default function NotFound() {
  return (
    <>
      <Seo
        title="Page not found"
        description="This page does not exist at The Southern Rebellion."
        path="/404"
        noindex
      />
      <section className="shell pt-16 md:pt-24">
        <Dagger className="h-24 w-auto text-ash" />
        <h1 className="mt-8 max-w-[14ch] font-display text-h1">Nothing on this page</h1>
        <p className="mt-6 measure text-lead">
          The link may be old, or the page may have moved. The artists and the booking form are still here.
        </p>
        <p className="mt-8 flex flex-wrap gap-6">
          <Link className="link" to="/#artists">See the artists</Link>
          <Link className="link" to="/#how-to-book">How to book</Link>
        </p>
      </section>
    </>
  );
}
