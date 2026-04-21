export const Trust = () => {
  return (
    <section className="py-12 border-y bg-card/40">
      <div className="container mx-auto px-4">
        <p className="text-center text-xs uppercase tracking-wider text-primary/50 mb-6">
          The infrastructure layer for forms — built on principles you already trust
        </p>
        <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-3 text-sm font-medium text-primary/60">
          <span>HMAC-signed webhooks</span>
          <span>·</span>
          <span>Idempotent delivery</span>
          <span>·</span>
          <span>Rate limiting</span>
          <span>·</span>
          <span>RLS-isolated storage</span>
          <span>·</span>
          <span>Versioned forms</span>
        </div>
      </div>
    </section>
  );
};
