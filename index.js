const express = require("express");
const handlebars = require("express-handlebars").engine
require('dotenv').config();

const app = express()


const port = 8383;


app.use('/public', express.static(__dirname + '/public'))
app.use(express.json())

app.engine("handlebars", handlebars({defaultLayout: "main"}))
app.set("view engine", "handlebars")


function fetchAPI(msg) {
    const options = {
      method: "POST",
      headers: {
        "Authorization": `Bearer  ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: msg }],
        max_tokens: 100,
      })
    };
  
    try {
      console.log(options);
      return fetch('https://api.openai.com/v1/chat/completions', options)
        .then(response => response.json())
        .then(data => {
          console.log(data); // Imprime os dados retornados pela API
          if (data.error) {
            console.error(data.error); // Imprime o erro, se houver
          } else {
            return data;
          }
        });
    } catch (error) {
      console.error(error);
    }
  }
  


app.get("/", async (req, res) => {
    res.render("index")
})

app.get("/request", async (req, res) => {
    const {alimento} = req.query
    fetchAPI(`\Quais as vantagens $alimentos para a saude`)
        .then(data => res.render("request", {data: data.choices[0].message.content}))
 
})


app.listen(port, () => {
    console.log("Rodando na porta:" + port);
})