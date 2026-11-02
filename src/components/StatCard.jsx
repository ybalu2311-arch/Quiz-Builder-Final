export default function StatCard({ label, value, helper, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-top"><span>{label}</span><span className="stat-icon">{icon}</span></div>
      <strong className="stat-value">{value}</strong>
      {helper && <span className="stat-helper">{helper}</span>}
    </div>
  );
}
