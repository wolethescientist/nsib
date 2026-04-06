export default function AllReportsPage() {
  return (
    <main className="container" style={{ paddingTop: '4rem', paddingBottom: '6rem' }}>
      <h1 className="text-navy" style={{ marginBottom: '2rem' }}>All Accident Reports</h1>
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <p className="text-slate">Combined archive across all transport modes.</p>
        {/* Reports list goes here */}
      </div>
    </main>
  );
}
