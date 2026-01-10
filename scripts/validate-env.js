#!/usr/bin/env node

/**
 * NewsFlow OS - Validação de Variáveis de Ambiente
 * Script para verificar se as variáveis necessárias estão configuradas
 */

const requiredVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY'
];

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function validateEnvVar(varName) {
  const value = process.env[varName];
  
  if (!value) {
    return {
      valid: false,
      message: `❌ ${varName} não está definida`
    };
  }

  if (value.trim() === '' || value.includes('your-') || value.includes('YOUR-')) {
    return {
      valid: false,
      message: `❌ ${varName} contém placeholder. Configure o valor real.`
    };
  }

  // Validações específicas
  if (varName === 'VITE_SUPABASE_URL') {
    if (!value.startsWith('https://') || !value.includes('.supabase.co')) {
      return {
        valid: false,
        message: `❌ ${varName} deve ser uma URL válida do Supabase (https://*.supabase.co)`
      };
    }
  }

  if (varName === 'VITE_SUPABASE_ANON_KEY') {
    if (value.length < 100) {
      return {
        valid: false,
        message: `❌ ${varName} parece inválida (muito curta)`
      };
    }
  }

  // Mascarar valor para log (mostrar apenas primeiros e últimos caracteres)
  const maskedValue = value.length > 20
    ? `${value.substring(0, 10)}...${value.substring(value.length - 10)}`
    : '***';

  return {
    valid: true,
    message: `✅ ${varName} = ${maskedValue}`
  };
}

// Main execution
log('\n═══════════════════════════════════════════════════════════', 'cyan');
log('  🔍 NewsFlow OS - Validação de Variáveis de Ambiente', 'cyan');
log('═══════════════════════════════════════════════════════════\n', 'cyan');

const results = requiredVars.map(varName => validateEnvVar(varName));
const allValid = results.every(r => r.valid);

// Exibir resultados
results.forEach(result => {
  if (result.valid) {
    log(result.message, 'green');
  } else {
    log(result.message, 'red');
  }
});

log('', 'reset');

// Verificar ambiente
const isCI = process.env.CI === 'true' || process.env.VERCEL === '1' || process.env.VERCEL_ENV;
const envType = process.env.VERCEL_ENV || process.env.NODE_ENV || 'development';

log(`📍 Ambiente: ${envType}`, 'blue');
if (isCI) {
  log('🤖 Modo CI/CD detectado', 'blue');
}

log('', 'reset');

// Resultado final
if (!allValid) {
  log('═══════════════════════════════════════════════════════════', 'red');
  log('  ❌ VALIDAÇÃO FALHOU', 'red');
  log('═══════════════════════════════════════════════════════════\n', 'red');
  
  log('📋 Instruções:', 'yellow');
  log('', 'reset');
  
  if (isCI) {
    log('Para ambiente CI/CD (Vercel):', 'yellow');
    log('1. Acesse: https://vercel.com/dashboard', 'cyan');
    log('2. Selecione seu projeto', 'cyan');
    log('3. Settings → Environment Variables', 'cyan');
    log('4. Adicione as variáveis:', 'cyan');
    log('   - VITE_SUPABASE_URL', 'cyan');
    log('   - VITE_SUPABASE_ANON_KEY', 'cyan');
    log('5. Selecione ambientes: Production, Preview, Development', 'cyan');
    log('6. Clique em "Save" e faça novo deploy\n', 'cyan');
  } else {
    log('Para ambiente local:', 'yellow');
    log('1. Crie arquivo .env.local na raiz do projeto', 'cyan');
    log('2. Adicione as variáveis:', 'cyan');
    log('   VITE_SUPABASE_URL=https://your-project-ref.supabase.co', 'cyan');
    log('   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key', 'cyan');
    log('3. Obtenha as credenciais em:', 'cyan');
    log('   Supabase Dashboard → Project Settings → API\n', 'cyan');
  }
  
  log('📄 Consulte: SUPABASE_CONFIG.md para mais detalhes\n', 'blue');
  
  process.exit(1);
} else {
  log('═══════════════════════════════════════════════════════════', 'green');
  log('  ✅ TODAS AS VARIÁVEIS VALIDADAS COM SUCESSO', 'green');
  log('═══════════════════════════════════════════════════════════\n', 'green');
  process.exit(0);
}
