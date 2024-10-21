"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

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

      <div className="bg-card text-card-foreground shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Create New Projects</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="ClassName" className="text-sm font-medium">Class Name</label>
            <Input id="ClassName" name="ClassName" placeholder="AP Statistics" required />
          </div>

          <div className="space-y-2">
            <label htmlFor="GradeLevel" className="text-sm font-medium">Grade Level</label>
            <Input id="GradeLevel" name="GradeLevel" placeholder="12th Grade" required />
          </div>

          <div className="space-y-2">
            <label htmlFor="clos" className="text-sm font-medium">Current Learning Objectives / Mastery Target</label>
            <Input id="clos" name="clos" placeholder="Chi Squared Test" required />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Creating Projects..." : "Create Projects"}
          </Button>
        </form>
      </div>

      {projectCreationResults.length > 0 && (
        <div className="bg-card text-card-foreground shadow-lg rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Project Creation Results</h2>
          <div className="space-y-4">
            {projectCreationResults.map((result, index) => (
              <div
                key={index}
                className={`p-4 border rounded-md ${result.success ? "bg-green-100 border-green-300" : "bg-red-100 border-red-300"
                  }`}
              >
                <h3 className="font-bold">{result.student}</h3>
                <p>{result.success ? "Project created successfully." : `Failed: ${result.error}`}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-card text-card-foreground shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">All Projects</h2>
        {fetchingProjects ? (
          <div className="flex justify-center items-center h-24">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="border border-border rounded-lg p-4 w-full">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">{project.students?.name}</h3>
                  <Badge variant="secondary">{project.status || "In Progress"}</Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{project.details}</p>
                <div className="mt-4 flex items-center space-x-4">
                  <Checkbox id={`complete-${project.id}`} />
                  <label htmlFor={`complete-${project.id}`} className="text-sm font-medium">
                    Mark as complete
                  </label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        Actions <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}