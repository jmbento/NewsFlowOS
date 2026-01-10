#!/usr/bin/env node

/**
 * NewsFlow OS - Validação de Chaves Supabase
 * Valida e decodifica tokens JWT do Supabase para verificar estrutura e tipo
 * 
 * ⚠️ IMPORTANTE: Este script aceita chaves como argumentos ou variáveis de ambiente
 * NUNCA commite este script com chaves hardcoded!
 * 
 * Uso:
 *   node scripts/validate-supabase-keys.js <anon-key> <service-role-key>
 *   OU
 *   ANON_KEY=... SERVICE_ROLE_KEY=... node scripts/validate-supabase-keys.js
 */

// Obter chaves dos argumentos ou variáveis de ambiente
const anonKey = process.argv[2] || process.env.ANON_KEY || '';
const serviceRoleKey = process.argv[3] || process.env.SERVICE_ROLE_KEY || '';

// Se não forneceu chaves, mostrar uso
if (!anonKey && !serviceRoleKey) {
  console.error('\n❌ ERRO: Nenhuma chave fornecida!\n');
  console.log('Uso 1 (argumentos):');
  console.log('  node scripts/validate-supabase-keys.js <anon-key> <service-role-key>\n');
  console.log('Uso 2 (variáveis de ambiente):');
  console.log('  ANON_KEY=... SERVICE_ROLE_KEY=... node scripts/validate-supabase-keys.js\n');
  console.log('Uso 3 (apenas ANON KEY):');
  console.log('  node scripts/validate-supabase-keys.js <anon-key>\n');
  process.exit(1);
}

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function decodeJWT(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return { error: 'Token JWT inválido: deve ter 3 partes separadas por ponto' };
    }

    // Decodificar payload (segunda parte)
    const payload = parts[1];
    const decoded = Buffer.from(payload, 'base64').toString('utf-8');
    const data = JSON.parse(decoded);

    return {
      header: JSON.parse(Buffer.from(parts[0], 'base64').toString('utf-8')),
      payload: data,
      signature: parts[2],
      valid: true
    };
  } catch (error) {
    return { error: `Erro ao decodificar JWT: ${error.message}` };
  }
}

function formatDate(timestamp) {
  if (!timestamp) return 'N/A';
  const date = new Date(timestamp * 1000);
  return date.toLocaleString('pt-BR', { 
    dateStyle: 'short', 
    timeStyle: 'short',
    timeZone: 'America/Sao_Paulo'
  });
}

