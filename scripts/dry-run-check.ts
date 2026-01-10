#!/usr/bin/env npx ts-node

/**
 * Dry Run Check Script (v13.0)
 * Simula operações críticas para validar integridade do banco.
 * 
 * Execução: npx ts-node scripts/dry-run-check.ts
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ ERRO CRÍTICO: Variáveis de ambiente não configuradas.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

interface ValidationResult {
  step: string;
  status: 'ok' | 'warning' | 'error';
  message: string;
}

const results: ValidationResult[] = [];

async function testConnection() {
  console.log('🔌 [HANDSHAKE] Testando conexão com Supabase...');
  try {
    const { error } = await supabase.from('nodes').select('id').limit(1);
    if (error) throw error;
    results.push({ step: 'Conexão', status: 'ok', message: 'Handshake bem-sucedido.' });
  } catch (err) {
    results.push({ step: 'Conexão', status: 'error', message: `Falha: ${err}` });
  }
}

async function testSchemaIntegrity() {
  console.log('🔍 [SCHEMA] Verificando colunas críticas...');
  
  const criticalColumns = [
    { table: 'nodes', column: 'data' },
    { table: 'edges', column: 'source' },
    { table: 'leads', column: 'status' }
  ];

  for (const { table, column } of criticalColumns) {
    try {
      const query = `${column}`;
      const { error } = await supabase.from(table).select(query).limit(0);
      if (error) {
        results.push({ step: `Coluna ${table}.${column}`, status: 'error', message: error.message });
      } else {
        results.push({ step: `Coluna ${table}.${column}`, status: 'ok', message: 'Existe.' });
      }
    } catch (err) {
      results.push({ step: `Coluna ${table}.${column}`, status: 'error', message: `${err}` });
    }
  }
}

async function testCRUDSimulation() {
  console.log('🧪 [CRUD] Simulando criação de proposta (Case Cinbal R$ 25k)...');
  
  const testNodeId = `dryrun-test-${Date.now()}`;
  
  try {
    // CREATE - Teste com modelo R$ 25k (Institucional)
    const { error: insertError } = await supabase.from('nodes').insert({
      id: testNodeId,
      type: 'campaign',
      position_x: 0,
      position_y: 0,
      data: {
        label: 'DRY RUN - Cinbal Test',
        status: 'todo',
        totalInvestment: 25000,
        campaignType: 'INSTITUCIONAL_ANNIVERSARY',
        targetCities: ['Resende', 'Barra Mansa', 'Volta Redonda']
      }
    });

    if (insertError) {
      results.push({ step: 'CRUD Insert (R$ 25k)', status: 'error', message: insertError.message });
      return;
    }

    results.push({ step: 'CRUD Insert (R$ 25k)', status: 'ok', message: 'Nó de teste criado.' });

    // Teste com modelo R$ 40k (ESG)
    const testNodeId2 = `dryrun-test-esg-${Date.now()}`;
    const { error: insertError2 } = await supabase.from('nodes').insert({
      id: testNodeId2,
      type: 'campaign',
      position_x: 0,
      position_y: 0,
      data: {
        label: 'DRY RUN - ESG Test',
        status: 'todo',
        totalInvestment: 40000,
        campaignType: 'ESG_PRACTICES',
        targetCities: ['Volta Redonda', 'Barra Mansa', 'Resende', 'Itatiaia']
      }
    });

    if (insertError2) {
      results.push({ step: 'CRUD Insert (R$ 40k)', status: 'error', message: insertError2.message });
    } else {
      results.push({ step: 'CRUD Insert (R$ 40k)', status: 'ok', message: 'Modelo ESG suportado.' });
    }

    // Validação de target_cities
    const { data: nodeData, error: fetchError } = await supabase
      .from('nodes')
      .select('data')
      .eq('id', testNodeId)
      .single();

    if (fetchError) {
      results.push({ step: 'Validação target_cities', status: 'error', message: `Não foi possível recuperar dados: ${fetchError.message}` });
    } else if (nodeData?.data?.targetCities && Array.isArray(nodeData.data.targetCities)) {
      const cities = nodeData.data.targetCities;
      const validCities = ['Resende', 'Barra Mansa', 'Volta Redonda', 'Itatiaia', 'Porto Real', 'Pinheiral'];
      const invalidCities = cities.filter((c: string) => !validCities.includes(c));
      
      if (invalidCities.length > 0) {
        results.push({ step: 'Validação target_cities', status: 'warning', message: `Cidades não padrão encontradas: ${invalidCities.join(', ')}` });
      } else {
        results.push({ step: 'Validação target_cities', status: 'ok', message: `Cidades válidas: ${cities.join(', ')}` });
      }
    } else {
      results.push({ step: 'Validação target_cities', status: 'warning', message: 'target_cities não encontrado no nó de teste' });
    }

    // DELETE (cleanup)
    const { error: deleteError } = await supabase.from('nodes').delete().in('id', [testNodeId, testNodeId2]);
    
    if (deleteError) {
      results.push({ step: 'CRUD Delete', status: 'warning', message: `Cleanup falhou: ${deleteError.message}` });
    } else {
      results.push({ step: 'CRUD Delete', status: 'ok', message: 'Cleanup concluído.' });
    }

  } catch (err) {
    results.push({ step: 'CRUD Simulation', status: 'error', message: `${err}` });
  }
}

async function testRLSPolicies() {
  console.log('🛡️ [RLS] Verificando políticas de segurança...');
  
  try {
    // Tenta ler leads (Comercial precisa de acesso)
    const { error: leadsError } = await supabase.from('leads').select('id').limit(1);
    if (leadsError) {
      results.push({ step: 'RLS Leads', status: 'warning', message: `Acesso restrito: ${leadsError.message}` });
    } else {
      results.push({ step: 'RLS Leads', status: 'ok', message: 'Comercial pode acessar leads.' });
    }

    // Tenta ler messages (Redação precisa de acesso)
    const { error: messagesError } = await supabase.from('messages').select('id').limit(1);
    if (messagesError) {
      results.push({ step: 'RLS Messages', status: 'warning', message: `Acesso restrito: ${messagesError.message}` });
    } else {
      results.push({ step: 'RLS Messages', status: 'ok', message: 'Redação pode acessar atas.' });
    }
  } catch (err) {
    results.push({ step: 'RLS Check', status: 'error', message: `${err}` });
  }
}

function printReport() {
  console.log('\n');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  🛡️  NewsFlow OS - Dry Run Report (v13.0)');
  console.log('═══════════════════════════════════════════════════════════\n');

  for (const result of results) {
    const icon = result.status === 'ok' ? '✅' : result.status === 'warning' ? '⚠️' : '❌';
    console.log(`  ${icon} ${result.step}: ${result.message}`);
  }

  console.log('\n═══════════════════════════════════════════════════════════');
  
  const errors = results.filter(r => r.status === 'error').length;
  const warnings = results.filter(r => r.status === 'warning').length;
  
  if (errors > 0) {
    console.log(`  ❌ ${errors} erro(s) encontrado(s). Deploy BLOQUEADO.`);
    console.log('═══════════════════════════════════════════════════════════\n');
    process.exit(1);
  } else if (warnings > 0) {
    console.log(`  ⚠️ ${warnings} alerta(s). Deploy permitido com cautela.`);
    console.log('═══════════════════════════════════════════════════════════\n');
    process.exit(0);
  } else {
    console.log('  ✅ Todos os testes passaram! Deploy liberado.');
    console.log('═══════════════════════════════════════════════════════════\n');
    process.exit(0);
  }
}

async function main() {
  await testConnection();
  await testSchemaIntegrity();
  await testCRUDSimulation();
  await testRLSPolicies();
  printReport();
}

main().catch(err => {
  console.error('❌ Erro fatal:', err);
  process.exit(1);
});
