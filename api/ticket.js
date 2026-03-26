import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {

    const { name, phone, email, city, description, images } = req.body

    if (!name || !phone || !city || !description) {
      return res.status(400).json({ error: "Campos obrigatórios em falta" })
    }

    // gerar número de ticket
    const ticketId = "TK-" + Date.now().toString().slice(-6)
    
    let imagesHtml = ""

    if(images && images.length){

      imagesHtml = `
        <h3>Fotografias</h3>
        ${images.map(img => `<p><a href="${img}">${img}</a></p>`).join("")}
        `
    }

    // EMAIL PARA TI
    await resend.emails.send({
      from: "Assistência <noreply@kpax.stream>",
      to: process.env.EMAIL,
      subject: `Novo pedido ${ticketId}`,
      html: `
        <h2>Novo pedido de assistência</h2>

        <b>Ticket:</b> ${ticketId}<br>
        <b>Nome:</b> ${name}<br>
        <b>Telefone:</b> ${phone}<br>
        <b>Email:</b> ${email || "não indicado"}<br>
        <b>Localidade:</b> ${city}<br><br>

        <b>Descrição:</b>
        <p>${description}</p>

        ${imagesHtml}
      `
    })

    // EMAIL DE CONFIRMAÇÃO PARA O CLIENTE
    if (email) {

      await resend.emails.send({
        from: "Assistência <noreply@kpax.stream>",
        to: email,
        subject: `Recebemos o seu pedido (${ticketId})`,
        html: `
          <h2>Pedido recebido</h2>

          Obrigado pelo seu contacto.

          O seu pedido foi registado com o número:

          <b>${ticketId}</b>

          Entraremos em contacto brevemente.

          <hr>

          <b>Descrição enviada:</b>

          <p>${description}</p>
        `
      })

    }

    // NOTIFICAÇÃO WHATSAPP
    if(process.env.WHATSAPP_PHONE && process.env.WHATSAPP_KEY){

      const message = encodeURIComponent(
        `🔧 Novo pedido ${ticketId}

        👤 ${name}
        📞 ${phone}
        📍 ${city}

        📝 ${description.substring(0,120)}`
      )

      await fetch(
`https://api.callmebot.com/whatsapp.php?phone=${process.env.WHATSAPP_PHONE}&text=${message}&apikey=${process.env.WHATSAPP_KEY}`
      )

    }

    return res.status(200).json({ status: "ok" })

  } catch (error) {

    console.error(error)

    return res.status(500).json({ error: "Erro ao enviar email" })

  }
}