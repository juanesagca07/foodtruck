function Menu({
  cambiarPantalla
}) {

  return (

    <main className="page">

      <header className="topbar">

        <div>

          <h1>

            Menú FoodTruck

          </h1>

          <p>

            Sistema funcionando correctamente

          </p>

        </div>

        <button
          className="secondary-btn"
          onClick={() =>
            cambiarPantalla("dashboard")
          }
        >

          Volver

        </button>

      </header>

      <section className="dashboard-grid">

        <article className="dashboard-card">

          <h2>

            Pájaro Loco

          </h2>

          <p>

            Hamburguesa especial

          </p>

          <strong>

            $15.000

          </strong>

        </article>

        <article className="dashboard-card">

          <h2>

            Perra Especial

          </h2>

          <p>

            Salchicha ranchera

          </p>

          <strong>

            $12.000

          </strong>

        </article>

      </section>

    </main>

  );

}

export default Menu;