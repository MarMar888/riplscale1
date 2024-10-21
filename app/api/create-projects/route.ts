import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/client';
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

    // Your logic to create projects goes here...
    return NextResponse.json({ success: true, message: 'Projects created successfully.' });
}