function validateToken(token, tokenName) {
  log(`\n${'='.repeat(60)}`, 'cyan');
  log(`  🔑 VALIDANDO: ${tokenName}`, 'cyan');
  log(`${'='.repeat(60)}\n`, 'cyan');

  const decoded = decodeJWT(token);
  
  if (decoded.error) {
    log(`❌ ERRO: ${decoded.error}`, 'red');
    return false;
  }

  log('📋 ESTRUTURA DO TOKEN:', 'blue');
  log(`   Header: ${JSON.stringify(decoded.header, null, 2)}`, 'reset');
  
  log('\n📊 PAYLOAD (Informações):', 'blue');
  log(`   iss (Issuer): ${decoded.payload.iss}`, 'green');
  log(`   ref (Project Ref): ${decoded.payload.ref}`, 'green');
  log(`   role (Role): ${decoded.payload.role}`, 'magenta');
  
  if (decoded.payload.iat) {
    log(`   iat (Issued At): ${formatDate(decoded.payload.iat)}`, 'yellow');
  }
  
  if (decoded.payload.exp) {
    const expDate = formatDate(decoded.payload.exp);
    const now = Date.now() / 1000;
    const isExpired = decoded.payload.exp < now;
    log(`   exp (Expires At): ${expDate} ${isExpired ? '(EXPIRADO)' : '(VÁLIDO)'}`, isExpired ? 'red' : 'green');
  }

  log(`\n🔐 SIGNATURE:`, 'blue');
  log(`   ${decoded.signature.substring(0, 50)}...`, 'reset');

  // Validações específicas
  log('\n✅ VALIDAÇÕES:', 'blue');
  
  let allValid = true;

  // Validar issuer
  if (decoded.payload.iss !== 'supabase') {
    log(`   ❌ Issuer inválido: esperado "supabase", encontrado "${decoded.payload.iss}"`, 'red');
    allValid = false;
  } else {
    log(`   ✅ Issuer válido: ${decoded.payload.iss}`, 'green');
  }

  // Validar project ref
  const projectRef = decoded.payload.ref;
  if (!projectRef || projectRef.length < 10) {
    log(`   ❌ Project Ref inválido ou muito curto`, 'red');
    allValid = false;
  } else {
    log(`   ✅ Project Ref válido: ${projectRef}`, 'green');
  }

  // Validar role
  const role = decoded.payload.role;
  const validRoles = ['anon', 'service_role'];
  if (!validRoles.includes(role)) {
    log(`   ⚠️  Role desconhecido: ${role}`, 'yellow');
    log(`   💡 Roles esperados: anon ou service_role`, 'yellow');
  } else {
    log(`   ✅ Role válido: ${role}`, role === 'service_role' ? 'magenta' : 'green');
    
    if (role === 'service_role') {
      log(`   ⚠️  ATENÇÃO: Esta é uma chave PRIVADA (service_role)!`, 'red');
      log(`   ⚠️  NUNCA exponha esta chave em código frontend!`, 'red');
      log(`   ⚠️  Use apenas em servidores ou funções serverless!`, 'red');
    } else {
      log(`   ✅ Esta é uma chave PÚBLICA (anon) - pode ser usada no frontend`, 'green');
    }
  }

  // Validar expiração
  if (decoded.payload.exp) {
    const now = Date.now() / 1000;
    if (decoded.payload.exp < now) {
      log(`   ❌ Token EXPIRADO em ${formatDate(decoded.payload.exp)}`, 'red');
      allValid = false;
    } else {
      const daysUntilExpiry = Math.floor((decoded.payload.exp - now) / 86400);
      log(`   ✅ Token válido por mais ${daysUntilExpiry} dias`, 'green');
    }
  }

  // Validar tamanho do signature
  if (decoded.signature.length < 40) {
    log(`   ⚠️  Signature muito curta (suspeito)`, 'yellow');
  } else {
    log(`   ✅ Signature tem tamanho adequado`, 'green');
  }

  log(`\n${'─'.repeat(60)}`, 'cyan');
  if (allValid) {
    log(`✅ RESULTADO: Token ${tokenName} é VÁLIDO`, 'green');
  } else {
    log(`❌ RESULTADO: Token ${tokenName} tem problemas`, 'red');
  }
  log(`${'─'.repeat(60)}`, 'cyan');

  return {
    valid: allValid,
    role: role,
    projectRef: projectRef,
    expired: decoded.payload.exp ? decoded.payload.exp < Date.now() / 1000 : false
  };
}

// Main execution
log('\n═══════════════════════════════════════════════════════════', 'cyan');
log('  🔍 NewsFlow OS - Validação de Chaves Supabase', 'cyan');
log('═══════════════════════════════════════════════════════════\n', 'cyan');

log('📋 Validando chaves fornecidas...\n', 'blue');

const result1 = anonKey ? validateToken(anonKey, 'ANON KEY (Pública)') : null;
const result2 = serviceRoleKey ? validateToken(serviceRoleKey, 'SERVICE ROLE KEY (Privada)') : null;

if (!result1 && !result2) {
  log('❌ Nenhuma chave válida fornecida!', 'red');
  process.exit(1);
}

// Resumo final
log('\n═══════════════════════════════════════════════════════════', 'cyan');
log('  📊 RESUMO DA VALIDAÇÃO', 'cyan');
log('═══════════════════════════════════════════════════════════\n', 'cyan');

