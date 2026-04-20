// @ts-nocheck
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pmvitxeriurmesenlbpb.supabase.co';
const supabaseKey = 'sb_publishable_k_sDbLxia1PuwcoutbpX4Q_1s8YLTVQ';

export const supabase = createClient(supabaseUrl, supabaseKey);