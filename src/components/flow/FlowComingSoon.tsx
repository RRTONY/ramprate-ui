export function FlowComingSoon({ feature }: { feature: string }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6 py-24 text-center">
      <div>
        <p className="text-sm uppercase tracking-widest text-muted-foreground mb-3 font-mono">
          Flow Circuit
        </p>
        <h1 className="!text-3xl md:!text-5xl mb-4">{feature}</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          This part of the app is being connected to the live platform and isn&apos;t available here yet.
        </p>
      </div>
    </div>
  );
}
