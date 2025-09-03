'use client'
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from '@/hooks/use-toast';
import React from 'react';

const recentFeedback = [
    {
        user: "Alice",
        avatar: "https://picsum.photos/101/101",
        feedback: "The tone exercises are fantastic! Really helped me distinguish between the 2nd and 3rd tones."
    },
    {
        user: "Bob",
        avatar: "https://picsum.photos/102/102",
        feedback: "I'd love to see more examples of 'ü' after j, q, x. It's a bit tricky."
    },
    {
        user: "Charlie",
        avatar: "https://picsum.photos/103/103",
        feedback: "The mobile experience is super smooth. Thanks for making it responsive!"
    }
];

export default function FeedbackPage() {
  const { toast } = useToast();
  const [feedback, setFeedback] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
        title: "Feedback Submitted",
        description: "Thank you for your input! We appreciate you helping us improve.",
    });

    setFeedback('');
    setIsSubmitting(false);
  }

  return (
    <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
            <h1 className="text-3xl font-bold font-headline mb-2">Feedback Hub</h1>
            <p className="text-muted-foreground">
                Have a suggestion or found a bug? Let us know. We read every piece of feedback.
            </p>
        </div>
        <div className="md:col-span-2 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Submit Your Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Textarea 
                          placeholder="Tell us what you think..." 
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                          rows={5}
                        />
                        <Button type="submit" className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90" disabled={isSubmitting}>
                          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <div className="space-y-4">
                <h2 className="text-2xl font-bold font-headline">Recent Feedback</h2>
                {recentFeedback.map((item, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                            <Avatar>
                                <AvatarImage src={item.avatar} data-ai-hint="person avatar" />
                                <AvatarFallback>{item.user.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <CardTitle className="text-base font-semibold">{item.user}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">{item.feedback}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    </div>
  );
}
