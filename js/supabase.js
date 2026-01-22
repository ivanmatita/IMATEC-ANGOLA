
/**
 * IMATEC SOFTWARE - Supabase Client Config & Multi-Company Utils
 */
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

export const SUPABASE_URL = 'https://bgudiehufcvdbjaekxyu.supabase.co';
export const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJndWRpZWh1ZmN2ZGJqYWVreHl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NDM5MjUsImV4cCI6MjA4NDExOTkyNX0.HjJbxhHaEhP4pDQ3fdYsoXKSmwZnBunzGEiTm_Bpks0';

export const client = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * Retorna a sessão atual do localStorage de forma segura
 */
export function getActiveSession() {
  const session = localStorage.getItem('imatec_session');
  if (!session) return null;
  try {
    return JSON.parse(session);
  } catch (e) {
    return null;
  }
}

/**
 * Função utilitária para buscar dados de tabelas filtrando AUTOMATICAMENTE por empresa_id
 * @param {string} tableName Nome da tabela no Supabase
 * @returns {Promise<Array>} Lista de registros filtrados
 */
export const getEmpresaData = async (tableName) => {
  const session = getActiveSession();
  if (!session || !session.empresa) {
    console.error("[IMATEC] Tentativa de buscar dados sem sessão ativa.");
    return [];
  }

  const empresaId = session.empresa.id;
  console.log(`[IMATEC] Buscando ${tableName} para a empresa: ${empresaId}`);

  try {
    const { data, error } = await client
      .from(tableName)
      .select('*')
      .eq('empresa_id', empresaId);
    
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error(`[IMATEC] Erro ao buscar ${tableName}:`, err);
    return [];
  }
};
