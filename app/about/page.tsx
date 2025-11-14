import { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Users, Globe, Briefcase, Target, Award, TrendingUp } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn more about HRVCC and our mission to serve veterans',
};

const stats = [
  { label: 'Active Members', value: '2,800+', icon: Users },
  { label: 'Member Businesses', value: '2,800+', icon: Globe },
  { label: 'Events Hosted', value: '150+', icon: Briefcase },
  { label: 'Success Stories', value: '500+', icon: Award },
];

const values = [
  {
    icon: Target,
    title: 'Our Mission',
    description:
      "To foster the success of veterans, active-duty military, and their families in the thriving business landscape of the Houston region.",
  },
  {
    icon: TrendingUp,
    title: 'Our Vision',
    description:
      'To empower every veteran-owned business to achieve their full potential through meaningful connections, resources, and opportunities.',
  },
  {
    icon: Award,
    title: 'Our Values',
    description: 'Service, integrity, camaraderie, and commitment to veteran success drive everything we do.',
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b bg-gradient-to-b from-muted/50 to-background py-20">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-6 text-4xl font-bold lg:text-5xl">
                Serving Houston Veterans, One Business at a Time
              </h1>
              <p className="mb-8 text-lg text-muted-foreground">
                HRVCC is dedicated to fostering the success of veterans, active-duty military, and their families
                in the thriving business landscape of the Houston region.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button size="lg" asChild>
                  <Link href="/auth/signup">Join Us Today</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/explore">Explore Network</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-b py-16">
          <div className="container">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <Card key={stat.label}>
                    <CardContent className="flex flex-col items-center p-6 text-center">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="text-3xl font-bold">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16">
          <div className="container">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold">Our Mission, Vision & Values</h2>
              <p className="text-lg text-muted-foreground">
                What drives us to support and empower veteran-owned businesses
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {values.map((value) => {
                const Icon = value.icon;
                return (
                  <Card key={value.title}>
                    <CardContent className="p-6">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="mb-2 text-xl font-semibold">{value.title}</h3>
                      <p className="text-muted-foreground">{value.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t py-20">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-4 text-3xl font-bold lg:text-4xl">Ready to Get Started?</h2>
              <p className="mb-8 text-lg text-muted-foreground">
                Join hundreds of veteran-owned businesses already thriving in the HRVCC community.
              </p>
              <Button size="lg" asChild>
                <Link href="/auth/signup">Create Your Account</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
