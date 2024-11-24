import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from 'lucide-react'
import { Tress } from '@/types'
import { API_URL } from '@/config'

export function ViewTress() {
  const [tress, setTress] = useState<Tress | null>(null)
  const [error, setError] = useState('')
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchTress = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`${API_URL}/api/tress/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
        if (response.ok) {
          const data = await response.json()
          setTress(data)
        } else {
          setError('Failed to fetch tress')
        }
      } catch (err) {
        setError('An error occurred while fetching the tress')
      }
    }
    fetchTress()
  }, [id])

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/api/tress/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      if (response.ok) {
        navigate('/')
      } else {
        setError('Failed to delete tress')
      }
    } catch (err) {
      setError('An error occurred while deleting the tress')
    }
  }

  if (error) {
    return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
    )
  }

  if (!tress) {
    return <div>Loading...</div>
  }

  return (
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>{tress.title}</CardTitle>
          <CardDescription>By User {tress.owner_id}</CardDescription>
        </CardHeader>
        <CardContent>
        <pre className="bg-muted p-4 rounded-md overflow-x-auto">
          <code>{tress.content}</code>
        </pre>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Badge>{tress.language}</Badge>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => navigate('/')}>Back</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </div>
        </CardFooter>
      </Card>
  )
}

