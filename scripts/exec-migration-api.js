#!/usr/bin/env node

/**
 * NewsFlow OS - Executar Migration 004 via API do Supabase
 * Este script executa o SQL diretamente via API REST
 */

const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://ajgqxifhvlwudqlhsfqy.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.argv[2];

if (!SERVICE_ROLE_KEY) {
  console.error('\n❌ ERRO: Service Role Key não fornecida.');
  console.log('\n📋 Uso:');
  console.log('   SUPABASE_SERVICE_ROLE_KEY=<key> node scripts/exec-migration-api.js');
  console.log('   OU');
  console.log('   node scripts/exec-migration-api.js <SERVICE_ROLE_KEY>');
  console.log('\n💡 Obtenha a Service Role Key em:');
  console.log('   https://ajgqxifhvlwudqlhsfqy.supabase.co');
  console.log('   Project Settings → API → service_role key');
  process.exit(1);
}

async function executeSQL(sql) {
  // Dividir em comandos individuais (simplificado - executar tudo de uma vez)
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify({ query: sql }),
  }).catch(() => null);

  // Se o RPC não existir, tentar método alternativo
  if (!response || response.status === 404) {
    console.log('⚠️  Método RPC não disponível. Usando método alternativo...');
    return false;
  }

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`HTTP ${response.status}: ${error}`);
  }

  return true;
}

async function runMigration() {
  const migrationPath = path.join(__dirname, '../supabase/migrations/004_work_status.sql');
  const sql = fs.readFileSync(migrationPath, 'utf-8');

  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  🔄 Executando Migration 004: Work Status');
  console.log('═══════════════════════════════════════════════════════════════\n');

  try {
    // Tentar executar via API
    const success = await executeSQL(sql);
    
    if (success) {
      console.log('✅ Migration executada com sucesso via API!');
      return;
    }

    // Se não funcionar, mostrar instruções manuais
    console.log('⚠️  Execução automática não disponível.');
    console.log('\n📋 EXECUTE MANUALMENTE NO SUPABASE DASHBOARD:\n');
    console.log('1. Acesse: https://ajgqxifhvlwudqlhsfqy.supabase.co');
    console.log('2. Vá em: SQL Editor');
    console.log('3. Cole o SQL abaixo e clique em "Run":\n');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(sql);
    console.log('═══════════════════════════════════════════════════════════════\n');
    
  } catch (error) {
    console.error('❌ ERRO ao executar migration:', error.message);
    console.log('\n📋 EXECUTE MANUALMENTE NO SUPABASE DASHBOARD:');
    console.log('1. Acesse: https://ajgqxifhvlwudqlhsfqy.supabase.co');
    console.log('2. Vá em: SQL Editor');
    console.log('3. Cole o conteúdo de: supabase/migrations/004_work_status.sql');
  }
}

runMigration();
