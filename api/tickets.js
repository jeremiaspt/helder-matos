export default async function handler(req,res){

 const sheetUrl = process.env.SHEET_JSON

 const r = await fetch(sheetUrl)

 const data = await r.json()

 res.status(200).json(data)

}