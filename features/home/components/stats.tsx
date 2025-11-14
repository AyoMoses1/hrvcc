import { Users, Building2, Briefcase, Globe } from 'lucide-react';

const stats = [
  {
    label: 'Member Businesses',
    value: '2,800+',
    icon: Building2,
  },
  {
    label: 'Events Hosted',
    value: '150+',
    icon: Briefcase,
  },
  {
    label: 'Active Members',
    value: '2,800+',
    icon: Users,
  },
  {
    label: 'States Represented',
    value: '50+',
    icon: Globe,
  },
];

export function Stats() {
  return (
    <section className="border-b py-16">
      <div className="container">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

