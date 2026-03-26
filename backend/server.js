const express = require("express")
const cors = require("cors")
const { Resend } = require("resend")

const app = express()

const resend = new Resend(process.env.RESEND_API_KEY)

app.use(cors())
app.use(express.json())

app.post("/ticket", async (req,res)=>{

 console.log("BODY:",req.body)

 const {name,phone,email,city,description} = req.body

 try{

 const response = await resend.emails.send({

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

 console.log("EMAIL RESPONSE:",response)

 res.json({status:"ok"})

 }catch(err){

 console.log("EMAIL ERROR:",err)

 res.status(500).json({error:"erro envio email"})

 }

})

const PORT = process.env.PORT || 3000

app.listen(PORT, "0.0.0.0", () => {
 console.log("Server running on port", PORT)
})