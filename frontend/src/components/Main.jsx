import React from "react";
import { useState, useEffect } from "react";
import "./Main.css";

function TripTile(props) {
  const id = props.id,
    image = props.obrazek,
    image_alt = props.obrazek_tekst,
    title = props.nazwa,
    description = props.opis,
    price = props.cena;
  return (
    <article class="trip">
      <a href={"trip/" + id}>
        <img src={image} alt={image_alt} />
      </a>
      <div class="trip-description">
        <a href={"trip/" + id}>
          <h1> {title} </h1>
        </a>
        <span class="description">{description} </span>
        <div class="trip-price">
          <span class="price">{"Cena:" + price} </span>
          <a href={"book/" + id}>Zarezerwuj</a>
        </div>
      </div>
    </article>
  );
}

function Main() {
  const rednerTrip = (details) => {
    return (
      <TripTile
        id={details.id}
        obrazek={details.obrazek}
        obrazek_tekst={details.obrazek_tekst}
        nazwa={details.nazwa}
        opis={details.opis}
        cena={details.cena}
      />
    );
  };

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/all/")
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setItems(result);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, []);

  console.log(items);

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    const trips = [];
    items.forEach((trip_details) => {
      trips.push(rednerTrip(trip_details));
    });

    return (
      <main>
        <div id="trips">{trips}</div>
        <aside>
          <section id="promos">
            <h2>Promocje</h2>
            <article className="promo">
              <h3>Góry wysokie</h3>
              <span className="trip-date">1-31 lutego</span>
              <a href="book/2">Rezerwuj</a>
            </article>
            <article className="promo">
              <h3>Inne miejsce</h3>
              <span className="trip-date">17-18 kwietnia</span>
              <a href="book/1">Rezerwuj</a>
            </article>
            <article className="promo">
              <h3>Też gdzieś</h3>
              <span className="trip-date">w listopadzie</span>
              <a href="book/1">Rezerwuj</a>
            </article>
            <article className="promo">
              <h3>Warszawa</h3>
              <span className="trip-date">ciągle</span>
              <a href="book/1">Rezerwuj</a>
            </article>
          </section>
          <section id="advices">
            <h2>Porady</h2>
            <a href="/">Co zabrać na wycieczkę?</a>
            <a href="/">Kiedy najlepiej wyjechać?</a>
            <a href="/">Jakie buty są najwygodniejsze?</a>
          </section>
        </aside>
      </main>
    );
  }
}

export default Main;
