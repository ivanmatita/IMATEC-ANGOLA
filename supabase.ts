
import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://bgudiehufcvdbjaekxyu.supabase.co';
export const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJndWRpZWh1ZmN2ZGJqYWVreHl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NDM5MjUsImV4cCI6MjA4NDExOTkyNX0.HjJbxhHaEhP4pDQ3fdYsoXKSmwZnBunzGEiTm_Bpks0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const getEmpresaData = async <T>(tableName: string, empresaId: string): Promise<T[]> => {
  const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .eq('empresa_id', empresaId);

  if (error) {
    console.error(`Erro ao buscar ${tableName}:`, error);
    return [];
  }
  return data as T[];
};
