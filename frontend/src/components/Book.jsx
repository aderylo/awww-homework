import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Book.css";

function isValidEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

function isValidPhone(phone) {
  return /\d/g.test(phone) && phone.length === 9;
}

function isValidPeopleNum(n_people) {
  return /\d/g.test(n_people) && n_people < 5;
}

function Book() {
  const [state, setState] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    n_people: "",
    gdpr_permission: false,
  });
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);
  const [getError, setGetError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [item, setItem] = useState(null);
  const { id } = useParams();

  const handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    setState({
      ...state,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setInfo(null);
    setError(null);

    if (state.first_name.length === 0) {
      setError("Name must be not empty!");
    } else if (state.last_name.length === 0) {
      setError("Last name should be not empty");
    } else if (!isValidPhone(state.phone)) {
      setError("Incorrect phone number!");
    } else if (!isValidEmail(state.email)) {
      setError("Incorrect email");
    } else if (!isValidPeopleNum(state.n_people)) {
      setError("One order can be for maxium 4 people!");
    } else if (state.gdpr_permission !== true) {
      setError("Please check the box!");
    } else {
      fetch("http://localhost:5000/book/" + id, {
        method: "POST",
        body: JSON.stringify(state),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then(
          (response) => {
            if (response.status >= 200 && response.status < 300)
              setInfo(response.msg);
            else setError(response.msg);
          },
          (error) => {
            console.log("Error" + error);
            setGetError(error);
            // setInfo(null);
          }
        );
    }
  };

  useEffect(() => {
    fetch("http://localhost:5000/api/trip/" + id)
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setItem(result);
        },
        (error) => {
          setIsLoaded(true);
          setGetError(error);
        }
      );
  }, [id]);

  if (getError) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    let miejsca = item.liczba_dostepnych_miejsc,
      obrazek = item.obrazek,
      obrazek_tekst = item.obrazek_tekst,
      nazwa = item.nazwa;

    return (
      <main>
        <section id="trip_informations">
          <img src={obrazek} alt={obrazek_tekst} />
          <a href={"/trip/" + id}>
            <h1>{nazwa} </h1>
            <h2>{"Pozostało miejsc:" + miejsca}</h2>
            {error && <p className="error">{error}</p>}
            {info && <p id="info">{info}</p>}
          </a>
          <table id="costs">
            <thead>
              <tr>
                <th scope="col">Nazwa</th>
                <th scope="col">Koszt</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Ubezpieczenie</td>
                <td>500 PLN</td>
              </tr>
              <tr>
                <td>Bilety</td>
                <td>1000 PLN</td>
              </tr>
              <tr>
                <td>Wyżywienie</td>
                <td>1000 PLN</td>
              </tr>
              <tr>
                <td>Zakwaterowanie</td>
                <td>1000 PLN</td>
              </tr>
              <tr>
                <td>Razem od osoby</td>
                <td>3000 PLN</td>
              </tr>
            </tbody>
          </table>
          <h2>Formularz rezerwacyjny</h2>
        </section>
        <section id="form">
          <form onSubmit={handleSubmit}>
            <input
              id="first_name"
              type="text"
              placeholder="Imię"
              name="first_name"
              maxLength={40}
              required=""
              onChange={handleInputChange}
            />
            <input
              id="last_name"
              type="text"
              placeholder="Nazwisko"
              name="last_name"
              maxLength={40}
              required=""
              onChange={handleInputChange}
            />
            <input
              id="phone"
              type="tel"
              placeholder="Nr telefonu"
              name="phone"
              pattern="[0-9]{9}"
              title="Numer powinien składać się z 9 cyfr."
              required=""
              onChange={handleInputChange}
            />
            <input
              id="email"
              placeholder="Adres e-mail"
              name="email"
              onChange={handleInputChange}
            />
            <input
              id="n_people"
              type="number"
              placeholder="Liczba osób"
              name="n_people"
              required=""
              min={1}
              max={4}
              onChange={handleInputChange}
            />
            <label htmlFor="gdpr_permission">
              Wyrażam zgodę na przetwarzanie moich danych osobowych zgodnie z
              art. 6 ust. 1 lit. a) Rozporządzenia Parlamentu Europejskiego i
              Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r. w sprawie ochrony
              osób fizycznych w związku z przetwarzaniem danych osobowych i w
              sprawie swobodnego przepływu takich danych oraz uchylenia
              dyrektywy 95/46/WE (ogólne rozporządzenie o ochronie danych),
              dalej: „RODO” <br /> (... tutaj powinna być dalsza część
              wynikająca z przepisów prawa ...)
            </label>
            <input
              id="gdpr_permission"
              type="checkbox"
              name="gdpr_permission"
              required=""
              onChange={handleInputChange}
            />
            <button id="submitid" type="submit">
              ZAREZERWUJ
            </button>
          </form>
        </section>
      </main>
    );
  }
}

export default Book;
