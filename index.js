const express = require("express")
const bodyparser = require("body-parser")
const connection = require("./database/database")
const pergunta = require("./database/pergunta")
const resposta = require("./database/resposta")

connection.authenticate().then(()=>{
    console.log("Conexao com o baco de dados")
}).catch((msgErro)=>{
    console.log(msgErro)
})

const app = express()

app.set('view engine','ejs')
app.use(express.static('public'))
app.use(express.json())
// app.use(express.urlencoded())
app.use(bodyparser.urlencoded({extended:true}))
app.use(bodyparser.json())


app.get("/",(req,res) =>{
    pergunta.findAll({raw:true,order:[
        ['id','DESC']
    ]}).then(perguntas =>{
    //    console.log(perguntas) 
        res.render("index",{
            perguntas:perguntas,

        })
    })

   
})

app.get("/perguntar",(req,res)=>{
    res.render("perguntar")
})

app.post("/salvar/pergunta",(req,res)=>{
    var titulo = req.body.titulo
    var descricao = req.body.descricao

    pergunta.create({
        titulo: titulo,
        descricao: descricao,

    }).then(()=>{
        res.redirect("/")
    })
})

app.get('/pergunta/:id',(req,res)=>{
    var id = req.params.id
    pergunta.findOne({
        where:{id:id},
    }).then(pergunta =>{
        if (pergunta != undefined) {

            resposta.findAll({
                where:{perguntaID:pergunta.id},
                order:[ 
                    ['id','DESC']
                ]
            }).then(respostas =>{
                res.render("pergunta",{
                    pergunta:pergunta,
                    respostas:respostas,
                })  
            })


  
        }else{
            res.redirect("/")
        }
    })
})

app.post("/salvar/resposta",(req,res)=>{
    var id = req.body.perguntaID
    var corpo = req.body.corpo
    resposta.create({
        corpo: corpo,
        perguntaID: id,
    }).then(()=>{
        res.redirect("/pergunta/"+id)
    })
    // res.send('Corpo: ' + corpo + ' id ' + id)
})

app.listen(4000,()=>{
    console.log('App rodando')
})

