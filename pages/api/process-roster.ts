import { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'
import util from 'util'

const execPromise = util.promisify(exec)

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const form = new formidable.IncomingForm()
  form.uploadDir = path.join(process.cwd(), 'tmp')
  form.keepExtensions = true

  try {
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err)
        resolve({ fields, files } as { fields: formidable.Fields, files: formidable.Files })
      })
    })

    const inputFile = files.file as formidable.File
    const option = fields.option as string

    // Convert CSV to XLSX
    const xlsxFile = inputFile.filepath.replace('.csv', '.xlsx')
    await execPromise(`python3 ${path.join(process.cwd(), 'scripts', 'csv_to_xlsx.py')} "${inputFile.filepath}" "${xlsxFile}"`)

    // Process the XLSX file
    let scriptName
    switch (option) {
      case 'daysoff
