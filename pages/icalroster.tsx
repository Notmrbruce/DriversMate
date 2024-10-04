import { useState } from 'react'

export default function ICALRoster() {
  const [file, setFile] = useState<File | null>(null)
  const [processing, setProcessing] = useState(false)
  const [processingOption, setProcessingOption] = useState('full')
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
      setError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      setError('Please select a file')
      return
    }

    setProcessing(true)
    setError(null)

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
        a.download = 'processed_roster.csv'
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'File processing failed')
      }
    } catch (error) {
      console.error('Error processing file:', error)
      setError('An error occurred while processing the file')
    }

    setProcessing(false)
  }

  return (
    <div className="min-h-screen bg-[#ff914d] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">ICAL Roster Processor</h1>
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
            <select
              id="processingOption"
              value={processingOption}
              onChange={(e) => setProcessingOption(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="full">Full Roster</option>
              <option value="daysoff">Days Off Only</option>
              <option value="workdays">Work Days Only</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={!file || processing}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {processing ? 'Processing...' : 'Process File'}
          </button>
        </form>
        {error && (
          <p className="mt-4 text-red-600 text-center">{error}</p>
        )}
      </div>
    </div>
  )
}