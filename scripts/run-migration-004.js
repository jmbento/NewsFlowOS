#!/usr/bin/env node

/**
 * NewsFlow OS - Executar Migration 004 (Work Status)
 * Este script executa a migration diretamente via API do Supabase
 * 
 * Uso: node scripts/run-migration-004.js <SERVICE_ROLE_KEY>
 */

const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://ajgqxifhvlwudqlhsfqy.supabase.co';
const SERVICE_ROLE_KEY = process.argv[2];

if (!SERVICE_ROLE_KEY) {
  console.error('❌ ERRO: Service Role Key não fornecida.');
  console.log('\n📋 Uso: node scripts/run-migration-004.js <SERVICE_ROLE_KEY>');
  console.log('\n💡 Obtenha a Service Role Key em:');
  console.log('   Supabase Dashboard → Project Settings → API → service_role key');
  process.exit(1);
}

async function runMigration() {
  const migrationPath = path.join(__dirname, '../supabase/migrations/004_work_status.sql');
  const sql = fs.readFileSync(migrationPath, 'utf-8');

  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  🔄 Executando Migration 004: Work Status');
  console.log('═══════════════════════════════════════════════════════════════\n');

  try {
    // Dividir o SQL em comandos individuais (simplificado)
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({ sql }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HTTP ${response.status}: ${error}`);
    }

    const result = await response.json();
    console.log('✅ Migration executada com sucesso!');
    console.log('📊 Resultado:', result);
  } catch (error) {
    console.error('❌ ERRO ao executar migration:', error.message);
    console.log('\n💡 Método alternativo: Execute o SQL manualmente no Supabase Dashboard:');
    console.log('   1. Acesse: https://ajgqxifhvlwudqlhsfqy.supabase.co');
    console.log('   2. Vá em: SQL Editor');
    console.log('   3. Cole o conteúdo de: supabase/migrations/004_work_status.sql');
    process.exit(1);
  }
}

runMigration();
