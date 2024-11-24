import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from 'lucide-react'
import { API_URL } from '@/config'

export function CreateTress() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [language, setLanguage] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
    }
  }, [navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        navigate('/login')
        return
      }
      const response = await fetch(`${API_URL}/api/tress/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content, language, is_public: isPublic }),
      })
      if (response.ok) {
        const data = await response.json()
        navigate(`/tress/${data.id}`)
      } else {
        const data = await response.json()
        setError(data.detail || 'Failed to create tress')
      }
    } catch (err) {
      setError('An error occurred while creating the tress')
    }
  }

  return (
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Create New Tress</h1>
        {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="min-h-[200px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Input
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                required
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
                id="public"
                checked={isPublic}
                onCheckedChange={setIsPublic}
            />
            <Label htmlFor="public">Public</Label>
          </div>
          <Button type="submit" className="w-full">Create Tress</Button>
        </form>
      </div>
  )
}

