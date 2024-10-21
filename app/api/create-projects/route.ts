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

    if (!className || !gradeLevel || !clos) {
        return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    // Fetch the teacher ID from the auth context
    const {
        data: { session },
        error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session?.user?.id) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const teacherId = session.user.id;

    // Fetch classroom details for the teacher
    const { data: classroom, error: classroomError } = await supabase
        .from('classrooms')
        .select('id')
        .eq('teacher_id', teacherId)
        .single();

    if (classroomError || !classroom) {
        return NextResponse.json({ error: 'Failed to fetch classroom for teacher' }, { status: 400 });
    }

    const classroomId = classroom.id;

    // Fetch students in the relevant classroom from Supabase
    const { data: students, error: fetchError } = await supabase
        .from('students')
        .select('*')
        .eq('classroom_id', classroomId);

    if (fetchError || !students || students.length === 0) {
        return NextResponse.json({ error: 'Failed to fetch students or no students found' }, { status: 400 });
    }

    console.log(students)
    console.log(classroom)
    // Iterate through students and generate projects for each
    const projectCreationResults = [];

    for (const student of students) {
        const prompt = `Create a personalized project for ${student.name}, who has ${student.interests}, a ${gradeLevel} student in ${className}, focusing on ${clos}.`;

        // Call OpenAI API to generate project details
        const promptFormData = new FormData();
        promptFormData.append('prompt', prompt);

        const openAIResult = await callOpenAIAction(promptFormData);
        console.log(`Generating project for student: ${student.name}`);
        console.log('OpenAI Result:', openAIResult);

        if (openAIResult.success) {
            // Save project details to Supabase
            const { error: projectError } = await supabase
                .from('projects')
                .insert([{ student_id: student.id, project_details: openAIResult.data }]);

            if (projectError) {
                console.error("Failed to save project:", projectError.message);
                projectCreationResults.push({ student: student.name, success: false, error: 'Project save error' });
            } else {
                projectCreationResults.push({ student: student.name, success: true, project: openAIResult.data });
            }
        } else {
            console.error("OpenAI error:", openAIResult.error);
            projectCreationResults.push({ student: student.name, success: false, error: openAIResult.error });
        }
    }

    return NextResponse.json({ success: true, results: projectCreationResults });
}
