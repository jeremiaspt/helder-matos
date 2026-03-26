const express = require("express")
const cors = require("cors")
const { Resend } = require("resend")

const app = express()

const resend = new Resend(process.env.RESEND_API_KEY)

app.use(cors({
 origin: "https://helder-matos.vercel.app",
 methods: ["GET","POST","OPTIONS"],
 allowedHeaders: ["Content-Type"]
}))

app.options("*", cors())

app.use(express.json())

app.post("/ticket", async (req,res)=>{

 const {name,phone,email,city,description} = req.body

 try{

 await resend.emails.send({

 from: "Assistência <onboarding@resend.dev>",
 to: process.env.EMAIL,

 subject:"Novo pedido de assistência",

 html:`
 <h2>Novo pedido</h2>

 Nome: ${name}<br>
 Telefone: ${phone}<br>
 Email: ${email}<br>
 Localidade: ${city}<br>

 <p>${description}</p>
 `
 })

 res.json({status:"ok"})

 }catch(err){

 console.log(err)

 res.status(500).json({error:"erro envio email"})

 }

})

const PORT = process.env.PORT || 3000

app.listen(PORT, "0.0.0.0", () => {
 console.log("Server running on", PORT)
})