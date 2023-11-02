import React, { useState, useEffect } from 'react'
import './App.css'

interface S3Data {
  BucketName: string
  ObjectName: string
  ObjectContent: string
}

function App() {
  const [buckets, setBuckets] = useState<string[]>([])
  const [objects, setObjects] = useState<string[]>([])
  const [selectedObject, setSelectedObject] = useState<string>('')
  const [selectedBucket, setSelectedBucket] = useState<string>('')
  const [selectedObjectContent, setSelectedObjectContent] = useState<string>('')
  const [data, setData] = useState<S3Data[]>([])

  useEffect(() => {
    // Fetch the data when the component mounts
    fetch(
      'https://u85th1dlw1.execute-api.us-east-1.amazonaws.com/myw6stage/new-ryouma-resource'
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Request failed with status: ${response.status}`)
        }
        return response.json()
      })
      .then((data) => {
        if (Array.isArray(data)) {
          const retrievedBuckets = data.map((item) => item.BucketName)
          setBuckets(retrievedBuckets)
          setData(data)
        }
      })
      .catch((error) => {
        console.error('There was an error fetching the data', error)
      })
  }, [])

  const handleBucketChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBucket(e.target.value)
    const relatedObjects = data
      .filter((item) => item.BucketName === e.target.value)
      .map((item) => item.ObjectName)
    setObjects(relatedObjects)
  }

  const handleObjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const objectName = e.target.value
    setSelectedObject(objectName)
    const content = data.find(
      (item) => item.ObjectName === e.target.value
    )?.ObjectContent
    setSelectedObjectContent(content || '')
  }

  // Log the selected data to the console
  useEffect(() => {
    if (
      selectedBucket !== '' &&
      selectedObject !== '' &&
      selectedObjectContent !== ''
    ) {
      console.log('Selected Bucket:', selectedBucket)
      console.log('Selected Object:', selectedObject)
      console.log('Selected Object Content:', selectedObjectContent)
    }
  }, [selectedBucket, selectedObject, selectedObjectContent])

  return (
    <div className="App">
      <div className="container">
        <div className="dropdown-container">
          <div className="title">Workshop 6</div>
          <div className="dropdown-item">
            <label>Select a Bucket</label>
            <select value={selectedBucket} onChange={handleBucketChange}>
              <option value="">Select a Bucket</option>
              {buckets.map((bucket) => (
                <option key={bucket} value={bucket}>
                  {bucket}
                </option>
              ))}
            </select>
          </div>
          <div className="dropdown-item">
            <label>Select an Object</label>
            <select value={selectedObject} onChange={handleObjectChange}>
              <option value="">Select an Object</option>
              {objects.map((object) => (
                <option key={object} value={object}>
                  {object}
                </option>
              ))}
            </select>
          </div>
          <label>Object Content</label>
          <textarea
            value={selectedObjectContent}
            className="content-textarea"
            readOnly
          />
        </div>
      </div>
    </div>
  )
}

export default App
