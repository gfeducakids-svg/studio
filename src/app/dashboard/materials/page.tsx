import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Video } from 'lucide-react';

const materials = [
  {
    title: 'Pinyin Chart (PDF)',
    description: 'A complete one-page reference for all Pinyin initials and finals.',
    icon: FileText,
    type: 'PDF'
  },
  {
    title: 'Tone Practice Audio',
    description: 'Audio files to practice listening and distinguishing the four main tones.',
    icon: Video,
    type: 'Audio'
  },
  {
    title: 'Initial-Final Combination Table',
    description: 'A comprehensive table showing all valid combinations of initials and finals.',
    icon: FileText,
    type: 'PDF'
  },
];

export default function MaterialsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-2">Learning Materials</h1>
      <p className="text-muted-foreground mb-8">Downloadable resources to supplement your learning.</p>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {materials.map((material, index) => (
          <Card key={index} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-primary/10 p-3">
                    <material.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <CardTitle className="font-headline text-lg leading-tight">{material.title}</CardTitle>
                    <CardDescription>{material.type}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground">{material.description}</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
