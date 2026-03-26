const express = require("express")
const cors = require("cors")
const { Resend } = require("resend")

const app = express()

// Resend
const resend = new Resend(process.env.RESEND_API_KEY)

// Middleware
app.use(cors())
app.use(express.json())

// Health check
app.get("/", (req,res)=>{
  res.send("API ONLINE")
})

// Endpoint formulário
app.post("/ticket", async (req,res)=>{

  try{

    const {name,phone,email,city,description} = req.body

    if(!name || !phone || !city || !description){
      return res.status(400).json({error:"campos obrigatórios"})
    }

    await resend.emails.send({
      from: "Assistência <onboarding@resend.dev>",
      to: process.env.EMAIL,
      subject: "Novo pedido de assistência",
      html: `
      <h2>Novo pedido</h2>

      <b>Nome:</b> ${name}<br>
      <b>Telefone:</b> ${phone}<br>
      <b>Email:</b> ${email || "não indicado"}<br>
      <b>Localidade:</b> ${city}<br><br>

      <b>Descrição:</b>
      <p>${description}</p>
      `
    })

    res.json({status:"ok"})

  }catch(err){

    console.error(err)

    res.status(500).json({error:"erro envio email"})
  }

})

const PORT = process.env.PORT || 3000

app.listen(PORT, "0.0.0.0", ()=>{
  console.log("Server running on port", PORT)
})