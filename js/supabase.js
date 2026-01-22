
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

export const SUPABASE_URL = 'https://bgudiehufcvdbjaekxyu.supabase.co';
export const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJndWRpZWh1ZmN2ZGJqYWVreHl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NDM5MjUsImV4cCI6MjA4NDExOTkyNX0.HjJbxhHaEhP4pDQ3fdYsoXKSmwZnBunzGEiTm_Bpks0';

export const client = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * Busca dados filtrando obrigatoriamente pela empresa logada
 */
export async function getEmpresaData(tableName) {
  const sessionData = localStorage.getItem('imatec_session');
  if (!sessionData) return [];

  const { empresa } = JSON.parse(sessionData);
  const empresaId = empresa.id;

  console.log(`[IMATEC] Filtrando ${tableName} para empresa_id: ${empresaId}`);

  try {
    const { data, error } = await client
      .from(tableName)
      .select('*')
      .eq('empresa_id', empresaId); // ISOLAMENTO COMPLETO

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error(`Erro ao buscar ${tableName}:`, err);
    return [];
  }
}
