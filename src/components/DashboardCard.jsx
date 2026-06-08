function DashboardCard({
  title,
  description,
  value,
  icon,
  variant = "",
  onClick,
}) {
  return (
    <article
      className={`dashboard-card ${variant}`}
      onClick={onClick}
    >
      <div className="dashboard-card-content">
        {icon && <span className="dashboard-card-icon">{icon}</span>}

        <h2>{title}</h2>

        <p>{description}</p>

        <strong>{value}</strong>
      </div>
    </article>
  );
}

export default DashboardCard;