if (result1) {
  log('1. ANON KEY (Pública):', 'blue');
  log(`   ✅ Válida: ${result1.valid ? 'SIM' : 'NÃO'}`, result1.valid ? 'green' : 'red');
  log(`   📍 Project Ref: ${result1.projectRef}`, 'green');
  log(`   🔑 Role: ${result1.role}`, 'magenta');
  log(`   💡 Uso: Frontend (React/Vite) - SEGURO para expor`, 'green');
}

if (result2) {
  log(`${result1 ? '\n' : ''}${result1 ? '2' : '1'}. SERVICE ROLE KEY (Privada):`, 'blue');
  log(`   ✅ Válida: ${result2.valid ? 'SIM' : 'NÃO'}`, result2.valid ? 'green' : 'red');
  log(`   📍 Project Ref: ${result2.projectRef}`, 'green');
  log(`   🔑 Role: ${result2.role}`, 'magenta');
  log(`   ⚠️  Uso: Apenas Backend/Serverless - NUNCA no frontend!`, 'red');
}

// Verificar se são do mesmo projeto (se ambas foram fornecidas)
if (result1 && result2) {
  if (result1.projectRef === result2.projectRef) {
    log(`\n✅ AMBAS AS CHAVES SÃO DO MESMO PROJETO: ${result1.projectRef}`, 'green');
  } else {
    log(`\n⚠️  ATENÇÃO: As chaves são de projetos diferentes!`, 'yellow');
    log(`   Anon: ${result1.projectRef}`, 'yellow');
    log(`   Service Role: ${result2.projectRef}`, 'yellow');
  }
}

// Recomendações de segurança
log('\n═══════════════════════════════════════════════════════════', 'cyan');
log('  🔒 RECOMENDAÇÕES DE SEGURANÇA', 'cyan');
log('═══════════════════════════════════════════════════════════\n', 'cyan');

log('✅ USAR NO FRONTEND (VITE_SUPABASE_ANON_KEY):', 'green');
log('   - ANON KEY é segura para usar no código frontend', 'green');
log('   - Pode ser exposta publicamente', 'green');
log('   - Respeita Row Level Security (RLS) do Supabase', 'green');
if (anonKey) {
  log(`   - Valor: ${anonKey.substring(0, 50)}...`, 'reset');
}

log('\n❌ NUNCA USAR NO FRONTEND:', 'red');
log('   - SERVICE ROLE KEY nunca deve estar em código frontend', 'red');
log('   - Esta chave ignora RLS e tem acesso total ao banco', 'red');
log('   - Use apenas em:', 'red');
log('     * Funções Serverless (Vercel Functions)', 'yellow');
log('     * Backend APIs', 'yellow');
log('     * Scripts de administração', 'yellow');
log('     * Migrations e seeders', 'yellow');

log('\n📋 CONFIGURAÇÃO NO VERCEL:', 'blue');
log('   1. Vercel Dashboard → Settings → Environment Variables', 'cyan');
log('   2. Adicione apenas: VITE_SUPABASE_ANON_KEY', 'cyan');
log('   3. Valor: (a chave ANON validada acima)', 'cyan');
log('   4. NUNCA adicione SERVICE ROLE KEY como variável pública!', 'red');

log('\n📋 CONFIGURAÇÃO LOCAL (.env.local):', 'blue');
log('   VITE_SUPABASE_URL=https://ajgqxifhvlwudqlhsfqy.supabase.co', 'cyan');
log(`   VITE_SUPABASE_ANON_KEY=${anonKey.substring(0, 30)}...`, 'cyan');
log('   # NUNCA adicione SERVICE_ROLE_KEY aqui!', 'red');

log('\n═══════════════════════════════════════════════════════════', 'green');
log('  ✅ VALIDAÇÃO CONCLUÍDA', 'green');
log('═══════════════════════════════════════════════════════════\n', 'green');

const allValid = (!result1 || result1.valid) && (!result2 || result2.valid);
process.exit(allValid ? 0 : 1);
