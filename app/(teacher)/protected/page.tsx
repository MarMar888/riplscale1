"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

export default function ProtectedPage() {
  const [loading, setLoading] = useState(false)
  const [projectCreationResults, setProjectCreationResults] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [fetchingProjects, setFetchingProjects] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchProjects = async () => {
      setFetchingProjects(true)
      try {
        const supabase = createClient()
        const { data, error } = await supabase.from("projects").select("*, students(name)")

        if (error) {
          console.error("Failed to fetch projects", error)
        } else {
          setProjects(data)
        }
      } catch (err) {
        console.error("An error occurred while fetching projects", err)
      } finally {
        setFetchingProjects(false)
      }
    }

    fetchProjects()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.target as HTMLFormElement)

    try {
      const response = await fetch("/api/create-projects", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        setProjectCreationResults(result.results)
        router.refresh()
      } else {
        console.error("Error:", result.error)
      }
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Project Management</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Create New Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ClassName">Class Name</Label>
              <Input id="ClassName" name="ClassName" placeholder="AP Statistics" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="GradeLevel">Grade Level</Label>
              <Input id="GradeLevel" name="GradeLevel" placeholder="12th Grade" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clos">Current Learning Objectives / Mastery Target</Label>
              <Input id="clos" name="clos" placeholder="Chi Squared Test" required />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Projects...
                </>
              ) : (
                "Create Projects"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {projectCreationResults.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Project Creation Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projectCreationResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 border rounded ${result.success ? "bg-green-100 border-green-300" : "bg-red-100 border-red-300"
                    }`}
                >
                  <h3 className="font-bold">{result.student}</h3>
                  <p>{result.success ? "Project created successfully." : `Failed: ${result.error}`}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Projects</CardTitle>
        </CardHeader>
        <CardContent>
          {fetchingProjects ? (
            <div className="flex justify-center items-center h-24">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <Card key={project.id} className="w-full">
                  <CardContent className="p-4">
                    <h2 className="text-xl font-semibold">{project.students?.name}</h2>
                    <p className="mt-2 text-sm text-gray-600">{project.details}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}