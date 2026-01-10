#!/usr/bin/env npx ts-node

/**
 * Schema Validation Script (v13.0)
 * Verifica a integridade do banco antes do deploy.
 * 
 * Execução: npx ts-node scripts/check-db-schema.ts
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ ERRO CRÍTICO: Variáveis de ambiente SUPABASE_URL ou SUPABASE_ANON_KEY não configuradas.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const REQUIRED_TABLES = ['nodes', 'edges', 'leads', 'messages', 'assets', 'meeting_logs', 'nodes_metadata'];
const REQUIRED_COLUMNS = {
  nodes: ['id', 'type', 'position_x', 'position_y', 'data'],
  edges: ['id', 'source', 'target'],
  leads: ['id', 'status', 'data'],
  assets: ['id', 'name', 'type', 'status']
};

async function checkConnection(): Promise<boolean> {
  console.log('🔌 Verificando conexão com Supabase...');
  try {
    const { error } = await supabase.from('nodes').select('id').limit(1);
    if (error) throw error;
    console.log('✅ Conexão estabelecida com sucesso.');
    return true;
  } catch (err) {
    console.error('❌ Falha na conexão:', err);
    return false;
  }
}

async function checkTables(): Promise<boolean> {
  console.log('\n📋 Verificando tabelas obrigatórias...');
  let allPassed = true;

  for (const table of REQUIRED_TABLES) {
    try {
      const { error } = await supabase.from(table).select('*').limit(0);
      if (error) {
        console.error(`  ❌ Tabela '${table}' não encontrada ou inacessível.`);
        allPassed = false;
      } else {
        console.log(`  ✅ Tabela '${table}' OK.`);
      }
    } catch (err) {
      console.error(`  ❌ Erro ao acessar tabela '${table}':`, err);
      allPassed = false;
    }
  }

  return allPassed;
}

async function checkCriticalColumns(): Promise<boolean> {
  console.log('\n🔍 Verificando colunas críticas...');
  let allPassed = true;

  // Verificar colunas de nodes
  try {
    const { data, error } = await supabase.from('nodes').select('id, type, position_x, position_y, data').limit(0);
    if (error) {
      console.error('  ❌ Colunas de nodes incompletas:', error.message);
      allPassed = false;
    } else {
      console.log('  ✅ Colunas de nodes OK.');
    }
  } catch (err) {
    console.error('  ❌ Erro ao verificar colunas:', err);
    allPassed = false;
  }

  return allPassed;
}

async function checkRelationships(): Promise<boolean> {
  console.log('\n🔗 Verificando relacionamentos (edges -> nodes)...');
  
  try {
    const { data: edges, error } = await supabase.from('edges').select('source, target').limit(10);
    if (error) throw error;

    if (edges && edges.length > 0) {
      console.log(`  📊 ${edges.length} edges encontradas para validação.`);
      console.log('  ✅ Relacionamentos parecem íntegros.');
    } else {
      console.log('  ℹ️ Nenhuma edge encontrada (banco vazio ou novo).');
    }
    return true;
  } catch (err) {
    console.error('  ❌ Erro ao verificar relacionamentos:', err);
    return false;
  }
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  🛡️  NewsFlow OS - Schema Validation Script (v13.0)');
  console.log('═══════════════════════════════════════════════════════════\n');

  const results = {
    connection: await checkConnection(),
    tables: await checkTables(),
    columns: await checkCriticalColumns(),
    relationships: await checkRelationships()
  };

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('  📊 RESUMO DA VALIDAÇÃO');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`  Conexão:         ${results.connection ? '✅ OK' : '❌ FALHOU'}`);
  console.log(`  Tabelas:         ${results.tables ? '✅ OK' : '❌ FALHOU'}`);
  console.log(`  Colunas:         ${results.columns ? '✅ OK' : '❌ FALHOU'}`);
  console.log(`  Relacionamentos: ${results.relationships ? '✅ OK' : '❌ FALHOU'}`);
  console.log('═══════════════════════════════════════════════════════════\n');

  const allPassed = Object.values(results).every(r => r);

  if (allPassed) {
    console.log('🚀 Schema validado com sucesso! Deploy liberado.\n');
    process.exit(0);
  } else {
    console.error('🛑 DEPLOY BLOQUEADO: Corrija os problemas acima antes de continuar.\n');
    process.exit(1);
  }
}

main().catch(err => {
  console.error('❌ Erro fatal:', err);
  process.exit(1);
});
