import express from "express";
import pg from "pg";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "BookNotes",
    password: "%THMvdw1",
    port: 5432,
  });
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
    const books = await db.query("SELECT * FROM books")
    res.render("index.ejs", {
        books: books.rows
    })
})

app.post("/add", async (req, res) => {
    const title = req.body.newItemTitle;
    const description = req.body.newItemDescription;
    try{
        await db.query("INSERT INTO books (title, description) VALUES ($1, $2)", [title, description]);
    } catch(err) {
        console.log(err)
    }
    res.redirect("/");
})

app.post("/delete", async (req, res) => {
    const id = req.body.deleteItemId;
    try{
        await db.query("DELETE FROM books WHERE id = $1", [id]);
    } catch(err) {
        console.log(err)
    }
    res.redirect("/")
})

app.post("/edit", async (req, res) => {
    console.log(req.body)
    const id = req.body.updatedId;
    const title = req.body.updatedItemTitle;
    const description = req.body.updatedItemDescription;
    try{
        await db.query("UPDATE books set title = $1, description = $2 WHERE id = $3", [title, description, id]);
    } catch(err) {
        console.log(err)
    }
    res.redirect("/")
})

app.listen(port, () => {
    console.log(`Server is now listening on port ${port}`);
});