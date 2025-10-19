import { MotionFlowProcessor } from '@/components/motion-flow-processor';
import { Logo } from '@/components/logo';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 max-w-5xl items-center px-4">
          <Logo />
        </div>
      </header>
      <main className="flex-1">
        <div className="container mx-auto flex max-w-5xl flex-1 flex-col items-center justify-center space-y-8 p-4 py-16">
          <MotionFlowProcessor />
        </div>
      </main>
      <footer className="w-full border-t">
        <div className="container mx-auto flex h-16 max-w-5xl items-center justify-center px-4">
          <p className="text-sm text-muted-foreground">
            Powered by{' '}
            <a
              href="https://github.com/DejavuMoe/MotionFlow"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              MotionFlow
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
