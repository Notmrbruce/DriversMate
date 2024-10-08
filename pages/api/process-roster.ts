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

  const options: formidable.Options = {
    uploadDir: '/tmp',
    keepExtensions: true,
  }

  const form = formidable(options)

  try {
    const [fields, files] = await new Promise<[formidable.Fields, formidable.Files]>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err)
        resolve([fields, files])
      })
    })

    const inputFile = Array.isArray(files.file) ? files.file[0] : files.file
    const option = Array.isArray(fields.option) ? fields.option[0] : fields.option

    if (!inputFile || !option) {
      throw new Error('Missing file or option')
    }

    const pythonPath = process.env.VERCEL_REGION ? '/var/lang/bin/python3' : 'python3'
    const scriptPath = path.join(process.cwd(), 'scripts')

    // Convert CSV to XLSX
    const xlsxFile = inputFile.filepath.replace('.csv', '.xlsx')
    await execPromise(`${pythonPath} "${path.join(scriptPath, 'csv_to_xlsx.py')}" "${inputFile.filepath}" "${xlsxFile}"`)

    // Process the XLSX file
    let scriptName
    switch (option) {
      case 'daysoff':
        scriptName = 'daysoff.py'
        break
      case 'workdays':
        scriptName = 'workdays.py'
        break
      default:
        scriptName = 'fullroster.py'
    }
    await execPromise(`${pythonPath} "${path.join(scriptPath, scriptName)}" "${xlsxFile}"`)

    // Convert XLSX back to CSV
    const outputCsvFile = xlsxFile.replace('.xlsx', '_processed.csv')
    await execPromise(`${pythonPath} "${path.join(scriptPath, 'xlsx_to_csv.py')}" "${xlsxFile}" "${outputCsvFile}"`)

    // Read the processed CSV file
    const fileContent = fs.readFileSync(outputCsvFile)

    // Clean up temporary files
    fs.unlinkSync(inputFile.filepath)
    fs.unlinkSync(xlsxFile)
    fs.unlinkSync(outputCsvFile)

    // Send the processed CSV file
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', 'attachment; filename=processed_roster.csv')
    return res.status(200).send(fileContent)
  } catch (error) {
    console.error('Error processing file:', error)
    return res.status(500).json({ message: 'Error processing file', error: error.message })
  }
}
