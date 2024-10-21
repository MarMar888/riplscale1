"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client"; // Updated to use client-side Supabase
import { useRouter } from "next/navigation";

export default function ProtectedPage() {
  const [loading, setLoading] = useState(false);
  const [projectCreationResults, setProjectCreationResults] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [fetchingProjects, setFetchingProjects] = useState(true);
  const router = useRouter();

  // Fetch existing projects when the page loads
  useEffect(() => {
    const fetchProjects = async () => {
      setFetchingProjects(true);
      try {
        const supabase = createClient();
        const { data, error } = await supabase.from("projects").select("*, students(name)");

        if (error) {
          console.error("Failed to fetch projects", error);
        } else {
          setProjects(data);
        }
      } catch (err) {
        console.error("An error occurred while fetching projects", err);
      } finally {
        setFetchingProjects(false);
      }
    };

    fetchProjects();
  }, []);

  // Form submission handler to create projects
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);

    try {
      const response = await fetch("/api/create-projects", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setProjectCreationResults(result.results);
        // Re-fetch projects to update the list
        router.refresh();
      } else {
        console.error("Error:", result.error);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full gap-12 py-8">
        {/* Form to create new projects */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="ClassName">Class Name</label>
            <input name="ClassName" placeholder="AP Statistics" required />
          </div>

          <div className="space-y-2">
            <label htmlFor="GradeLevel">Grade Level</label>
             <input name="GradeLevel" placeholder="12th Grade" required />
          </div>

          <div className="space-y-2">
            <label htmlFor="clos">Current Learning Objectives / Mastery Target</label>
            <input name="clos" placeholder="Chi Squared Test" required />
          </div>

          <div className="mt-8">
            <button type="submit" disabled={loading}>
              {loading ? "Creating Projects..." : "Create Projects"}
            </button>
          </div>
        </form>

        {/* Display project creation results */}
        {projectCreationResults && projectCreationResults.length > 0 && (
          <div className="mt-8 space-y-4">
            {projectCreationResults.map((result, index) => (
              <div key={index} className={`p-4 border rounded ${result.success ? "bg-green-100" : "bg-red-100"}`}>
                <h3 className="font-bold">{result.student}</h3>
                <p>{result.success ? "Project created successfully." : `Failed: ${result.error}`}</p>
              </div>
            ))}
          </div>
        )}

        {/* Display all projects as cards */}
        {fetchingProjects ? (
          <p>Loading projects...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full p-4">
            {projects.map((project) => (
              <div key={project.id} className="card p-4 border rounded shadow bg-white">
                <h2 className="text-xl font-semibold">{project.students?.name}</h2>
                <p className="mt-2 text-sm">{project.project_details}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
