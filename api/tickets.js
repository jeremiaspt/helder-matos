export default async function handler(req,res){

 try{

  const auth = req.headers.authorization

  if(!auth){
   res.setHeader("WWW-Authenticate","Basic")
   return res.status(401).send("Authentication required")
  }

  const base64 = auth.split(" ")[1]
  const decoded = Buffer.from(base64,"base64").toString()

  const [user,pass] = decoded.split(":")

  if(
   user !== process.env.ADMIN_USER ||
   pass !== process.env.ADMIN_PASS
  ){
   return res.status(401).send("Access denied")
  }

  const r = await fetch(process.env.SHEET_WEBHOOK)

  const text = await r.text()

  let data

  try{
   data = JSON.parse(text)
  }catch(e){
   console.error("Resposta inválida:",text)
   return res.status(500).json({
    error:"Apps Script did not return JSON",
    response:text
   })
  }

  res.status(200).json(data)

 }catch(err){

  console.error(err)

  res.status(500).json({error:"Server error"})

 }

}