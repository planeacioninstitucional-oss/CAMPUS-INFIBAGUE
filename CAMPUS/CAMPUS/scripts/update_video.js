
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://bsonmzabqkkeoqnlgthe.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzb25temFicWtrZW9xbmxndGhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2OTA4OTEsImV4cCI6MjA4NTI2Njg5MX0.Utt46LUI20nuT3NZDnS_jgyhgBcr3llgFBRCVdJRIgs';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function updateVideo() {
    console.log('Searching for course "INTEGRA"...');

    // 1. Find the course
    const { data: courses, error: courseError } = await supabase
        .from('cursos')
        .select('id, titulo')
        // Try searching for case-insensitive or partial match
        .ilike('titulo', '%INTEGRA%')
        .limit(1);

    if (courseError) {
        console.error('Error fetching course:', courseError);
        return;
    }

    if (!courses || courses.length === 0) {
        console.error('Course "INTEGRA" not found.');
        return;
    }

    const course = courses[0];
    console.log(`Found course: ${course.titulo} (${course.id})`);

    // 2. Find Module 1
    const { data: modules, error: modError } = await supabase
        .from('modulos')
        .select('id, titulo, orden')
        .eq('curso_id', course.id)
        .order('orden', { ascending: true }); // Assuming Module 1 is the first one or named "Modulo 1"

    if (modError) {
        console.error('Error fetching modules:', modError);
        return;
    }

    if (!modules || modules.length === 0) {
        console.error('No modules found for this course.');
        return;
    }

    // Heuristic: Pick the first module by order, or try to match "Modulo 1"
    let targetModule = modules[0];
    console.log(`Targeting module: ${targetModule.titulo} (Orden: ${targetModule.orden})`);

    // 3. Update the module
    const videoUrl = 'https://www.youtube.com/embed/ljA74GTG5ew?si=3shb4MRHljA1b6fx';

    const { error: updateError } = await supabase
        .from('modulos')
        .update({
            contenido_tipo: 'video',
            contenido_url: videoUrl
        })
        .eq('id', targetModule.id);

    if (updateError) {
        console.error('Error updating module:', updateError);
    } else {
        console.log('Successfully updated module video.');
    }
}

updateVideo();
