import { useState } from 'react';

export default function ProtectedPage() {
  const [loading, setLoading] = useState(false);
  const [projectCreationResults, setProjectCreationResults] = useState<any[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);

    try {
      const response = await fetch('/api/create-projects', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setProjectCreationResults(result.results);
      } else {
        console.error('Error:', result.error);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full gap-12 py-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Input fields for class name, grade level, etc. */}
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
              {loading ? 'Creating Projects...' : 'Create Projects'}
            </button>
          </div>
        </form>

        {projectCreationResults.length > 0 && (
          <div className="mt-8 space-y-4">
            {projectCreationResults.map((result, index) => (
              <div key={index} className={`p-4 border rounded ${result.success ? 'bg-green-100' : 'bg-red-100'}`}>
                <h3 className="font-bold">{result.student}</h3>
                <p>{result.success ? 'Project created successfully.' : `Failed: ${result.error}`}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
