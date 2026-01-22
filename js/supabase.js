
/**
 * IMATEC SOFTWARE - Supabase Client Config
 */
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// URL e Key fornecidas para o projeto IMATEC
export const SUPABASE_URL = 'https://bgudiehufcvdbjaekxyu.supabase.co';
export const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJndWRpZWh1ZmN2ZGJqYWVreHl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NDM5MjUsImV4cCI6MjA4NDExOTkyNX0.HjJbxhHaEhP4pDQ3fdYsoXKSmwZnBunzGEiTm_Bpks0';

/**
 * Criação e exportação do client.
 * Erro "does not provide an export named client" resolvido com export const.
 */
export const client = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * Função utilitária para buscar dados de tabelas filtrando por empresa
 */
export const getEmpresaData = async (tableName, empresaId) => {
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
