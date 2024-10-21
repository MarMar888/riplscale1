import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { callOpenAIAction } from '@/app/actions';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    const supabase = createClient();
    const formData = await request.formData();

    const className = formData.get('ClassName') as string;
    const gradeLevel = formData.get('GradeLevel') as string;
    const clos = formData.get('clos') as string;

    // Fetch students in the relevant class from Supabase
    const { data: students, error: fetchError } = await supabase
        .from('students')
        .select('*')
        .eq('class_name', className);

    if (fetchError || !students) {
        return NextResponse.json({ error: 'Failed to fetch students' }, { status: 400 });
    }

    // Iterate through students and generate projects for each
    const projectCreationResults = [];

    for (const student of students) {
        const prompt = `Create a personalized project for ${student.name}, a ${gradeLevel} student in ${className}, focusing on ${clos}.`;

        // Call OpenAI API to generate project details
        const formData = new FormData();
        formData.append('prompt', prompt);

        const openAIResult = await callOpenAIAction(formData);

        if (openAIResult.success) {
            // Save project details to Supabase
            const { data: projectData, error: projectError } = await supabase
                .from('projects')
                .insert([{ student_id: student.id, project_details: openAIResult.data }]);

            if (!projectError) {
                projectCreationResults.push({ student: student.name, success: true, project: openAIResult.data });
            } else {
                projectCreationResults.push({ student: student.name, success: false, error: 'Project save error' });
            }
        } else {
            projectCreationResults.push({ student: student.name, success: false, error: openAIResult.error });
        }
    }

    return NextResponse.json({ success: true, results: projectCreationResults });
}
