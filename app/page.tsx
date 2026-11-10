import Image from 'next/image';
import Link from 'next/link';

const FEATURES = [
  {
    title: 'Plan every Sunday',
    body: 'Hymns, prayers, ward business, speakers, and musical numbers in one clear agenda.',
  },
  {
    title: 'Four meeting types',
    body: 'Regular, fast and testimony, stake, and general conference meetings are all supported.',
  },
  {
    title: 'Print with confidence',
    body: 'Members can open this week’s program or any past one and print a clean copy.',
  },
];

export default function Home() {
  return (
    <div className="space-y-10">
      <section aria-labelledby="hero-heading" className="overflow-hidden rounded-2xl border border-line bg-surface">
        <Image
          src="/hero.jpg"
          alt="Rolling green hills beneath a warm sunrise sky"
          width={1600}
          height={640}
          priority
          sizes="(min-width: 1024px) 1024px, 100vw"
          className="h-48 w-full object-cover sm:h-64"
        />
        <div className="p-6 sm:p-8">
          <h1 id="hero-heading" className="text-3xl font-semibold sm:text-4xl">
            Sacrament Meeting Planner
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-muted">
            Help the bishopric and branch leaders plan each Sunday, and let members view and print
            current and past programs.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/meetings/current"
              className="rounded-md bg-brand px-5 py-2.5 font-semibold text-white hover:bg-brand-dark"
            >
              This week&rsquo;s program
            </Link>
            <Link
              href="/meetings"
              className="rounded-md border border-brand px-5 py-2.5 font-semibold text-brand-dark hover:bg-brand-light"
            >
              Browse all meetings
            </Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="features-heading">
        <h2 id="features-heading" className="mb-4 text-2xl font-semibold">
          What you can do
        </h2>
        <ul className="grid gap-4 sm:grid-cols-3">
          {FEATURES.map((feature) => (
            <li key={feature.title} className="rounded-xl border border-line bg-surface p-5">
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted">{feature.body}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
