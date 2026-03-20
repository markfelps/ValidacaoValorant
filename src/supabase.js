import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://blcioceixwmvokktmsat.supabase.co';
const supabaseKey = 'sb_publishable_7q8NdLTXav55a2fQJChskw_4uoCvSZ_';

export const supabase = createClient(supabaseUrl, supabaseKey);