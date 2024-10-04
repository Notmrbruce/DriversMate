import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ICALRoster() {
  const [file, setFile] = useState<File | null>(null)
  const [processing, setProcessing] = useState(false)
  const [processingOption, setProcessingOption] = useState('full')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setProcessing(true)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('option', processingOption)

    try {
      const response = await fetch('/api/process-roster', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = 'processed_roster.xlsx'
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
      } else {
        console.error('File processing failed')
      }
    } catch (error) {
      console.error('Error processing file:', error)
    }

    setProcessing(false)
  }

  return (
    <div className="min-h-screen bg-[#ff914d] flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">ICAL Roster Processor</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
                Upload CSV File
              </label>
              <input
                type="file"
                id="file"
                accept=".csv"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="processingOption" className="block text-sm font-medium text-gray-700 mb-1">
                Processing Option
              </label>
              <Select value={processingOption} onValueChange={setProcessingOption}>
                <SelectTrigger>
                  <SelectValue placeholder="Select processing option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">Full Roster</SelectItem>
                  <SelectItem value="daysoff">Days Off Only</SelectItem>
                  <SelectItem value="workdays">Work Days Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              type="submit"
              disabled={!file || processing}
              className="w-full"
            >
              {processing ? 'Processing...' : 'Process File'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}