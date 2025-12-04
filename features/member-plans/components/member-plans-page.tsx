'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, Plus, Loader2 } from 'lucide-react';
import { MemberPlan } from '@/lib/types';
import { exportMemberPlansCSV } from '@/lib/utils/csv';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useMemberPlans, useCreateMemberPlan } from '@/hooks/use-member-plans';

export function MemberPlansPage() {
  const { data: plansData, isLoading, error } = useMemberPlans({ page: 1, limit: 100 });
  const plans = plansData?.data || [];
  const createPlanMutation = useCreateMemberPlan();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPlan, setNewPlan] = useState({
    category: '',
    name: '',
    monthly: '',
    yearly: '',
    oneTime: '',
    features: '',
    description: '',
  });

  const handleAddPlan = async () => {
    if (!newPlan.category || !newPlan.name) {
      return;
    }

    try {
      await createPlanMutation.mutateAsync({
        category: newPlan.category,
        name: newPlan.name,
        pricing: {
          monthly: newPlan.monthly ? parseFloat(newPlan.monthly) : undefined,
          yearly: newPlan.yearly ? parseFloat(newPlan.yearly) : undefined,
          oneTime: newPlan.oneTime ? parseFloat(newPlan.oneTime) : undefined,
        },
        features: newPlan.features
          .split(',')
          .map((f) => f.trim())
          .filter(Boolean),
        description: newPlan.description || undefined,
      });

      setNewPlan({
        category: '',
        name: '',
        monthly: '',
        yearly: '',
        oneTime: '',
        features: '',
        description: '',
      });
      setIsDialogOpen(false);
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleExportCSV = () => {
    exportMemberPlansCSV(plans);
  };

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Member Plans</h1>
          <p className="text-muted-foreground">Manage membership plans and pricing options</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Plan
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Member Plan</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={newPlan.category}
                      onChange={(e) => setNewPlan({ ...newPlan, category: e.target.value })}
                      placeholder="e.g., Basic, Professional"
                    />
                  </div>
                  <div>
                    <Label htmlFor="name">Plan Name</Label>
                    <Input
                      id="name"
                      value={newPlan.name}
                      onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                      placeholder="e.g., Starter Plan"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={newPlan.description}
                    onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                    placeholder="Plan description"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="monthly">Monthly Price ($)</Label>
                    <Input
                      id="monthly"
                      type="number"
                      value={newPlan.monthly}
                      onChange={(e) => setNewPlan({ ...newPlan, monthly: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="yearly">Yearly Price ($)</Label>
                    <Input
                      id="yearly"
                      type="number"
                      value={newPlan.yearly}
                      onChange={(e) => setNewPlan({ ...newPlan, yearly: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="oneTime">One-Time Price ($)</Label>
                    <Input
                      id="oneTime"
                      type="number"
                      value={newPlan.oneTime}
                      onChange={(e) => setNewPlan({ ...newPlan, oneTime: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="features">Features (comma-separated)</Label>
                  <Input
                    id="features"
                    value={newPlan.features}
                    onChange={(e) => setNewPlan({ ...newPlan, features: e.target.value })}
                    placeholder="Feature 1, Feature 2, Feature 3"
                  />
                </div>
                <Button
                  onClick={handleAddPlan}
                  className="w-full"
                  disabled={createPlanMutation.isPending}
                >
                  {createPlanMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Add Plan'
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-4 text-muted-foreground">Loading member plans...</p>
        </div>
      ) : error ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-destructive">Failed to load member plans. Please try again.</p>
          </CardContent>
        </Card>
      ) : plans.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No member plans found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <Card
              key={plan.id}
              className="card-hover animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription className="mt-1">{plan.category}</CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Enroll
                  </Badge>
                </div>
                {plan.description && (
                  <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {plan.pricing.monthly && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Monthly:</span>
                      <span className="font-semibold">{plan.pricing.monthly}/mo</span>
                    </div>
                  )}
                  {plan.pricing.yearly && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Yearly:</span>
                      <span className="font-semibold">{plan.pricing.yearly}/yr</span>
                    </div>
                  )}
                  {plan.pricing.oneTime && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">One-Time:</span>
                      <span className="font-semibold">{plan.pricing.oneTime}</span>
                    </div>
                  )}
                  <div className="mt-4 border-t pt-3">
                    <p className="mb-2 text-sm font-semibold">Features:</p>
                    <ul className="max-h-64 space-y-1 overflow-y-auto text-sm text-muted-foreground">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                          <span className="text-xs">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
