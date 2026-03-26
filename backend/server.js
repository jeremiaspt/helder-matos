const express = require("express")
const cors = require("cors")
const nodemailer = require("nodemailer")

const app = express()

app.use(cors({
 origin: "*",
 methods: ["GET","POST","OPTIONS"],
 allowedHeaders: ["Content-Type"]
}))

app.options('*', cors())

app.use(express.json())

app.post("/ticket", async (req,res)=>{

 console.log("Pedido recebido:", req.body)

 const {name,phone,email,city,description} = req.body

 try{

 const transporter = nodemailer.createTransport({
  service: "gmail",
  auth:{
   user: process.env.EMAIL,
   pass: process.env.PASS
  }
 })

 await transporter.sendMail({

  from:process.env.EMAIL,
  to:process.env.EMAIL,
  subject:"Novo pedido de assistência",

  text:`
Nome: ${name}
Telefone: ${phone}
Email: ${email}
Localidade: ${city}

Descrição:
${description}
`
 })

 res.json({status:"ok"})

 }catch(err){

 console.log("ERRO EMAIL:", err)

 res.status(500).json({error:"erro envio email"})

 }

})

const port = process.env.PORT || 3000

app.listen(port,()=>{
 console.log("Servidor iniciado")
})