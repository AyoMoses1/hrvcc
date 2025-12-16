'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface InactivityTimeoutModalProps {
  isOpen: boolean;
  secondsRemaining: number;
  onExtend: () => void;
  onSignOut: () => void;
}

export function InactivityTimeoutModal({
  isOpen,
  secondsRemaining,
  onExtend,
  onSignOut,
}: InactivityTimeoutModalProps) {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    setMinutes(Math.floor(secondsRemaining / 60));
    setSeconds(secondsRemaining % 60);
  }, [secondsRemaining]);

  const formatTime = (mins: number, secs: number) => {
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-orange-100 p-4">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </div>
          <DialogTitle className="text-center text-xl">
            We&apos;ll sign you out in {formatTime(minutes, seconds)}
          </DialogTitle>
          <DialogDescription className="pt-2 text-center">
            We sign you out of your account when you&apos;re inactive for 1 hour. You can change
            your inactivity timer in{' '}
            <button
              onClick={() => {
                // Navigate to settings when implemented
                console.log('Navigate to settings');
              }}
              className="text-primary underline hover:no-underline"
            >
              Advanced Settings
            </button>
            .
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6 flex gap-3">
          <Button onClick={onExtend} className="flex-1" size="lg">
            I need more time
          </Button>
          <Button onClick={onSignOut} variant="outline" className="flex-1" size="lg">
            Sign out
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
