export default async function handler(req,res){

 const { ticket, estado, obs } = req.body

 await fetch(
 `${process.env.SHEET_WEBHOOK}?ticket=${ticket}&estado=${estado}&obs=${encodeURIComponent(obs)}`
 )

 res.status(200).json({status:"ok"})

}