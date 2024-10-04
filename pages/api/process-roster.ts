import { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import fs from 'fs'
import { exec } from 'child_process'
import path from 'path'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm()
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: 'Error parsing form data' })
      }

      const file = files.file as formidable.File
      const option = fields.option as string

      if (!file || !option) {
        return res.status(400).json({ error: 'Missing file or processing option' })
      }

      const tempPath = file.filepath
      const targetPath = path.join('/tmp', file.originalFilename || 'upload.csv')

      fs.copyFileSync(tempPath, targetPath)

      let scriptPath
      switch (option) {
        case 'full':
          scriptPath = path.join(process.cwd(), 'scripts', 'roster_reformatter_enhanced.py')
          break
        case 'daysoff':
          scriptPath = path.join(process.cwd(), 'scripts', 'roster_reformatter_rdonly.py')
          break
        case 'workdays':
          scriptPath = path.join(process.cwd(), 'scripts', 'roster_reformatter_workonly.py')
          break
        default:
          return res.status(400).json({ error: 'Invalid processing option' })
      }

      exec(`python ${scriptPath} ${targetPath}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error.message}`)
          return res.status(500).json({ error: 'Error processing file' })
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`)
          return res.status(500).json({ error: 'Error processing file' })
        }

        const outputPath = targetPath.replace('.csv', '.xlsx')
        const fileContent = fs.readFileSync(outputPath)

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        res.setHeader('Content-Disposition', 'attachment; filename=processed_roster.xlsx')
        res.send(fileContent)

        // Clean up temporary files
        fs.unlinkSync(targetPath)
        fs.unlinkSync(outputPath)
      })
    })
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}