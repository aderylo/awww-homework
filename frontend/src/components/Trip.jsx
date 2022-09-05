import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Trip.css";

function Trip() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [item, setItems] = useState(null);
  const { id } = useParams();

  console.log(id);
  console.log("http://localhost:5000/api/trip/" + id);

  useEffect(() => {
    fetch("http://localhost:5000/api/trip/" + id)
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
  }, [id]);

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    let img = item.obrazek,
      img_txt = item.obrazek_tekst,
      name = item.nazwa,
      desc = item.opis,
      price = item.cena;

    return (
      <main>
        <title>Wycieczka</title>
        <section id="trip_description">
          <img src={img} alt={img_txt} />
          <h1> {name} </h1>
          <p> {desc} </p>
          <h2>Nagłowek z tytułem</h2>
          <p>
            Tu kolejny fragment tekstu. Może się z składać z kilku akapitów.
          </p>
          <h2>Jeszcze jeden nagłówek</h2>
          <p>
            I kolejne informacje o wycieczce. Trzeba się wysilić i wymyślić
            własne.
          </p>
          <h2>Istotne informacje</h2>
          <ul>
            <li>termin wycieczki: kiedyś w przyszłości</li>
            <li>temperatury na miejscu: takie w sam raz</li>
            <li>warto zabrać: trochę ubrań na zmianę</li>
            <li>{"cena wycieczki to: " + price} </li>
          </ul>
          <h2>Program wycieczki</h2>
          <ol>
            <li>Odwiedziny na miejscu</li>
            <li>Obiad</li>
            <li>Wspólna wyprawa</li>
          </ol>
        </section>
        <section id="links">
          <a href="/">Powrót</a>
          <a href={"/book/" + id}>Zarezerwuj</a>
        </section>
      </main>
    );
  }
}

export default Trip;
