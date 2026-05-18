function DashboardCard({
  title,
  description,
  value,
  onClick
}) {

  return (

    <button
      className="dashboard-card"
      onClick={onClick}
    >

      <h2>

        {title}

      </h2>

      <p>

        {description}

      </p>

      <strong>

        {value}

      </strong>

    </button>

  );

}

export default DashboardCard;