import express, { static as _static } from "express";
import _body_parser from "body-parser";
import { ValidationError } from "sequelize";
import { check, validationResult } from "express-validator";
import { get_db_postgres } from "./database/database.mjs";
import { get_all_wycieczki, get_wycieczka } from "./database/queries.mjs";
import cors from 'cors';

function isInt(value) {
  return !isNaN(value) && (function (x) { return (x | 0) === x; })(parseFloat(value))
}

const { urlencoded, json } = _body_parser;

export const app = express();
const port = 5000;

app.use(cors());
app.use(urlencoded({ extended: false }));
app.use(json());

get_db_postgres().then((db) => {
  const with_wycieczka =
    (init_transaction = false) =>
      async (req, res, next) => {
        let t = null;
        if (init_transaction) t = await db.sequelize.transaction();
        const { wycieczka, zgloszenia } = (isInt(req.params.id)) ?
          await get_wycieczka(db, req.params.id, t) : [null, null];

        if (!wycieczka) {
          res.locals.trip = null;
        }
        res.locals.trip = wycieczka;
        res.locals.t = t;
        return next();
      };


  app.get("/api/trip/:id", with_wycieczka(), async (req, res, next) => {
    if (res.locals.trip) {
      res.send(res.locals.trip);
    } else {
      res.status(404).send("Sorry, can't find that!");
    }
  });

  app.get("/api/all/", async (req, res, next) => {
    const all = await get_all_wycieczki(db);
    res.send(all);
  });

  function parseErrors(mapped) {
    const parsed = {};
    Object.keys(mapped).forEach((key) => {
      parsed[`${key}_error`] = mapped[key].msg;
    });
    return parsed;
  }

  async function withCommit(t, callback) {
    await t.commit();
    return callback();
  }

  async function withRollback(t, callback) {
    await t.rollback();
    return callback();
  }

  app.post(
    "/book/:id(\\d+)",
    with_wycieczka(true),
    check("email").isEmail().withMessage("Proszę wpisać poprawny email!"),
    check("first_name").notEmpty().withMessage("Imię nie może być puste!"),
    check("last_name").notEmpty().withMessage("Nazwisko nie może być puste!"),
    check("n_people")
      .isInt({ min: 0 })
      .withMessage("Liczba zgłoszeń musi być większa od 0!"),
    async (req, res, next) => {
      const { trip } = res.locals;
      const { t } = res.locals;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return withRollback(t, () =>
          res.status(400).send({msg: parseErrors(errors.mapped())}));
      }
      if (req.body.n_people > trip.liczba_dostepnych_miejsc) {
        return withRollback(t, () =>
          res.status(400).send({
            msg: "Brak wystarczającej liczby wolnych miejsc!",
          })
        );
      }
      try {
        const zgloszenie = await db.Zgloszenie.create(
          {
            imie: req.body.first_name,
            nazwisko: req.body.last_name,
            email: req.body.email,
            liczba_miejsc: req.body.n_people,
          },
          { transaction: t }
        );
        await trip.addZgloszenie(zgloszenie, { transaction: t });
        trip.liczba_dostepnych_miejsc -= req.body.n_people;
        await trip.save({ transaction: t });
        return withCommit(t, () =>
          res.status(200).send({msg: "Udało się zarezerować wycieczkę!"})
        );
      } catch (error) {
        if (error instanceof ValidationError) {
          return withRollback(t, () =>
            res.status(400).send({
              msg: "Wprowadzono niepoprawne dane!",
            })
          );
        }
        return withRollback(t, () =>
          res.status(400).send({ msg: "Nieznany błąd!" })
        );
      }
    }
  );

  app.use((err, req, res) => {
    res.status(400).send({ error: err });
  });

  app.use((err, req, res, next) => {
    res.status(400).send({ error: "Nie znaleziono strony o podanym adresie!" });
  });

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
});
