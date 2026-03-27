export default async function handler(req,res){

 const { ticket, estado } = req.body

 await fetch(
  `${process.env.SHEET_WEBHOOK}?ticket=${ticket}&estado=${estado}`
 )

 res.status(200).json({status:"ok"})

}