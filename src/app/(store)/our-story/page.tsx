import Link from "next/link";
import { AnimateIn } from "@/components/animate-in";

export default function OurStoryPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#f8f6f0] py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <AnimateIn animation="fade-in-up">
            <img
              src="/brand/icon.jpeg"
              alt="Madur Life"
              className="w-24 h-24 rounded-full object-cover mx-auto mb-8 shadow-lg"
            />
          </AnimateIn>
          <AnimateIn animation="fade-in-up" delay={100}>
            <h1 className="font-serif text-5xl sm:text-6xl font-bold text-foreground">
              Our Story
            </h1>
          </AnimateIn>
          <AnimateIn animation="fade-in-up" delay={200}>
            <p className="mt-6 text-lg text-muted max-w-2xl mx-auto leading-relaxed">
              Madhur Life was born from the idea of bringing people back to nature
              — where food is medicine and grains are the treasure of health.
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* Story Content */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <div className="prose prose-lg max-w-none">
              <p className="text-muted leading-relaxed text-lg">
                The logo tells the story — a figure rising joyfully from lush green leaves, representing life, energy and wellness nurtured by the Earth. Just as the leaves protect and nourish, Madhur Life celebrates wholesome grains that have sustained generations.
              </p>
            </div>
          </AnimateIn>

          <AnimateIn delay={100}>
            <blockquote className="my-12 border-l-4 border-primary pl-6 py-2">
              <p className="font-serif text-2xl sm:text-3xl text-foreground leading-snug italic">
                &ldquo;Experience the richness of true, wholesome food — a lifestyle upgrade.&rdquo;
              </p>
            </blockquote>
          </AnimateIn>

          <AnimateIn delay={200}>
            <p className="text-muted leading-relaxed text-lg">
              Every pack we send out is freshly milled, naturally processed and packed with care. No shortcuts. No compromise. Only purity — because quality is not an option, it&apos;s a promise.
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-16 sm:py-20 bg-[#f8f6f0]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5a17.92 17.92 0 01-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg>,
                title: "Naturally Processed",
                desc: "Stone-ground and freshly milled from premium grains, the traditional way."
              },
              {
                icon: <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5a17.92 17.92 0 01-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg>,
                title: "Sourced with Care",
                desc: "We work directly with trusted farms to bring you grains you can trust."
              },
              {
                icon: <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>,
                title: "Healthy You, Happy Family",
                desc: "Wholesome goodness in every pack — for the people who matter most."
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-border bg-white p-8"
              >
                <div className="text-primary mb-4">{item.icon}</div>
                <h3 className="font-serif text-xl font-bold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Processed By Section */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <AnimateIn animation="slide-in-left">
              <div>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-6">
                  Processed &amp; Packed by Akshatha Traders
                </h2>
                <div className="space-y-2 text-muted leading-relaxed">
                  <p>Matter Thota, Harapanahalli,</p>
                  <p>Vijayanagar, Karnataka</p>
                  <p>FSSAI Lic. No. 21225337001107</p>
                  <p className="mt-4">
                    Customer Care:{" "}
                    <a href="tel:+919483205069" className="text-primary font-semibold hover:text-primary/80 transition-colors">
                      +91 94832 05069
                    </a>
                  </p>
                </div>
                <Link
                  href="/products"
                  className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-8 text-sm font-semibold text-white shadow-lg shadow-primary/25 hover:bg-primary/90 hover:scale-105 transition-all duration-200"
                >
                  Shop our grains
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            </AnimateIn>
            <AnimateIn animation="fade-in-up" delay={150}>
              <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="text-xs font-bold tracking-widest uppercase text-muted mb-2">Processed &amp; Packed By :</div>
                    <div className="font-serif text-2xl font-bold text-foreground mb-1">AKSHATHA TRADERS</div>
                    <div className="text-sm text-muted mb-4">MATTER THOTA, HARAPANAHALLI,<br />VIJAYANAGAR</div>
                    <div className="text-sm text-muted mb-4">Customer Care No.: 9483205069</div>
                    <div className="inline-block border-2 border-primary/20 rounded-lg px-6 py-3">
                      <div className="text-xs text-muted mb-1">fssai</div>
                      <div className="text-sm font-bold text-foreground">Lic. No. 21225337001107</div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>
    </>
  );
}
