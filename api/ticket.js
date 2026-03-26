import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {

    const { name, phone, email, city, description } = req.body

    if (!name || !phone || !city || !description) {
      return res.status(400).json({ error: "Campos obrigatórios em falta" })
    }

    await resend.emails.send({
      from: "Assistência <onboarding@resend.dev>",
      to: process.env.EMAIL,
      subject: "Novo pedido de assistência",
      html: `
        <h2>Novo pedido de assistência</h2>

        <b>Nome:</b> ${name}<br>
        <b>Telefone:</b> ${phone}<br>
        <b>Email:</b> ${email || "não indicado"}<br>
        <b>Localidade:</b> ${city}<br><br>

        <b>Descrição:</b>
        <p>${description}</p>
      `
    })

    return res.status(200).json({ status: "ok" })

  } catch (error) {

    console.error(error)

    return res.status(500).json({ error: "Erro ao enviar email" })

  }
}